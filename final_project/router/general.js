let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const express = require('express');
let books = require("./booksdb.js");

const public_users = express.Router();

// Get all books
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({ message: "Book not found" });
});
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const result = Object.values(books).filter(
    book => book.author.toLowerCase() === author.toLowerCase()
  );

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({ message: "Author not found" });
});
// Get books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const result = Object.values(books).filter(
    book => book.title.toLowerCase() === title.toLowerCase()
  );

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({ message: "Book not found" });
});
// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});
// Register a new user
public_users.post('/register', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({ username: username, password: password });

  return res.status(200).json({
    message: "User successfully registered"
  });
});
module.exports.general = public_users;