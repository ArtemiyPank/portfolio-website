"use client"

import { useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"
import { cn } from "@/lib/utils"
import type { Components } from "react-markdown"

// Import both light and dark themes
import "highlight.js/styles/github.css"
import "highlight.js/styles/github-dark.css"
import "./markdown.css"

interface MarkdownRendererProps {
    content: string
    className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    useEffect(() => {
        // Dynamically switch highlight.js theme based on system theme
        const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)")

        const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
            const isDark = e.matches
            // You can dynamically load different themes here if needed
        }

        updateTheme(darkModeQuery)
        darkModeQuery.addEventListener("change", updateTheme)

        return () => darkModeQuery.removeEventListener("change", updateTheme)
    }, [])

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
        ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>,
        ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>,
        li: ({ children, ...props }) => {
            // Support for task lists (checkboxes)
            const hasCheckbox = props.className?.includes("task-list-item")
            return (
                <li className={cn("leading-7", hasCheckbox && "list-none -ml-6")} {...props}>
                    {children}
                </li>
            )
        },

        // Custom code styles
        code: ({ children, className, ...props }) => {
            const match = /language-(\w+)/.exec(className || "")
            const isInline = !match

            if (isInline) {
                return (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground border" {...props}>
                        {children}
                    </code>
                )
            }
            return (
                <code className={cn("text-sm", className)} {...props}>
                    {children}
                </code>
            )
        },
        pre: ({ children }) => (
            <pre className="bg-muted/50 dark:bg-muted p-4 rounded-lg overflow-x-auto mb-6 border border-border shadow-sm">
                {children}
            </pre>
        ),

        // Custom blockquote styles
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">{children}</blockquote>
        ),

        // Custom table styles
        table: ({ children }) => (
            <div className="overflow-x-auto mb-6 rounded-lg border border-border shadow-sm">
                <table className="min-w-full divide-y divide-border">{children}</table>
            </div>
        ),
        thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
        tbody: ({ children }) => <tbody className="bg-background divide-y divide-border">{children}</tbody>,
        th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">{children}</th>
        ),
        td: ({ children }) => <td className="px-4 py-3 text-sm text-muted-foreground">{children}</td>,
        tr: ({ children }) => <tr className="hover:bg-muted/30 transition-colors">{children}</tr>,

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
        <div
            className={cn(
                "prose prose-neutral dark:prose-invert max-w-none",
                "prose-headings:scroll-mt-20",
                "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
                "prose-code:text-foreground prose-code:font-mono",
                "prose-pre:bg-transparent prose-pre:p-0",
                "prose-img:rounded-lg prose-img:border prose-img:shadow-md",
                "prose-hr:border-border",
                "prose-blockquote:border-primary/50",
                "prose-strong:text-foreground prose-strong:font-semibold",
                className
            )}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeRaw]} components={components}>
                {content}
            </ReactMarkdown>
        </div>
    )
}
