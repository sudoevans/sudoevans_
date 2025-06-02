"use server"

import { createActionClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"

export interface LoginFormData {
  username: string
  password: string
}

export async function login(formData: LoginFormData) {
  try {
    const supabase = createActionClient()

    // Get admin user by username
    const { data: adminUser, error: userError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", formData.username)
      .single()

    if (userError || !adminUser) {
      return { success: false, message: "Invalid credentials" }
    }

    // For demo purposes, we'll use a simple password check
    // In production, you'd use proper password hashing
    const isValidPassword =
      formData.password === "admin123" ||
      (adminUser.password_hash && (await bcrypt.compare(formData.password, adminUser.password_hash)))

    if (!isValidPassword) {
      return { success: false, message: "Invalid credentials" }
    }

    // Create session token
    const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store session in database
    const { error: sessionError } = await supabase.from("admin_sessions").insert({
      admin_id: adminUser.id,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
    })

    if (sessionError) {
      return { success: false, message: "Failed to create session" }
    }

    // Update last login
    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", adminUser.id)

    // Set session cookie
    cookies().set("admin_session", sessionToken, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return { success: true, message: "Login successful" }
  } catch (error) {
    return { success: false, message: "Login failed" }
  }
}

export async function logout() {
  try {
    const sessionToken = cookies().get("admin_session")?.value

    if (sessionToken) {
      const supabase = createActionClient()

      // Remove session from database
      await supabase.from("admin_sessions").delete().eq("session_token", sessionToken)
    }

    // Clear session cookie
    cookies().delete("admin_session")

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function checkAuth() {
  try {
    const sessionToken = cookies().get("admin_session")?.value

    if (!sessionToken) {
      return { isAuthenticated: false, user: null }
    }

    const supabase = createActionClient()

    // Check if session is valid and not expired
    const { data: session, error } = await supabase
      .from("admin_sessions")
      .select("*, admin_users(*)")
      .eq("session_token", sessionToken)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !session) {
      // Clean up invalid session
      cookies().delete("admin_session")
      return { isAuthenticated: false, user: null }
    }

    return {
      isAuthenticated: true,
      user: {
        id: session.admin_users.id,
        username: session.admin_users.username,
      },
    }
  } catch (error) {
    return { isAuthenticated: false, user: null }
  }
}

export async function requireAuth() {
  const { isAuthenticated } = await checkAuth()

  if (!isAuthenticated) {
    redirect("/admin/login")
  }
}
