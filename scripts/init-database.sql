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
  ('Java', '#007396');

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
