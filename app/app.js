const express = require('express');
const mysql = require('mysql');
const app = express();

const connection = mysql.CreateConnection({//mysql接続の初期化
  host: 'localhost',
  user: '',　//dbのuser
  password: '',//dbのpass
  database: ''//database
})

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.get('/todo', (req, res) => {
  connection.query(
    'SELECT * FROM items',
    (error, results) => {
      res.render('todo.ejs',{items:results});
    }
  );
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.listen(3000);
