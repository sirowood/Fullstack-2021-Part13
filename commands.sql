CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs
(author, url, title)
VALUES
('Xuefeng', 'fake url', 'Learning Fullstack');

INSERT INTO blogs
(author, url, title)
VALUES
('Xuefeng', 'fake url 2', 'Happy coding');