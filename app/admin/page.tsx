"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUpload } from "@/components/image-upload"
import { useToast } from "@/hooks/use-toast"
import { PersonalInfoForm } from "./components/PersonalInfoForm"
import { AboutContentForm } from "./components/AboutContentForm"
import { ContactContentForm } from "./components/ContactContentForm"
import { TechnologiesManager } from "./components/TechnologiesManager"
import { EducationManager } from "./components/EducationManager"
import { MusicManager } from "./components/MusicManager"
import Image from "next/image"

type Project = {
  id: string
  title: string
  description: string | null
  short_description: string | null
  image_url: string | null
  github_url: string | null
  demo_url: string | null
  tags: string[]
  featured: boolean
  created_at: string
  updated_at: string
}

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects()
    }
  }, [isAuthenticated])

  // Restore session from the HttpOnly cookie on page load
  useEffect(() => {
    fetch("/api/auth/admin")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setIsAuthenticated(true)
      })
      .catch(() => {})
  }, [])

  // Authentication with environment variable
  const handleAuth = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const result = await response.json()

      if (response.ok) {
        setIsAuthenticated(true)
        toast({
          title: "Success",
          description: "Access granted",
        })
      } else {
        toast({
          title: "Access Denied",
          description: result.error || "Invalid password",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/admin", { method: "DELETE" })
    } catch (error) {
      // Cookie may already be gone; drop local state either way
    }
    setIsAuthenticated(false)
    setPassword("")
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      const data = await response.json()
      setProjects(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      })
    }
  }

  const handleSaveProject = async (projectData: Partial<Project>) => {
    try {
      if (editingProject?.id) {
        // Update existing project
        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        })

        if (!response.ok) throw new Error("Failed to update project")

        toast({
          title: "Success",
          description: "Project updated successfully",
        })
      } else {
        // Create new project
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        })

        if (!response.ok) throw new Error("Failed to create project")

        toast({
          title: "Success",
          description: "Project created successfully",
        })
      }

      fetchProjects()
      setIsDialogOpen(false)
      setEditingProject(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete project")

      toast({
        title: "Success",
        description: "Project deleted successfully",
      })

      fetchProjects()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Enter password to access admin panel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                    disabled={isLoading}
                />
              </div>
              <Button onClick={handleAuth} className="w-full" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Login"}
              </Button>
            </CardContent>
          </Card>
        </div>
    )
  }

  return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Manage your portfolio content</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-8">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="technologies">Technologies</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold">Projects</h2>
                  <p className="text-muted-foreground">Manage your portfolio projects</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingProject(null)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
                    </DialogHeader>
                    <ProjectForm
                        project={editingProject}
                        onSave={handleSaveProject}
                        onCancel={() => {
                          setIsDialogOpen(false)
                          setEditingProject(null)
                        }}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group"
                    >
                      <Card className="h-full">
                        {project.image_url && (
                            <div className="relative h-48 overflow-hidden rounded-t-lg">
                              <Image
                                  src={project.image_url || "/placeholder.svg"}
                                  alt={project.title}
                                  fill
                                  className="object-cover"
                              />
                            </div>
                        )}

                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingProject(project)
                                    setIsDialogOpen(true)
                                  }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteProject(project.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <CardDescription>{project.short_description}</CardDescription>
                        </CardHeader>

                        <CardContent>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {project.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                            ))}
                          </div>
                          {project.featured && <Badge variant="secondary">Featured</Badge>}
                        </CardContent>
                      </Card>
                    </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="personal">
              <PersonalInfoForm />
            </TabsContent>

            <TabsContent value="about">
              <AboutContentForm />
            </TabsContent>

            <TabsContent value="contact">
              <ContactContentForm />
            </TabsContent>

            <TabsContent value="technologies">
              <TechnologiesManager />
            </TabsContent>

            <TabsContent value="education">
              <EducationManager />
            </TabsContent>

            <TabsContent value="music">
              <MusicManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}

function ProjectForm({
                       project,
                       onSave,
                       onCancel,
                     }: {
  project: Project | null
  onSave: (data: Partial<Project>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    short_description: project?.short_description || "",
    image_url: project?.image_url || "",
    github_url: project?.github_url || "",
    demo_url: project?.demo_url || "",
    tags: project?.tags.join(", ") || "",
    featured: project?.featured || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const projectData = {
      ...formData,
      tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
    }

    onSave(projectData)
  }

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, image_url: url }))
  }

  const handleImageRemove = () => {
    setFormData((prev) => ({ ...prev, image_url: "" }))
  }

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <ImageUpload value={formData.image_url} onChange={handleImageChange} onRemove={handleImageRemove} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL (Optional)</Label>
            <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                placeholder="Or paste image URL here"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="short_description">Short Description</Label>
          <Input
              id="short_description"
              value={formData.short_description}
              onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Full Description (Optional)</Label>
          <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={6}
              placeholder="Supports Markdown formatting. Leave empty to show only README from GitHub."
          />
          <p className="text-xs text-muted-foreground">
            Markdown supported. Will be shown on project details page before README section.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, github_url: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo_url">Demo URL</Label>
            <Input
                id="demo_url"
                value={formData.demo_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, demo_url: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
              placeholder="React, Next.js, TypeScript"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
          />
          <Label htmlFor="featured">Featured Project</Label>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save Project
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
  )
}
