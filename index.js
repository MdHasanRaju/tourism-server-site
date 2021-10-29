const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
require("dotenv").config();

const port = process.env.PORT || 5000;

// user: tourUsers
// password: UKT6mAIApuZmdpo2

// middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6cjag.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db("tour_package_shop");
    const productCollection = database.collection("products");
    
    // GET ALL PRODUCTS API
    app.get('/products', async(req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    })

    
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

