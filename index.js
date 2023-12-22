const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5144;
app.use(cors());
app.use(express.json());
require('dotenv').config();

app.get("/", (req, res) => {
	res.send("simple crud is running");
});


const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.uotm6ic.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});
async function run() {
	try {
		
        
    const database = client.db("TaskCraftHub");
    const usersCollection = database.collection("users");
    const TaskCollection = database.collection("Tasks");

    app.post("/users" , async (req, res) => {
        const user = req.body;
        // console.log(user.email);

        const query = {email : user.email }
        const userEmail = await usersCollection.findOne(query)
        console.log("useremail" ,userEmail);

        if(!userEmail){
            const result = await usersCollection.insertOne(user);
            res.send(result);
        }
        else{
            res.send({Message : "user already exist"})
        }
      });


      app.post("/tasks" , async (req , res) => {
        const data = req.body
        console.log(data);  
        const resul = await TaskCollection.insertOne(data)
        res.send(resul)
    })

       
    app.get("/tasks/:email"  , async(req , res) => {

        const email = req.params.email

        const query = {email : email}

        const result =  await TaskCollection.find(query).toArray()
        
        res.send(result);


        
    })

    app.delete("/tasks/:id", async (req , res) => {

        const id = req.params.id
        const filter = {_id : new ObjectId(id)}

        const result =await TaskCollection.deleteOne(filter)
        res.send(result)
    })



		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.listen(port, () => {
	console.log(`simple crud is running on ${port}`);
});

// start t
