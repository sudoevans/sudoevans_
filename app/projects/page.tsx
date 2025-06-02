"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const allProjects = [
  {
    id: 1,
    title: "NEURAL INTERFACE",
    description: "AI-powered design system with brutal aesthetics",
    year: "2024",
    tech: ["React", "TypeScript", "WebGL"],
    featured: true,
    status: "LIVE",
  },
  {
    id: 2,
    title: "VOID COMMERCE",
    description: "E-commerce platform with dark patterns",
    year: "2024",
    tech: ["Next.js", "Stripe", "PostgreSQL"],
    featured: false,
    status: "DEVELOPMENT",
  },
  {
    id: 3,
    title: "GEOMETRIC CHAOS",
    description: "Generative art using mathematical brutalism",
    year: "2023",
    tech: ["Three.js", "GLSL", "Canvas"],
    featured: true,
    status: "LIVE",
  },
  {
    id: 4,
    title: "MONOLITH CMS",
    description: "Content management with stark simplicity",
    year: "2023",
    tech: ["Node.js", "MongoDB", "GraphQL"],
    featured: false,
    status: "ARCHIVED",
  },
  {
    id: 5,
    title: "BRUTALIST PORTFOLIO",
    description: "Minimalist portfolio with geometric elements",
    year: "2023",
    tech: ["Next.js", "Tailwind CSS", "Supabase"],
    featured: false,
    status: "LIVE",
  },
  {
    id: 6,
    title: "PIXEL GHOST",
    description: "Interactive pixel art character with animations",
    year: "2023",
    tech: ["React", "CSS Grid", "Animation"],
    featured: false,
    status: "LIVE",
  },
  {
    id: 7,
    title: "STARK DASHBOARD",
    description: "Minimalist analytics dashboard with brutal UI",
    year: "2022",
    tech: ["Vue.js", "D3.js", "Firebase"],
    featured: false,
    status: "ARCHIVED",
  },
  {
    id: 8,
    title: "CONCRETE BLOG",
    description: "Brutalist blog platform with raw typography",
    year: "2022",
    tech: ["Gatsby", "MDX", "Netlify CMS"],
    featured: false,
    status: "DEVELOPMENT",
  },
  {
    id: 9,
    title: "BINARY WEATHER",
    description: "Weather app with binary aesthetic and minimal UI",
    year: "2022",
    tech: ["React Native", "OpenWeather API", "Expo"],
    featured: false,
    status: "LIVE",
  },
  {
    id: 10,
    title: "BRUTALIST NOTES",
    description: "Note-taking app with stark contrasts and raw design",
    year: "2021",
    tech: ["Electron", "React", "IndexedDB"],
    featured: false,
    status: "ARCHIVED",
  },
]

export default function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 4

  const featuredProjects = allProjects.filter((p) => p.featured)
  const nonFeaturedProjects = allProjects.filter((p) => !p.featured)

  const totalPages = Math.max(1, Math.ceil(nonFeaturedProjects.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProjects = nonFeaturedProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE)

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
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-4">PROJECTS</h1>
          <div className="w-24 h-1 bg-black dark:bg-white mb-16"></div>

          {/* Featured Projects */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-8 text-gray-600 dark:text-gray-400">FEATURED</h2>
            <div className="grid gap-8">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="border-2 border-black dark:border-white p-8 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-3xl font-black mb-2">{project.title}</h3>
                      <p className="text-lg group-hover:text-gray-300 dark:group-hover:text-gray-800">
                        {project.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono mb-2">{project.year}</div>
                      <div
                        className={`text-xs font-bold px-2 py-1 ${
                          project.status === "LIVE"
                            ? "bg-green-500 text-black"
                            : project.status === "DEVELOPMENT"
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-500 text-white"
                        }`}
                      >
                        {project.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-sm font-mono border border-current px-2 py-1 group-hover:border-gray-300 dark:group-hover:border-gray-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <ExternalLink className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" />
                      <Github className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Projects */}
          <div>
            <h2 className="text-2xl font-bold mb-8 text-gray-600 dark:text-gray-400">ALL PROJECTS</h2>
            <div className="space-y-4 mb-12">
              {paginatedProjects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-400 dark:border-gray-600 p-6 hover:border-black dark:hover:border-white transition-all duration-300 group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300">
                        {project.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-gray-600 dark:text-gray-400">{project.year}</div>
                      <div
                        className={`text-xs font-bold px-2 py-1 mt-1 ${
                          project.status === "LIVE"
                            ? "bg-green-500 text-black"
                            : project.status === "DEVELOPMENT"
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-500 text-white"
                        }`}
                      >
                        {project.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
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
      </div>

      {/* Geometric Elements */}
      <div className="fixed bottom-8 right-8 w-24 h-24 border-2 border-gray-300 dark:border-gray-800"></div>
      <div className="fixed top-1/3 right-12 w-4 h-4 bg-black dark:bg-white rotate-45"></div>
    </div>
  )
}
