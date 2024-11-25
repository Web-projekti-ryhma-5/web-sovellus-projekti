
CREATE TABLE IF NOT EXISTS account (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    movie_name VARCHAR(255) NOT NULL,
    info TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO account (email, user_password) VALUES ('user1@example.com', 'password123');
INSERT INTO account (email, user_password) VALUES ('user2@example.com', 'password456');

INSERT INTO movies (movie_name, info) VALUES ('Movie 1', 'Description of Movie 1');
INSERT INTO movies (movie_name, info) VALUES ('Movie 2', 'Description of Movie 2');
