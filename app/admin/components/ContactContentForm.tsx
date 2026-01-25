"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"

type ContactContent = {
    page_title: string
    page_subtitle: string | null
    form_title: string
    form_description: string | null
    direct_contact_title: string
    follow_me_title: string
    follow_me_description: string | null
    footer_text: string | null
}

export function ContactContentForm() {
    const [data, setData] = useState<ContactContent | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await fetch("/api/content/contact")
            const result = await response.json()
            setData(result)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch contact content",
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
            const response = await fetch("/api/content/contact", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Contact content updated successfully",
                })
            } else {
                throw new Error("Failed to update")
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update contact content",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (field: keyof ContactContent, value: string) => {
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
                <CardTitle>Contact Page Content</CardTitle>
                <CardDescription>
                    Update text content for your Contact page
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <Label htmlFor="form_title">Form Title</Label>
                            <Input
                                id="form_title"
                                value={data.form_title}
                                onChange={(e) => handleChange("form_title", e.target.value)}
                                required
                            />
                        </div>
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
                        <Label htmlFor="form_description">Form Description</Label>
                        <Textarea
                            id="form_description"
                            value={data.form_description || ""}
                            onChange={(e) => handleChange("form_description", e.target.value)}
                            rows={3}
                            placeholder="Description shown above contact form"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="direct_contact_title">Direct Contact Section Title</Label>
                            <Input
                                id="direct_contact_title"
                                value={data.direct_contact_title}
                                onChange={(e) => handleChange("direct_contact_title", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="follow_me_title">Follow Me Section Title</Label>
                            <Input
                                id="follow_me_title"
                                value={data.follow_me_title}
                                onChange={(e) => handleChange("follow_me_title", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="follow_me_description">Follow Me Description</Label>
                        <Input
                            id="follow_me_description"
                            value={data.follow_me_description || ""}
                            onChange={(e) => handleChange("follow_me_description", e.target.value)}
                            placeholder="Description for social media section"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="footer_text">Footer Text</Label>
                        <Textarea
                            id="footer_text"
                            value={data.footer_text || ""}
                            onChange={(e) => handleChange("footer_text", e.target.value)}
                            rows={3}
                            placeholder="Call-to-action or additional message"
                        />
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
