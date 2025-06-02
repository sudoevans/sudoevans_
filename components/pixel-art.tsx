"use client"
import { useState, useEffect, useCallback } from "react"
import { useTheme } from "./theme-provider"

export function PixelArt() {
  // Console troll: only run on client after hydration, and only once
  useEffect(() => {
    if (typeof window === "undefined") return
    // Prevent multiple logs if React Fast Refresh or HMR triggers
    if ((window as any).__ghostTrollPrinted) return
    ;(window as any).__ghostTrollPrinted = true

    const asciiGhost = `
          .-.
         (o o)
         | O \\
         \\   \\
          \`~~~'
    `
    const uncomfortableQuestions = [
      "Why are you snooping around in the console?",
      "Looking for secrets, are we?",
      "Do you always peek behind the curtain?",
      "What are you hoping to find here?",
      "Are you lost, developer?",
      "Does this make you feel powerful?",
      "Are you debugging... or just curious?",
      "Is this where you hide from your problems?",
      "Do you inspect everyone this closely?",
      "What would your boss say if they saw you here?",
    ]
    const question = uncomfortableQuestions[Math.floor(Math.random() * uncomfortableQuestions.length)]
    setTimeout(() => {
      console.log(
        `%c${asciiGhost}\n\n%c${question}\n\n%cFind me on x.com/sudoevans 👻`,
        "color: #ff5555; font-weight: bold; font-size: 18px;",
        "color: #888; font-size: 14px;",
        "color: #00bfff; font-size: 14px;"
      )
    }, 500)
  }, [])

  const [hasMounted, setHasMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isBlinking, setIsBlinking] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isDiscovered, setIsDiscovered] = useState(false)
  const [showPrompt, setShowPrompt] = useState(true)
  const [isFrowning, setIsFrowning] = useState(false)
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null)
  const [messageType, setMessageType] = useState<"initial" | "discovered" | "chatting" | "angry">("initial")
  const [messageTimer, setMessageTimer] = useState<NodeJS.Timeout | null>(null)
  const { theme } = useTheme()

  // Message arrays for different states
  const initialMessages = ["Who is there?", "Someone there?", "Hello?", "I sense someone...", "Who's watching?"]

  const discoveredMessages = [
    "Aah, you got me!", "You found me!", "I can't even hide in peace!", "I was just chilling...", 
    "Busted!", "Well, hello there!", "Sneaky human!", "You're quite observant!", 
    "I thought I was invisible!", "Oops, caught red-eyed!", "So much for stealth mode!"
  ]
  
  const chattingMessages = [
    "What's your last commit message?", "Are you hiring?", "Do you prefer tabs or spaces?", 
    "What's your favorite programming language?", "Coffee or tea?", "Working late again?",
    "How many monitors do you have?", "Still using Windows?", "When's your last backup?",
    "Do you comment your code?", "Vim or VSCode?", "Is it really a bug or a feature?",
    "Have you tried turning it off and on?", "What's your GitHub streak?", "Localhost or live?",
    "Do you test in production?", "What's your biggest fear? Merge conflicts?", "Still debugging?",
    "Do you believe in clean code?", "How's your work-life balance?", "Rubber duck debugging?",
    "What's in your .gitignore?", "Do you push on Fridays?", "Legacy code haunting you too?"
  ]
  
  const angryMessages = [
    "Stop staring at me!", "This is getting weird...", "Do you mind?", "Personal space please!",
    "I'm not a zoo animal!", "Take a picture, it lasts longer!", "Rude much?", "Back off!",
    "I have rights too!", "This is harassment!", "I'm calling HR!", "Creepy human alert!",
    "Social distancing!", "Privacy invasion!", "I need an adult!", "Ghost lives matter!","Why are you still here?",
    "I didn't sign up for this!", "Do you even code?", "This is not a petting zoo!",
    "I have feelings too!", "You wouldn't like it if I stared at you!", "Ever heard of boundaries?","Enough already!",
    "I need some ghostly space!", "This is not a staring contest!", "Seriously, stop it!",
  ]

  // Set deterministic initial message for SSR/CSR match
  const [currentMessage, setCurrentMessage] = useState(initialMessages[0])

  // Handle hydration and setup client-side only effects
  useEffect(() => {
    setHasMounted(true)
    // Set random initial message only after mount to avoid hydration mismatch
    setCurrentMessage(initialMessages[Math.floor(Math.random() * initialMessages.length)])
  }, [])

  // Handle mouse movement - only after mount
  useEffect(() => {
    if (!hasMounted) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [hasMounted])

  // Natural blinking animation with random intervals - only after mount
  useEffect(() => {
    if (!hasMounted) return

    const scheduleNextBlink = () => {
      // Random interval between 1.5 to 4 seconds
      const nextBlinkDelay = 1500 + Math.random() * 2500
      
      const timeoutId = setTimeout(() => {
        setIsBlinking(true)
        
        // Blink duration - keep eyes closed for 100-150ms for natural feel
        const blinkTimeoutId = setTimeout(() => {
          setIsBlinking(false)
          scheduleNextBlink() // Schedule the next blink
        }, 100 + Math.random() * 50)

        return () => clearTimeout(blinkTimeoutId)
      }, nextBlinkDelay)

      return () => clearTimeout(timeoutId)
    }

    const cleanup = scheduleNextBlink()
    return cleanup
  }, [hasMounted])

  // Memoized message cycling function to prevent unnecessary re-renders
  const cycleMessages = useCallback((messages: string[], interval: number) => {
    const timer = setTimeout(() => {
      setCurrentMessage(messages[Math.floor(Math.random() * messages.length)])
    }, interval + Math.random() * 3000)
    
    setMessageTimer(timer)
    return timer
  }, [])

  // Message cycling for chatting state - only after mount
  useEffect(() => {
    if (!hasMounted) return

    // Only cycle chatting messages if not angry/frowning
    if (messageType === "chatting" && !isFrowning) {
      const timer = cycleMessages(chattingMessages, 5000)
      
      return () => {
        if (timer) clearTimeout(timer)
      }
    }
  }, [messageType, isFrowning, hasMounted, cycleMessages])

  // Angry message cycling (only while hovered and angry) - only after mount
  useEffect(() => {
    if (!hasMounted) return

    if (messageType === "angry" && isFrowning && isHovered) {
      const timer = cycleMessages(angryMessages, 2000)
      
      return () => {
        if (timer) clearTimeout(timer)
      }
    }
  }, [messageType, isFrowning, isHovered, hasMounted, cycleMessages])

  // Handle state transitions - only after mount
  useEffect(() => {
    if (!hasMounted) return

    if (isHovered && !isDiscovered) {
      // First time being discovered
      setIsDiscovered(true)
      setMessageType("discovered")
      setCurrentMessage(discoveredMessages[Math.floor(Math.random() * discoveredMessages.length)])
      setShowPrompt(false)
      
      // After 3 seconds, start chatting
      setTimeout(() => {
        setMessageType("chatting")
        setCurrentMessage(chattingMessages[Math.floor(Math.random() * chattingMessages.length)])
      }, 3000)
    }
  }, [isHovered, isDiscovered, hasMounted])

  // Handle long hover for frowning
  const handleMouseEnter = useCallback(() => {
    if (!hasMounted) return
    
    setIsHovered(true)
    
    if (isDiscovered) {
      setIsFrowning(false)
      const timer = setTimeout(() => {
        setIsFrowning(true)
        setMessageType("angry")
        setCurrentMessage(angryMessages[Math.floor(Math.random() * angryMessages.length)])
      }, 4000) // Start frowning after 4 seconds of hovering

      setHoverTimer(timer)
    }
  }, [isDiscovered, hasMounted])

  const handleMouseLeave = useCallback(() => {
    if (!hasMounted) return
    
    setIsHovered(false)
    setIsFrowning(false)
    
    // Clean up hover timer
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      setHoverTimer(null)
    }
    
    // If discovered and angry, go back to chatting mode and chatting messages
    if (isDiscovered && messageType === "angry") {
      setMessageType("chatting")
      setCurrentMessage(chattingMessages[Math.floor(Math.random() * chattingMessages.length)])
    }
  }, [hoverTimer, isDiscovered, messageType, hasMounted])

  // Calculate transform safely - only after mount and with window available
  const getTransform = () => {
    if (!hasMounted || isDiscovered || typeof window === "undefined") {
      return "translate(0px, 0px)"
    }
    
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const translateX = (mousePosition.x - centerX) * 0.02
    const translateY = (mousePosition.y - centerY) * 0.02
    
    return `translate(${translateX}px, ${translateY}px)`
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]

  const getPixelColor = (value: number) => {
    switch (value) {
      case 1:
        return theme === "dark" ? "#e0e0e0" : "#333333" // Ghost body
      case 2:
        // When blinking, eyes completely disappear (transparent)
        // When not blinking, eyes are red
        return isBlinking ? "transparent" : "#ff0000"
      case 3:
        return theme === "dark" ? "#000000" : "#ffffff" // Mouth
      default:
        return "transparent"
    }
  }

  const currentGrid = isDiscovered ? (isFrowning ? ghostBodyFrowning : ghostBodyNormal) : eyesOnly

  // Don't render interactive elements until mounted to prevent hydration issues
  if (!hasMounted) {
    return (
      <div className="flex flex-col items-center justify-center relative">
        <div className="relative">
          <div
            className="grid gap-0"
            style={{
              gridTemplateColumns: `repeat(12, ${pixelSize}px)`,
              gridTemplateRows: `repeat(16, ${pixelSize}px)`,
            }}
          >
            {eyesOnly.map((row, rowIndex) =>
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
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-lg font-mono animate-pulse whitespace-nowrap px-3 py-1 rounded-lg text-black bg-white/90 dark:text-white dark:bg-black/90">
            {initialMessages[0]}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div
        className="relative transition-transform duration-200 ease-out"
        style={{
          transform: getTransform(),
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="grid gap-0 cursor-pointer"
          style={{
            gridTemplateColumns: `repeat(12, ${pixelSize}px)`,
            gridTemplateRows: `repeat(16, ${pixelSize}px)`,
            filter: !isDiscovered ? "drop-shadow(0 0 8px rgba(255, 0, 0, 0.6))" : "none",
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

      {/* Dynamic message display */}
      {(showPrompt || isDiscovered) && (
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center">
          <div 
            className={`text-lg font-mono animate-pulse whitespace-nowrap px-3 py-1 rounded-lg ${
              messageType === "angry"
                ? "text-red-400 bg-red-900/20"
                : "text-black bg-white/90 dark:text-white dark:bg-black/90"
            }`}
          >
            {currentMessage}
          </div>
        </div>
      )}
    </div>
  )
}