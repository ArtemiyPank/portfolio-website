CREATE TABLE IF NOT EXISTS projects (
                                        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    image_url TEXT,
    github_url TEXT,
    demo_url TEXT,
    tags TEXT DEFAULT '[]', -- JSON array as string
    featured INTEGER DEFAULT 0, -- SQLite uses INTEGER for boolean
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

-- Create tags table for better organization
CREATE TABLE IF NOT EXISTS tags (
                                    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

-- Insert some sample tags
INSERT OR IGNORE INTO tags (name, color) VALUES
  ('React', '#61DAFB'),
  ('Next.js', '#000000'),
  ('TypeScript', '#3178C6'),
  ('Tailwind CSS', '#06B6D4'),
  ('Node.js', '#339933'),
  ('Python', '#3776AB'),
  ('C#', '#239120'),
  ('Docker', '#2496ED'),
  ('C++', '#00599C'),
  ('Cryptography', '#8B0000'),
  ('Homomorphic Encryption', '#DC143C'),
  ('Neural Networks', '#FF6347'),
  ('Security', '#B22222'),
  ('Crypto++', '#CD5C5C'),
  ('ASP.NET', '#512BD4'),
  ('.NET MAUI', '#512BD4'),
  ('SQLite', '#003B57'),
  ('JWT', '#000000'),
  ('Redis', '#DC382D'),
  ('FFmpeg', '#007808'),
  ('Telegram Bot', '#0088CC'),
  ('Java', '#007396'),
  ('Assembly x86', '#5C2D91');

-- Insert actual projects
INSERT OR IGNORE INTO projects (title, description, short_description, image_url, github_url, demo_url, tags, featured) VALUES
  (
    'SSNS - Secure Split-Neural Synchronization',
    'A revolutionary post-quantum cryptographic protocol combining homomorphic encryption (BFV/CKKS) and neural network synchronization for secure key generation between IoT devices and servers. The system enables privacy-preserving machine learning where resource-constrained clients and powerful servers can synchronize neural networks without transmitting sensitive model weights or training data, achieving post-quantum security through lattice cryptography while supporting offline key generation.',
    'Post-quantum cryptographic protocol using homomorphic encryption and neural network synchronization',
    NULL,
    'https://github.com/ArtemiyPank/SSNS',
    NULL,
    '["C++", "Cryptography", "Homomorphic Encryption", "Neural Networks", "Security"]',
    1
  ),
  (
    'PasswordGenerator',
    'A cryptographically secure password generator built in C++ that deterministically creates unique passwords from a master password using SHA3-512 hashing. The application eliminates the need for password storage by computing passwords on-the-fly with the Crypto++ library, providing quantum-resistant security while ensuring the same master password and service name combination always produces identical results across platforms.',
    'Deterministic password generator using SHA3-512 and Crypto++ for cryptographic security',
    NULL,
    'https://github.com/ArtemiyPank/PasswordGenerator',
    NULL,
    '["C++", "Cryptography", "Crypto++", "Security"]',
    1
  ),
  (
    'KioskUdBet',
    'A production-ready enterprise kiosk management system built with C# and .NET MAUI, serving 400+ active users in a dormitory environment with 100-150 daily transactions. The full-stack application features a cross-platform mobile app, RESTful API backend with custom JWT authentication, real-time inventory management, role-based access control, and comprehensive analytics dashboard, achieving 99.5% uptime with sub-200ms response times.',
    'Enterprise kiosk management system serving 400+ users with custom JWT authentication',
    NULL,
    'https://github.com/ArtemiyPank/KioskUdBet',
    NULL,
    '["C#", ".NET MAUI", "ASP.NET", "SQLite", "JWT", "Security"]',
    1
  ),
  (
    'orchestra-website',
    'A modern, multilingual website for the Atid Raziel School Orchestra in Israel, built with Next.js 14 and TypeScript. The site supports Hebrew, English, and Russian languages with next-intl, features a responsive mobile-first design with Tailwind CSS and Framer Motion animations, includes photo/video galleries for concerts, event calendars for performances, and is optimized for SEO with server-side rendering deployed on Vercel.',
    'Multilingual Next.js website for school orchestra with modern UI/UX',
    NULL,
    'https://github.com/ArtemiyPank/orchestra-website',
    NULL,
    '["TypeScript", "Next.js", "Tailwind CSS", "React"]',
    0
  ),
  (
    'YouTubeDownloadBot',
    'A production-ready Telegram bot built with Python and python-telegram-bot library for downloading YouTube videos and audio with multiple quality options. The bot features asynchronous processing using Redis job queues, FFmpeg media conversion, automatic quality downgrade for large files, real-time progress tracking, comprehensive error recovery with retry logic, rate limiting, and is containerized with Docker for scalable deployment.',
    'Async Telegram bot for YouTube downloads with Redis queue and FFmpeg conversion',
    NULL,
    'https://github.com/ArtemiyPank/YouTubeDownloadBot',
    NULL,
    '["Python", "Telegram Bot", "Redis", "FFmpeg", "Docker"]',
    0
  ),
  (
    'KioskWebCheckOut',
    'A lightweight Node.js web application for managing product sales with an Express backend and SQLite database. The system includes a product catalog with category filtering, shopping cart functionality, revenue tracking and analytics, an admin dashboard for inventory management, and real-time stock updates, all styled with Bootstrap for a responsive interface.',
    'Node.js web app for product sales with analytics and inventory management',
    NULL,
    'https://github.com/ArtemiyPank/KioskWebCheckOut',
    NULL,
    '["Node.js", "SQLite", "JavaScript"]',
    0
  ),
  (
    'CodeGuru-tactics',
    'A collection of warrior programs and tactical innovations developed for the CodeGuru Xtreme Competition, an annual x86 assembly programming competition organized by the Weizmann Institute of Science. The repository contains battle strategies written in 8086 assembly language for the corewars8086 engine, demonstrating advanced techniques including self-replication, opponent detection, memory control, and optimization strategies. This work contributed to achieving 3rd place nationally among 150+ Israeli teams and 8th place in the finals, showcasing mastery of low-level programming and strategic thinking.',
    '8086 assembly battle strategies for CodeGuru competition - 3rd place nationally',
    NULL,
    'https://github.com/ArtemiyPank/CodeGuru-tactics',
    NULL,
    '["Assembly x86", "Security"]',
    1
--   ),
--   (
--     'DungeonAdventureGameExercise',
--     'An object-oriented dungeon crawler game developed in Java 17+ demonstrating classic OOP design patterns and game architecture. The game features procedural dungeon generation algorithms, a turn-based combat system, inventory management mechanics, and a structured game loop architecture, with comprehensive unit testing using JUnit to ensure code quality and game logic correctness.',
--     'Java-based dungeon crawler with OOP design patterns',
--     NULL,
--     'https://github.com/ArtemiyPank/DungeonAdventureGameExercise',
--     NULL,
--     '["Java"]',
--     0
  );

-- ============================================================================
-- CONTENT MANAGEMENT TABLES
-- ============================================================================

-- Personal Information
CREATE TABLE IF NOT EXISTS personal_info (
    id TEXT PRIMARY KEY DEFAULT 'main',
    full_name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    email TEXT NOT NULL,
    telegram TEXT NOT NULL,
    github_url TEXT,
    linkedin_url TEXT,
    instagram_url TEXT,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- About Page Content
CREATE TABLE IF NOT EXISTS about_content (
    id TEXT PRIMARY KEY DEFAULT 'main',
    page_title TEXT NOT NULL DEFAULT 'About Me',
    page_subtitle TEXT,
    biography TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Technologies & Skills
CREATE TABLE IF NOT EXISTS tech_categories (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL UNIQUE,
    icon_name TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tech_skills (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    category_id TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES tech_categories(id) ON DELETE CASCADE,
    UNIQUE(category_id, skill_name)
);

-- Contact Page Content
CREATE TABLE IF NOT EXISTS contact_content (
    id TEXT PRIMARY KEY DEFAULT 'main',
    page_title TEXT NOT NULL DEFAULT 'Get In Touch',
    page_subtitle TEXT,
    form_title TEXT NOT NULL DEFAULT 'Send a Message',
    form_description TEXT,
    direct_contact_title TEXT NOT NULL DEFAULT 'Direct Contact',
    follow_me_title TEXT NOT NULL DEFAULT 'Follow Me',
    follow_me_description TEXT,
    footer_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Education Content
CREATE TABLE IF NOT EXISTS education_content (
    id TEXT PRIMARY KEY DEFAULT 'main',
    page_title TEXT NOT NULL DEFAULT 'Education & Passion',
    intro_text TEXT NOT NULL,
    section_title TEXT NOT NULL DEFAULT 'Academic Profile',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS education_entries (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    institution TEXT NOT NULL,
    credentials TEXT NOT NULL,
    period TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'Israel',
    website_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(institution, credentials)
);

CREATE TABLE IF NOT EXISTS education_highlights (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    education_id TEXT NOT NULL,
    highlight_text TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (education_id) REFERENCES education_entries(id) ON DELETE CASCADE,
    UNIQUE(education_id, highlight_text)
);

-- Music Content
CREATE TABLE IF NOT EXISTS music_content (
    id TEXT PRIMARY KEY DEFAULT 'main',
    page_title TEXT NOT NULL DEFAULT 'Music & Me',
    page_subtitle TEXT NOT NULL DEFAULT 'The soundtrack to my life and creative journey',
    journey_section_title TEXT NOT NULL DEFAULT 'My Musical Journey',
    favorites_section_title TEXT NOT NULL DEFAULT 'Favorite Genres & Artists',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS musical_journey (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    instrument TEXT NOT NULL UNIQUE,
    icon_name TEXT NOT NULL DEFAULT 'Music',
    years TEXT NOT NULL,
    level TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS musical_achievements (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    journey_id TEXT NOT NULL,
    achievement_text TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (journey_id) REFERENCES musical_journey(id) ON DELETE CASCADE,
    UNIQUE(journey_id, achievement_text)
);

CREATE TABLE IF NOT EXISTS music_genres (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    genre_name TEXT NOT NULL UNIQUE,
    icon_name TEXT NOT NULL DEFAULT 'Music',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favorite_artists (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    genre_id TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (genre_id) REFERENCES music_genres(id) ON DELETE CASCADE,
    UNIQUE(genre_id, artist_name)
);
