-- ============================================================================
-- Content Management System Migration
-- This script adds all necessary tables for managing site content via admin panel
-- ============================================================================

-- ============================================================================
-- PERSONAL INFORMATION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS personal_info (
    id TEXT PRIMARY KEY DEFAULT 'main',
    full_name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    email TEXT NOT NULL,
    telegram TEXT NOT NULL,
    github_url TEXT,
    linkedin_url TEXT,
    instagram_url TEXT,
    twitter_url TEXT,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO personal_info (
    id, full_name, tagline, email, telegram,
    github_url, linkedin_url, instagram_url, twitter_url, location
) VALUES (
    'main',
    'Artemiy Pankratov',
    'Cryptography Specialist & Security-Focused Developer',
    'ad.pankrat@gmail.com',
    '@adpankrat',
    'https://github.com/ArtemiyPank',
    'https://www.linkedin.com/in/artemiy-pankratov-251059326/',
    'https://www.instagram.com/pankratov_artemiy/',
    'https://x.com/AdPankrat',
    'Tel Aviv, Israel'
);

-- ============================================================================
-- ABOUT PAGE CONTENT
-- ============================================================================
CREATE TABLE IF NOT EXISTS about_content (
    id TEXT PRIMARY KEY DEFAULT 'main',
    page_title TEXT NOT NULL DEFAULT 'About Me',
    page_subtitle TEXT,
    biography TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO about_content (
    id, page_title, page_subtitle, biography
) VALUES (
    'main',
    'About Me',
    'Get to know me better - my journey, skills, and passion for development',
    'I''m Artemiy Pankratov, a software developer specializing in cryptography, data protection, and secure systems design. Since 2022, I''ve been building applications that push the boundaries of security, from deterministic password generators using SHA3-512 hashing to neural network-based cryptographic protocols with homomorphic encryption.

My current focus is SSNS (Secure Split-Neural Synchronization) - a revolutionary post-quantum cryptographic protocol that combines homomorphic encryption (BFV/CKKS), neural network synchronization, and privacy-preserving machine learning. This C++ implementation enables secure key generation between IoT devices and servers without transmitting sensitive data over the network.

On GitHub, you''ll find projects like PasswordGenerator (C++ application using Crypto++ and SHA3-512 for deterministic password generation with master password protection), KioskUdBet (enterprise C#/.NET MAUI system serving 400+ users with custom JWT authentication and encrypted data transmission), orchestra-website (multilingual Next.js website with modern UI/UX), and various automation tools showcasing full-stack capabilities.

Beyond coding, I''m deeply invested in academic cryptography research, exploring lattice-based encryption schemes, zero-knowledge proofs, and developing practical applications for emerging post-quantum algorithms. Based in Tel Aviv, Israel, I combine mathematical rigor with engineering pragmatism to build secure systems for the modern world.'
);

-- ============================================================================
-- TECHNOLOGIES & SKILLS
-- ============================================================================
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

-- Insert tech categories
INSERT OR IGNORE INTO tech_categories (id, name, icon_name, display_order) VALUES
    ('cat_prog_lang', 'Programming Languages', 'Code', 1),
    ('cat_crypto', 'Cryptography & Security', 'Shield', 2),
    ('cat_frontend', 'Frontend', 'Globe', 3),
    ('cat_backend', 'Backend', 'Server', 4),
    ('cat_devops', 'DevOps & Tools', 'Wrench', 5),
    ('cat_database', 'Database', 'Database', 6),
    ('cat_languages', 'Languages', 'Languages', 7);

-- Insert skills for Programming Languages
INSERT OR IGNORE INTO tech_skills (category_id, skill_name, display_order) VALUES
    ('cat_prog_lang', 'C++', 1),
    ('cat_prog_lang', 'C', 2),
    ('cat_prog_lang', 'Assembly x86', 3),
    ('cat_prog_lang', 'JavaScript', 4),
    ('cat_prog_lang', 'TypeScript', 5),
    ('cat_prog_lang', 'Python', 6),
    ('cat_prog_lang', 'C#', 7),
    ('cat_prog_lang', 'Java', 8),
    ('cat_prog_lang', 'SQL', 9);

-- Insert skills for Cryptography & Security
INSERT OR IGNORE INTO tech_skills (category_id, skill_name, display_order) VALUES
    ('cat_crypto', 'Homomorphic Encryption (BFV/CKKS)', 1),
    ('cat_crypto', 'SHA3-512', 2),
    ('cat_crypto', 'Crypto++', 3),
    ('cat_crypto', 'Neural Network Cryptography', 4),

-- Insert skills for Frontend
INSERT OR IGNORE INTO tech_skills (category_id, skill_name, display_order) VALUES
    ('cat_frontend', 'React', 1),
    ('cat_frontend', 'Next.js', 2),
    ('cat_frontend', 'Tailwind CSS', 3),
    ('cat_frontend', 'Framer Motion', 4);

-- Insert skills for Backend
INSERT OR IGNORE INTO tech_skills (category_id, skill_name, display_order) VALUES
    ('cat_backend', 'Node.js', 1),
    ('cat_backend', 'ASP.NET', 2),
    ('cat_backend', 'REST APIs', 3),
    ('cat_backend', 'Token Authentication', 4),
    ('cat_backend', 'JWT', 5);

-- Insert skills for DevOps & Tools
INSERT OR IGNORE INTO tech_skills (category_id, skill_name, display_order) VALUES
    ('cat_devops', 'Git', 1),
    ('cat_devops', 'Docker', 2),
    ('cat_devops', 'Redis', 3),
    ('cat_devops', 'Caddy', 4),
    ('cat_devops', 'CMake', 5),
    ('cat_devops', 'FFmpeg', 6);

-- Insert skills for Database
INSERT OR IGNORE INTO tech_skills (category_id, skill_name, display_order) VALUES
    ('cat_database', 'SQLite', 1),
    ('cat_database', 'Firebase', 2),
    ('cat_database', 'MSSQL', 3);

-- Insert skills for Languages
INSERT OR IGNORE INTO tech_skills (category_id, skill_name, display_order) VALUES
    ('cat_languages', 'Russian - native', 1),
    ('cat_languages', 'English - B2', 2),
    ('cat_languages', 'Hebrew - A2', 3),
    ('cat_languages', 'German - A1', 4);

-- ============================================================================
-- CONTACT PAGE CONTENT
-- ============================================================================
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

INSERT OR IGNORE INTO contact_content (
    id, page_title, page_subtitle, form_description,
    follow_me_description, footer_text
) VALUES (
    'main',
    'Get In Touch',
    'Have a project in mind or just want to chat? I''d love to hear from you!',
    'Fill out the form below and I''ll get back to you as soon as possible.',
    'Connect with me on social media',
    'Got a neat idea, a puzzling bug, or just want to geek out over tech? Shoot me a message!'
);

-- ============================================================================
-- EDUCATION CONTENT
-- ============================================================================
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

-- Insert education content
INSERT OR IGNORE INTO education_content (id, intro_text) VALUES (
    'main',
    'I am a quick and enthusiastic learner, driven by an insatiable curiosity and a deep love for mathematics, programming, data protection, encryption, and physics. I thrive in dynamic environments, eagerly embracing new challenges and turning complex problems into elegant solutions.'
);

-- Insert education entry
INSERT OR IGNORE INTO education_entries (
    id, institution, credentials, period, location, display_order
) VALUES (
    'edu_atid_raziel',
    'Atid Raziel High School (Israeli)',
    'Math 5 (100), Physics 5 (100), Computer Science 5 (100)',
    'Graduated 2022',
    'Israel',
    1
);

-- Insert highlights
INSERT OR IGNORE INTO education_highlights (education_id, highlight_text, display_order) VALUES
    ('edu_atid_raziel', 'Graduated with top honors in core STEM subjects', 1),
    ('edu_atid_raziel', 'Served as peer mentor in mathematics and computer science', 2),
    ('edu_atid_raziel', 'Led after-school coding workshops for fellow students', 3),
    ('edu_atid_raziel', 'Developed the dormitory kiosk management website', 4),
    ('edu_atid_raziel', 'Created a cross-platform mobile app for dorm orders', 5);

-- ============================================================================
-- MUSIC CONTENT
-- ============================================================================
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

-- Insert music content
INSERT OR IGNORE INTO music_content (id) VALUES ('main');

-- Insert musical journey
INSERT OR IGNORE INTO musical_journey (
    id, instrument, icon_name, years, level, description, display_order
) VALUES
    ('journey_violin', 'Violin', 'Music', 'Since age 6', 'Advanced',
     'Started violin at the A. A. Alyabyev Music School at age 6; after moving to Israel, joined the Atid Raziel youth orchestra, which repeatedly competed in and won international competitions.', 1),
    ('journey_piano', 'Piano', 'Music', '7 grades completed', 'Advanced',
     'Studied piano in parallel at A. A. Alyabyev Music School, completing all 7 grade examinations with distinction. Accompanied ensembles and soloists during school concerts.', 2);

-- Insert achievements for violin
INSERT OR IGNORE INTO musical_achievements (journey_id, achievement_text, display_order) VALUES
    ('journey_violin', 'Multiple international competition wins with Atid Raziel orchestra', 1),
    ('journey_violin', 'Featured soloist at school and community recitals', 2);

-- Insert achievements for piano
INSERT OR IGNORE INTO musical_achievements (journey_id, achievement_text, display_order) VALUES
    ('journey_piano', 'Grade 7 piano diploma', 1),
    ('journey_piano', 'Accompanied school choir and chamber performances', 2),
    ('journey_piano', 'Performed solo recital pieces at local festivals', 3);

-- Insert music genres
INSERT OR IGNORE INTO music_genres (id, genre_name, icon_name, display_order) VALUES
    ('genre_classical', 'Classical', 'Music2', 1),
    ('genre_metal', 'Heavy Rock / Metal', 'Zap', 2),
    ('genre_rock', 'Classic Rock', 'Radio', 3),
    ('genre_other', 'Other', 'Music4', 4);

-- Insert favorite artists for Classical
INSERT OR IGNORE INTO favorite_artists (genre_id, artist_name, display_order) VALUES
    ('genre_classical', 'Vivaldi', 1),
    ('genre_classical', 'Grieg', 2),
    ('genre_classical', 'Rachmaninoff', 3),
    ('genre_classical', 'Bach', 4),
    ('genre_classical', 'Mozart', 5);

-- Insert favorite artists for Heavy Rock / Metal
INSERT OR IGNORE INTO favorite_artists (genre_id, artist_name, display_order) VALUES
    ('genre_metal', 'Metallica', 1),
    ('genre_metal', 'Rammstein', 2),
    ('genre_metal', 'Led Zeppelin', 3),
    ('genre_metal', 'Sabaton', 4),
    ('genre_metal', 'Iron Maiden', 5);

-- Insert favorite artists for Classic Rock
INSERT OR IGNORE INTO favorite_artists (genre_id, artist_name, display_order) VALUES
    ('genre_rock', 'Deep Purple', 1),
    ('genre_rock', 'AC/DC', 2),
    ('genre_rock', 'Queen', 3),
    ('genre_rock', 'The Rolling Stones', 4),
    ('genre_rock', 'Pink Floyd', 5);

-- Insert favorite artists for Other
INSERT OR IGNORE INTO favorite_artists (genre_id, artist_name, display_order) VALUES
    ('genre_other', 'Miles Davis (Jazz)', 1),
    ('genre_other', 'Daft Punk (Electronic)', 2),
    ('genre_other', 'Simon & Garfunkel (Folk)', 3);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
