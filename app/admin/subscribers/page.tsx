"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, LogOut, Search, Mail, Users, UserCheck, UserX, Download, Trash2, Eye } from "lucide-react"
import {
  getSubscribers,
  toggleSubscriberStatus,
  deleteSubscriber,
  getSubscriberStats,
  exportSubscribers,
  type Subscriber,
} from "@/lib/actions/admin-subscribers"
import { generateWeeklyEmail, previewWeeklyEmail, getWeeklyEmailHistory } from "@/lib/actions/weekly-emails"
import { logout, checkAuth } from "@/lib/actions/auth"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, recent: 0 })
  const [user, setUser] = useState<any>(null)
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false)
  const [emailHistory, setEmailHistory] = useState<any[]>([])
  const { showToast, ToastContainer } = useToast()
  const router = useRouter()

  const ITEMS_PER_PAGE = 20
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))

  useEffect(() => {
    checkAuthentication()
  }, [])

  useEffect(() => {
    if (user) {
      fetchSubscribers()
      fetchStats()
      fetchEmailHistory()
    }
  }, [currentPage, searchTerm, user])

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

  const fetchSubscribers = async () => {
    setIsLoading(true)
    try {
      const {
        subscribers: fetchedSubscribers,
        count,
        error,
      } = await getSubscribers(currentPage, ITEMS_PER_PAGE, searchTerm || undefined)

      if (error) {
        showToast({ message: error, type: "error" })
        return
      }

      setSubscribers(fetchedSubscribers)
      setTotalCount(count)
    } catch (error) {
      showToast({ message: "Failed to load subscribers", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const statsResult = await getSubscriberStats()
      if (!statsResult.error) {
        setStats(statsResult)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const fetchEmailHistory = async () => {
    try {
      const { emails } = await getWeeklyEmailHistory(1, 5)
      setEmailHistory(emails)
    } catch (error) {
      console.error("Failed to fetch email history:", error)
    }
  }

  const handleToggleStatus = async (subscriberId: string, currentStatus: boolean) => {
    try {
      const result = await toggleSubscriberStatus(subscriberId, !currentStatus)
      if (result.success) {
        showToast({ message: result.message, type: "success" })
        fetchSubscribers()
        fetchStats()
      } else {
        showToast({ message: result.message, type: "error" })
      }
    } catch (error) {
      showToast({ message: "Failed to update subscriber", type: "error" })
    }
  }

  const handleDelete = async (subscriberId: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return

    try {
      const result = await deleteSubscriber(subscriberId)
      if (result.success) {
        showToast({ message: result.message, type: "success" })
        fetchSubscribers()
        fetchStats()
      } else {
        showToast({ message: result.message, type: "error" })
      }
    } catch (error) {
      showToast({ message: "Failed to delete subscriber", type: "error" })
    }
  }

  const handleGenerateWeeklyEmail = async () => {
    setIsGeneratingEmail(true)
    try {
      const result = await generateWeeklyEmail()
      if (result.success) {
        showToast({ message: result.message, type: "success" })
        fetchEmailHistory()
      } else {
        showToast({ message: result.message, type: "error" })
      }
    } catch (error) {
      showToast({ message: "Failed to generate weekly email", type: "error" })
    } finally {
      setIsGeneratingEmail(false)
    }
  }

  const handlePreviewEmail = async () => {
    try {
      const result = await previewWeeklyEmail()
      if (result.success && result.preview) {
        // Open preview in new window
        const previewWindow = window.open("", "_blank", "width=800,height=600")
        if (previewWindow) {
          previewWindow.document.write(result.preview.content)
          previewWindow.document.title = result.preview.subject
        }
      } else {
        showToast({ message: result.message || "Failed to generate preview", type: "error" })
      }
    } catch (error) {
      showToast({ message: "Failed to preview email", type: "error" })
    }
  }

  const handleExport = async () => {
    try {
      const result = await exportSubscribers()
      if (result.success && result.csv) {
        // Download CSV
        const blob = new Blob([result.csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        showToast({ message: `Exported ${result.count} subscribers`, type: "success" })
      } else {
        showToast({ message: result.message || "Failed to export", type: "error" })
      }
    } catch (error) {
      showToast({ message: "Failed to export subscribers", type: "error" })
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/admin/login")
    } catch (error) {
      showToast({ message: "Logout failed", type: "error" })
    }
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Navigation */}
      <nav className="fixed top-8 left-8 z-50 flex gap-4">
        <Link
          href="/admin/resources"
          className="w-16 h-16 border-2 border-black dark:border-white rounded-full flex items-center justify-center hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300"
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

      {/* Theme Toggle */}
      <div className="fixed top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="pt-32 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-4">SUBSCRIBERS</h1>
              <div className="w-24 h-1 bg-black dark:bg-white mb-4"></div>
              <h2 className="text-2xl font-bold">EMAIL MANAGEMENT</h2>
            </div>
            {user && (
              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-400 text-sm">LOGGED IN AS</p>
                <p className="font-bold">{user.username.toUpperCase()}</p>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="border-2 border-black dark:border-white p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-black">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">TOTAL</div>
            </div>
            <div className="border-2 border-green-500 p-6 text-center">
              <UserCheck className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-black">{stats.active}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">ACTIVE</div>
            </div>
            <div className="border-2 border-red-500 p-6 text-center">
              <UserX className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-black">{stats.inactive}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">INACTIVE</div>
            </div>
            <div className="border-2 border-blue-500 p-6 text-center">
              <Mail className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-black">{stats.recent}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">LAST 30 DAYS</div>
            </div>
          </div>

          {/* Email Actions */}
          <div className="border-2 border-black dark:border-white p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">WEEKLY EMAIL ACTIONS</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleGenerateWeeklyEmail}
                disabled={isGeneratingEmail}
                className="border-2 border-green-500 text-green-500 px-6 py-3 hover:bg-green-500 hover:text-white transition-all duration-300 font-bold disabled:opacity-50 flex items-center gap-2"
              >
                {isGeneratingEmail ? (
                  <>
                    <LoadingSpinner size="sm" />
                    SENDING...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    SEND WEEKLY EMAIL
                  </>
                )}
              </button>
              <button
                onClick={handlePreviewEmail}
                className="border-2 border-blue-500 text-blue-500 px-6 py-3 hover:bg-blue-500 hover:text-white transition-all duration-300 font-bold flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                PREVIEW EMAIL
              </button>
              <button
                onClick={handleExport}
                className="border-2 border-gray-400 dark:border-gray-600 px-6 py-3 hover:border-black dark:hover:border-white transition-all duration-300 font-bold flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                EXPORT CSV
              </button>
            </div>
          </div>

          {/* Recent Email History */}
          {emailHistory.length > 0 && (
            <div className="border-2 border-gray-400 dark:border-gray-600 p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">RECENT EMAIL HISTORY</h3>
              <div className="space-y-3">
                {emailHistory.map((email) => (
                  <div key={email.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900">
                    <div>
                      <div className="font-bold">{email.email_subject}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Sent to {email.subscriber_count} subscribers • {new Date(email.sent_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH SUBSCRIBERS..."
                className="w-full bg-transparent border-2 border-gray-400 dark:border-gray-600 pl-12 pr-4 py-3 focus:border-black dark:focus:border-white outline-none transition-colors font-mono"
              />
            </div>
          </div>

          {/* Subscribers List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="border-2 border-gray-400 dark:border-gray-600 p-12 text-center">
              <p className="text-xl mb-4">NO SUBSCRIBERS FOUND</p>
              <p className="text-gray-600 dark:text-gray-400">No subscribers match your search criteria.</p>
            </div>
          ) : (
            <div className="space-y-4 mb-12">
              {subscribers.map((subscriber) => (
                <div key={subscriber.id} className="border-2 border-gray-400 dark:border-gray-600 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{subscriber.email}</h3>
                        <span
                          className={`text-xs font-bold px-2 py-1 ${
                            subscriber.is_active ? "bg-green-500 text-white" : "bg-red-500 text-white"
                          }`}
                        >
                          {subscriber.is_active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>SUBSCRIBED: {new Date(subscriber.subscribed_at).toLocaleDateString()}</span>
                        <span>
                          LAST EMAIL:{" "}
                          {subscriber.last_email_sent
                            ? new Date(subscriber.last_email_sent).toLocaleDateString()
                            : "Never"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleStatus(subscriber.id, subscriber.is_active)}
                        className={`p-3 border-2 transition-all duration-300 ${
                          subscriber.is_active
                            ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        }`}
                      >
                        {subscriber.is_active ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(subscriber.id)}
                        className="p-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
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

      {/* Toast Container */}
      <ToastContainer />
    </div>
  )
}
