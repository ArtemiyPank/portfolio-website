"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Headphones, Loader2 } from "lucide-react"
import * as LucideIcons from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type MusicContent = {
  id: string
  page_title: string
  page_subtitle: string
  journey_section_title: string
  favorites_section_title: string
}

type MusicalAchievement = {
  id: string
  journey_id: string
  achievement_text: string
  display_order: number
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
}

type FavoriteArtist = {
  id: string
  genre_id: string
  artist_name: string
  display_order: number
}

type MusicGenre = {
  id: string
  genre_name: string
  icon_name: string
  display_order: number
  artists: FavoriteArtist[]
}

export default function MusicPage() {
  const [content, setContent] = useState<MusicContent | null>(null)
  const [journey, setJourney] = useState<MusicalJourney[]>([])
  const [genres, setGenres] = useState<MusicGenre[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const [contentResponse, journeyResponse, genresResponse] = await Promise.all([
        fetch("/api/content/music"),
        fetch("/api/content/musical-journey"),
        fetch("/api/content/music-genres")
      ])

      const contentData = await contentResponse.json()
      const journeyData = await journeyResponse.json()
      const genresData = await genresResponse.json()

      setContent(contentData)
      setJourney(journeyData || [])
      setGenres(genresData || [])
    } catch (error) {
      console.error("Error fetching music content:", error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Music
    return Icon
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
      <div className="min-h-screen pt-20 bg-background">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {content?.page_title || "Music & Me"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {content?.page_subtitle || "The soundtrack to my life and creative journey"}
            </p>
          </motion.div>

          {/* Musical Journey */}
          <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              {(() => {
                const Icon = getIcon("Music")
                return <Icon className="w-6 h-6" />
              })()}
              {content?.journey_section_title || "My Musical Journey"}
            </h2>

            <div className="space-y-6">
              {journey
                .sort((a, b) => a.display_order - b.display_order)
                .map((item, index) => {
                const Icon = getIcon(item.icon_name)
                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="w-6 h-6 text-primary" />
                              <span>{item.instrument}</span>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="secondary">{item.years}</Badge>
                              <Badge variant="outline">{item.level}</Badge>
                            </div>
                          </CardTitle>
                          <CardDescription className="text-base">
                            {item.description}
                          </CardDescription>
                        </CardHeader>
                        {item.achievements && item.achievements.length > 0 && (
                          <CardContent>
                            <h4 className="font-semibold mb-2">Achievements</h4>
                            <ul className="space-y-1">
                              {item.achievements
                                .sort((a, b) => a.display_order - b.display_order)
                                .map((ach) => (
                                    <li
                                        key={ach.id}
                                        className="flex items-start gap-2 text-sm"
                                    >
                                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                      {ach.achievement_text}
                                    </li>
                                ))}
                            </ul>
                          </CardContent>
                        )}
                      </Card>
                    </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* Favorite Genres & Artists */}
          <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Headphones className="w-6 h-6" />
              {content?.favorites_section_title || "Favorite Genres & Artists"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {genres
                .sort((a, b) => a.display_order - b.display_order)
                .map((block, idx) => {
                const Icon = getIcon(block.icon_name)
                return (
                    <motion.div
                        key={block.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <Icon className="w-6 h-6 text-primary" />
                            <span>{block.genre_name}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {block.artists
                              .sort((a, b) => a.display_order - b.display_order)
                              .map((artist) => (
                                  <li key={artist.id}>{artist.artist_name}</li>
                              ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                )
              })}
            </div>
          </motion.section>
        </div>
      </div>
  )
}
