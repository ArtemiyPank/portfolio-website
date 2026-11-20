"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"

type AboutContent = {
    page_title: string
    page_subtitle: string | null
    biography: string
}

export function AboutContentForm() {
    const [data, setData] = useState<AboutContent | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await fetch("/api/content/about")
            const result = await response.json()
            setData(result)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch about content",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!data) return

        setSaving(true)
        try {
            const response = await fetch("/api/content/about", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "About content updated successfully",
                })
            } else {
                throw new Error("Failed to update")
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update about content",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (field: keyof AboutContent, value: string) => {
        if (!data) return
        setData({ ...data, [field]: value })
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!data) {
        return <div>No data found</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>About Page Content</CardTitle>
                <CardDescription>
                    Update the content for your About page
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="page_title">Page Title</Label>
                        <Input
                            id="page_title"
                            value={data.page_title}
                            onChange={(e) => handleChange("page_title", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="page_subtitle">Page Subtitle</Label>
                        <Input
                            id="page_subtitle"
                            value={data.page_subtitle || ""}
                            onChange={(e) => handleChange("page_subtitle", e.target.value)}
                            placeholder="Optional subtitle"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="biography">Biography</Label>
                        <Textarea
                            id="biography"
                            value={data.biography}
                            onChange={(e) => handleChange("biography", e.target.value)}
                            rows={15}
                            className="font-mono text-sm"
                            placeholder="Your professional biography..."
                            required
                        />
                        <p className="text-sm text-muted-foreground">
                            {data.biography.length} characters
                        </p>
                    </div>

                    <Button type="submit" disabled={saving} className="w-full md:w-auto">
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
