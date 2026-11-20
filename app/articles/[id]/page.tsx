"use client"

import { use, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MarkdownRenderer } from "@/components/markdown-renderer"
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

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [article, setArticle] = useState<Article | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch(`/api/articles/${id}`)
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
                    throw new Error(errorData.error || `HTTP ${response.status}`)
                }

                setArticle(await response.json())
            } catch (error) {
                console.error("Error fetching article:", error)
                setError(error instanceof Error ? error.message : "Failed to load article")
            } finally {
                setLoading(false)
            }
        }
        fetchArticle()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading article...</p>
                </div>
            </div>
        )
    }

    if (error || !article) {
        return (
            <div className="min-h-screen pt-20">
                <div className="container mx-auto px-4 py-12">
                    <Alert variant="destructive" className="max-w-2xl mx-auto">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <div className="space-y-2">
                                <p>
                                    <strong>Error loading article:</strong> {error || "Article not found"}
                                </p>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/articles">Back to Articles</Link>
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                >
                    <Button variant="ghost" size="sm" asChild className="mb-6">
                        <Link href="/articles">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Articles
                        </Link>
                    </Button>

                    {!article.published && (
                        <Badge variant="secondary" className="mb-4">
                            Draft — only you can see this
                        </Badge>
                    )}

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>

                    <div className="flex flex-wrap items-center gap-4 mb-8 text-muted-foreground">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" />
                            {formatDate(article.published_at ?? article.created_at)}
                        </div>
                        {article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {article.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {article.cover_image_url && (
                        <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                            <Image
                                src={article.cover_image_url}
                                alt={article.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <MarkdownRenderer content={article.content} />
                </motion.div>
            </div>
        </div>
    )
}
