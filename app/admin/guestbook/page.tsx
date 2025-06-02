"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, LogOut, Trash2 } from "lucide-react"
import { getGuestbookEntries } from "@/lib/actions/guestbook"
import { logout, checkAuth } from "@/lib/actions/auth"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"

export default function AdminGuestbookPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [user, setUser] = useState<any>(null)
  const { showToast, ToastContainer } = useToast()
  const router = useRouter()

  const ITEMS_PER_PAGE = 20
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))

  useEffect(() => {
    checkAuthentication()
  }, [])

  useEffect(() => {
    if (user) {
      fetchEntries()
    }
  }, [currentPage, user])

  const checkAuthentication = async () => {
    try {
      const { isAuthenticated, user: authUser } = await checkAuth()

      if (!isAuthenticated) {
        router.push("/admin/login")
        return
      }

      setUser(authUser)
    } catch (error) {
      router.push("/admin/login")
    } finally {
      setIsAuthLoading(false)
    }
  }

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

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/admin/login")
    } catch (error) {
      showToast({
        message: "Logout failed",
        type: "error",
      })
    }
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-8 left-8 z-50 flex gap-4">
        <Link
          href="/admin/resources"
          className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <button
          onClick={handleLogout}
          className="w-16 h-16 border-2 border-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </nav>

      <div className="pt-32 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-4">GUESTBOOK</h1>
              <div className="w-24 h-1 bg-white mb-4"></div>
              <h2 className="text-2xl font-bold">ADMIN MANAGEMENT</h2>
            </div>
            {user && (
              <div className="text-right">
                <p className="text-gray-400 text-sm">LOGGED IN AS</p>
                <p className="font-bold">{user.username.toUpperCase()}</p>
              </div>
            )}
          </div>

          <div className="mb-8 text-sm font-mono text-gray-400">TOTAL ENTRIES: {totalCount}</div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : entries.length === 0 ? (
            <div className="border-2 border-gray-600 p-12 text-center">
              <p className="text-xl mb-4">NO GUESTBOOK ENTRIES</p>
              <p className="text-gray-400">No one has signed the guestbook yet.</p>
            </div>
          ) : (
            <div className="space-y-6 mb-12">
              {entries.map((entry) => (
                <div key={entry.id} className="border-2 border-gray-600 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{entry.name.toUpperCase()}</h3>
                        {entry.location && (
                          <span className="text-xs font-mono text-gray-400">{entry.location.toUpperCase()}</span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-4 leading-relaxed">{entry.message}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span>SUBMITTED: {new Date(entry.created_at).toLocaleString()}</span>
                        {entry.ip_address && <span>IP: {entry.ip_address}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // In a real app, you'd implement delete functionality
                          showToast({
                            message: "Delete functionality would be implemented here",
                            type: "info",
                          })
                        }}
                        className="p-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {entry.user_agent && (
                    <div className="mt-4 p-3 bg-gray-900 font-mono text-xs overflow-x-auto">
                      <p>User Agent: {entry.user_agent}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center gap-2 mb-16">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-12 h-12 border-2 font-bold transition-all duration-300 ${
                    currentPage === page ? "border-white bg-white text-black" : "border-gray-600 hover:border-white"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  )
}
