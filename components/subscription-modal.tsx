"use client"

import type React from "react"

import { useState } from "react"
import { X, Mail } from "lucide-react"
import { subscribeToNewsletter, type SubscriptionFormData } from "@/lib/actions/subscribers"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<SubscriptionFormData>({ email: "" })
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await subscribeToNewsletter(formData)

      if (result.success) {
        showToast({
          message: result.message,
          type: "success",
        })
        setFormData({ email: "" })
        onClose()
      } else {
        showToast({
          message: result.message,
          type: "error",
        })
      }
    } catch (error) {
      showToast({
        message: "Failed to subscribe. Please try again.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-white/10 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black border-2 border-black dark:border-white max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6" />
            <h2 className="text-2xl font-black">WEEKLY TOP RESOURCES</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Get the most liked resources delivered to your inbox every week. Stay updated with the best design tools,
            templates, and inspiration from our community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-600 dark:text-gray-400">EMAIL ADDRESS *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
              className="w-full bg-transparent border-2 border-gray-400 dark:border-gray-600 p-3 focus:border-black dark:focus:border-white outline-none transition-colors font-mono"
              placeholder="your@email.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 border-2 border-black dark:border-white px-6 py-3 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  SUBSCRIBING...
                </>
              ) : (
                "SUBSCRIBE"
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-2 border-gray-400 dark:border-gray-600 px-6 py-3 hover:border-black dark:hover:border-white transition-all duration-300 font-bold disabled:opacity-50"
            >
              CANCEL
            </button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>• Weekly digest of top-rated resources</p>
            <p>• No spam, unsubscribe anytime</p>
            <p>• Join our community of designers and developers</p>
          </div>
        </form>
      </div>
    </div>
  )
}
