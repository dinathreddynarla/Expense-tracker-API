const express = require("express")
const fs = require("fs")
const bodyParser = require('body-parser');
const cors = require("cors")
const app = express()
const PORT = 3333;

app.use(bodyParser.json());
app.use(cors())
//Utility Function
const JSON_FILE = './data.json';

// Reads JSON data from the file
const readJson = () => {
    const rawData = fs.readFileSync(JSON_FILE);
    return JSON.parse(rawData);
};

// Writes data to the JSON file
const writeJson = (data) => {
    fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 4));
};

//Read Data
app.get('/data', (req, res) => {
    const jsonData = readJson();
    res.json(jsonData);
});

//Write Data
app.post('/data', (req, res) => {
    const newData = req.body;
    const jsonData = readJson();

    if (!newData || Object.keys(newData).length === 0) {
        return res.status(400).json({ error: 'No data provided' });
    }

    jsonData.data.push(newData);
    writeJson(jsonData);

    res.status(201).json({ message: 'Data added successfully', data: newData });
});

//Delete Data
app.delete('/data/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    const jsonData = readJson();

    if (index < 0 || index >= jsonData.data.length) {
        return res.status(404).json({ error: 'Index out of range' });
    }

    const removedData = jsonData.data.splice(index, 1);
    writeJson(jsonData);

    res.json({ message: 'Data removed successfully', data: removedData });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
