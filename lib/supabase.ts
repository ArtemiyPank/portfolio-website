import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Project = {
  id: string
  title: string
  description: string | null
  short_description: string | null
  image_url: string | null
  github_url: string | null
  demo_url: string | null
  tags: string[]
  featured: boolean
  created_at: string
  updated_at: string
}

export type Tag = {
  id: string
  name: string
  color: string
  created_at: string
}
