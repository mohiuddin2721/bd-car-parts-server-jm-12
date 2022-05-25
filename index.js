const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.riued.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const partsCollection = client.db("car_parts").collection("parts");
        const ordersCollection = client.db("car_parts").collection("orders");
        const reviewsCollection = client.db("car_parts").collection("reviews");

        // get parts
        app.get('/parts', async (req, res) => {
            const query = {};
            const cursor = partsCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts);
        });

        // get parts by id
        app.get('/parts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await partsCollection.findOne(query);
            res.send(result);
        });

        // Post Orders
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await ordersCollection.insertOne(orders);
            res.send(result);
        });

        // Get my orders by email
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const myOrders = await ordersCollection.find(query).toArray();
            res.send(myOrders);
        });

        // get reviews
        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // post review
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        });

    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('BD Car Parts running....')
})

app.listen(port, () => {
    console.log(`BD Car Parts App listening on port ${port}`)
})