-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  image_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table for better organization
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample tags
INSERT INTO tags (name, color) VALUES 
  ('React', '#61DAFB'),
  ('Next.js', '#000000'),
  ('TypeScript', '#3178C6'),
  ('Tailwind CSS', '#06B6D4'),
  ('Node.js', '#339933'),
  ('Python', '#3776AB'),
  ('C#', '#239120'),
  ('Docker', '#2496ED')
ON CONFLICT (name) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (title, description, short_description, image_url, github_url, demo_url, tags, featured) VALUES 
  (
    'E-Commerce Dashboard',
    'A comprehensive admin dashboard for managing an e-commerce platform with real-time analytics, inventory management, and order processing.',
    'Modern admin dashboard with analytics and inventory management',
    '/placeholder.svg?height=400&width=600',
    'https://github.com/username/ecommerce-dashboard',
    'https://ecommerce-dashboard-demo.vercel.app',
    ARRAY['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    true
  ),
  (
    'Task Management App',
    'A collaborative task management application with real-time updates, team collaboration features, and project tracking.',
    'Collaborative task manager with real-time updates',
    '/placeholder.svg?height=400&width=600',
    'https://github.com/username/task-manager',
    'https://task-manager-demo.vercel.app',
    ARRAY['React', 'Node.js', 'TypeScript'],
    true
  ),
  (
    'Weather Forecast API',
    'RESTful API service that aggregates weather data from multiple sources and provides accurate forecasting with caching and rate limiting.',
    'RESTful weather API with data aggregation',
    '/placeholder.svg?height=400&width=600',
    'https://github.com/username/weather-api',
    NULL,
    ARRAY['Python', 'Docker', 'Node.js'],
    false
  )
ON CONFLICT DO NOTHING;
