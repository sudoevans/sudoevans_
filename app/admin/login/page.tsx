"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, LogIn } from "lucide-react"
import { login, type LoginFormData } from "@/lib/actions/auth"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast"

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  })
  const router = useRouter()
  const { showToast, ToastContainer } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(formData)

      if (result.success) {
        showToast({
          message: result.message,
          type: "success",
        })
        router.push("/admin/resources")
      } else {
        showToast({
          message: result.message,
          type: "error",
        })
      }
    } catch (error) {
      showToast({
        message: "Login failed",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-8 left-8 z-50">
        <Link
          href="/"
          className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </nav>

      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-black mb-4">ADMIN</h1>
            <div className="w-16 h-1 bg-white mx-auto mb-4"></div>
            <p className="text-gray-400">LOGIN TO ACCESS ADMIN PANEL</p>
          </div>

          <div className="border-2 border-white p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-400">USERNAME</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-transparent border-2 border-gray-600 p-3 focus:border-white outline-none transition-colors font-mono"
                  placeholder="ENTER USERNAME"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-400">PASSWORD</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-transparent border-2 border-gray-600 p-3 focus:border-white outline-none transition-colors font-mono"
                  placeholder="ENTER PASSWORD"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full border-2 border-white px-8 py-3 hover:bg-white hover:text-black transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    LOGGING IN...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    LOGIN
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-900 text-sm font-mono">
              <p className="text-gray-400 mb-2">DEMO CREDENTIALS:</p>
              <p>Username: admin</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Geometric Elements */}
      <div className="fixed bottom-16 right-16 w-32 h-32 border border-gray-800 rotate-12"></div>
      <div className="fixed top-1/3 left-1/4 w-8 h-8 bg-gray-800"></div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  )
}
