"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"

type Article = {
    id: string
    title: string
    excerpt: string | null
    content: string
    cover_image_url: string | null
    tags: string[]
    published: boolean
    published_at: string | null
    created_at: string
    updated_at: string
}

function formatDate(date: string | null): string {
    if (!date) return ""
    return new Date(date.replace(" ", "T") + "Z").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch("/api/articles")
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
                throw new Error(errorData.error || `HTTP ${response.status}`)
            }

            const data = await response.json()
            if (!Array.isArray(data)) {
                throw new Error("Invalid data format received")
            }

            setArticles(data.filter((article: Article) => article.published))
        } catch (error) {
            console.error("Error fetching articles:", error)
            setError(error instanceof Error ? error.message : "Failed to load articles")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading articles...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen pt-20">
                <div className="container mx-auto px-4 py-12">
                    <Alert variant="destructive" className="max-w-2xl mx-auto">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <div className="space-y-2">
                                <p>
                                    <strong>Error loading articles:</strong> {error}
                                </p>
                                <Button variant="outline" size="sm" onClick={fetchArticles}>
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Articles</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        My thoughts and notes on technology, projects, and things I find interesting
                    </p>
                </motion.div>

                {articles.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No articles yet.</p>
                        <p className="text-sm text-muted-foreground mt-2">Check back soon!</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-3xl mx-auto space-y-6"
                    >
                        {articles.map((article, index) => (
                            <Link href={`/articles/${article.id}`} key={article.id} className="block">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -3 }}
                                    className="cursor-pointer"
                                >
                                    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
                                        {article.cover_image_url && (
                                            <div className="relative h-56 overflow-hidden">
                                                <Image
                                                    src={article.cover_image_url}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />
                                            </div>
                                        )}

                                        <CardHeader>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(article.published_at ?? article.created_at)}
                                            </div>
                                            <CardTitle className="text-2xl">{article.title}</CardTitle>
                                            {article.excerpt && <CardDescription className="text-base">{article.excerpt}</CardDescription>}
                                        </CardHeader>

                                        {article.tags.length > 0 && (
                                            <CardContent>
                                                <div className="flex flex-wrap gap-1">
                                                    {article.tags.map((tag) => (
                                                        <Badge key={tag} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    )
}
