"use client"

import {motion} from "framer-motion"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Code, Database, Globe, Smartphone, Server, Palette, LanguagesIcon, Puzzle, } from "lucide-react"

const technologies = [
    {category: "Programming Languishes", icon: Code, skills: ["C++", "JavaScript", "TypeScript", "Python", "C#", "SQL"]},
    {category: "Frontend", icon: Globe, skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion"]},
    {category: "Backend", icon: Server, skills: ["Node.js", "ASP.NET"]},
    {category: "Concepts", icon: Puzzle, skills: ["Git", "Docker", "Redis", "REST APIs", "Token Authentication", "JWT"]},
    {category: "Database", icon: Database, skills: ["SQLite", "Firebase"]},
    {category: "Languishes", icon: LanguagesIcon, skills: ["Russian - native", "English - B2", "Hebrew - A2", "German - A1"]},

]

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-20">
            <div className="container mx-auto px-4 py-12">
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
                        <p className="text-muted-foreground text-lg">
                            Get to know me better - my journey, skills, and passion for development
                        </p>
                    </div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2}}
                        className="mb-12"
                    >
                        <Card>
                            <CardContent className="p-8">
                                <div className="prose prose-neutral dark:prose-invert max-w-none">
                                    <p className="text-lg leading-relaxed mb-6">
                                        I’m Artemiy Pankratov, a full-stack developer who’s been writing code since 2022
                                        with a strong foundation in mathematics and a deep interest in data protection
                                        and cryptography. I’ve built modern, cross-platform applications that showcase
                                        real-time features alongside custom token-based authentication (all without
                                        relying on third-party libraries), as well as intelligent Telegram chatbots and
                                        full-featured web services.
                                    </p>

                                    <p className="text-lg leading-relaxed mb-6">
                                        On GitHub, you’ll find projects like KioskUdBet (a C#/.NET MAUI + ASP NET +
                                        SQLite mobile + web API system for managing a dormitory kiosk with adaptive UI,
                                        role-based REST endpoints, secure access/refresh tokens, cart/order workflows,
                                        delivery tracking, and an admin panel), KioskWebCheckOut (a Node.js/SQLite web
                                        app for product sales with category filtering, photo-backed counters, revenue
                                        stats, and purchase analytics), and YouTubeDownloadBot (a
                                        Python/yt-dlp/Redis-powered Telegram bot featuring asynchronous job queues,
                                        FFmpeg conversion, duration/file-size safeguards, and robust error
                                        logging). </p>

                                    <p className="text-lg leading-relaxed">
                                        When I’m not building features, you’ll find me exploring advanced
                                        data-protection techniques, contributing to open-source projects, or diving
                                        deeper into distributed systems and server-sent events to level up my real-time
                                        architectures. </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.4}}>
                        <h2 className="text-2xl font-bold mb-8 text-center">Technologies & Skills</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {technologies.map((tech, index) => {
                                const Icon = tech.icon
                                return (
                                    <motion.div
                                        key={tech.category}
                                        initial={{opacity: 0, y: 20}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{delay: 0.1 * index}}
                                        whileHover={{y: -5}}
                                    >
                                        <Card className="h-full">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Icon className="w-5 h-5 text-primary"/>
                                                    {tech.category}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-wrap gap-2">
                                                    {tech.skills.map((skill) => (
                                                        <Badge key={skill} variant="secondary">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
