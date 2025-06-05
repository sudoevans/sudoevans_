"use client"

import type React from "react"

import Link from "next/link"
import { ArrowLeft, Send, Trophy } from "lucide-react"
import { useState, useEffect } from "react"
import { submitGuestbookEntry, getGuestbookEntries, type GuestbookFormData } from "@/lib/actions/guestbook"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast"
import { ThemeToggle } from "@/components/theme-toggle"

export default function GuestbookPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const { showToast, ToastContainer } = useToast()

  const [formData, setFormData] = useState<GuestbookFormData>({
    name: "",
    message: "",
    location: "",
  })

  const [firstThreeIds, setFirstThreeIds] = useState<string[]>([])
  const [trophyEntries, setTrophyEntries] = useState<any[]>([])

  const ITEMS_PER_PAGE = 10
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))

  useEffect(() => {
    fetchEntries()
  }, [currentPage])

  useEffect(() => {
    // Fetch first three entries only once
    const fetchFirstThree = async () => {
      try {
        // Fetch the first 3 entries by oldest first
        const { entries: firstThree } = await getGuestbookEntries(1, 3, "asc")
        setFirstThreeIds(firstThree.map((e: any) => e.id))
        setTrophyEntries(firstThree)
      } catch {
        setFirstThreeIds([])
        setTrophyEntries([])
      }
    }
    fetchFirstThree()
  }, [])

  const fetchEntries = async () => {
    setIsLoading(true)
    try {
      const { entries: fetchedEntries, count, error } = await getGuestbookEntries(currentPage, ITEMS_PER_PAGE)

      if (error) {
        showToast({
          message: error,
          type: "error",
        })
        return
      }

      setEntries(fetchedEntries)
      setTotalCount(count)
    } catch (error) {
      showToast({
        message: "Failed to load guestbook entries",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await submitGuestbookEntry(formData)

      if (result.success) {
        showToast({
          message: result.message,
          type: "success",
        })

        setFormData({ name: "", message: "", location: "" })
        setCurrentPage(1)
        fetchEntries()
      } else {
        showToast({
          message: result.message,
          type: "error",
        })
      }
    } catch (error) {
      showToast({
        message: "Failed to submit entry",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Navigation */}
      <nav className="fixed top-8 left-8 z-50">
        <Link
          href="/"
          className="w-16 h-16 border-2 border-black dark:border-white rounded-full flex items-center justify-center hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </nav>

      {/* Theme Toggle */}
      <div className="fixed top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="pt-32 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-4">GUESTBOOK</h1>
          <div className="w-24 h-1 bg-black dark:bg-white mb-8"></div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-2xl">
            Show some love and tell everyone you were here! Be honourable :)
          </p>

          {/* Sign Form */}
          <div className="border-2 border-black dark:border-white p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6">SIGN THE BOOK</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-600 dark:text-gray-400">NAME *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-2 border-gray-400 dark:border-gray-600 p-3 focus:border-black dark:focus:border-white outline-none transition-colors font-mono"
                    placeholder="YOUR NAME"
                    required
                    disabled={isSubmitting}
                    maxLength={32} // Limit name to 32 characters
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-600 dark:text-gray-400">LOCATION</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-transparent border-2 border-gray-400 dark:border-gray-600 p-3 focus:border-black dark:focus:border-white outline-none transition-colors font-mono"
                    placeholder="CITY, COUNTRY"
                    disabled={isSubmitting}
                    maxLength={32} // Limit location to 32 characters
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-600 dark:text-gray-400">MESSAGE *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent border-2 border-gray-400 dark:border-gray-600 p-3 focus:border-black dark:focus:border-white outline-none transition-colors font-mono h-32 resize-none"
                  placeholder="SHARE YOUR THOUGHTS..."
                  required
                  disabled={isSubmitting}
                  maxLength={180} // Limit message to 180 characters
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="border-2 border-black dark:border-white px-8 py-3 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    SUBMITTING...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    SUBMIT
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Entries */}
          <div>
            <h2 className="text-2xl font-bold mb-8 text-gray-600 dark:text-gray-400">
              ENTRIES ({isLoading ? "..." : totalCount})
            </h2>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : entries.length === 0 ? (
              <div className="border-2 border-gray-400 dark:border-gray-600 p-12 text-center">
                <p className="text-xl mb-4">NO ENTRIES YET</p>
                <p className="text-gray-600 dark:text-gray-400">Be the first to sign the guestbook!</p>
              </div>
            ) : (
              (() => {
                // Remove trophy entries from paginated entries
                const restEntries = entries
                  .filter(e => !firstThreeIds.includes(e.id))
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

                // Combine for display: always show trophyEntries first, in correct order
                const displayEntries = [...trophyEntries, ...restEntries]

                return (
                  <div className="space-y-6 mb-12">
                    {displayEntries.map((entry) => {
                      const trophyIndex = firstThreeIds.indexOf(entry.id)
                      return (
                        <div
                          key={entry.id}
                          className="border border-gray-400 dark:border-gray-600 p-6 hover:border-black dark:hover:border-white transition-colors"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">{entry.name.toUpperCase()}</h3>
                              {trophyIndex !== -1 && (
                                <Trophy
                                  className={`w-5 h-5 ${
                                    trophyIndex === 0
                                      ? "text-yellow-500"
                                      : trophyIndex === 1
                                      ? "text-gray-400"
                                      : "text-amber-700"
                                  }`}
                                  aria-label={
                                    trophyIndex === 0
                                      ? "First guest"
                                      : trophyIndex === 1
                                      ? "Second guest"
                                      : "Third guest"
                                  }
                                />
                              )}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                              {new Date(entry.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {entry.location && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                              {entry.location.toUpperCase()}
                            </p>
                          )}
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{entry.message}</p>
                        </div>
                      )
                    })}
                  </div>
                )
              })()
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex justify-center gap-2 mb-16">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-12 h-12 border-2 font-bold transition-all duration-300 ${
                      currentPage === page
                        ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                        : "border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Geometric Elements */}
      <div className="fixed bottom-8 right-8 w-16 h-16 border-2 border-gray-300 dark:border-gray-800 rotate-45"></div>
      <div className="fixed top-1/3 right-1/4 w-6 h-6 bg-gray-300 dark:bg-gray-700"></div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  )
}
