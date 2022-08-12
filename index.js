const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const objectId = require("mongodb").objectId;

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri =
  "mongodb+srv://dbuser1:0Hm0KAegoxVUxbkl@cluster0.kgvtq2j.mongodb.net/?retryWrites=true&w=majority";
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

    // insert code goes here

    app.get("/user", async (req, res) => {
      const cursor = testColl.find();
      const user = await cursor.toArray();
      res.send(user);
    });

    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await testColl.insertOne(newUser);

      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const userId = req.params.id;
      console.log(userId, "userId");
      // const query = { _id: objectId(userId) };
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

// pass ;0Hm0KAegoxVUxbkl
//user:dbuser1
