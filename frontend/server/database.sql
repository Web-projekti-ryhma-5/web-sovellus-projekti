-- Create the user table (renamed to users to avoid reserved keyword conflict)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create the items table
CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_info TEXT
);

-- Create the order_items table
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id)
);

-- Create the movies table
CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    movie_name VARCHAR(255) NOT NULL,
    movie_info TEXT
);

-- Create the movie_info table with a foreign key to the movie table
CREATE TABLE movie_info (
    movie_info_id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    movie_info_category VARCHAR(255),
    movie_info_language VARCHAR(255),
    movie_info_actors TEXT,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

-- Add some example data
-- Insert data into users
INSERT INTO users (user_email, user_password) VALUES ('user1@example.com', 'password123');
INSERT INTO users (user_email, user_password) VALUES ('user2@example.com', 'password456');

-- Insert data into orders
INSERT INTO orders (user_id) VALUES (1);
INSERT INTO orders (user_id) VALUES (2);

-- Insert data into items
INSERT INTO items (item_name, item_info) VALUES ('Item 1', 'Info about Item 1');
INSERT INTO items (item_name, item_info) VALUES ('Item 2', 'Info about Item 2');

-- Insert data into order_items
INSERT INTO order_items (order_id, item_id) VALUES (1, 1);
INSERT INTO order_items (order_id, item_id) VALUES (1, 2);
INSERT INTO order_items (order_id, item_id) VALUES (2, 1);

-- Insert data into movies
INSERT INTO movies (movie_name, movie_info) VALUES ('Movie 1', 'Description of Movie 1');
INSERT INTO movies (movie_name, movie_info) VALUES ('Movie 2', 'Description of Movie 2');

-- Insert data into movie_info (linking with existing movie_id values)
INSERT INTO movie_info (movie_id, movie_info_category, movie_info_language, movie_info_actors)
VALUES (1, 'Action', 'English', 'Actor 1, Actor 2');
INSERT INTO movie_info (movie_id, movie_info_category, movie_info_language, movie_info_actors)
VALUES (2, 'Drama', 'French', 'Actor 3, Actor 4');
