"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"

type PersonalInfo = {
    full_name: string
    tagline: string
    email: string
    telegram: string
    github_url: string | null
    linkedin_url: string | null
    instagram_url: string | null
    twitter_url: string | null
    location: string | null
}

export function PersonalInfoForm() {
    const [data, setData] = useState<PersonalInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await fetch("/api/content/personal")
            const result = await response.json()
            setData(result)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch personal info",
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
            const response = await fetch("/api/content/personal", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Personal info updated successfully",
                })
            } else {
                throw new Error("Failed to update")
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update personal info",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (field: keyof PersonalInfo, value: string) => {
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
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                    Update your personal details and social media links
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                value={data.full_name}
                                onChange={(e) => handleChange("full_name", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={data.location || ""}
                                onChange={(e) => handleChange("location", e.target.value)}
                                placeholder="e.g., Tel Aviv, Israel"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                            id="tagline"
                            value={data.tagline}
                            onChange={(e) => handleChange("tagline", e.target.value)}
                            placeholder="Your professional tagline"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telegram">Telegram</Label>
                            <Input
                                id="telegram"
                                value={data.telegram}
                                onChange={(e) => handleChange("telegram", e.target.value)}
                                placeholder="@username"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Social Media Links</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="github_url">GitHub URL</Label>
                                <Input
                                    id="github_url"
                                    type="url"
                                    value={data.github_url || ""}
                                    onChange={(e) => handleChange("github_url", e.target.value)}
                                    placeholder="https://github.com/username"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                                <Input
                                    id="linkedin_url"
                                    type="url"
                                    value={data.linkedin_url || ""}
                                    onChange={(e) => handleChange("linkedin_url", e.target.value)}
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="instagram_url">Instagram URL</Label>
                                <Input
                                    id="instagram_url"
                                    type="url"
                                    value={data.instagram_url || ""}
                                    onChange={(e) => handleChange("instagram_url", e.target.value)}
                                    placeholder="https://instagram.com/username"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="twitter_url">Twitter/X URL</Label>
                                <Input
                                    id="twitter_url"
                                    type="url"
                                    value={data.twitter_url || ""}
                                    onChange={(e) => handleChange("twitter_url", e.target.value)}
                                    placeholder="https://x.com/username"
                                />
                            </div>
                        </div>
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
