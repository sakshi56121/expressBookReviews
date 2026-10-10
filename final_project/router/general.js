
const express = require('express');
const axios = require('axios');

const users = require('./auth_users.js').users;
const books = require('./booksdb.js');

const public_users = express.Router();

// Internal data endpoint: serves the local book database
public_users.get('/api/books', (req, res) => {
  res.status(200).json(books);
});

// Retrieve all books using Axios and async/await
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/books'
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve books'
    });
  }
});

// Retrieve book details by ISBN using Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/books'
    );

    const book = response.data[req.params.isbn];

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve book details'
    });
  }
});

// Retrieve books by author using Axios
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/books'
    );

    const author = decodeURIComponent(req.params.author)
      .trim()
      .toLowerCase();

    const result = Object.values(response.data).filter(
      book =>
        book.author &&
        book.author.trim().toLowerCase() === author
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: 'Author not found'
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve books by author'
    });
  }
});

// Retrieve books by title using Axios
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/books'
    );

    const title = decodeURIComponent(req.params.title)
      .trim()
      .toLowerCase();

    const result = Object.values(response.data).filter(
      book =>
        book.title &&
        book.title.trim().toLowerCase() === title
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve books by title'
    });
  }
});

// Retrieve reviews by ISBN
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({
      message: 'Book not found'
    });
  }

  return res.status(200).json(book.reviews);
});

// Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({
      message: 'User already exists'
    });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: 'User successfully registered'
  });
});

module.exports.general = public_users;
