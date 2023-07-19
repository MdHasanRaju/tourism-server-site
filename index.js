const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const app = express();
const cors = require('cors');
require("dotenv").config();

const port = process.env.PORT || 5000;

// user: tourUsers
// password: UKT6mAIApuZmdpo2

// middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6cjag.mongodb.net/?retryWrites=true&w=majority`

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6cjag.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db("tour_package_shop");
    const productCollection = database.collection("products");
    const myCollection = database.collection("my_order");
    
    // GET ALL PRODUCTS API
    app.get('/products', async(req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    })

    // Add New Service
    app.post('/addNewService', async(req, res) => {
      const query = req.body;
      const result = await productCollection.insertOne(query);
      res.send(result)
    })

    // Add Order place
    app.post('/addUserOrder', async(req, res) => {
      const order = req.body;
      console.log(order)
      const result = await myCollection.insertOne(order);
      console.log(result)
      res.send(result)
    })
    
    app.get("/my_order", async (req, res) => {
      const cursor = myCollection.find({});
      const myOrders = await cursor.toArray();
      res.send(myOrders);
    });
    
     app.get("/ownOrder", async(req, res) => {
       await myCollection.find({ email: req.query.email }).toArray((err, items) => {
           console.log("items", items);
           res.send(items);
         });
     });

    //  Deleted From My order Dashboard
     app.delete("/deleteService/:id", async(req, res) =>{
        const id = req.params.id;
        const deletedItem = {_id:new ObjectId(id)}
        const result = await myCollection.deleteOne(deletedItem);
        console.log(result);
        res.send(result)

     });
    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tourism server is running");
});

app.listen(port, () => {
  console.log("Server running at port", port);
});

