"use server"

import { createActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Subscriber {
  id: string
  email: string
  is_active: boolean
  subscribed_at: string
  last_email_sent: string | null
  unsubscribe_token: string
}

export async function getSubscribers(page = 1, limit = 20, search?: string) {
  try {
    const supabase = createActionClient()
    const offset = (page - 1) * limit

    let query = supabase
      .from("subscribers")
      .select("*", { count: "exact" })
      .order("subscribed_at", { ascending: false })

    if (search) {
      query = query.ilike("email", `%${search}%`)
    }

    const { data: subscribers, error, count } = await query.range(offset, offset + limit - 1)

    if (error) {
      return { subscribers: [], count: 0, error: error.message }
    }

    return { subscribers: subscribers as Subscriber[], count: count || 0, error: null }
  } catch (error) {
    return { subscribers: [], count: 0, error: "Failed to fetch subscribers" }
  }
}

export async function toggleSubscriberStatus(subscriberId: string, isActive: boolean) {
  try {
    const supabase = createActionClient()

    const { error } = await supabase.from("subscribers").update({ is_active: isActive }).eq("id", subscriberId)

    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath("/admin/subscribers")
    return {
      success: true,
      message: `Subscriber ${isActive ? "activated" : "deactivated"} successfully`,
    }
  } catch (error) {
    return { success: false, message: "Failed to update subscriber status" }
  }
}

export async function deleteSubscriber(subscriberId: string) {
  try {
    const supabase = createActionClient()

    const { error } = await supabase.from("subscribers").delete().eq("id", subscriberId)

    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath("/admin/subscribers")
    return { success: true, message: "Subscriber deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failed to delete subscriber" }
  }
}

export async function getSubscriberStats() {
  try {
    const supabase = createActionClient()

    // Get total subscribers
    const { count: totalCount } = await supabase.from("subscribers").select("*", { count: "exact", head: true })

    // Get active subscribers
    const { count: activeCount } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    // Get subscribers from last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: recentCount } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .gte("subscribed_at", thirtyDaysAgo.toISOString())

    return {
      total: totalCount || 0,
      active: activeCount || 0,
      inactive: (totalCount || 0) - (activeCount || 0),
      recent: recentCount || 0,
      error: null,
    }
  } catch (error) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      recent: 0,
      error: "Failed to fetch subscriber stats",
    }
  }
}

export async function exportSubscribers() {
  try {
    const supabase = createActionClient()

    const { data: subscribers, error } = await supabase
      .from("subscribers")
      .select("email, is_active, subscribed_at, last_email_sent")
      .eq("is_active", true)
      .order("subscribed_at", { ascending: false })

    if (error) {
      return { success: false, message: error.message }
    }

    // Convert to CSV format
    const csvHeader = "Email,Status,Subscribed Date,Last Email Sent\n"
    const csvData = subscribers
      .map((sub) => {
        const subscribedDate = new Date(sub.subscribed_at).toLocaleDateString()
        const lastEmailDate = sub.last_email_sent ? new Date(sub.last_email_sent).toLocaleDateString() : "Never"
        return `${sub.email},${sub.is_active ? "Active" : "Inactive"},${subscribedDate},${lastEmailDate}`
      })
      .join("\n")

    return {
      success: true,
      csv: csvHeader + csvData,
      count: subscribers.length,
    }
  } catch (error) {
    return { success: false, message: "Failed to export subscribers" }
  }
}
