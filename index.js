const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l9mlnno.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const userCollection = client.db("mTaskDB").collection('users')
        const taskCollection = client.db("mTaskDB").collection('tasks')

        app.get("/users", async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })
        app.post("/users", async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user)
            res.send(result);
        })
        app.get("/tasks", async (req, res) => {
            const result = await taskCollection.find().toArray();
            // console.log(result);
            res.send(result);
        })
        app.get("/tasks/todo", async (req, res) => {
            // const status = req.params.todo;
            const query = { status: 'todo' }
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        })
        app.get("/tasks/moderate", async (req, res) => {
            // const status = req.params.moderate;
            const query = { status: 'moderate' }
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        })
        app.get("/tasks/completed", async (req, res) => {
            // const status = req.params.completed;
            const query = { status: 'completed' }
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        })

        app.post("/tasks", async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("mTask server is running")
})

app.listen(port, () => {
    console.log(`Server is runnig on port ${port}`);
})