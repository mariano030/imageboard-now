DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    text VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_id INT NOT NULL REFERENCES images(id)
);

INSERT INTO comments (username, text, image_id)
VALUES ('luca', 'i like this image, but i like window cleaning better', 4)

