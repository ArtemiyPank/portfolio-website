const Database = require('better-sqlite3');
const path = require('path');

function seedData(db) {
  console.log('🌱 Seeding initial data...');

  try {
    // Insert personal info
    const personalStmt = db.prepare(`
        INSERT OR IGNORE INTO personal_info (
            id, full_name, tagline, email, telegram,
            github_url, linkedin_url, instagram_url, location
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    personalStmt.run(
        'main',
        'Artemiy Pankratov',
        'Cryptography Specialist & Security-Focused Developer',
        'ad.pankrat@gmail.com',
        '@artemiypank',
        'https://github.com/ArtemiyPank',
        'https://www.linkedin.com/in/artemiy-pankratov-251059326/',
        'https://www.instagram.com/pankratov_artemiy/',
        'Tel Aviv, Israel'
    );
    console.log('✅ Personal info inserted');

    // Insert about content
    const aboutBio = `I'm Artemiy Pankratov, a software developer specializing in cryptography, data protection, and secure systems design. I build applications focused on security - from deterministic password generators using SHA3-512 to neural network-based cryptographic protocols with homomorphic encryption.

My current focus is SSNS (Secure Split-Neural Synchronization) - a post-quantum cryptographic protocol combining homomorphic encryption (BFV/CKKS) and neural network synchronization for secure key generation between IoT devices and servers.

I have hands-on experience developing custom authentication systems from scratch, including token-based authentication with JWT for enterprise applications serving 400+ active users with real-time secure data transmission.

Based in Tel Aviv, Israel, I combine mathematical rigor with engineering pragmatism to build secure systems for the modern world.`;

    const aboutStmt = db.prepare(`
        INSERT OR IGNORE INTO about_content (id, page_title, page_subtitle, biography)
        VALUES (?, ?, ?, ?)
    `);

    aboutStmt.run(
        'main',
        'About Me',
        null,
        aboutBio
    );
    console.log('✅ About content inserted');

    // Insert tech categories
    const categories = [
        ['cat_prog_lang', 'Programming Languages', 'Code', 1],
        ['cat_crypto', 'Cryptography & Security', 'Shield', 2],
        ['cat_frontend', 'Frontend', 'Globe', 3],
        ['cat_backend', 'Backend', 'Server', 4],
        ['cat_devops', 'DevOps & Tools', 'Wrench', 5],
        ['cat_database', 'Database', 'Database', 6],
        ['cat_languages', 'Languages', 'Languages', 7]
    ];

    const categoryStmt = db.prepare(`
        INSERT OR IGNORE INTO tech_categories (id, name, icon_name, display_order)
        VALUES (?, ?, ?, ?)
    `);

    for (const cat of categories) {
        categoryStmt.run(...cat);
    }
    console.log('✅ Tech categories inserted');

    // Insert tech skills
    const skills = [
        // Programming Languages
        ['cat_prog_lang', 'C++', 1],
        ['cat_prog_lang', 'C', 2],
        ['cat_prog_lang', 'Assembly x86', 3],
        ['cat_prog_lang', 'JavaScript', 4],
        ['cat_prog_lang', 'TypeScript', 5],
        ['cat_prog_lang', 'Python', 6],
        ['cat_prog_lang', 'C#', 7],
        ['cat_prog_lang', 'Java', 8],
        ['cat_prog_lang', 'SQL', 9],
        // Cryptography & Security
        ['cat_crypto', 'Homomorphic Encryption (BFV/CKKS)', 1],
        ['cat_crypto', 'SHA3-512', 2],
        ['cat_crypto', 'Crypto++', 3],
        ['cat_crypto', 'Neural Network Cryptography', 4],
        // Frontend
        ['cat_frontend', 'React', 1],
        ['cat_frontend', 'Next.js', 2],
        ['cat_frontend', 'Tailwind CSS', 3],
        ['cat_frontend', 'Framer Motion', 4],
        // Backend
        ['cat_backend', 'Node.js', 1],
        ['cat_backend', 'ASP.NET', 2],
        ['cat_backend', 'REST APIs', 3],
        ['cat_backend', 'Token Authentication', 4],
        ['cat_backend', 'JWT', 5],
        // DevOps & Tools
        ['cat_devops', 'Git', 1],
        ['cat_devops', 'Docker', 2],
        ['cat_devops', 'Redis', 3],
        ['cat_devops', 'Caddy', 4],
        ['cat_devops', 'CMake', 5],
        ['cat_devops', 'FFmpeg', 6],
        // Database
        ['cat_database', 'SQLite', 1],
        ['cat_database', 'Firebase', 2],
        ['cat_database', 'MSSQL', 3],
        // Languages
        ['cat_languages', 'Russian - native', 1],
        ['cat_languages', 'English - B2', 2],
        ['cat_languages', 'Hebrew - A2', 3],
        ['cat_languages', 'German - A1', 4]
    ];

    const skillStmt = db.prepare(`
        INSERT OR IGNORE INTO tech_skills (category_id, skill_name, display_order)
        VALUES (?, ?, ?)
    `);

    for (const skill of skills) {
        skillStmt.run(...skill);
    }
    console.log('✅ Tech skills inserted');

    // Insert contact content
    const contactStmt = db.prepare(`
        INSERT OR IGNORE INTO contact_content (
            id, page_title, page_subtitle, form_description,
            follow_me_description, footer_text
        ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    contactStmt.run(
        'main',
        'Get In Touch',
        'Have a project in mind or just want to chat? I\'d love to hear from you!',
        'Fill out the form below and I\'ll get back to you as soon as possible.',
        'Connect with me on social media',
        'Got a neat idea, a puzzling bug, or just want to geek out over tech? Shoot me a message!'
    );
    console.log('✅ Contact content inserted');

    // Insert education content
    const educationIntro = `I am a quick and enthusiastic learner, driven by an insatiable curiosity and a deep love for mathematics, programming, data protection, encryption, and physics. I thrive in dynamic environments, eagerly embracing new challenges and turning complex problems into elegant solutions.`;

    const educationContentStmt = db.prepare(`
        INSERT OR IGNORE INTO education_content (id, intro_text)
        VALUES (?, ?)
    `);

    educationContentStmt.run('main', educationIntro);
    console.log('✅ Education content inserted');

    // Insert education entries
    const educationEntryStmt = db.prepare(`
        INSERT OR IGNORE INTO education_entries (
            id, institution, credentials, period, location, website_url, display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    educationEntryStmt.run(
        'edu_atid_raziel',
        'Atid Raziel High School (Israeli)',
        'Math 5, Physics 5, Computer Science 10',
        'Graduated 2025',
        'Israel',
        null,
        1
    );

    educationEntryStmt.run(
        'edu_codeguru',
        'CodeGuru Xtreme Competition',
        'National Programming & Cyber Competition',
        '2025',
        'Israel',
        'https://codeguru.co.il/Xtreme/',
        2
    );
    console.log('✅ Education entries inserted');

    // Insert education highlights
    const highlights = [
        ['edu_atid_raziel', 'Graduated with top honors in core STEM subjects', 1],
        ['edu_atid_raziel', 'Served as peer mentor in mathematics and computer science', 2],
        ['edu_atid_raziel', 'Led after-school coding workshops for fellow students', 3],
        ['edu_atid_raziel', 'Developed the dormitory kiosk management website', 4],
        ['edu_atid_raziel', 'Created a cross-platform mobile app for dorm orders', 5],
        ['edu_codeguru', '🏆 3rd place in the national stage out of 150+ teams from across Israel', 1],
        ['edu_codeguru', '8th place in the final competition', 2],
        ['edu_codeguru', 'CodeGuru Xtreme is a prestigious annual x86 assembly programming competition organized by the Weizmann Institute of Science, where teams write low-level code to program battle strategies in a Survivor-style virtual arena using the corewars8086 engine', 3]
    ];

    const highlightStmt = db.prepare(`
        INSERT OR IGNORE INTO education_highlights (education_id, highlight_text, display_order)
        VALUES (?, ?, ?)
    `);

    for (const highlight of highlights) {
        highlightStmt.run(...highlight);
    }
    console.log('✅ Education highlights inserted');

    // Insert music content
    const musicStmt = db.prepare(`
        INSERT OR IGNORE INTO music_content (id) VALUES (?)
    `);
    musicStmt.run('main');
    console.log('✅ Music content inserted');

    // Insert musical journey
    const journeys = [
        [
            'journey_violin',
            'Violin',
            'Music',
            'Since age 6',
            'Advanced',
            'Started violin at the A. A. Alyabyev Music School at age 6; after moving to Israel, joined the Atid Raziel youth orchestra, which repeatedly competed in and won international competitions.',
            1
        ],
        [
            'journey_piano',
            'Piano',
            'Music',
            '7 grades completed',
            'Advanced',
            'Studied piano in parallel at A. A. Alyabyev Music School, completing all 7 grade examinations with distinction. Accompanied ensembles and soloists during school concerts.',
            2
        ]
    ];

    const journeyStmt = db.prepare(`
        INSERT OR IGNORE INTO musical_journey (
            id, instrument, icon_name, years, level, description, display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const journey of journeys) {
        journeyStmt.run(...journey);
    }
    console.log('✅ Musical journey inserted');

    // Insert musical achievements
    const achievements = [
        ['journey_violin', 'Multiple international competition wins with Atid Raziel orchestra', 1],
        ['journey_violin', 'Featured soloist at school and community recitals', 2],
        ['journey_piano', 'Grade 7 piano diploma', 1],
        ['journey_piano', 'Accompanied school choir and chamber performances', 2],
        ['journey_piano', 'Performed solo recital pieces at local festivals', 3]
    ];

    const achievementStmt = db.prepare(`
        INSERT OR IGNORE INTO musical_achievements (journey_id, achievement_text, display_order)
        VALUES (?, ?, ?)
    `);

    for (const achievement of achievements) {
        achievementStmt.run(...achievement);
    }
    console.log('✅ Musical achievements inserted');

    // Insert music genres
    const genres = [
        ['genre_classical', 'Classical', 'Music2', 1],
        ['genre_metal', 'Heavy Rock / Metal', 'Zap', 2],
        ['genre_rock', 'Classic Rock', 'Radio', 3],
        ['genre_other', 'Other', 'Music4', 4]
    ];

    const genreStmt = db.prepare(`
        INSERT OR IGNORE INTO music_genres (id, genre_name, icon_name, display_order)
        VALUES (?, ?, ?, ?)
    `);

    for (const genre of genres) {
        genreStmt.run(...genre);
    }
    console.log('✅ Music genres inserted');

    // Insert favorite artists
    const artists = [
        // Classical
        ['genre_classical', 'Vivaldi', 1],
        ['genre_classical', 'Grieg', 2],
        ['genre_classical', 'Rachmaninoff', 3],
        ['genre_classical', 'Bach', 4],
        ['genre_classical', 'Mozart', 5],
        // Heavy Rock / Metal
        ['genre_metal', 'Metallica', 1],
        ['genre_metal', 'Rammstein', 2],
        ['genre_metal', 'Led Zeppelin', 3],
        ['genre_metal', 'Sabaton', 4],
        ['genre_metal', 'Iron Maiden', 5],
        // Classic Rock
        ['genre_rock', 'Deep Purple', 1],
        ['genre_rock', 'AC/DC', 2],
        ['genre_rock', 'Queen', 3],
        ['genre_rock', 'The Rolling Stones', 4],
        ['genre_rock', 'Pink Floyd', 5],
        // Other
        ['genre_other', 'Miles Davis (Jazz)', 1],
        ['genre_other', 'Daft Punk (Electronic)', 2],
        ['genre_other', 'Simon & Garfunkel (Folk)', 3]
    ];

    const artistStmt = db.prepare(`
        INSERT OR IGNORE INTO favorite_artists (genre_id, artist_name, display_order)
        VALUES (?, ?, ?)
    `);

    for (const artist of artists) {
        artistStmt.run(...artist);
    }
    console.log('✅ Favorite artists inserted');

    console.log('🎉 Initial data seeding complete!\n');
    return true;
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

// If run directly (not required as module)
if (require.main === module) {
  const dbPath = path.join(process.cwd(), 'data', 'portfolio.db');
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');

  try {
    seedData(db);
  } catch (error) {
    process.exit(1);
  } finally {
    db.close();
  }
}

module.exports = { seedData };
