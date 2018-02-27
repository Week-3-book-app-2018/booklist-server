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


//tell it to get everything except the description
//use client.query
app.get('/api/v1/books', (req, res) => {
  client.query(`SELECT book_id, title, author, image_url FROM books;`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});


app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

