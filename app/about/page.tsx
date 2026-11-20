"use client"

import { useState, useEffect } from "react"
import {motion} from "framer-motion"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import * as LucideIcons from "lucide-react"

type TechSkill = {
    id: string
    category_id: string
    skill_name: string
    display_order: number
}

type TechCategory = {
    id: string
    name: string
    icon_name: string
    display_order: number
    skills: TechSkill[]
}

// Растягивает последнюю карточку на всю строку, если она осталась в ряду одна
function orphanSpan(index: number, total: number) {
    if (index !== total - 1) return ""
    const md = total % 2 === 1 ? "md:col-span-2" : ""
    const lg = total % 3 === 1 ? "lg:col-span-3" : "lg:col-span-1"
    return `${md} ${lg}`.trim()
}

export default function AboutPage() {
    const [technologies, setTechnologies] = useState<TechCategory[]>([])
    const [aboutContent, setAboutContent] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        try {
            const [techResponse, aboutResponse] = await Promise.all([
                fetch("/api/content/tech-categories"),
                fetch("/api/content/about")
            ])

            const techData = await techResponse.json()
            const aboutData = await aboutResponse.json()

            setTechnologies(techData || [])
            setAboutContent(aboutData)
        } catch (error) {
            console.error("Error fetching content:", error)
        } finally {
            setLoading(false)
        }
    }

    const getIcon = (iconName: string) => {
        const Icon = (LucideIcons as any)[iconName] || LucideIcons.Code
        return Icon
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <LucideIcons.Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }
    return (
        <div className="min-h-screen pt-20">
            <div className="container mx-auto px-4 py-12">
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
                        <p className="text-muted-foreground text-lg">
                            Get to know me better - my journey, skills, and passion for development
                        </p>
                    </div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2}}
                        className="mb-12"
                    >
                        <Card>
                            <CardContent className="p-8">
                                {aboutContent?.page_title && (
                                    <h2 className="text-3xl font-bold mb-6">{aboutContent.page_title}</h2>
                                )}
                                {aboutContent?.page_subtitle && (
                                    <p className="text-xl text-muted-foreground mb-8">{aboutContent.page_subtitle}</p>
                                )}
                                {aboutContent?.biography && (
                                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                                        <p className="text-lg leading-relaxed whitespace-pre-line">{aboutContent.biography}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {technologies.length > 0 && (
                        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.4}}>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-2">Technologies & Skills</h2>
                                <p className="text-muted-foreground">The tools I reach for, from bare metal to the browser</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 xl:-mx-16">
                                {technologies.map((tech, index) => {
                                    const Icon = getIcon(tech.icon_name)
                                    return (
                                        <motion.div
                                            key={tech.id}
                                            initial={{opacity: 0, y: 20}}
                                            animate={{opacity: 1, y: 0}}
                                            transition={{delay: 0.08 * index}}
                                            className={orphanSpan(index, technologies.length)}
                                        >
                                            <Card className="h-full transition-colors hover:border-primary/40">
                                                <CardHeader className="pb-4">
                                                    <CardTitle className="flex items-center gap-3 text-lg">
                                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                            <Icon className="w-5 h-5 text-primary"/>
                                                        </span>
                                                        {tech.name}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex flex-wrap gap-2">
                                                        {tech.skills.map((skill) => {
                                                            const [name, level] = skill.skill_name.split(/\s+[-–—]\s+/, 2)
                                                            return (
                                                                <span
                                                                    key={skill.id}
                                                                    className="inline-flex items-center gap-1.5 rounded-md border bg-secondary/50 px-2.5 py-1 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/10"
                                                                >
                                                                    {name}
                                                                    {level && (
                                                                        <span className="text-xs font-normal text-muted-foreground">
                                                                            {level}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            )
                                                        })}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
