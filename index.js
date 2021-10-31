const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


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

        //GET API for single order
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await allOrders.findOne(query)
            res.send(order);
        })

        //POST API orders
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await allOrders.insertOne(newOrder)
            res.json(result);
        })

        //UPDATE API
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            console.log(req.body)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status
                },
            };

            const result = await allOrders.updateOne(filter, updateDoc, options)
            console.log('updating order status', result)

            res.json(result);
        })

        //Delete API orders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await allOrders.deleteOne(query);

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