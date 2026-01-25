"use client"

import {motion} from "framer-motion"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Code, Database, Globe, Smartphone, Server, Palette, LanguagesIcon, Puzzle, } from "lucide-react"

const technologies = [
    {category: "Programming Languages", icon: Code, skills: ["C++20", "C", "Assembly x86", "JavaScript", "TypeScript", "Python", "C#", "Java", "SQL"]},
    {category: "Cryptography & Security", icon: Code, skills: ["Homomorphic Encryption (BFV/CKKS)", "SHA3-512", "Crypto++", "Neural Network Cryptography", "Post-Quantum Algorithms"]},
    {category: "Frontend", icon: Globe, skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion"]},
    {category: "Backend", icon: Server, skills: ["Node.js", "ASP.NET", "REST APIs", "Token Authentication", "JWT"]},
    {category: "DevOps & Tools", icon: Puzzle, skills: ["Git", "Docker", "Redis", "Caddy", "CMake", "FFmpeg"]},
    {category: "Database", icon: Database, skills: ["SQLite", "Firebase", "MSSQL"]},
    {category: "Languages", icon: LanguagesIcon, skills: ["Russian - native", "English - B2", "Hebrew - A2", "German - A1"]},

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
                                        I'm Artemiy Pankratov, a software developer specializing in cryptography, data protection, and secure systems design. Since 2022, I've been building applications that push the boundaries of security, from deterministic password generators using SHA3-512 hashing to neural network-based cryptographic protocols with homomorphic encryption.
                                    </p>

                                    <p className="text-lg leading-relaxed mb-6">
                                        My current focus is <strong>SSNS (Secure Split-Neural Synchronization)</strong> - a revolutionary post-quantum cryptographic protocol that combines homomorphic encryption (BFV/CKKS), neural network synchronization, and privacy-preserving machine learning. This C++ implementation enables secure key generation between IoT devices and servers without transmitting sensitive data over the network.
                                    </p>

                                    <p className="text-lg leading-relaxed mb-6">
                                        On GitHub, you'll find projects like <strong>PasswordGenerator</strong> (C++ application using Crypto++ and SHA3-512 for deterministic password generation with master password protection), <strong>KioskUdBet</strong> (enterprise C#/.NET MAUI system serving 400+ users with custom JWT authentication and encrypted data transmission), <strong>orchestra-website</strong> (multilingual Next.js website with modern UI/UX), and various automation tools showcasing full-stack capabilities.
                                    </p>

                                    <p className="text-lg leading-relaxed">
                                        Beyond coding, I'm deeply invested in academic cryptography research, exploring lattice-based encryption schemes, zero-knowledge proofs, and developing practical applications for emerging post-quantum algorithms. Based in Tel Aviv, Israel, I combine mathematical rigor with engineering pragmatism to build secure systems for the modern world.
                                    </p>
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
