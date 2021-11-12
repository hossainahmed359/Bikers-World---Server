const ObjectId = require('mongodb').ObjectId;
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
        const ordersCollection = database.collection('orders');
        const ratingsCollection = database.collection('ratings');
        const usersCollection = database.collection('users');


        // get all products || GET
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        });


        // get signle product || GET
        app.get('/signleProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.json(product);
        });


        // Place Order || POST
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        });


        // Find Orders with email || GET
        app.get('/findOrder/:userEmail', async (req, res) => {
            const userEmail = req.params.userEmail;
            const query = { email: userEmail };
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray()
            res.json(orders);
        });


        // Delete Order on request || DELETE
        app.delete('/deleteOrder/:orderId', async (req, res) => {
            const orderId = req.params.orderId;
            const query = { _id: ObjectId(orderId) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        });


        // Add User Rating || POST
        app.post('/ratings', async (req, res) => {
            const userRating = req.body;
            const result = await ratingsCollection.insertOne(userRating);
            res.json(result);
        });


        // Get Ratingns || GET
        app.get('/ratings', async (req, res) => {
            const query = {};
            const cursor = ratingsCollection.find(query);
            const ratings = await cursor.toArray();
            res.json(ratings);
        });


        // Create User after registration || POST
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });


        // Create User after google sign in || PUT
        app.put('/user', async (req, res) => {
            const user = req.body;
            console.log(user)
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
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