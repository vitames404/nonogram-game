const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

const port = 3000;

// Route

app.get('/', (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


