const port = process.env.PORT || 5000;
const express = require('express');
const cors = require('cors')
const app = express();


// middlewares
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Bikers World Server is running');
});

app.listen(port, () => {
    console.log('Listening to port', port)
})