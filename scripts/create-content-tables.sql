-- Create only tables without initial data to avoid SQL syntax errors
-- Initial data will be added later through admin panel

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

CREATE TABLE IF NOT EXISTS about_content (
    id TEXT PRIMARY KEY DEFAULT 'main',
    page_title TEXT NOT NULL DEFAULT 'About Me',
    page_subtitle TEXT,
    biography TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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
