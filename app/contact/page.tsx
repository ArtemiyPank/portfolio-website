"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {Mail, MessageSquare, Send, Github, Linkedin, Twitter, Instagram} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Message sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    })

    setIsSubmitting(false)
    ;(e.target as HTMLFormElement).reset()
  }

  const socialLinks = [
    { href: "https://github.com", icon: Github, label: "GitHub" },
    { href: "https://www.linkedin.com/in/artemiy-pankratov-251059326/", icon: Linkedin, label: "LinkedIn" },
    { href: "https://www.instagram.com/pankratov_artemiy/", icon: Instagram, label: "https://www.instagram.com/pankratov_artemiy/" },
    { href: "https://x.com/AdPankrat", icon: Twitter, label: "Twitter" },
  ]

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
            <p className="text-muted-foreground text-lg">
              Have a project in mind or just want to chat? I'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Send a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and I'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" name="subject" placeholder="What's this about?" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell me about your project or just say hello!"
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Direct Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Email</p>
                    <Link href="mailto:ad.pankrat@gmail.com" className="text-primary hover:underline">
                      ad.pankrat@gmail.com
                    </Link>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Telegram</p>
                    <Link href="https://t.me/adpankrat" className="text-primary hover:underline" target="_blank">
                      @adpankrat
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Follow Me</CardTitle>
                  <CardDescription>Connect with me on social media</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {socialLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <Button key={link.label} variant="outline" size="icon" asChild>
                          <Link href={link.href} target="_blank">
                            <Icon className="w-4 h-4" />
                            <span className="sr-only">{link.label}</span>
                          </Link>
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">I’m all ears</h3>
                    <p className="text-sm text-muted-foreground">
                      Got a neat idea, a puzzling bug, or just want to geek out over tech? Shoot me a message!
                    </p>
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
