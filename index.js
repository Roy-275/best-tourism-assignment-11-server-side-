const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uucxb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('tour_plans');
        const ourServices = database.collection('services');
        const allOrders = database.collection('orders');

        //GET API services
        app.get('/services', async (req, res) => {
            const cursor = ourServices.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //POST API services
        app.post('/services', async (req, res) => {
            const newService = req.body;
            const result = await ourServices.insertOne(newService)
            res.json(result);
        })

        //GET API orders
        app.get('/orders', async (req, res) => {
            const cursor = allOrders.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        //POST API orders
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await allOrders.insertOne(newOrder)
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('my server is running')
});

app.listen(port, () => {
    console.log('running on port', port)
});