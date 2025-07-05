"use client"

import { motion } from "framer-motion"
import { Music, Headphones, Guitar } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const musicalJourney = [
  {
    instrument: "Violin",
    icon: Music,
    years: "Since age 6",
    level: "Advanced",
    description:
        "Started violin at the A. A. Alyabyev Music School at age 6; after moving to Israel, joined the Atid Raziel youth orchestra, which repeatedly competed in and won international competitions.",
    achievements: [
      "Multiple international competition wins with Atid Raziel orchestra",
      "Featured soloist at school and community recitals",
    ],
  },
  {
    instrument: "Piano",
    icon: Music,
    years: "7 grades completed",
    level: "Advanced",
    description:
        "Studied piano in parallel at A. A. Alyabyev Music School, completing all 7 grade examinations with distinction. Accompanied ensembles and soloists during school concerts.",
    achievements: [
      "Grade 7 piano diploma",
      "Accompanied school choir and chamber performances",
      "Performed solo recital pieces at local festivals",
    ],
  },
]

const favoriteMusic = [
  {
    genre: "Classical",
    icon: Music,
    artists: ["Vivaldi", "Grieg", "Rachmaninoff", "Bach", "Mozart"],
  },
  {
    genre: "Heavy Rock / Metal",
    icon: Headphones,
    artists: ["Metallica", "Rammstein", "Led Zeppelin", "Sabaton", "Iron Maiden"],
  },
  {
    genre: "Classic Rock",
    icon: Guitar,
    artists: ["Deep Purple", "AC/DC", "Queen", "The Rolling Stones", "Pink Floyd"],
  },
  {
    genre: "Other",
    icon: Music,
    artists: ["Jazz (Miles Davis)", "Electronic (Daft Punk)", "Folk (Simon & Garfunkel)"],
  },
]

export default function MusicPage() {
  return (
      <div className="min-h-screen pt-20 bg-background">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Music & Me</h1>
            <p className="text-muted-foreground text-lg">
              The soundtrack to my life and creative journey
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
              <Music className="w-6 h-6" />
              My Musical Journey
            </h2>

            <div className="space-y-6">
              {musicalJourney.map((item, index) => {
                const Icon = item.icon
                return (
                    <motion.div
                        key={index}
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
                        <CardContent>
                          <h4 className="font-semibold mb-2">Achievements</h4>
                          <ul className="space-y-1">
                            {item.achievements.map((ach, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm"
                                >
                                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                  {ach}
                                </li>
                            ))}
                          </ul>
                        </CardContent>
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
              Favorite Genres &amp; Artists
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favoriteMusic.map((block, idx) => {
                const Icon = block.icon
                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <Icon className="w-6 h-6 text-primary" />
                            <span>{block.genre}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {block.artists.map((artist, i) => (
                                <li key={i}>{artist}</li>
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
