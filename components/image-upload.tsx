"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    onRemove: () => void
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const handleFileUpload = async (file: File) => {
        if (!file) return

        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Upload failed")
            }

            onChange(result.url)
            toast({
                title: "Success",
                description: "Image uploaded successfully",
            })
        } catch (error) {
            console.error("Upload error:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to upload image",
                variant: "destructive",
            })
        } finally {
            setIsUploading(false)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileUpload(file)
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            handleFileUpload(file)
        }
    }

    const openFileDialog = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="space-y-4">
            <Label>Project Image</Label>

            {value ? (
                <div className="relative">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                        <Image src={value || "/placeholder.svg"} alt="Project preview" fill className="object-cover" />
                    </div>
                    <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={onRemove}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <div
                    className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                        dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="p-4 rounded-full bg-muted">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-medium">Upload Project Image</h3>
                            <p className="text-sm text-muted-foreground">Drag and drop an image here, or click to select</p>
                            <p className="text-xs text-muted-foreground">Supports: JPG, PNG, WebP, GIF (max 5MB)</p>
                        </div>

                        <Button type="button" variant="outline" onClick={openFileDialog} disabled={isUploading}>
                            {isUploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Select Image
                                </>
                            )}
                        </Button>
                    </div>

                    <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </div>
            )}
        </div>
    )
}
