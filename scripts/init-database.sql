CREATE TABLE IF NOT EXISTS projects (
                                        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title TEXT NOT NULL,
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
    '# Secure Split-Neural Synchronization Protocol

## Overview
SSNS is a revolutionary post-quantum cryptographic protocol that combines homomorphic encryption (BFV/CKKS), neural network synchronization, and privacy-preserving machine learning. This protocol enables secure key generation between resource-constrained IoT devices and powerful servers without transmitting sensitive model weights or training data over the network.

## Key Features
- **Homomorphic Encryption**: Uses BFV/CKKS schemes for post-quantum security
- **Neural Network Synchronization**: Teacher-Student model architecture with Feedback Alignment
- **Privacy-Preserving ML**: Stochastic Activation Pruning with zero-masking protection
- **IoT-Optimized**: Asymmetric computation (heavy ops on server, light ops on client)
- **Offline Key Generation**: Synchronized models generate identical keys without network communication

## Technical Architecture

### Phase 1: Initialization
1. Client generates homomorphic encryption keypair (Public Key, Secret Key, Galois Keys)
2. Client initializes neural network with random weights (W1, W2)
3. Server generates fixed Feedback Alignment matrix (B) for gradient computation

### Phase 2: Training Loop (Synchronization)
1. **Client Forward Pass**: Computes hidden layer with Dropout masking and noise injection
2. **Encryption & Transmission**: Encrypts activations with homomorphic encryption
3. **Server Gradient Computation**: Computes gradients on ciphertext using teacher model
4. **Client Weight Update**: Decrypts gradients, filters with Dropout mask, updates weights

### Phase 3: Key Generation
- Both parties use synchronized neural networks as pseudorandom functions
- Identical inputs produce identical outputs (cryptographic key material)
- No network communication required during key generation phase

## Security Properties
- **Post-Quantum Resistant**: Based on lattice cryptography (RLWE problem)
- **Forward Secrecy**: Each training epoch uses different Dropout masks
- **Side-Channel Protection**: Zero-masking prevents traffic analysis attacks
- **Model Privacy**: Server never sees plaintext weights or activations

## Implementation
- **Language**: C++20
- **Crypto Library**: Homomorphic encryption implementation (BFV/CKKS)
- **Build System**: CMake
- **Target**: IoT devices, embedded systems, mobile platforms

## Applications
- Secure device pairing without pre-shared secrets
- Privacy-preserving federated learning
- Quantum-resistant key exchange for IoT
- Distributed machine learning with confidential models',
    'Post-quantum cryptographic protocol using homomorphic encryption and neural network synchronization',
    NULL,
    'https://github.com/ArtemiyPank/SSNS',
    NULL,
    '["C++", "Cryptography", "Homomorphic Encryption", "Neural Networks", "Security"]',
    1
  ),
  (
    'PasswordGenerator',
    '# Deterministic Password Generator

## Overview
A C++ application that generates complex, unique passwords deterministically from a master password. Uses SHA3-512 hashing and Crypto++ library to ensure cryptographic security while maintaining reproducibility.

## Key Features
- **Deterministic Generation**: Same master password + service name = same output password
- **Cryptographically Secure**: SHA3-512 hashing algorithm (post-quantum resistant)
- **No Storage Required**: Passwords are computed on-the-fly, nothing stored on disk
- **Customizable Output**: Configurable length, character sets, and complexity rules
- **Cross-Platform**: Works on Windows, Linux, and macOS

## Technical Implementation
- **Hashing Algorithm**: SHA3-512 (Keccak) from Crypto++ library
- **Key Derivation**: Master password + service name + optional salt
- **Character Encoding**: Base64/Custom alphabet for password generation
- **Memory Security**: Secure memory wiping after password generation

## Security Properties
- **Master Password Protection**: Single point of entry, never transmitted
- **Collision Resistance**: SHA3-512 provides 512-bit security
- **Quantum Resistant**: SHA3 is considered post-quantum secure
- **No Database Breaches**: No password storage means no data to steal

## Build & Dependencies
- C++20 compiler (GCC 10+, Clang 12+, MSVC 2019+)
- Crypto++ library (libcrypto++)
- CMake 3.15+

## Use Cases
- Personal password management without cloud storage
- Secure password generation for multiple services
- Offline password access (no internet required)
- Security-conscious users seeking transparency',
    'Deterministic password generator using SHA3-512 and Crypto++ for cryptographic security',
    NULL,
    'https://github.com/ArtemiyPank/PasswordGenerator',
    NULL,
    '["C++", "Cryptography", "Crypto++", "Security"]',
    1
  ),
  (
    'KioskUdBet',
    '# KioskUdBet - Enterprise Kiosk Management System

## Overview
Full-stack C#/.NET MAUI mobile and web application for managing a dormitory kiosk with 400+ active users. Features real-time inventory management, role-based access control, custom JWT authentication, and comprehensive admin dashboard.

## Key Features
- **Cross-Platform Mobile App**: .NET MAUI (iOS, Android, Windows)
- **RESTful Web API**: ASP.NET Core backend with SQLite database
- **Custom Authentication**: JWT-based access/refresh token system (no third-party libraries)
- **Role-Based Access**: Admin, Manager, Customer roles with granular permissions
- **Real-Time Updates**: Order status tracking and delivery notifications
- **Inventory Management**: Stock tracking, low-stock alerts, auto-reordering
- **Analytics Dashboard**: Sales reports, revenue tracking, customer insights

## Technical Stack
- **Frontend**: .NET MAUI, XAML, C#
- **Backend**: ASP.NET Core 7.0, Entity Framework Core
- **Database**: SQLite (production), MSSQL (staging)
- **Authentication**: Custom JWT implementation with refresh tokens
- **API Design**: RESTful architecture with versioning support

## Architecture
- **Client-Server**: Mobile app communicates with centralized API server
- **Token Management**: Secure token storage with encryption
- **Cart System**: Persistent shopping cart with offline support
- **Payment Integration**: Multiple payment methods support
- **Delivery Tracking**: Real-time order status updates

## Deployed Scale
- **Active Users**: 400+ students and staff
- **Daily Transactions**: 100-150 orders
- **Uptime**: 99.5% availability
- **Response Time**: <200ms average API response

## Security Features
- Encrypted data transmission (HTTPS/TLS)
- Password hashing with bcrypt
- SQL injection prevention (parameterized queries)
- XSS protection (input validation and sanitization)
- Rate limiting and abuse prevention',
    'Enterprise kiosk management system serving 400+ users with custom JWT authentication',
    NULL,
    'https://github.com/ArtemiyPank/KioskUdBet',
    NULL,
    '["C#", ".NET MAUI", "ASP.NET", "SQLite", "JWT", "Security"]',
    1
  ),
  (
    'orchestra-website',
    '# Atid Raziel School Orchestra Website

## Overview
Multilingual website for the Atid Raziel School Orchestra in Israel. Built with Next.js, featuring modern design, internationalization, and content management for showcasing orchestra performances and events.

## Key Features
- **Multilingual Support**: Hebrew, English, Russian language support
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: Next.js SSG/SSR for fast page loads
- **Gallery Management**: Photo and video galleries for concerts
- **Event Calendar**: Upcoming performances and rehearsal schedules
- **SEO Optimized**: Meta tags, structured data, sitemap generation

## Technical Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- next-intl (internationalization)

## Deployment
- Vercel hosting
- Automatic deployments from Git
- CDN-optimized assets
- Analytics integration',
    'Multilingual Next.js website for school orchestra with modern UI/UX',
    NULL,
    'https://github.com/ArtemiyPank/orchestra-website',
    NULL,
    '["TypeScript", "Next.js", "Tailwind CSS", "React"]',
    0
  ),
  (
    'YouTubeDownloadBot',
    '# YouTube Download Telegram Bot

## Overview
Python Telegram bot for downloading YouTube videos and audio. Features asynchronous job queues, FFmpeg conversion, file size safeguards, and robust error handling with Redis caching.

## Key Features
- **Video Download**: Multiple quality options (1080p, 720p, 480p)
- **Audio Extraction**: MP3/M4A format support
- **Async Processing**: Non-blocking job queue with Redis
- **File Size Limits**: Automatic quality downgrade for large files
- **Progress Tracking**: Real-time download progress updates
- **Error Recovery**: Retry logic and detailed error logging

## Technical Stack
- Python 3.10+
- python-telegram-bot library
- yt-dlp (YouTube downloader)
- FFmpeg (media conversion)
- Redis (job queue and caching)
- Docker (containerization)

## Architecture
- Async/await for concurrent downloads
- Redis-based job queue for scalability
- FFmpeg for format conversion
- Temp file cleanup and disk management

## Deployed Features
- Rate limiting (anti-spam)
- User analytics
- Download history
- Playlist support',
    'Async Telegram bot for YouTube downloads with Redis queue and FFmpeg conversion',
    NULL,
    'https://github.com/ArtemiyPank/YouTubeDownloadBot',
    NULL,
    '["Python", "Telegram Bot", "Redis", "FFmpeg", "Docker"]',
    0
  ),
  (
    'KioskWebCheckOut',
    '# Kiosk Web Checkout System

## Overview
Node.js/SQLite web application for product sales with category filtering, photo-backed counters, revenue statistics, and purchase analytics.

## Key Features
- Product catalog with categories
- Shopping cart functionality
- Revenue tracking and analytics
- Admin dashboard for inventory management
- Real-time stock updates

## Technical Stack
- Node.js + Express
- SQLite database
- JavaScript frontend
- Bootstrap CSS',
    'Node.js web app for product sales with analytics and inventory management',
    NULL,
    'https://github.com/ArtemiyPank/KioskWebCheckOut',
    NULL,
    '["Node.js", "SQLite", "JavaScript"]',
    0
  ),
  (
    'DungeonAdventureGameExercise',
    '# Dungeon Adventure Game

## Overview
Object-oriented dungeon crawler game written in Java. Features procedural dungeon generation, combat system, and inventory management.

## Technical Stack
- Java 17+
- Object-Oriented Design
- Game loop architecture
- Unit testing with JUnit',
    'Java-based dungeon crawler with OOP design patterns',
    NULL,
    'https://github.com/ArtemiyPank/DungeonAdventureGameExercise',
    NULL,
    '["Java"]',
    0
  );
