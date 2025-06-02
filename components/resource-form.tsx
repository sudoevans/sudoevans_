"use client"

import type React from "react"

import { useState } from "react"
import {
  submitResource,
  type ResourceFormData,
  type ResourceType,
  type ResourceCategory,
} from "@/lib/actions/resources"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast"

export function ResourceForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  const [formData, setFormData] = useState<ResourceFormData>({
    name: "",
    type: "Figma",
    category: "DESIGN SYSTEMS",
    description: "",
    downloadUrl: "",
    author: "",
    size: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await submitResource(formData)

      if (result.success) {
        showToast({
          message: result.message,
          type: "success",
          duration: 8000, // Show longer for important message
        })

        // Reset form
        setFormData({
          name: "",
          type: "Figma",
          category: "DESIGN SYSTEMS",
          description: "",
          downloadUrl: "",
          author: "",
          size: "",
        })

        if (onSuccess) {
          onSuccess()
        }
      } else {
        showToast({
          message: result.message || "Failed to submit resource",
          type: "error",
        })
        console.error("Submission error:", result)
      }
    } catch (error) {
      console.error("Form submission error:", error)
      showToast({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border-2 border-black dark:border-white p-8 mb-16">
      <h2 className="text-2xl font-bold mb-6">SUBMIT RESOURCE</h2>
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-400 dark:border-gray-600">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>📝 Submission Guidelines:</strong>
        </p>
        <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
          <li>• Your resource will be reviewed before being published</li>
          <li>• Only high-quality, relevant resources will be approved</li>
          <li>• Please ensure your download URL is working and accessible</li>
          <li>• You won't see your submission until it's approved by an admin</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-600 dark:text-gray-400">RESOURCE NAME *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-transparent border-2 border-gray-400 dark:border-gray-600 p-3 focus:border-black dark:focus:border-white outline-none transition-colors font-mono"
              placeholder="RESOURCE NAME"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-600 dark:text-gray-400">AUTHOR *</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full bg-transparent border-2 border-gray-400 dark:border-gray-600 p-3 focus:border-black dark:focus:border-white outline-none transition-colors font-mono"
              placeholder="YOUR NAME"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-600 dark:text-gray-400">TYPE *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ResourceType })}
              className="w-full bg-white dark:bg-black border-2 border-gray-400 dark:border-gray-600 p-3 focus:border-black dark:focus:border-white outline-none transition-colors font-mono"
              required
              disabled={isSubmitting}
            >
              <option value="Figma">Figma</option>
              <option value="SVG">SVG</option>
              <option value="CSS">CSS</option>
              <option value="GitHub">GitHub</option>
              <option value="CodePen">CodePen</option>
              <option value="Link">Link</option>
              <option value="PDF">PDF</option>
              <option value="ZIP">ZIP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-600 dark:text-gray-400">CATEGORY *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ResourceCategory })}
              className="w-full bg-white dark:bg-black border-2 border-gray-400 dark:border-gray-600 p-3 focus:border-black dark:focus:border-white outline-none transition-colors font-mono"
              required
              disabled={isSubmitting}
            >
              <option value="DESIGN SYSTEMS">DESIGN SYSTEMS</option>
              <option value="CODE TEMPLATES">CODE TEMPLATES</option>
              <option value="INSPIRATION">INSPIRATION</option>
              <option value="BLOGS">BLOGS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-600 dark:text-gray-400">SIZE</label>
            <input
              type="text"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full bg-transparent border-2 border-gray-400 dark:border-gray-600 p-3 focus:border-black dark:focus:border-white outline-none transition-colors font-mono"
              placeholder="2.4MB"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-600 dark:text-gray-400">DESCRIPTION *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-transparent border-2 border-gray-400 dark:border-gray-600 p-3 focus:border-black dark:focus:border-white outline-none transition-colors font-mono h-24 resize-none"
            placeholder="DESCRIBE YOUR RESOURCE..."
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-600 dark:text-gray-400">DOWNLOAD URL *</label>
          <input
            type="url"
            value={formData.downloadUrl}
            onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
            className="w-full bg-transparent border-2 border-gray-400 dark:border-gray-600 p-3 focus:border-black dark:focus:border-white outline-none transition-colors font-mono"
            placeholder="https://..."
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="border-2 border-black dark:border-white px-8 py-3 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                SUBMITTING...
              </>
            ) : (
              "SUBMIT RESOURCE"
            )}
          </button>

          <button
            type="button"
            onClick={onSuccess}
            disabled={isSubmitting}
            className="border-2 border-gray-400 dark:border-gray-600 px-8 py-3 hover:border-black dark:hover:border-white transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CANCEL
          </button>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 mt-4 space-y-1">
          <p>* Required fields</p>
          <p>📋 Your submission will be reviewed before being published</p>
          <p>⏱️ Review typically takes 24-48 hours</p>
        </div>
      </form>
    </div>
  )
}
