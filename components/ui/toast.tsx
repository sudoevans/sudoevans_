"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export interface ToastProps {
  message: string
  type: "success" | "error" | "info"
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-gray-700"

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 p-4 ${bgColor} text-white flex items-center gap-4 min-w-[300px] shadow-lg`}
    >
      <div className="flex-1">{message}</div>
      <button
        onClick={() => {
          setVisible(false)
          if (onClose) onClose()
        }}
        className="p-1 hover:bg-white/20 rounded-full"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([])

  const showToast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...props, id }])
    return id
  }

  const closeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const ToastContainer = () => (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => closeToast(toast.id)}
        />
      ))}
    </div>
  )

  return { showToast, closeToast, ToastContainer }
}
