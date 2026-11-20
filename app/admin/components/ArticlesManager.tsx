"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/image-upload"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Edit2, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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

type ArticleForm = {
    title: string
    excerpt: string
    content: string
    cover_image_url: string
    tags: string
    published: boolean
}

const emptyForm: ArticleForm = {
    title: "",
    excerpt: "",
    content: "",
    cover_image_url: "",
    tags: "",
    published: false,
}

export function ArticlesManager() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [editingArticle, setEditingArticle] = useState<Article | null>(null)
    const [form, setForm] = useState<ArticleForm>(emptyForm)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async () => {
        try {
            const response = await fetch("/api/articles")
            const data = await response.json()
            setArticles(Array.isArray(data) ? data : [])
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch articles",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const openCreateDialog = () => {
        setEditingArticle(null)
        setForm(emptyForm)
        setIsDialogOpen(true)
    }

    const openEditDialog = (article: Article) => {
        setEditingArticle(article)
        setForm({
            title: article.title,
            excerpt: article.excerpt ?? "",
            content: article.content,
            cover_image_url: article.cover_image_url ?? "",
            tags: article.tags.join(", "),
            published: article.published,
        })
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        if (!form.title.trim() || !form.content.trim()) {
            toast({
                title: "Error",
                description: "Title and content are required",
                variant: "destructive",
            })
            return
        }

        setIsSaving(true)
        try {
            const payload = {
                title: form.title.trim(),
                excerpt: form.excerpt.trim() || null,
                content: form.content,
                cover_image_url: form.cover_image_url || null,
                tags: form.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                published: form.published,
            }

            const response = await fetch(
                editingArticle ? `/api/articles/${editingArticle.id}` : "/api/articles",
                {
                    method: editingArticle ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                },
            )

            if (!response.ok) {
                const result = await response.json().catch(() => ({}))
                throw new Error(result.error || "Request failed")
            }

            toast({
                title: "Success",
                description: editingArticle ? "Article updated" : "Article created",
            })
            setIsDialogOpen(false)
            fetchArticles()
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save article",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (article: Article) => {
        if (!confirm(`Delete article "${article.title}"? This cannot be undone.`)) return

        try {
            const response = await fetch(`/api/articles/${article.id}`, { method: "DELETE" })
            if (!response.ok) throw new Error("Request failed")

            toast({ title: "Success", description: "Article deleted" })
            fetchArticles()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete article",
                variant: "destructive",
            })
        }
    }

    if (loading) {
        return <p className="text-muted-foreground">Loading articles...</p>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold">Articles</h2>
                    <p className="text-muted-foreground">Write and publish your articles</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Article
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingArticle ? "Edit Article" : "New Article"}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="article-title">Title</Label>
                                <Input
                                    id="article-title"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Article title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="article-excerpt">Excerpt</Label>
                                <Textarea
                                    id="article-excerpt"
                                    value={form.excerpt}
                                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                    placeholder="Short summary shown in the article list"
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Cover Image</Label>
                                <ImageUpload
                                    value={form.cover_image_url || undefined}
                                    onChange={(url) => setForm({ ...form, cover_image_url: url })}
                                    onRemove={() => setForm({ ...form, cover_image_url: "" })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="article-content">Content (Markdown)</Label>
                                <Textarea
                                    id="article-content"
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    placeholder="Write your article in Markdown..."
                                    rows={16}
                                    className="font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="article-tags">Tags (comma-separated)</Label>
                                <Input
                                    id="article-tags"
                                    value={form.tags}
                                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                                    placeholder="typescript, docker, music"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <Switch
                                    id="article-published"
                                    checked={form.published}
                                    onCheckedChange={(checked) => setForm({ ...form, published: checked })}
                                />
                                <Label htmlFor="article-published">
                                    {form.published ? "Published" : "Draft"}
                                </Label>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {articles.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                    No articles yet. Create your first one!
                </p>
            ) : (
                <div className="space-y-3">
                    {articles.map((article) => (
                        <Card key={article.id}>
                            <CardContent className="flex items-center justify-between py-4">
                                <div className="min-w-0 mr-4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold truncate">{article.title}</h3>
                                        <Badge variant={article.published ? "default" : "secondary"}>
                                            {article.published ? "Published" : "Draft"}
                                        </Badge>
                                    </div>
                                    {article.excerpt && (
                                        <p className="text-sm text-muted-foreground truncate">{article.excerpt}</p>
                                    )}
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/articles/${article.id}`} target="_blank">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => openEditDialog(article)}>
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(article)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
