"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Github, ExternalLink, Calendar, Tag, FileText, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

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

type ReadmeData = {
    content: string
    name: string
    path: string
    sha: string
    size: number
    url: string
}

export default function ProjectPage({ params }: { params: { id: string } }) {
    const [project, setProject] = useState<Project | null>(null)
    const [readme, setReadme] = useState<ReadmeData | null>(null)
    const [loading, setLoading] = useState(true)
    const [readmeLoading, setReadmeLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [readmeError, setReadmeError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        fetchProject()
    }, [params.id])

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/projects/${params.id}`)

            if (!response.ok) {
                if (response.status === 404) {
                    setError("Project not found")
                } else {
                    setError("Failed to load project")
                }
                return
            }

            const data = await response.json()
            setProject(data)

            // Fetch README if GitHub URL is available
            if (data.github_url) {
                fetchReadme()
            }
        } catch (error) {
            console.error("Error fetching project:", error)
            setError("Failed to load project")
        } finally {
            setLoading(false)
        }
    }

    const fetchReadme = async () => {
        setReadmeLoading(true)
        setReadmeError(null)

        try {
            const response = await fetch(`/api/projects/${params.id}/readme`)

            if (!response.ok) {
                const errorData = await response.json()
                setReadmeError(errorData.error || "Failed to fetch README")
                return
            }

            const data = await response.json()
            setReadme(data)
        } catch (error) {
            console.error("Error fetching README:", error)
            setReadmeError("Failed to fetch README")
        } finally {
            setReadmeLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span>Loading project...</span>
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
                    <p className="text-muted-foreground mb-6">{error || "The project you're looking for doesn't exist."}</p>
                    <Button onClick={() => router.push("/projects")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Projects
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20">
            <div className="container mx-auto px-4 py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Back Button */}
                    <Button variant="ghost" className="mb-6" onClick={() => router.push("/projects")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Projects
                    </Button>

                    {/* Project Header */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Project Image */}
                            {project.image_url && (
                                <div className="lg:w-1/2">
                                    <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden">
                                        <Image
                                            src={project.image_url || "/placeholder.svg"}
                                            alt={project.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Project Info */}
                            <div className={`${project.image_url ? "lg:w-1/2" : "w-full"} space-y-4`}>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                                    {project.featured && <Badge variant="secondary">Featured</Badge>}
                                </div>

                                <p className="text-lg text-muted-foreground">{project.short_description}</p>

                                {project.description && <p className="text-muted-foreground">{project.description}</p>}

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <Badge key={tag} variant="outline" className="flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Project Links */}
                                <div className="flex gap-4 pt-4">
                                    {project.github_url && (
                                        <Button asChild>
                                            <Link href={project.github_url} target="_blank">
                                                <Github className="w-4 h-4 mr-2" />
                                                View Code
                                            </Link>
                                        </Button>
                                    )}
                                    {project.demo_url && (
                                        <Button variant="outline" asChild>
                                            <Link href={project.demo_url} target="_blank">
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Live Demo
                                            </Link>
                                        </Button>
                                    )}
                                </div>

                                {/* Project Metadata */}
                                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Created: {formatDate(project.created_at)}
                                    </div>
                                    {project.updated_at !== project.created_at && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Updated: {formatDate(project.updated_at)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-8" />

                    {/* README Section */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    README
                                    {readme && (
                                        <Badge variant="outline" className="ml-2">
                                            {readme.name}
                                        </Badge>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {project.github_url ? (
                                        <>
                                            Documentation from the project repository
                                            {readme && (
                                                <Link href={readme.url} target="_blank" className="ml-2 text-primary hover:underline">
                                                    View on GitHub
                                                </Link>
                                            )}
                                        </>
                                    ) : (
                                        "No GitHub repository available"
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {readmeLoading && (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                        <span>Loading README...</span>
                                    </div>
                                )}

                                {readmeError && (
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            {readmeError}
                                            {project.github_url && (
                                                <div className="mt-2">
                                                    <Button variant="outline" size="sm" onClick={fetchReadme}>
                                                        Try Again
                                                    </Button>
                                                </div>
                                            )}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {readme && !readmeLoading && <MarkdownRenderer content={readme.content} />}

                                {!project.github_url && !readmeLoading && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No GitHub repository linked to this project.</p>
                                        <p className="text-sm">README documentation is not available.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
