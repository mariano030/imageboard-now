DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://film-grab.com/wp-content/uploads/photo-gallery/08%20(328).jpg',
    'kubrick',
    'Welcome to Past and the Future!',
    'This photo brings back so many great memories.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://film-grab.com/2014/08/01/dr-strangelove-or-how-i-learned-to-stop-worrying-and-love-the-bomb/#bwg800/49305',
    'kubrick',
    'Is this a drill? Oh so you are saying this is not a drill?',
    'We can''t go on together with suspicious minds.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://film-grab.com/wp-content/uploads/photo-gallery/37%20(332).jpg',
    'kubrick',
    'Why didnt you tell the world?!',
    'The whole purpose of the doomsday machine is lost, if you dont tell the world!'
);


-- https://film-grab.com/wp-content/uploads/photo-gallery/08%20(328).jpg
--?bwg=1547211639
-- https://film-grab.com/2014/08/01/dr-strangelove-or-how-i-learned-to-stop-worrying-and-love-the-bomb/#bwg800/49305
-- https://film-grab.com/wp-content/uploads/photo-gallery/37%20(332).jpg
--?bwg=1547211639


-- INSERT INTO images (url, username, title, description) VALUES (
--     'https://s3.amazonaws.com/spicedling/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg',
--     'funkychicken',
--     'Welcome to Spiced and the Future!',
--     'This photo brings back so many great memories.'
-- );

-- INSERT INTO images (url, username, title, description) VALUES (
--     'https://s3.amazonaws.com/spicedling/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg',
--     'discoduck',
--     'Elvis',
--     'We can''t go on together with suspicious minds.'
-- );

-- INSERT INTO images (url, username, title, description) VALUES (
--     'https://s3.amazonaws.com/spicedling/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg',
--     'discoduck',
--     'To be or not to be',
--     'That is the question.'
-- );