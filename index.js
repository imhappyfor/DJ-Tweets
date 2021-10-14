const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use('/public', express.static('public/'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

// app.get('/melodies', (req, res) => {
//     res.sendFile(path.join(__dirname + '/melodyexperimenting.html'));
// })

app.listen(port, () => {
    console.log(`DJ-Tweets listening at http://localhost:${port} 😎🎸🤘`);
})
