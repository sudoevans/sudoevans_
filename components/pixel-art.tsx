"use client"
import { useState, useEffect } from "react"
import { useTheme } from "./theme-provider"

export function PixelArt() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isBlinking, setIsBlinking] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showPrompt, setShowPrompt] = useState(true)
  const [isFrowning, setIsFrowning] = useState(false)
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null)
  const { theme } = useTheme()

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 200)
      },
      2000 + Math.random() * 2000,
    ) // Random blink between 3-5 seconds

    return () => clearInterval(blinkInterval)
  }, [])

  // Hide prompt after hover
  useEffect(() => {
    if (isHovered) {
      setShowPrompt(false)
    }
  }, [isHovered])

  // Handle long hover for frowning
  const handleMouseEnter = () => {
    setIsHovered(true)
    setIsFrowning(false)

    const timer = setTimeout(() => {
      setIsFrowning(true)
    }, 2000) // Start frowning after 3 seconds

    setHoverTimer(timer)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsFrowning(false)
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      setHoverTimer(null)
    }
  }

  const pixelSize = 8 // Larger pixels for more pixelated look

  // Ghost body pixels - normal expression
  const ghostBodyNormal = [
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1],
    [1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]

  // Ghost body pixels - frowning expression
  const ghostBodyFrowning = [
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1],
    [1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 1],
    [1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]

  // Just the eyes with glow effect
  const eyesOnly = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0],
    [0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]

  const getPixelColor = (value: number) => {
    switch (value) {
      case 1:
        return theme === "dark" ? "#e0e0e0" : "#333333" // Ghost body
      case 2:
        return isBlinking ? (theme === "dark" ? "#666" : "#ccc") : "#ff0000" // Eyes (red, gray when blinking)
      case 3:
        return theme === "dark" ? "#000000" : "#ffffff" // Mouth
      default:
        return "transparent"
    }
  }

  const currentGrid = isHovered ? (isFrowning ? ghostBodyFrowning : ghostBodyNormal) : eyesOnly

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div
        className="relative transition-transform duration-200 ease-out"
        style={{
          transform: `translate(${(mousePosition.x - (typeof window !== "undefined" ? window.innerWidth : 0) / 2) * 0.02}px, ${(mousePosition.y - (typeof window !== "undefined" ? window.innerHeight : 0) / 2) * 0.02}px)`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="grid gap-0 cursor-pointer"
          style={{
            gridTemplateColumns: `repeat(12, ${pixelSize}px)`,
            gridTemplateRows: `repeat(16, ${pixelSize}px)`,
            filter: !isHovered ? "drop-shadow(0 0 8px rgba(255, 0, 0, 0.6))" : "none",
          }}
        >
          {currentGrid.map((row, rowIndex) =>
            row.map((pixel, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: `${pixelSize}px`,
                  height: `${pixelSize}px`,
                  backgroundColor: getPixelColor(pixel),
                  imageRendering: "pixelated",
                }}
              />
            )),
          )}
        </div>
      </div>

      {/* Prompt text */}
      {showPrompt && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-black dark:text-white text-sm font-mono animate-pulse whitespace-nowrap">
          Who is there?
        </div>
      )}

      {/* Frowning prompt */}
      {isFrowning && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-red-400 text-sm font-mono animate-pulse whitespace-nowrap">
          Who is this?
        </div>
      )}
    </div>
  )
}
