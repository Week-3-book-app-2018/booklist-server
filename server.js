'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());

app.get('/', (req, res) => res.send('Testing 1, 2, 3'));


//API Endpoints:
//tell it to get everything except the description
//use client.query
app.get('/api/v1/books', (req, res) => {
  client.query(`SELECT book_id, title, author, isbn, image_url FROM books;`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

//Allie code is req.params.id
app.get('/api/v1/books/:id', (req, res) => {
  client.query(`SELECT * FROM books WHERE book_id=${req.params.id};`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.post('/api/v1/books', bodyParser, (req, res) => {
  let {author, title, isbn, image_url, description} = req.body;
  client.query(
    'INSERT INTO books(author, title, isbn, image_url, description) VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
    [author, title, isbn, image_url, description],
  )
  .then(results => res.sendStatus(201))
  .catch(console.error);
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

