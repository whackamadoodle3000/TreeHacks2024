const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json()); // For parsing JSON bodies

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to trigger Python script execution
app.post('/run-mlnp', (req, res) => {
  exec('python3 mlnp.py', (error, stdout, stderr) => { // Ensure correct command
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Failed to execute model script.');
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send('Model script error.');
    }
    
    try {
      const result = JSON.parse(stdout);
      res.status(200).json(result);
    } catch (parseError) {
      console.error(`Failed to parse stdout: ${stdout}`); // Log the problematic output
      res.status(500).send('Failed to parse model output. Check server logs for details.');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
