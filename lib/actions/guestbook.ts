"use server"

import { createActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

export interface GuestbookEntry {
  id: string
  name: string
  message: string
  location: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
  updated_at: string
}

export interface GuestbookFormData {
  name: string
  message: string
  location?: string
}

export async function submitGuestbookEntry(formData: GuestbookFormData) {
  try {
    // Enforce limits on server side
    const name = formData.name.trim().slice(0, 32)
    const message = formData.message.trim().slice(0, 180)
    const location = formData.location?.trim().slice(0, 32) || null

    const supabase = createActionClient()
    const headersList = headers()

    // Get client info for tracking
    const userAgent = headersList.get("user-agent") || null
    const forwardedFor = headersList.get("x-forwarded-for")
    const realIp = headersList.get("x-real-ip")
    const ipAddress = forwardedFor?.split(",")[0] || realIp || null

    const { data, error } = await supabase
      .from("guestbook_entries")
      .insert({
        name,
        message,
        location,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()

    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath("/guestbook")
    return { success: true, message: "Thank you for signing my guestbook!" }
  } catch (error) {
    return { success: false, message: "Failed to submit entry" }
  }
}

export async function getGuestbookEntries(page = 1, limit = 10, order: "asc" | "desc" = "desc") {
  try {
    const supabase = createActionClient()
    const offset = (page - 1) * limit

    const {
      data: entries,
      error,
      count,
    } = await supabase
      .from("guestbook_entries")
      .select("id, name, message, location, created_at", { count: "exact" }) // Only public fields
      .order("created_at", { ascending: order === "asc" })
      .range(offset, offset + limit - 1)

    if (error) {
      return { entries: [], count: 0, error: error.message }
    }

    // Entries will not include ip_address or user_agent
    return { entries: entries as Omit<GuestbookEntry, 'ip_address' | 'user_agent'>[], count: count || 0, error: null }
  } catch (error) {
    return { entries: [], count: 0, error: "Failed to fetch guestbook entries" }
  }
}
