const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const objectId = require("mongodb").ObjectId;

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kgvtq2j.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    // database and collection code goes here
    const testColl = client.db("testExpress").collection("testuser");

    app.get("/user", async (req, res) => {
      const cursor = testColl.find();
      const user = await cursor.toArray();
      res.send(user);
    });

    app.get("/user/:id", async (req, res) => {
      const updateId = req.params.id;

      const cursor = await testColl.findOne({ _id: objectId(updateId) });
      res.send(cursor);
      console.log(cursor);
    });

    //data base total koyta data ase ta jana jabe
    app.get("/total", async (req, res) => {
      const count = await testColl.estimatedDocumentCount();

      res.send({ count });
    });

    app.post("/user", async (req, res) => {
      const newUser = req.body;

      const result = await testColl.insertOne(newUser);

      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const userId = req.params.id;

      const query = { _id: objectId(userId) };
      const result = await testColl.deleteOne(query);
      res.send(result);
    });

    app.put("/user/:id", async (req, res) => {
      const userId = req.params.id;
      const updateUser = req.body;

      const filter = { _id: objectId(userId) };

      const updateDoc = {
        $set: {
          name: updateUser?.name,
          email: updateUser?.email,
        },
      };
      const result = await testColl.updateOne(filter, updateDoc);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
// ****************************
// cursor.limit(10).toArray() = matro 10 ta item dekhabe

// ***************************

// **********  pagination code  ******************

app.get("product", async (req, res) => {
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);

  const cursor = colltection.find();
  let products;

  if (page || size) {
    products = await cursor
      .skip(page * size)
      .limit(size)
      .toArray();
  } else {
    products = await cursor.toArray();
  }
  res.send(products);
});

//this meaning of skip()
// 0--> skip : 0 get : 0-10(10)
// 1--> skip : 1*10 get : 11-20(10)
// 3--> skip : 3*10 get : 21-30(10)

// **********  pagination code  ******************
