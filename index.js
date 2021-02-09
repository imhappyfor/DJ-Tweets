const express = require('express');
const app = express();
var cors = require('cors');
var path = require('path');
app.use(cors());
const port = 3000
// app.use('/public', express.static('public/'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

// app.get('/melodies', (req, res) => {
    // res.sendFile(path.join(__dirname + '/melodyexperimenting.html'));
// })

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })
app.listen(process.env.PORT || 3000, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



