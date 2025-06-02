"use server"

import { createActionClient } from "@/lib/supabase/server"

export interface WeeklyEmailData {
  id: string
  sent_at: string
  subscriber_count: number
  top_resources: any[]
  email_subject: string
  email_content: string
}

export async function getWeeklyTopResources() {
  try {
    const supabase = createActionClient()

    // Get top 10 resources from the last week based on likes
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const { data: resources, error } = await supabase
      .from("resources")
      .select(`
        *,
        resource_likes!inner(created_at)
      `)
      .eq("status", "approved")
      .gte("resource_likes.created_at", oneWeekAgo.toISOString())
      .order("created_at", { ascending: false })

    if (error) {
      return { resources: [], error: error.message }
    }

    // Group by resource and count likes
    const resourceLikeCounts = new Map()

    resources.forEach((resource) => {
      const resourceId = resource.id
      if (!resourceLikeCounts.has(resourceId)) {
        resourceLikeCounts.set(resourceId, {
          ...resource,
          like_count: 0,
          resource_likes: undefined,
        })
      }
      resourceLikeCounts.get(resourceId).like_count += 1
    })

    // Convert to array and sort by like count
    const topResources = Array.from(resourceLikeCounts.values())
      .sort((a, b) => b.like_count - a.like_count)
      .slice(0, 10)

    return { resources: topResources, error: null }
  } catch (error) {
    return { resources: [], error: "Failed to get weekly top resources" }
  }
}

export async function generateWeeklyEmail() {
  try {
    const supabase = createActionClient()

    // Get top resources
    const { resources: topResources, error: resourcesError } = await getWeeklyTopResources()

    if (resourcesError) {
      return { success: false, message: resourcesError }
    }

    // Get active subscribers count
    const { count: subscriberCount, error: countError } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    if (countError) {
      return { success: false, message: countError.message }
    }

    if (!subscriberCount || subscriberCount === 0) {
      return { success: false, message: "No active subscribers found" }
    }

    // Generate email content
    const emailSubject = `🔥 Weekly Top ${topResources.length} Resources - ${new Date().toLocaleDateString()}`
    const emailContent = generateEmailHTML(topResources)

    // Save email record
    const { data: emailRecord, error: saveError } = await supabase
      .from("weekly_emails")
      .insert({
        subscriber_count: subscriberCount,
        top_resources: topResources,
        email_subject: emailSubject,
        email_content: emailContent,
      })
      .select()
      .single()

    if (saveError) {
      return { success: false, message: saveError.message }
    }

    // In a real application, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Resend
    // For now, we'll simulate sending

    // Update last_email_sent for all active subscribers
    const { error: updateError } = await supabase
      .from("subscribers")
      .update({ last_email_sent: new Date().toISOString() })
      .eq("is_active", true)

    if (updateError) {
      return { success: false, message: updateError.message }
    }

    return {
      success: true,
      message: `Weekly email generated and sent to ${subscriberCount} subscribers`,
      emailRecord,
    }
  } catch (error) {
    return { success: false, message: "Failed to generate weekly email" }
  }
}

function generateEmailHTML(resources: any[]): string {
  const resourcesHTML = resources
    .map(
      (resource, index) => `
    <div style="border: 2px solid #000; padding: 20px; margin-bottom: 20px; background: #fff;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        <span style="font-size: 24px; font-weight: bold; color: #000;">#${index + 1}</span>
        <h3 style="margin: 0; font-size: 18px; font-weight: bold;">${resource.name}</h3>
        <span style="background: #000; color: #fff; padding: 2px 8px; font-size: 12px; font-family: monospace;">${resource.type}</span>
      </div>
      <p style="color: #666; margin: 10px 0;">${resource.description}</p>
      <div style="display: flex; gap: 20px; font-size: 14px; color: #888; margin-bottom: 15px;">
        <span>BY ${resource.author.toUpperCase()}</span>
        <span>❤️ ${resource.like_count} likes</span>
        ${resource.size ? `<span>📦 ${resource.size}</span>` : ""}
      </div>
      <a href="${resource.download_url}" 
         style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; font-weight: bold; border: 2px solid #000;">
        VIEW RESOURCE →
      </a>
    </div>
  `,
    )
    .join("")

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Top Resources</title>
</head>
<body style="font-family: 'Syne', system-ui, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px;">
    <h1 style="font-size: 32px; font-weight: 900; margin: 0; letter-spacing: -1px;">WEEKLY TOP RESOURCES</h1>
    <p style="color: #666; margin: 10px 0;">The most liked resources from our brutal design community</p>
    <p style="font-size: 14px; color: #888;">${new Date().toLocaleDateString()}</p>
  </div>

  <div style="margin-bottom: 40px;">
    <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">🔥 THIS WEEK'S TOP ${resources.length}</h2>
    ${resourcesHTML}
  </div>

  <div style="border-top: 2px solid #000; padding-top: 20px; text-align: center; color: #666;">
    <p>You're receiving this because you subscribed to our weekly top resources.</p>
    <p style="font-size: 14px;">
      <a href="https://your-domain.com/unsubscribe" style="color: #666;">Unsubscribe</a> | 
      <a href="https://your-domain.com/resources" style="color: #666;">Browse All Resources</a>
    </p>
    <p style="font-size: 12px; margin-top: 20px;">
      Evans Kiptoo Cheruiyot - Brutal Design Portfolio<br>
      Nairobi, Kenya
    </p>
  </div>

</body>
</html>
  `
}

export async function getWeeklyEmailHistory(page = 1, limit = 10) {
  try {
    const supabase = createActionClient()
    const offset = (page - 1) * limit

    const {
      data: emails,
      error,
      count,
    } = await supabase
      .from("weekly_emails")
      .select("*", { count: "exact" })
      .order("sent_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return { emails: [], count: 0, error: error.message }
    }

    return { emails: emails as WeeklyEmailData[], count: count || 0, error: null }
  } catch (error) {
    return { emails: [], count: 0, error: "Failed to fetch email history" }
  }
}

export async function previewWeeklyEmail() {
  try {
    const { resources, error } = await getWeeklyTopResources()

    if (error) {
      return { success: false, message: error }
    }

    const emailContent = generateEmailHTML(resources)

    return {
      success: true,
      preview: {
        subject: `🔥 Weekly Top ${resources.length} Resources - ${new Date().toLocaleDateString()}`,
        content: emailContent,
        resources,
      },
    }
  } catch (error) {
    return { success: false, message: "Failed to generate email preview" }
  }
}
