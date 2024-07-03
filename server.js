const express = require('express');
const fileUpload = require('express-fileupload');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(fileUpload());
app.use(express.static('public'));

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let wordFile = req.files.wordFile;
    let filePath = path.join(__dirname, 'uploads', wordFile.name);

    wordFile.mv(filePath, async err => {
        if (err) return res.status(500).send(err);

        try {
            let result = await mammoth.extractRawText({ path: filePath });
            fs.unlinkSync(filePath);  // Delete the file after reading its content
            let questions = result.value.split('\n').filter(text => text.trim().length > 0);
            res.send({ questions: questions });
        } catch (err) {
            fs.unlinkSync(filePath);  // Ensure file is deleted even if an error occurs
            res.status(500).send('Error processing the document.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
