"use server"

import { createActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type ResourceType = "Figma" | "SVG" | "CSS" | "GitHub" | "CodePen" | "Link" | "PDF" | "ZIP"
export type ResourceCategory = "DESIGN SYSTEMS" | "CODE TEMPLATES" | "INSPIRATION" | "BLOGS"
export type ResourceStatus = "pending" | "approved" | "rejected"

export interface ResourceFormData {
  name: string
  type: ResourceType
  category: ResourceCategory
  description: string
  downloadUrl: string
  author: string
  size: string
}

export interface Resource {
  id: string
  name: string
  type: ResourceType
  category: ResourceCategory
  description: string
  download_url: string
  author: string
  size: string | null
  date: string
  status: ResourceStatus
  created_at: string
  updated_at: string
  download_count?: number
  like_count?: number
}

export async function submitResource(formData: ResourceFormData) {
  try {
    const supabase = createActionClient()

    console.log("Submitting resource:", formData)

    // Submit with explicit pending status - this matches our RLS policy
    const { error } = await supabase.from("resources").insert({
      name: formData.name.trim(),
      type: formData.type,
      category: formData.category,
      description: formData.description.trim(),
      download_url: formData.downloadUrl.trim(),
      author: formData.author.trim(),
      size: formData.size?.trim() || null,
      status: "pending", // Explicitly set to pending
      date: new Date().toISOString(),
    })

    if (error) {
      console.error("Supabase error:", error)
      return { success: false, message: `Submission failed: ${error.message}` }
    }

    console.log("Resource submitted successfully")

    // Only revalidate admin paths since users can't see pending resources
    revalidatePath("/admin/resources")

    return {
      success: true,
      message:
        "Resource submitted successfully! It will be reviewed before being published. Thank you for your contribution!",
    }
  } catch (error) {
    console.error("Server action error:", error)
    return { success: false, message: "Failed to submit resource. Please try again." }
  }
}

export async function getResources(options?: {
  status?: ResourceStatus
  category?: ResourceCategory
  search?: string
  page?: number
  limit?: number
}) {
  try {
    const supabase = createActionClient()
    const { status = "approved", category, search, page = 1, limit = 6 } = options || {}

    const offset = (page - 1) * limit

    let query = supabase
      .from("resources")
      .select(`
        *,
        download_tracking(count),
        resource_likes(count)
      `)
      .eq("status", status)
      .order("created_at", { ascending: false })

    if (category) {
      query = query.eq("category", category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const {
      data: resources,
      error,
      count,
    } = await query.range(offset, offset + limit - 1).select("*", { count: "exact" })

    if (error) {
      return { resources: [], count: 0, error: error.message }
    }

    // Process resources to include download and like counts
    const processedResources = resources.map((resource) => {
      const downloadCount = resource.download_tracking ? resource.download_tracking.length : 0
      const likeCount = resource.resource_likes ? resource.resource_likes.length : 0

      // Clean up the response
      delete resource.download_tracking
      delete resource.resource_likes

      return {
        ...resource,
        download_count: downloadCount,
        like_count: likeCount,
      }
    })

    return { resources: processedResources as Resource[], count: count || 0, error: null }
  } catch (error) {
    return { resources: [], count: 0, error: "Failed to fetch resources" }
  }
}

export async function getPendingResources(page = 1, limit = 10) {
  return getResources({ status: "pending", page, limit })
}

export async function approveResource(id: string) {
  try {
    const supabase = createActionClient()

    const { error } = await supabase
      .from("resources")
      .update({ status: "approved", updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath("/admin/resources")
    revalidatePath("/resources")
    return { success: true, message: "Resource approved" }
  } catch (error) {
    return { success: false, message: "Failed to approve resource" }
  }
}

export async function rejectResource(id: string) {
  try {
    const supabase = createActionClient()

    const { error } = await supabase
      .from("resources")
      .update({ status: "rejected", updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath("/admin/resources")
    return { success: true, message: "Resource rejected" }
  } catch (error) {
    return { success: false, message: "Failed to reject resource" }
  }
}

export async function trackDownload(resourceId: string, ipAddress?: string, userAgent?: string) {
  try {
    const supabase = createActionClient()

    const { error } = await supabase.from("download_tracking").insert({
      resource_id: resourceId,
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
    })

    if (error) {
      console.error("Failed to track download:", error)
    }

    return { success: !error }
  } catch (error) {
    console.error("Error tracking download:", error)
    return { success: false }
  }
}
