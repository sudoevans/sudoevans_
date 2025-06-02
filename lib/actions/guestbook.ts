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
        name: formData.name.trim(),
        message: formData.message.trim(),
        location: formData.location?.trim() || null,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()

    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath("/guestbook")
    return { success: true, message: "Thank you for signing the guestbook!" }
  } catch (error) {
    return { success: false, message: "Failed to submit entry" }
  }
}

export async function getGuestbookEntries(page = 1, limit = 10) {
  try {
    const supabase = createActionClient()
    const offset = (page - 1) * limit

    const {
      data: entries,
      error,
      count,
    } = await supabase
      .from("guestbook_entries")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return { entries: [], count: 0, error: error.message }
    }

    return { entries: entries as GuestbookEntry[], count: count || 0, error: null }
  } catch (error) {
    return { entries: [], count: 0, error: "Failed to fetch guestbook entries" }
  }
}
