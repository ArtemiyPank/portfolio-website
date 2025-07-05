"use client"

import {useState, useEffect} from "react"
import {motion} from "framer-motion"
import {ArrowDown, Github, Linkedin, Mail, ExternalLink, Instagram} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

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

export default function HomePage() {
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])

    useEffect(() => {
        fetchFeaturedProjects()
    }, [])

    const fetchFeaturedProjects = async () => {
        try {
            const response = await fetch("/api/projects")
            const projects = await response.json()
            setFeaturedProjects(projects.filter((p: Project) => p.featured).slice(0, 3))
        } catch (error) {
            console.error("Error fetching featured projects:", error)
        }
    }

    const scrollToProjects = () => {
        document.getElementById("projects-preview")?.scrollIntoView({
            behavior: "smooth",
        })
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"/>
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -100, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
                        animate={{
                            x: [0, -150, 0],
                            y: [0, 100, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 text-center">
                    <motion.div initial={{opacity: 0, y: 50}} animate={{opacity: 1, y: 0}} transition={{duration: 0.8}}>
                        <motion.h1
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.2, duration: 0.8}}
                        >
                            Artemiy Pankratov
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.4, duration: 0.8}}
                        >
                            Developer crafting digital experiences with modern technologies
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.6, duration: 0.8}}
                        >
                            <Button size="lg" onClick={scrollToProjects} className="group">
                                View My Work
                                <ArrowDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform"/>
                            </Button>

                            <div className="flex items-center space-x-4">
                                <Button variant="outline" size="icon" asChild>
                                    <Link href="https://github.com/ArtemiyPank" target="_blank">
                                        <Github className="w-4 h-4"/>
                                    </Link>
                                </Button>
                                <Button variant="outline" size="icon" asChild>
                                    <Link href="https://www.linkedin.com/in/artemiy-pankratov-251059326/"
                                          target="_blank">
                                        <Linkedin className="w-4 h-4"/>
                                    </Link>
                                </Button>
                                <Button variant="outline" size="icon" asChild>
                                    <Link href="https://www.instagram.com/pankratov_artemiy/" target="_blank">
                                        <Instagram className="w-4 h-4"/>
                                    </Link>
                                </Button>
                                <Button variant="outline" size="icon" asChild>
                                    <Link href="/contact">
                                        <Mail className="w-4 h-4"/>
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    animate={{y: [0, 10, 0]}}
                    transition={{duration: 2, repeat: Number.POSITIVE_INFINITY}}
                >
                    <ArrowDown className="w-6 h-6 text-muted-foreground"/>
                </motion.div>
            </section>

            {/* Projects Preview Section */}
            <section id="projects-preview" className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                        viewport={{once: true}}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Here are some of my recent projects that showcase my skills and passion for development
                        </p>
                    </motion.div>

                    {featuredProjects.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {featuredProjects.map((project, index) => (
                                <Link href={`/projects/${project.id}`} key={project.id}>
                                    <motion.div
                                        initial={{opacity: 0, y: 50}}
                                        whileInView={{opacity: 1, y: 0}}
                                        transition={{delay: index * 0.1, duration: 0.8}}
                                        viewport={{once: true}}
                                        whileHover={{y: -5}}
                                        className="cursor-pointer"
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
                                                    <Badge variant="secondary">Featured</Badge>
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
                                            </CardContent>

                                            <div className="p-6 pt-0 flex gap-2">
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
                                            </div>
                                        </Card>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="text-center">
                        <Button size="lg" asChild>
                            <Link href="/projects">View All Projects</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
