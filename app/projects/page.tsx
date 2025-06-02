"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const allProjects = [
	{
		id: 1,
		title: "Spotify_UI_with_flutter",
		description: "Flutter project of a Spotify Desktop App",
		stars: 8,
		language: "Dart",
		topics: ["android", "clone", "flutter", "spotify", "web"],
		repo: "https://github.com/sudoevans/Spotify_UI_with_flutter",
		homepage: null,
		featured: true,
	},
	{
		id: 2,
		title: "keep-alive",
		description: "Octocat to keep your profile alive",
		stars: 4,
		language: "JavaScript",
		topics: [],
		repo: "https://github.com/sudoevans/keep-alive",
		homepage: "https://keep-alive-bice.vercel.app",
		featured: false,
	},
	{
		id: 3,
		title: "e-commerce-electro",
		description: "Django Electro Shop",
		stars: 4,
		language: "Python",
		topics: ["bootstrap", "css", "django", "django-rest-framework", "htmx", "python"],
		repo: "https://github.com/sudoevans/e-commerce-electro",
		homepage: null,
		featured: false,
	},
	{
		id: 4,
		title: "ricky",
		description: "Command-line tool for managing weekly progress logs",
		stars: 7,
		language: "Rust",
		topics: ["rust"],
		repo: "https://github.com/sudoevans/ricky",
		homepage: null,
		featured: false,
	},
	{
		id: 5,
		title: "breathworksai",
		description: "Personalized breathwork sessions for well-being",
		stars: 2,
		language: "TypeScript",
		topics: ["health", "mental-health", "nextjs", "vercel"],
		repo: "https://github.com/sudoevans/breathworksai",
		homepage: "https://breathworksai.vercel.app",
		featured: false,
	},
	{
		id: 6,
		title: "telemed",
		description: "Doctor appointment management REST API.",
		stars: 0,
		language: "Python",
		topics: ["api", "doctor-appointment-management", "rest-api", "drf-spectacular", "bruno", "djngo"],
		repo: "https://github.com/sudoevans/telemed",
		homepage: "https://telemed.fly.dev/",
		featured: false,
	},
	{
		id: 7,
		title: "SentiNews-Scout",
		description:
			"SentiNews-Scout is a Python-based web application that uses machine learning and Flask to analyze news articles from China Daily and classify their sentiment. It automates scraping and processing articles, determining if the sentiment is positive or negative.",
		stars: 1,
		language: "Jupyter Notebook",
		topics: ["database", "flask", "machine-learning", "nlp", "sentiment-analysis"],
		repo: "https://github.com/sudoevans/SentiNews-Scout",
		homepage: null,
		featured: false,
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
											<div className="text-sm font-mono mb-2">{project.language}</div>
											<div className="text-xs font-bold px-2 py-1 bg-gray-200 dark:bg-gray-800 text-black dark:text-white mb-2">
												★ {project.stars}
											</div>
											{project.homepage && (
												<a
													href={project.homepage}
													target="_blank"
													rel="noopener noreferrer"
													className="block text-xs underline text-blue-600 dark:text-blue-400"
												>
													Homepage
												</a>
											)}
										</div>
									</div>
									<div className="flex justify-between items-center">
										<div className="flex gap-2 flex-wrap">
											{project.topics &&
												project.topics.map((topic) => (
													<span
														key={topic}
														className="text-xs font-mono border border-current px-2 py-1 rounded"
													>
														{topic}
													</span>
												))}
										</div>
										<div className="flex gap-4">
											<a
												href={project.repo}
												target="_blank"
												rel="noopener noreferrer"
											>
												<GitHubIcon className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" />
											</a>
											{project.homepage && (
												<a
													href={project.homepage}
													target="_blank"
													rel="noopener noreferrer"
												>
													<LinkIcon className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" />
												</a>
											)}
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
											<div className="flex gap-2 flex-wrap mt-2">
												{project.topics &&
													project.topics.map((topic) => (
														<span
															key={topic}
															className="text-xs font-mono border border-current px-2 py-1 rounded"
														>
															{topic}
														</span>
													))}
											</div>
										</div>
										<div className="text-right">
											<div className="text-sm font-mono text-gray-600 dark:text-gray-400">
												{project.language}
											</div>
											<div className="text-xs font-bold px-2 py-1 bg-gray-200 dark:bg-gray-800 text-black dark:text-white mb-2">
												★ {project.stars}
											</div>
											{project.homepage && (
												<a
													href={project.homepage}
													target="_blank"
													rel="noopener noreferrer"
													className="block text-xs underline text-blue-600 dark:text-blue-400"
												>
													Homepage
												</a>
											)}
											<div className="flex gap-2 justify-end mt-2">
												<a
													href={project.repo}
													target="_blank"
													rel="noopener noreferrer"
												>
													<GitHubIcon className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" />
												</a>
												{project.homepage && (
													<a
														href={project.homepage}
														target="_blank"
														rel="noopener noreferrer"
													>
														<LinkIcon className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" />
													</a>
												)}
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

// Custom GitHub SVG icon component
function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
			<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
		</svg>
	)
}

// Custom Link SVG icon component (minimal, geometric, "brutal" vibe)
function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			strokeWidth={2.2}
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M7 13l6-6" />
			<rect x="2" y="12" width="8" height="6" rx="2" />
			<rect x="10" y="2" width="8" height="6" rx="2" />
		</svg>
	)
}
