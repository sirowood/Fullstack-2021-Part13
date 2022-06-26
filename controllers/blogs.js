const blogsRouter = require('express').Router();
const Blog = require('../Models/Blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const blog = await Blog.create(req.body);
  res.json(blog);
});

blogsRouter.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    await blog.destroy();
    res.status(200).send('ok');
  } catch (error) {
    res.status(404).end();
  };
});

module.exports = blogsRouter;