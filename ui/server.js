const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  // Dynamically import the 'open' module and then open the URL
  import('open').then(open => open.default('http://localhost:3000'));
});
