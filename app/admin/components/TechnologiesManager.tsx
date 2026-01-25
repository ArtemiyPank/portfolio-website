"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type TechSkill = {
    id: string
    category_id: string
    skill_name: string
    display_order: number
    created_at: string
}

type TechCategory = {
    id: string
    name: string
    icon_name: string
    display_order: number
    created_at: string
    updated_at: string
    skills: TechSkill[]
}

export function TechnologiesManager() {
    const [categories, setCategories] = useState<TechCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [editingCategory, setEditingCategory] = useState<TechCategory | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/content/tech-categories")
            const data = await response.json()
            setCategories(data || [])
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch tech categories",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSaveCategory = async (data: { name: string; icon_name: string }) => {
        try {
            if (editingCategory) {
                // Update existing category
                const response = await fetch(`/api/content/tech-categories/${editingCategory.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })

                if (!response.ok) throw new Error("Failed to update category")

                toast({
                    title: "Success",
                    description: "Category updated successfully",
                })
            } else {
                // Create new category
                const response = await fetch("/api/content/tech-categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })

                if (!response.ok) throw new Error("Failed to create category")

                toast({
                    title: "Success",
                    description: "Category created successfully",
                })
            }

            fetchCategories()
            setIsDialogOpen(false)
            setEditingCategory(null)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save category",
                variant: "destructive",
            })
        }
    }

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Are you sure? This will delete all skills in this category.")) return

        try {
            const response = await fetch(`/api/content/tech-categories/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete category")

            toast({
                title: "Success",
                description: "Category deleted successfully",
            })

            fetchCategories()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete category",
                variant: "destructive",
            })
        }
    }

    const handleAddSkill = async (categoryId: string, skillName: string) => {
        try {
            const response = await fetch("/api/content/tech-skills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category_id: categoryId, skill_name: skillName }),
            })

            if (!response.ok) throw new Error("Failed to add skill")

            toast({
                title: "Success",
                description: "Skill added successfully",
            })

            fetchCategories()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add skill",
                variant: "destructive",
            })
        }
    }

    const handleDeleteSkill = async (skillId: string) => {
        try {
            const response = await fetch(`/api/content/tech-skills/${skillId}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete skill")

            toast({
                title: "Success",
                description: "Skill deleted successfully",
            })

            fetchCategories()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete skill",
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
                    <h2 className="text-2xl font-semibold">Technologies & Skills</h2>
                    <p className="text-muted-foreground">Manage your technology categories and skills</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingCategory(null)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                        </DialogHeader>
                        <CategoryForm
                            category={editingCategory}
                            onSave={handleSaveCategory}
                            onCancel={() => {
                                setIsDialogOpen(false)
                                setEditingCategory(null)
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category) => (
                    <Card key={category.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        {category.name}
                                    </CardTitle>
                                    <CardDescription>Icon: {category.icon_name}</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setEditingCategory(category)
                                            setIsDialogOpen(true)
                                        }}
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteCategory(category.id)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <SkillsList
                                categoryId={category.id}
                                skills={category.skills}
                                onAddSkill={handleAddSkill}
                                onDeleteSkill={handleDeleteSkill}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function CategoryForm({
    category,
    onSave,
    onCancel,
}: {
    category: TechCategory | null
    onSave: (data: { name: string; icon_name: string }) => void
    onCancel: () => void
}) {
    const [formData, setFormData] = useState({
        name: category?.name || "",
        icon_name: category?.icon_name || "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="icon_name">Icon Name (from lucide-react)</Label>
                <Input
                    id="icon_name"
                    value={formData.icon_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, icon_name: e.target.value }))}
                    placeholder="Code, Shield, Globe, etc."
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

function SkillsList({
    categoryId,
    skills,
    onAddSkill,
    onDeleteSkill,
}: {
    categoryId: string
    skills: TechSkill[]
    onAddSkill: (categoryId: string, skillName: string) => void
    onDeleteSkill: (skillId: string) => void
}) {
    const [newSkill, setNewSkill] = useState("")

    const handleAdd = () => {
        if (newSkill.trim()) {
            onAddSkill(categoryId, newSkill.trim())
            setNewSkill("")
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add new skill..."
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
                <Button type="button" size="sm" onClick={handleAdd}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-2">
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                        <span className="text-sm">{skill.skill_name}</span>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteSkill(skill.id)}
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
