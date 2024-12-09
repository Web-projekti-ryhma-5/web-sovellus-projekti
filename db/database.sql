
CREATE TABLE IF NOT EXISTS account (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Only id and movie titles are used
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    movie_name VARCHAR(255) NOT NULL,
    category VARCHAR(255) DEFAULT '',
    movie_language VARCHAR(255) DEFAULT '',
    actor VARCHAR(255) DEFAULT '',
    info TEXT DEFAULT '',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (owner_id)
    REFERENCES account(id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS group_movies (
    group_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movie FOREIGN KEY (movie_id)
    REFERENCES movies(id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,
    CONSTRAINT fk_group FOREIGN KEY (group_id)
    REFERENCES groups(id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS group_members (
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
    REFERENCES account(id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,
    CONSTRAINT fk_group FOREIGN KEY (group_id)
    REFERENCES groups(id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS join_requests (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    request_status VARCHAR(50) NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
    REFERENCES account(id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,
    CONSTRAINT fk_group FOREIGN KEY (group_id)
    REFERENCES groups(id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS reviews (
    user_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    movie_id INT NOT NULL,
    rating VARCHAR(255) NOT NULL,
    info TEXT DEFAULT '',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
    REFERENCES account(id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,
    CONSTRAINT fk_movie FOREIGN KEY (movie_id)
    REFERENCES movies(id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS revoked_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    blacklisted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO account (email, user_password) VALUES ('user1@example.com', 'password123');

INSERT INTO movies (movie_name, category, movie_language, actor, info) VALUES ('Movie 1', 'Category of Movie 1', 'Language of Movie 1', 'Actor of Movie 1', 'Description of Movie 1');
