"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"
import { cn } from "@/lib/utils"
import type { Components } from "react-markdown"
import "highlight.js/styles/github-dark.css"

interface MarkdownRendererProps {
    content: string
    className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    const components: Components = {
        // Custom heading styles
        h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 pb-2 border-b border-border">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-semibold mb-4 mt-8 pb-2 border-b border-border">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-semibold mb-3 mt-6">{children}</h3>,
        h4: ({ children }) => <h4 className="text-lg font-semibold mb-2 mt-4">{children}</h4>,
        h5: ({ children }) => <h5 className="text-base font-semibold mb-2 mt-4">{children}</h5>,
        h6: ({ children }) => <h6 className="text-sm font-semibold mb-2 mt-4">{children}</h6>,

        // Custom paragraph styles
        p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,

        // Custom list styles
        ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>,
        li: ({ children }) => <li className="leading-7">{children}</li>,

        // Custom code styles
        code: ({ children, className, ...props }) => {
            const match = /language-(\w+)/.exec(className || "")
            const isInline = !match

            if (isInline) {
                return (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                    </code>
                )
            }
            return (
                <code className={className} {...props}>
                    {children}
                </code>
            )
        },
        pre: ({ children }) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 border">{children}</pre>,

        // Custom blockquote styles
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">{children}</blockquote>
        ),

        // Custom table styles
        table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
                <table className="min-w-full border-collapse border border-border">{children}</table>
            </div>
        ),
        thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
        th: ({ children }) => <th className="border border-border px-4 py-2 text-left font-semibold">{children}</th>,
        td: ({ children }) => <td className="border border-border px-4 py-2">{children}</td>,

        // Custom link styles
        a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                {children}
            </a>
        ),

        // Custom image styles
        img: ({ src, alt }) => (
            <img src={src || "/placeholder.svg"} alt={alt} className="max-w-full h-auto rounded-lg border my-4" />
        ),

        // Custom horizontal rule
        hr: () => <hr className="my-8 border-border" />,
    }

    return (
        <div className={cn("prose prose-neutral dark:prose-invert max-w-none", className)}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeRaw]} components={components}>
                {content}
            </ReactMarkdown>
        </div>
    )
}
