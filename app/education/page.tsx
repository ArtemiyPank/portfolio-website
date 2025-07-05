"use client"

import {motion} from "framer-motion"
import {Award, Calendar, GraduationCap, MapPin} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"

const introText = `
I am a quick and enthusiastic learner, driven by an insatiable curiosity and a deep love for mathematics, programming, data protection, encryption, and physics. I thrive in dynamic environments, eagerly embracing new challenges and turning complex problems into elegant solutions.
`

const education = [{
    institution: "Atid Raziel High School (Israeli)",
    credentials: "Math 5 (100), Physics 5 (100), Computer Science 5 (100)",
    period: "Graduated 2022",
    highlights: ["Graduated with top honors in core STEM subjects", "Served as peer mentor in mathematics and computer science", "Led after-school coding workshops for fellow students", "Developed the dormitory kiosk management website", "Created a cross-platform mobile app for dorm orders",],
},]

export default function EducationPage() {
    return (<div className="min-h-screen pt-20 bg-background">
        <div className="container mx-auto px-6 py-16">
            {/* Header */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                className="max-w-3xl mx-auto text-center mb-12"
            >
                <GraduationCap className="mx-auto mb-4 w-8 h-8 text-primary"/>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Education &amp; Passion</h1>
                <p className="prose prose-lg mx-auto whitespace-pre-line">{introText}</p>
            </motion.div>

            {/* Academic Background */}
            <motion.section
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.2}}
                className="max-w-3xl mx-auto"
            >
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-primary"/>
                    Academic Profile
                </h2>

                {education.map((edu, i) => (<Card key={i} className="mb-8">
                    <CardHeader>
                        <CardTitle
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                                <h3 className="text-2xl font-semibold">{edu.institution}</h3>
                                <p className="text-lg text-muted-foreground">{edu.credentials}</p>
                            </div>
                            <Badge variant="secondary" className="text-sm">
                                {edu.period}
                            </Badge>
                        </CardTitle>
                        <CardDescription className="flex flex-wrap gap-6 mt-2 text-base">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-5 h-5"/>
                    Israel
                  </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Award className="w-5 h-5 text-primary"/>
                                Achievements &amp; Highlights
                            </h4>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                {edu.highlights.map((hl, idx) => (<li key={idx}>{hl}</li>))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>))}
            </motion.section>
        </div>
    </div>)
}
