"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { ResourceCard } from "@/components/resource-card"
import { ResourceForm } from "@/components/resource-form"
import { getResources, type ResourceCategory } from "@/lib/actions/resources"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast"
import { ThemeToggle } from "@/components/theme-toggle"

const ITEMS_PER_PAGE = 6

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | "">("")
  const { showToast, ToastContainer } = useToast()

  const categories: (ResourceCategory | "")[] = ["", "DESIGN SYSTEMS", "CODE TEMPLATES", "INSPIRATION", "BLOGS"]
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))

  const fetchResources = async () => {
    setIsLoading(true)
    try {
      const {
        resources: fetchedResources,
        count,
        error,
      } = await getResources({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
        category: (selectedCategory as ResourceCategory) || undefined,
      })

      if (error) {
        showToast({
          message: error,
          type: "error",
        })
        return
      }

      setResources(fetchedResources)
      setTotalCount(count)
    } catch (error) {
      showToast({
        message: "Failed to load resources",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [currentPage, searchTerm, selectedCategory])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchResources()
  }

  const handleCategoryChange = (category: ResourceCategory | "") => {
    setSelectedCategory(category)
    setCurrentPage(1)
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-4">RESOURCES</h1>
          <div className="w-24 h-1 bg-black dark:bg-white mb-8"></div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-2xl">
            Tools, templates, inspiration, and insights for brutal design systems and minimalistic interfaces.
          </p>

          {/* Submit Form */}
          {showSubmitForm ? (
            <ResourceForm
              onSuccess={() => {
                setShowSubmitForm(false)
                fetchResources()
              }}
            />
          ) : null}

          {/* Search and Filters */}
          <div className="mb-12 space-y-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH RESOURCES..."
                className="w-full bg-transparent border-2 border-gray-400 dark:border-gray-600 pl-12 pr-4 py-3 focus:border-black dark:focus:border-white outline-none transition-colors font-mono"
              />
            </form>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 border-2 font-bold text-sm transition-all duration-300 ${
                    selectedCategory === category
                      ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                      : "border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white"
                  }`}
                >
                  {category || "ALL"}
                </button>
              ))}
            </div>
          </div>

          {/* Resources with Pagination */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {isLoading
                  ? "LOADING RESOURCES..."
                  : resources.length === 0
                    ? "NO RESOURCES FOUND"
                    : `SHOWING ${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(
                        currentPage * ITEMS_PER_PAGE,
                        totalCount,
                      )} OF ${totalCount} RESOURCES`}
              </div>
              {!showSubmitForm && (
                <button
                  onClick={() => setShowSubmitForm(true)}
                  className="border-2 border-gray-400 dark:border-gray-600 px-6 py-3 hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 font-bold"
                >
                  SUBMIT RESOURCE
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : resources.length === 0 ? (
              <div className="border-2 border-gray-400 dark:border-gray-600 p-12 text-center">
                <p className="text-xl mb-4">NO RESOURCES FOUND</p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search or filters, or submit a new resource.
                </p>
                <button
                  onClick={() => setShowSubmitForm(true)}
                  className="border-2 border-black dark:border-white px-6 py-3 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 font-bold"
                >
                  SUBMIT RESOURCE
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mb-16">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-3 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2 flex-wrap justify-center">
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

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-3 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Geometric Elements */}
      <div className="fixed bottom-16 right-16 w-32 h-32 border border-gray-300 dark:border-gray-800 rotate-12"></div>
      <div className="fixed top-1/2 right-8 w-8 h-8 bg-gray-300 dark:bg-gray-800"></div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  )
}
