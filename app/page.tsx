import Link from "next/link"
import { PixelArt } from "@/components/pixel-art"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white relative overflow-hidden">
      {/* Theme Toggle */}
      <div className="fixed top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      {/* Main Content Container */}
      <div className="flex min-h-screen">
        {/* Left Side - Main Content */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-12">
              <div className="mb-2">EVANS</div>
              <div className="mb-2">KIPTOO</div>
              <div className="text-gray-500 dark:text-gray-500">CHERUIYOT</div>
            </h1>

            <div className="w-32 h-1 bg-black dark:bg-white mb-8"></div>

            <p className="text-xl md:text-2xl font-light max-w-2xl mb-8 leading-relaxed">
              Minimalistic approach to showcasing my work through stark contrasts and geometric brutalism.
            </p>

            {/* Contact Details */}
            <div className="mb-12 space-y-2 font-mono text-sm">
              <p className="text-gray-600 dark:text-gray-400">CONTACT</p>
              <p>sudoevans@gmail.com</p>
              <p>+254 740 213 937</p>
              <p>Nairobi, Kenya</p>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="https://x.com/sudoevans"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border-2 border-gray-400 dark:border-gray-600 px-4 py-2 hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 font-bold text-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                TWITTER
              </a>
              <a
                href="https://github.com/sudoevans"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border-2 border-gray-400 dark:border-gray-600 px-4 py-2 hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 font-bold text-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GITHUB
              </a>
              <a
                href="https://linkedin.com/in/sudoevans"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border-2 border-gray-400 dark:border-gray-600 px-4 py-2 hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 font-bold text-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LINKEDIN
              </a>
              <a
                href="mailto:sudoevans@gmail.com"
                className="flex items-center gap-2 border-2 border-gray-400 dark:border-gray-600 px-4 py-2 hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 font-bold text-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                </svg>
                EMAIL
              </a>
            </div>
          </div>
        </div>

        {/* Right Side - Pixel Art */}
        <div className="hidden lg:flex flex-col justify-center items-center w-1/3 relative">
          <PixelArt />
        </div>
      </div>

      {/* Mobile Pixel Art - Shows on smaller screens */}
      <div className="lg:hidden absolute top-1/4 right-4 opacity-50">
        <PixelArt />
      </div>

      {/* Decorative geometry - Dark theme only */}
      <div className="dark:block hidden">
        {/* Soft blurred colour blob */}
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-fuchsia-500/30 blur-3xl" />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-8 left-8 flex flex-col gap-4 text-sm font-mono z-10">
        <Link href="/projects" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
          PROJECTS
        </Link>
        <Link href="/resources" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
          RESOURCES
        </Link>
        <Link href="/guestbook" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
          GUESTBOOK
        </Link>
      </div>
    </div>
  )
}
