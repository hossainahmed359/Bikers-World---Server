const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();


// middlewares
app.use(cors());
app.use(express.json());


// Testing server
app.get('/', (req, res) => {
    res.send('Bikers World Server is running');
});

app.listen(port, () => {
    console.log('Listening to port', port)
});

// *********************** Mongodb ***********************

// Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yhntb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// CRUD function
async function run() {
    try {
        await client.connect();

        // Get database
        const database = client.db('bikersDB');
        const productsCollection = database.collection('products');

        // get all products || GET
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        });

    }
    catch {
        //
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);