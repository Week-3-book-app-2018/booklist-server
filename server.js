'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

app.use(cors());

app.get('/', (req, res) => res.send('Testing 1, 2, 3'));


//API Endpoints:
//tell it to get everything except the description
//use client.query
app.get('/api/v1/books', (req, res) => {
  client.query(`SELECT book_id, title, author, image_url FROM books;`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

//Allie code is req.params.id
app.get('/api/v1/books/:id', (req, res) => {
  client.query(`SELECT * FROM books WHERE book_id=${req.params.id};`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

//Allie code is bodyParser
//take data from view and insert in to database
app.post('/api/v1/books', bodyParser, (req, res) => {
  client.query(
    //code review
    //INSERT INTO books (title, author, isbn) VALUES ($1, $2, $3)
    'INSERT INTO books(author, title, isbn, image_url, description) VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
    [res.body.author, res.body.title, res.body.isbn, res.body.image_url, res.body.description],
    function(err) {
      if(err) console.error(err);
    });
});

//Allie code
//app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

