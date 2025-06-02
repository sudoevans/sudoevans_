export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border-t-white border-r-white/30 border-b-white/10 border-l-white/10 animate-spin`}
    ></div>
  )
}
