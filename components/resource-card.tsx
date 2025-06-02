"use client"

import { useState, useEffect } from "react"
import { Download, ExternalLink, Heart } from "lucide-react"
import { trackDownload } from "@/lib/actions/resources"
import { likeResource, getResourceLikes, checkUserLiked } from "@/lib/actions/likes"
import type { Resource } from "@/lib/actions/resources"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast"
import { SubscriptionModal } from "@/components/subscription-modal"

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [downloadCount, setDownloadCount] = useState(resource.download_count || 0)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    // Load like count and check if user has liked
    loadLikeData()
  }, [resource.id])

  const loadLikeData = async () => {
    try {
      const [likesResult, likedResult] = await Promise.all([getResourceLikes(resource.id), checkUserLiked(resource.id)])

      if (!likesResult.error) {
        setLikeCount(likesResult.count)
      }

      if (!likedResult.error) {
        setIsLiked(likedResult.liked)
      }
    } catch (error) {
      console.error("Failed to load like data:", error)
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      // Track the download
      await trackDownload(resource.id)
      setDownloadCount((prev) => prev + 1)

      // Handle the download based on resource type
      if (resource.type === "GitHub" || resource.type === "CodePen" || resource.type === "Link") {
        window.open(resource.download_url, "_blank")
      } else {
        // Simulate download for local files
        const link = document.createElement("a")
        link.href = resource.download_url
        link.download = resource.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleLike = async () => {
    if (isLiked) {
      showToast({
        message: "You have already liked this resource",
        type: "info",
      })
      return
    }

    setIsLiking(true)

    try {
      const result = await likeResource(resource.id)

      if (result.success) {
        setIsLiked(true)
        setLikeCount((prev) => prev + 1)
        showToast({
          message: result.message,
          type: "success",
        })

        // Show subscription modal after first like
        if (likeCount === 0) {
          setTimeout(() => {
            setShowSubscriptionModal(true)
          }, 1500)
        }
      } else {
        showToast({
          message: result.message,
          type: "error",
        })
      }
    } catch (error) {
      showToast({
        message: "Failed to like resource",
        type: "error",
      })
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <>
      <div className="border border-gray-400 dark:border-gray-600 p-6 hover:border-black dark:hover:border-white transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold">{resource.name}</h3>
              <span className="text-xs font-mono px-2 py-1 border border-black dark:border-white">{resource.type}</span>
              <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{resource.category}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors mb-2">
              {resource.description}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              {resource.author && <span>BY {resource.author.toUpperCase()}</span>}
              {resource.date && <span>{new Date(resource.date).toLocaleDateString()}</span>}
              {resource.size && <span>{resource.size}</span>}
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" /> {downloadCount}
              </span>
              <span className="flex items-center gap-1">
                <Heart className={`w-3 h-3 ${isLiked ? "fill-red-500 text-red-500" : ""}`} /> {likeCount}
              </span>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={handleLike}
              disabled={isLiking || isLiked}
              className={`p-3 border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                isLiked
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-gray-400 dark:border-gray-600 hover:border-red-500 hover:text-red-500"
              }`}
            >
              {isLiking ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              )}
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-3 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <LoadingSpinner size="sm" />
              ) : resource.type === "Link" || resource.type === "GitHub" || resource.type === "CodePen" ? (
                <ExternalLink className="w-5 h-5" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <SubscriptionModal isOpen={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)} />
    </>
  )
}
