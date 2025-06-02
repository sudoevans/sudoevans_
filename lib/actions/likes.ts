"use server"

import { createActionClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export async function likeResource(resourceId: string) {
  try {
    const supabase = createActionClient()
    const headersList = headers()

    // Get client info for tracking
    const userAgent = headersList.get("user-agent") || null
    const forwardedFor = headersList.get("x-forwarded-for")
    const realIp = headersList.get("x-real-ip")
    const ipAddress = forwardedFor?.split(",")[0] || realIp || null

    // Check if user has already liked this resource
    const { data: existingLike } = await supabase
      .from("resource_likes")
      .select("id")
      .eq("resource_id", resourceId)
      .eq("ip_address", ipAddress)
      .single()

    if (existingLike) {
      return { success: false, message: "You have already liked this resource" }
    }

    // Add the like
    const { error } = await supabase.from("resource_likes").insert({
      resource_id: resourceId,
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath("/resources")
    return { success: true, message: "Resource liked!" }
  } catch (error) {
    return { success: false, message: "Failed to like resource" }
  }
}

export async function getResourceLikes(resourceId: string) {
  try {
    const supabase = createActionClient()

    const { count, error } = await supabase
      .from("resource_likes")
      .select("*", { count: "exact", head: true })
      .eq("resource_id", resourceId)

    if (error) {
      return { count: 0, error: error.message }
    }

    return { count: count || 0, error: null }
  } catch (error) {
    return { count: 0, error: "Failed to get likes count" }
  }
}

export async function checkUserLiked(resourceId: string) {
  try {
    const supabase = createActionClient()
    const headersList = headers()

    const forwardedFor = headersList.get("x-forwarded-for")
    const realIp = headersList.get("x-real-ip")
    const ipAddress = forwardedFor?.split(",")[0] || realIp || null

    const { data, error } = await supabase
      .from("resource_likes")
      .select("id")
      .eq("resource_id", resourceId)
      .eq("ip_address", ipAddress)
      .single()

    if (error && error.code !== "PGRST116") {
      return { liked: false, error: error.message }
    }

    return { liked: !!data, error: null }
  } catch (error) {
    return { liked: false, error: "Failed to check like status" }
  }
}

export async function getTopResources(limit = 10) {
  try {
    const supabase = createActionClient()

    const { data: resources, error } = await supabase
      .from("resources")
      .select(`
        *,
        resource_likes(count)
      `)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      return { resources: [], error: error.message }
    }

    // Sort by like count
    const resourcesWithLikes = resources.map((resource) => ({
      ...resource,
      like_count: resource.resource_likes?.length || 0,
    }))

    resourcesWithLikes.sort((a, b) => b.like_count - a.like_count)

    return { resources: resourcesWithLikes, error: null }
  } catch (error) {
    return { resources: [], error: "Failed to get top resources" }
  }
}
