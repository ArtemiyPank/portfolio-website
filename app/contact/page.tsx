"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {Mail, MessageSquare, Send, Github, Linkedin, Twitter, Instagram} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

type PersonalInfo = {
  id: string
  full_name: string
  tagline: string
  email: string
  telegram: string
  github_url: string | null
  linkedin_url: string | null
  instagram_url: string | null
  twitter_url: string | null
  location: string | null
}

type ContactContent = {
  id: string
  page_title: string
  page_subtitle: string | null
  form_title: string
  form_description: string | null
  direct_contact_title: string
  follow_me_title: string
  follow_me_description: string | null
  footer_text: string | null
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [contactContent, setContactContent] = useState<ContactContent | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const [personalResponse, contactResponse] = await Promise.all([
        fetch("/api/content/personal"),
        fetch("/api/content/contact")
      ])

      const personalData = await personalResponse.json()
      const contactData = await contactResponse.json()

      setPersonalInfo(personalData)
      setContactContent(contactData)
    } catch (error) {
      console.error("Error fetching content:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    }

    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "Thank you for your message. I'll get back to you soon.",
        })
        ;(e.target as HTMLFormElement).reset()
      } else {
        toast({
          title: "Failed to send message",
          description: result.error || "Please try again later.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const socialLinks = [
    { href: personalInfo?.github_url, icon: Github, label: "GitHub" },
    { href: personalInfo?.linkedin_url, icon: Linkedin, label: "LinkedIn" },
    { href: personalInfo?.instagram_url, icon: Instagram, label: "Instagram" },
    { href: personalInfo?.twitter_url, icon: Twitter, label: "Twitter" },
  ].filter(link => link.href)

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {contactContent?.page_title || "Get In Touch"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {contactContent?.page_subtitle || "Have a project in mind or just want to chat? I'd love to hear from you!"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    {contactContent?.form_title || "Send a Message"}
                  </CardTitle>
                  <CardDescription>
                    {contactContent?.form_description || "Fill out the form below and I'll get back to you as soon as possible."}
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
                    {contactContent?.direct_contact_title || "Direct Contact"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {personalInfo?.email && (
                    <div>
                      <p className="font-medium mb-2">Email</p>
                      <Link href={`mailto:${personalInfo.email}`} className="text-primary hover:underline">
                        {personalInfo.email}
                      </Link>
                    </div>
                  )}

                  {personalInfo?.telegram && (
                    <div>
                      <p className="font-medium mb-2">Telegram</p>
                      <Link
                        href={`https://t.me/${personalInfo.telegram.replace('@', '')}`}
                        className="text-primary hover:underline"
                        target="_blank"
                      >
                        {personalInfo.telegram}
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{contactContent?.follow_me_title || "Follow Me"}</CardTitle>
                  <CardDescription>
                    {contactContent?.follow_me_description || "Connect with me on social media"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {socialLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <Button key={link.label} variant="outline" size="icon" asChild>
                          <Link href={link.href!} target="_blank">
                            <Icon className="w-4 h-4" />
                            <span className="sr-only">{link.label}</span>
                          </Link>
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {contactContent?.footer_text && (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="font-semibold mb-2">I'm all ears</h3>
                      <p className="text-sm text-muted-foreground">
                        {contactContent.footer_text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
