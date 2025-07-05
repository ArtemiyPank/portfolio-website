"use client"

import {useState, useEffect} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {Github, ExternalLink, Filter, AlertCircle} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Alert, AlertDescription} from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"

type Project = {
    id: string
    title: string
    description: string | null
    short_description: string | null
    image_url: string | null
    github_url: string | null
    demo_url: string | null
    tags: string[]
    featured: boolean
    created_at: string
    updated_at: string
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [allTags, setAllTags] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchProjects()
    }, [])

    useEffect(() => {
        if (selectedTags.length === 0) {
            setFilteredProjects(projects)
        } else {
            setFilteredProjects(projects.filter((project) => selectedTags.some((tag) => project.tags.includes(tag))))
        }
    }, [projects, selectedTags])

    const fetchProjects = async () => {
        try {
            console.log("Fetching projects...")
            setLoading(true)
            setError(null)

            const response = await fetch("/api/projects")
            console.log("Response status:", response.status)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({error: "Unknown error"}))
                throw new Error(errorData.error || `HTTP ${response.status}`)
            }

            const data = await response.json()
            console.log("Received data:", data)

            if (!Array.isArray(data)) {
                throw new Error("Invalid data format received")
            }

            setProjects(data)

            // Extract all unique tags
            const tags = new Set<string>()
            data.forEach((project: Project) => {
                if (Array.isArray(project.tags)) {
                    project.tags.forEach((tag) => tags.add(tag))
                }
            })
            setAllTags(Array.from(tags))

            console.log(`Successfully loaded ${data.length} projects`)
        } catch (error) {
            console.error("Error fetching projects:", error)
            setError(error instanceof Error ? error.message : "Failed to load projects")
        } finally {
            setLoading(false)
        }
    }

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
    }

    const clearFilters = () => {
        setSelectedTags([])
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading projects...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen pt-20">
                <div className="container mx-auto px-4 py-12">
                    <Alert variant="destructive" className="max-w-2xl mx-auto">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>
                            <div className="space-y-2">
                                <p>
                                    <strong>Error loading projects:</strong> {error}
                                </p>
                                <Button variant="outline" size="sm" onClick={fetchProjects}>
                                    Try Again
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20">
            <div className="container mx-auto px-4 py-12">
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">My Projects</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        A collection of projects I've worked on, showcasing various technologies and skills
                    </p>
                </motion.div>

                {/* Filter Section */}
                {allTags.length > 0 && (
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2}}
                        className="mb-8"
                    >
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4"/>
                                <span className="font-medium">Filter by technology:</span>
                            </div>
                            {selectedTags.length > 0 && (
                                <Button variant="outline" size="sm" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {allTags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                                    onClick={() => toggleTag(tag)}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Projects Grid */}
                {projects.length === 0 ? (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No projects found.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Projects will appear here once they are added to the database.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.4}}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence mode="wait">
                            {filteredProjects.map((project, index) => (
                                <Link href={`/projects/${project.id}`} key={project.id}>
                                    <motion.div
                                        initial={{opacity: 0, y: 50}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: -50}}
                                        transition={{delay: index * 0.1}}
                                        whileHover={{y: -5}}
                                        className="h-full cursor-pointer"
                                    >
                                        <Card
                                            className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-shadow">
                                            {project.image_url && (
                                                <div className="relative h-48 overflow-hidden">
                                                    <Image
                                                        src={project.image_url || "/placeholder.svg"}
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover transition-transform group-hover:scale-105"
                                                    />
                                                </div>
                                            )}

                                            <CardHeader>
                                                <CardTitle className="flex items-center justify-between">
                                                    {project.title}
                                                    {project.featured && <Badge variant="secondary">Featured</Badge>}
                                                </CardTitle>
                                                <CardDescription>{project.short_description}</CardDescription>
                                            </CardHeader>

                                            <CardContent className="flex-1">
                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {project.tags.map((tag) => (
                                                        <Badge key={tag} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                {project.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                                                )}
                                            </CardContent>

                                            <CardFooter className="flex gap-2">
                                                {project.github_url && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="flex-1 bg-transparent"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Link href={project.github_url} target="_blank">
                                                            <Github className="w-4 h-4 mr-2"/>
                                                            Code
                                                        </Link>
                                                    </Button>
                                                )}
                                                {project.demo_url && (
                                                    <Button size="sm" asChild className="flex-1"
                                                            onClick={(e) => e.stopPropagation()}>
                                                        <Link href={project.demo_url} target="_blank">
                                                            <ExternalLink className="w-4 h-4 mr-2"/>
                                                            Demo
                                                        </Link>
                                                    </Button>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                </Link>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {filteredProjects.length === 0 && projects.length > 0 && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No projects found with the selected filters.</p>
                        <Button variant="outline" className="mt-4 bg-transparent" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
