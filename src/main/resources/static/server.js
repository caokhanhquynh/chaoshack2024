const express = require('express');
const fs = require('fs');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Successful response.');
});

app.get('/add', (req, res) => {
    res.send("hi")
})


app.post('/add', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        let jsonData = [];

        if (!err) {
            try {
                // Parse the data and ensure it's an array
                const parsedData = JSON.parse(data.toString());
                if (Array.isArray(parsedData)) {
                    jsonData = parsedData;
                } else {
                    console.log('Existing data is not an array, initializing to an empty array.');
                }
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                // If there's an error parsing the file, proceed with an empty array
            }
        } else if (err.code !== 'ENOENT') {
            // If the error is not a "file not found" error, log it and return
            console.error('Error reading the file:', err);
            return res.status(500).send('Failed to read the file.');
        }

        // Add the new data to the array
        jsonData.push(req.body);

        // Write the updated data back to the file
        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing to file:', writeErr);
                return res.status(500).send('Failed to write to file.');
            }
            res.send('Data added to file successfully.');
        });
    });
});

app.get('/view', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).send('Failed to read the file.');
        }

        // Assuming the data in data.json is in JSON format
        // Convert the buffer to a string and then to a JSON object
        const jsonData = JSON.parse(data.toString());
        res.json(jsonData);
    });
});



app.listen(3000, () => console.log('App is listening on port 3000.'));
