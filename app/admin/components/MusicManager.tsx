"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Edit2, Music2, ListMusic } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type MusicalAchievement = {
    id: string
    journey_id: string
    achievement_text: string
    display_order: number
    created_at: string
}

type MusicalJourney = {
    id: string
    instrument: string
    icon_name: string
    years: string
    level: string
    description: string
    display_order: number
    achievements: MusicalAchievement[]
    created_at: string
    updated_at: string
}

type FavoriteArtist = {
    id: string
    genre_id: string
    artist_name: string
    display_order: number
    created_at: string
}

type MusicGenre = {
    id: string
    genre_name: string
    icon_name: string
    display_order: number
    artists: FavoriteArtist[]
    created_at: string
    updated_at: string
}

export function MusicManager() {
    const { toast } = useToast()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold">Music</h2>
                <p className="text-muted-foreground">Manage your musical journey and favorite genres</p>
            </div>

            <Tabs defaultValue="journey" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="journey">
                        <Music2 className="w-4 h-4 mr-2" />
                        Musical Journey
                    </TabsTrigger>
                    <TabsTrigger value="genres">
                        <ListMusic className="w-4 h-4 mr-2" />
                        Music Genres
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="journey" className="mt-6">
                    <MusicalJourneySection />
                </TabsContent>

                <TabsContent value="genres" className="mt-6">
                    <MusicGenresSection />
                </TabsContent>
            </Tabs>
        </div>
    )
}

function MusicalJourneySection() {
    const [journeys, setJourneys] = useState<MusicalJourney[]>([])
    const [loading, setLoading] = useState(true)
    const [editingJourney, setEditingJourney] = useState<MusicalJourney | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        fetchJourneys()
    }, [])

    const fetchJourneys = async () => {
        try {
            const response = await fetch("/api/content/musical-journey")
            const data = await response.json()
            setJourneys(data || [])
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch musical journey",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSaveJourney = async (data: {
        instrument: string
        icon_name: string
        years: string
        level: string
        description: string
    }) => {
        try {
            if (editingJourney) {
                const response = await fetch(`/api/content/musical-journey/${editingJourney.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })

                if (!response.ok) throw new Error("Failed to update journey")

                toast({
                    title: "Success",
                    description: "Musical journey updated successfully",
                })
            } else {
                const response = await fetch("/api/content/musical-journey", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })

                if (!response.ok) throw new Error("Failed to create journey")

                toast({
                    title: "Success",
                    description: "Musical journey created successfully",
                })
            }

            fetchJourneys()
            setIsDialogOpen(false)
            setEditingJourney(null)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save musical journey",
                variant: "destructive",
            })
        }
    }

    const handleDeleteJourney = async (id: string) => {
        if (!confirm("Are you sure? This will delete all achievements for this journey.")) return

        try {
            const response = await fetch(`/api/content/musical-journey/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete journey")

            toast({
                title: "Success",
                description: "Musical journey deleted successfully",
            })

            fetchJourneys()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete musical journey",
                variant: "destructive",
            })
        }
    }

    const handleAddAchievement = async (journeyId: string, achievementText: string) => {
        try {
            const response = await fetch("/api/content/musical-achievements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ journey_id: journeyId, achievement_text: achievementText }),
            })

            if (!response.ok) throw new Error("Failed to add achievement")

            toast({
                title: "Success",
                description: "Achievement added successfully",
            })

            fetchJourneys()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add achievement",
                variant: "destructive",
            })
        }
    }

    const handleDeleteAchievement = async (achievementId: string) => {
        try {
            const response = await fetch(`/api/content/musical-achievements/${achievementId}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete achievement")

            toast({
                title: "Success",
                description: "Achievement deleted successfully",
            })

            fetchJourneys()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete achievement",
                variant: "destructive",
            })
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingJourney(null)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Journey
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingJourney ? "Edit Journey" : "Add New Journey"}</DialogTitle>
                        </DialogHeader>
                        <JourneyForm
                            journey={editingJourney}
                            onSave={handleSaveJourney}
                            onCancel={() => {
                                setIsDialogOpen(false)
                                setEditingJourney(null)
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {journeys.map((journey) => (
                    <Card key={journey.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{journey.instrument}</CardTitle>
                                    <CardDescription>
                                        {journey.years} • {journey.level} • Icon: {journey.icon_name}
                                    </CardDescription>
                                    {journey.description && (
                                        <p className="text-sm text-muted-foreground mt-2">{journey.description}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setEditingJourney(journey)
                                            setIsDialogOpen(true)
                                        }}
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteJourney(journey.id)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <AchievementsList
                                journeyId={journey.id}
                                achievements={journey.achievements}
                                onAddAchievement={handleAddAchievement}
                                onDeleteAchievement={handleDeleteAchievement}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function MusicGenresSection() {
    const [genres, setGenres] = useState<MusicGenre[]>([])
    const [loading, setLoading] = useState(true)
    const [editingGenre, setEditingGenre] = useState<MusicGenre | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        fetchGenres()
    }, [])

    const fetchGenres = async () => {
        try {
            const response = await fetch("/api/content/music-genres")
            const data = await response.json()
            setGenres(data || [])
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch music genres",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSaveGenre = async (data: { genre_name: string; icon_name: string }) => {
        try {
            if (editingGenre) {
                const response = await fetch(`/api/content/music-genres/${editingGenre.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })

                if (!response.ok) throw new Error("Failed to update genre")

                toast({
                    title: "Success",
                    description: "Genre updated successfully",
                })
            } else {
                const response = await fetch("/api/content/music-genres", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })

                if (!response.ok) throw new Error("Failed to create genre")

                toast({
                    title: "Success",
                    description: "Genre created successfully",
                })
            }

            fetchGenres()
            setIsDialogOpen(false)
            setEditingGenre(null)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save genre",
                variant: "destructive",
            })
        }
    }

    const handleDeleteGenre = async (id: string) => {
        if (!confirm("Are you sure? This will delete all artists in this genre.")) return

        try {
            const response = await fetch(`/api/content/music-genres/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete genre")

            toast({
                title: "Success",
                description: "Genre deleted successfully",
            })

            fetchGenres()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete genre",
                variant: "destructive",
            })
        }
    }

    const handleAddArtist = async (genreId: string, artistName: string) => {
        try {
            const response = await fetch("/api/content/favorite-artists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ genre_id: genreId, artist_name: artistName }),
            })

            if (!response.ok) throw new Error("Failed to add artist")

            toast({
                title: "Success",
                description: "Artist added successfully",
            })

            fetchGenres()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add artist",
                variant: "destructive",
            })
        }
    }

    const handleDeleteArtist = async (artistId: string) => {
        try {
            const response = await fetch(`/api/content/favorite-artists/${artistId}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete artist")

            toast({
                title: "Success",
                description: "Artist deleted successfully",
            })

            fetchGenres()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete artist",
                variant: "destructive",
            })
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingGenre(null)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Genre
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingGenre ? "Edit Genre" : "Add New Genre"}</DialogTitle>
                        </DialogHeader>
                        <GenreForm
                            genre={editingGenre}
                            onSave={handleSaveGenre}
                            onCancel={() => {
                                setIsDialogOpen(false)
                                setEditingGenre(null)
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {genres.map((genre) => (
                    <Card key={genre.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{genre.genre_name}</CardTitle>
                                    <CardDescription>Icon: {genre.icon_name}</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setEditingGenre(genre)
                                            setIsDialogOpen(true)
                                        }}
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteGenre(genre.id)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ArtistsList
                                genreId={genre.id}
                                artists={genre.artists}
                                onAddArtist={handleAddArtist}
                                onDeleteArtist={handleDeleteArtist}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function JourneyForm({
    journey,
    onSave,
    onCancel,
}: {
    journey: MusicalJourney | null
    onSave: (data: { instrument: string; icon_name: string; years: string; level: string; description: string }) => void
    onCancel: () => void
}) {
    const [formData, setFormData] = useState({
        instrument: journey?.instrument || "",
        icon_name: journey?.icon_name || "",
        years: journey?.years || "",
        level: journey?.level || "",
        description: journey?.description || "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="instrument">Instrument</Label>
                <Input
                    id="instrument"
                    value={formData.instrument}
                    onChange={(e) => setFormData((prev) => ({ ...prev, instrument: e.target.value }))}
                    placeholder="e.g., Piano"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="icon_name">Icon Name (from lucide-react)</Label>
                <Input
                    id="icon_name"
                    value={formData.icon_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, icon_name: e.target.value }))}
                    placeholder="Music, Piano, Guitar, etc."
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="years">Years</Label>
                <Input
                    id="years"
                    value={formData.years}
                    onChange={(e) => setFormData((prev) => ({ ...prev, years: e.target.value }))}
                    placeholder="e.g., 2010 - Present"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Input
                    id="level"
                    value={formData.level}
                    onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
                    placeholder="e.g., Advanced"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description..."
                    rows={3}
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

function GenreForm({
    genre,
    onSave,
    onCancel,
}: {
    genre: MusicGenre | null
    onSave: (data: { genre_name: string; icon_name: string }) => void
    onCancel: () => void
}) {
    const [formData, setFormData] = useState({
        genre_name: genre?.genre_name || "",
        icon_name: genre?.icon_name || "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="genre_name">Genre Name</Label>
                <Input
                    id="genre_name"
                    value={formData.genre_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, genre_name: e.target.value }))}
                    placeholder="e.g., Classical"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="icon_name">Icon Name (from lucide-react)</Label>
                <Input
                    id="icon_name"
                    value={formData.icon_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, icon_name: e.target.value }))}
                    placeholder="Music, Radio, etc."
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

function AchievementsList({
    journeyId,
    achievements,
    onAddAchievement,
    onDeleteAchievement,
}: {
    journeyId: string
    achievements: MusicalAchievement[]
    onAddAchievement: (journeyId: string, achievementText: string) => void
    onDeleteAchievement: (achievementId: string) => void
}) {
    const [newAchievement, setNewAchievement] = useState("")

    const handleAdd = () => {
        if (newAchievement.trim()) {
            onAddAchievement(journeyId, newAchievement.trim())
            setNewAchievement("")
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <Textarea
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Add new achievement..."
                    rows={2}
                />
                <Button type="button" size="sm" onClick={handleAdd}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-2">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className="flex items-start justify-between p-3 bg-muted rounded-md"
                    >
                        <span className="text-sm flex-1">{achievement.achievement_text}</span>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteAchievement(achievement.id)}
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ArtistsList({
    genreId,
    artists,
    onAddArtist,
    onDeleteArtist,
}: {
    genreId: string
    artists: FavoriteArtist[]
    onAddArtist: (genreId: string, artistName: string) => void
    onDeleteArtist: (artistId: string) => void
}) {
    const [newArtist, setNewArtist] = useState("")

    const handleAdd = () => {
        if (newArtist.trim()) {
            onAddArtist(genreId, newArtist.trim())
            setNewArtist("")
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <Input
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    placeholder="Add favorite artist..."
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
                <Button type="button" size="sm" onClick={handleAdd}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-2">
                {artists.map((artist) => (
                    <div
                        key={artist.id}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                        <span className="text-sm">{artist.artist_name}</span>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteArtist(artist.id)}
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
