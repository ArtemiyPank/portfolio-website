"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type EducationHighlight = {
    id: string
    education_id: string
    highlight_text: string
    display_order: number
    created_at: string
}

type EducationEntry = {
    id: string
    institution: string
    credentials: string
    period: string
    location: string
    display_order: number
    highlights: EducationHighlight[]
    created_at: string
    updated_at: string
}

export function EducationManager() {
    const [entries, setEntries] = useState<EducationEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [editingEntry, setEditingEntry] = useState<EducationEntry | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        fetchEntries()
    }, [])

    const fetchEntries = async () => {
        try {
            const response = await fetch("/api/content/education-entries")
            const data = await response.json()
            setEntries(data || [])
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch education entries",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSaveEntry = async (data: {
        institution: string
        credentials: string
        period: string
        location: string
    }) => {
        try {
            if (editingEntry) {
                const response = await fetch(`/api/content/education-entries/${editingEntry.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })

                if (!response.ok) throw new Error("Failed to update entry")

                toast({
                    title: "Success",
                    description: "Education entry updated successfully",
                })
            } else {
                const response = await fetch("/api/content/education-entries", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })

                if (!response.ok) throw new Error("Failed to create entry")

                toast({
                    title: "Success",
                    description: "Education entry created successfully",
                })
            }

            fetchEntries()
            setIsDialogOpen(false)
            setEditingEntry(null)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save education entry",
                variant: "destructive",
            })
        }
    }

    const handleDeleteEntry = async (id: string) => {
        if (!confirm("Are you sure? This will delete all highlights for this education entry.")) return

        try {
            const response = await fetch(`/api/content/education-entries/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete entry")

            toast({
                title: "Success",
                description: "Education entry deleted successfully",
            })

            fetchEntries()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete education entry",
                variant: "destructive",
            })
        }
    }

    const handleAddHighlight = async (educationId: string, highlightText: string) => {
        try {
            const response = await fetch("/api/content/education-highlights", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ education_id: educationId, highlight_text: highlightText }),
            })

            if (!response.ok) throw new Error("Failed to add highlight")

            toast({
                title: "Success",
                description: "Highlight added successfully",
            })

            fetchEntries()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add highlight",
                variant: "destructive",
            })
        }
    }

    const handleDeleteHighlight = async (highlightId: string) => {
        try {
            const response = await fetch(`/api/content/education-highlights/${highlightId}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete highlight")

            toast({
                title: "Success",
                description: "Highlight deleted successfully",
            })

            fetchEntries()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete highlight",
                variant: "destructive",
            })
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold">Education</h2>
                    <p className="text-muted-foreground">Manage your education history and achievements</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingEntry(null)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Education Entry
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingEntry ? "Edit Education Entry" : "Add New Education Entry"}</DialogTitle>
                        </DialogHeader>
                        <EducationEntryForm
                            entry={editingEntry}
                            onSave={handleSaveEntry}
                            onCancel={() => {
                                setIsDialogOpen(false)
                                setEditingEntry(null)
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {entries.map((entry) => (
                    <Card key={entry.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{entry.institution}</CardTitle>
                                    <CardDescription>
                                        {entry.credentials} • {entry.period} • {entry.location}
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setEditingEntry(entry)
                                            setIsDialogOpen(true)
                                        }}
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteEntry(entry.id)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <HighlightsList
                                educationId={entry.id}
                                highlights={entry.highlights}
                                onAddHighlight={handleAddHighlight}
                                onDeleteHighlight={handleDeleteHighlight}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function EducationEntryForm({
    entry,
    onSave,
    onCancel,
}: {
    entry: EducationEntry | null
    onSave: (data: { institution: string; credentials: string; period: string; location: string }) => void
    onCancel: () => void
}) {
    const [formData, setFormData] = useState({
        institution: entry?.institution || "",
        credentials: entry?.credentials || "",
        period: entry?.period || "",
        location: entry?.location || "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => setFormData((prev) => ({ ...prev, institution: e.target.value }))}
                    placeholder="e.g., Harvard University"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="credentials">Credentials</Label>
                <Input
                    id="credentials"
                    value={formData.credentials}
                    onChange={(e) => setFormData((prev) => ({ ...prev, credentials: e.target.value }))}
                    placeholder="e.g., Bachelor of Science in Computer Science"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Input
                    id="period"
                    value={formData.period}
                    onChange={(e) => setFormData((prev) => ({ ...prev, period: e.target.value }))}
                    placeholder="e.g., 2018 - 2022"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Cambridge, MA, USA"
                    required
                />
            </div>

            <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                    Save
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}

function HighlightsList({
    educationId,
    highlights,
    onAddHighlight,
    onDeleteHighlight,
}: {
    educationId: string
    highlights: EducationHighlight[]
    onAddHighlight: (educationId: string, highlightText: string) => void
    onDeleteHighlight: (highlightId: string) => void
}) {
    const [newHighlight, setNewHighlight] = useState("")

    const handleAdd = () => {
        if (newHighlight.trim()) {
            onAddHighlight(educationId, newHighlight.trim())
            setNewHighlight("")
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <Textarea
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="Add new highlight or achievement..."
                    rows={2}
                />
                <Button type="button" size="sm" onClick={handleAdd}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-2">
                {highlights.map((highlight) => (
                    <div
                        key={highlight.id}
                        className="flex items-start justify-between p-3 bg-muted rounded-md"
                    >
                        <span className="text-sm flex-1">{highlight.highlight_text}</span>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteHighlight(highlight.id)}
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
