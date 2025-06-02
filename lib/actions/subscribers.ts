"use server"

import { createActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface SubscriptionFormData {
  email: string
}

export async function subscribeToNewsletter(formData: SubscriptionFormData) {
  try {
    const supabase = createActionClient()

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("subscribers")
      .select("id, is_active")
      .eq("email", formData.email.toLowerCase().trim())
      .single()

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return { success: false, message: "You are already subscribed to our newsletter!" }
      } else {
        // Reactivate subscription
        const { error } = await supabase
          .from("subscribers")
          .update({ is_active: true, subscribed_at: new Date().toISOString() })
          .eq("email", formData.email.toLowerCase().trim())

        if (error) {
          return { success: false, message: error.message }
        }

        return { success: true, message: "Welcome back! Your subscription has been reactivated." }
      }
    }

    // Add new subscriber
    const { error } = await supabase.from("subscribers").insert({
      email: formData.email.toLowerCase().trim(),
    })

    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath("/resources")
    return { success: true, message: "Successfully subscribed! You'll receive weekly top resources." }
  } catch (error) {
    return { success: false, message: "Failed to subscribe. Please try again." }
  }
}

export async function getSubscribersCount() {
  try {
    const supabase = createActionClient()

    const { count, error } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    if (error) {
      return { count: 0, error: error.message }
    }

    return { count: count || 0, error: null }
  } catch (error) {
    return { count: 0, error: "Failed to get subscribers count" }
  }
}

export async function unsubscribe(token: string) {
  try {
    const supabase = createActionClient()

    const { error } = await supabase.from("subscribers").update({ is_active: false }).eq("unsubscribe_token", token)

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, message: "Successfully unsubscribed from newsletter." }
  } catch (error) {
    return { success: false, message: "Failed to unsubscribe. Please try again." }
  }
}
