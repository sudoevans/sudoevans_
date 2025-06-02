"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, X, LogOut, Users } from "lucide-react"
import { getPendingResources, approveResource, rejectResource } from "@/lib/actions/resources"
import { logout, checkAuth } from "@/lib/actions/auth"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminResourcesPage() {
  const [pendingResources, setPendingResources] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [user, setUser] = useState<any>(null)
  const { showToast, ToastContainer } = useToast()
  const router = useRouter()

  const ITEMS_PER_PAGE = 10
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))

  useEffect(() => {
    checkAuthentication()
  }, [])

  useEffect(() => {
    if (user) {
      fetchPendingResources()
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

  const fetchPendingResources = async () => {
    setIsLoading(true)
    try {
      const { resources, count, error } = await getPendingResources(currentPage, ITEMS_PER_PAGE)

      if (error) {
        showToast({
          message: error,
          type: "error",
        })
        return
      }

      setPendingResources(resources)
      setTotalCount(count)
    } catch (error) {
      showToast({
        message: "Failed to load pending resources",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const result = await approveResource(id)

      if (result.success) {
        showToast({
          message: result.message,
          type: "success",
        })
        fetchPendingResources()
      } else {
        showToast({
          message: result.message,
          type: "error",
        })
      }
    } catch (error) {
      showToast({
        message: "Failed to approve resource",
        type: "error",
      })
    }
  }

  const handleReject = async (id: string) => {
    try {
      const result = await rejectResource(id)

      if (result.success) {
        showToast({
          message: result.message,
          type: "success",
        })
        fetchPendingResources()
      } else {
        showToast({
          message: result.message,
          type: "error",
        })
      }
    } catch (error) {
      showToast({
        message: "Failed to reject resource",
        type: "error",
      })
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
          href="/"
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
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-4">ADMIN</h1>
              <div className="w-24 h-1 bg-black dark:bg-white mb-4"></div>
              <h2 className="text-2xl font-bold">PENDING RESOURCES</h2>
            </div>
            {user && (
              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-400 text-sm">LOGGED IN AS</p>
                <p className="font-bold">{user.username.toUpperCase()}</p>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : pendingResources.length === 0 ? (
            <div className="border-2 border-gray-400 dark:border-gray-600 p-12 text-center">
              <p className="text-xl mb-4">NO PENDING RESOURCES</p>
              <p className="text-gray-600 dark:text-gray-400">All resources have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-6 mb-12">
              {pendingResources.map((resource) => (
                <div key={resource.id} className="border-2 border-gray-400 dark:border-gray-600 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{resource.name}</h3>
                        <span className="text-xs font-mono px-2 py-1 border border-black dark:border-white">
                          {resource.type}
                        </span>
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{resource.category}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{resource.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {resource.author && <span>BY {resource.author.toUpperCase()}</span>}
                        {resource.date && <span>{new Date(resource.date).toLocaleDateString()}</span>}
                        {resource.size && <span>{resource.size}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(resource.id)}
                        className="p-3 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(resource.id)}
                        className="p-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-900 font-mono text-sm overflow-x-auto">
                    <p>
                      URL:{" "}
                      <a
                        href={resource.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {resource.download_url}
                      </a>
                    </p>
                    <p>Submitted: {new Date(resource.created_at).toLocaleString()}</p>
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

          {/* Quick Links */}
          <div className="border-2 border-gray-400 dark:border-gray-600 p-6">
            <h3 className="text-xl font-bold mb-4">ADMIN ACTIONS</h3>
            <div className="flex gap-4">
              <Link
                href="/admin/subscribers"
                className="border-2 border-gray-400 dark:border-gray-600 px-6 py-3 hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 font-bold flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                MANAGE SUBSCRIBERS
              </Link>
              <Link
                href="/admin/guestbook"
                className="border-2 border-gray-400 dark:border-gray-600 px-6 py-3 hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 font-bold"
              >
                MANAGE GUESTBOOK
              </Link>
              <Link
                href="/resources"
                className="border-2 border-gray-400 dark:border-gray-600 px-6 py-3 hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 font-bold"
              >
                VIEW RESOURCES
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  )
}
