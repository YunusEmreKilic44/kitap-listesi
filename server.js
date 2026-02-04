const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const PORT = 3000;

const app = express();

app.use(express.json());

const filePath = "books.json";

const readData = () => {
  const jsonData = fs.readFileSync(filePath);
  return JSON.parse(jsonData);
};

const writeData = (books) => {
  fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
};

app.get("/books", (req, res) => {
  const data = readData();
  res.status(200).json(data);
});

app.get("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const books = readData();
  const book = books.find((book) => book.id === id);

  if (!book) {
    return res.status(404).json({ message: "Kitap bulunamadi" });
  }
  res.status(200).json(book);
});

app.post("/books", (req, res) => {
  let books = readData();
  let newBook = req.body;

  let newBooks = [...books, { id: books.length + 1, ...newBook }];
  writeData(newBooks);

  res.status(201).json(newBooks);
});

app.put("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const bodyValues = req.body;
  let books = readData();
  console.log(req.body);

  const findBook = books.find((book) => book.id === id);

  if (findBook) {
    books = books.map((book) =>
      book.id === id ? { ...book, ...bodyValues } : book,
    );
    writeData(books);
    res.status(200).json(books);
  } else {
    res.status(404).json({ message: "Kitap bulunamadi" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
