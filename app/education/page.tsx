"use client"

import { useState, useEffect } from "react"
import {motion} from "framer-motion"
import {Award, Calendar, GraduationCap, MapPin, Loader2} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"

type EducationContent = {
    id: string
    page_title: string
    intro_text: string
    section_title: string
}

type EducationHighlight = {
    id: string
    education_id: string
    highlight_text: string
    display_order: number
}

type EducationEntry = {
    id: string
    institution: string
    credentials: string
    period: string
    location: string
    display_order: number
    highlights: EducationHighlight[]
}

export default function EducationPage() {
    const [content, setContent] = useState<EducationContent | null>(null)
    const [entries, setEntries] = useState<EducationEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        try {
            const [contentResponse, entriesResponse] = await Promise.all([
                fetch("/api/content/education"),
                fetch("/api/content/education-entries")
            ])

            const contentData = await contentResponse.json()
            const entriesData = await entriesResponse.json()

            setContent(contentData)
            setEntries(entriesData || [])
        } catch (error) {
            console.error("Error fetching education content:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20 bg-background">
            <div className="container mx-auto px-6 py-16">
                {/* Header */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    className="max-w-3xl mx-auto text-center mb-12"
                >
                    <GraduationCap className="mx-auto mb-4 w-8 h-8 text-primary"/>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {content?.page_title || "Education & Passion"}
                    </h1>
                    <p className="prose prose-lg mx-auto whitespace-pre-line">
                        {content?.intro_text}
                    </p>
                </motion.div>

                {/* Academic Background */}
                <motion.section
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.2}}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-primary"/>
                        {content?.section_title || "Academic Profile"}
                    </h2>

                    {entries.map((edu, i) => (
                        <Card key={edu.id} className="mb-8">
                            <CardHeader>
                                <CardTitle
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <div>
                                        <h3 className="text-2xl font-semibold">{edu.institution}</h3>
                                        <p className="text-lg text-muted-foreground">{edu.credentials}</p>
                                    </div>
                                    <Badge variant="secondary" className="text-sm">
                                        {edu.period}
                                    </Badge>
                                </CardTitle>
                                <CardDescription className="flex flex-wrap gap-6 mt-2 text-base">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-5 h-5"/>
                                        {edu.location}
                                    </span>
                                </CardDescription>
                            </CardHeader>
                            {edu.highlights && edu.highlights.length > 0 && (
                                <CardContent className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <Award className="w-5 h-5 text-primary"/>
                                            Achievements &amp; Highlights
                                        </h4>
                                        <ul className="list-disc list-inside space-y-2 text-sm">
                                            {edu.highlights
                                                .sort((a, b) => a.display_order - b.display_order)
                                                .map((hl) => (
                                                    <li key={hl.id}>{hl.highlight_text}</li>
                                                ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </motion.section>
            </div>
        </div>
    )
}
