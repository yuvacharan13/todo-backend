const express = require('express');
const mongodb = require('mongodb');
const app = express();
// const url = "mongodb://localhost:27017";
const url = "mongodb+srv://dbUser:dbUserPassword@todo-app.k8b7z.mongodb.net/todo-app?retryWrites=true&w=majority";
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4040;

app.use(cors());
app.use(bodyParser.json())
var ObjectId = require('mongodb').ObjectID;


// function authorize (req , res , next){
//     try{
//     if(req.headers.auth !== undefined){
//         let jwtmessage = jwt.verify(req.headers.auth , process.env.JWTTK)
//         res.locals.user = jwtmessage.user
//         next()
//     }else{
//         res.status(404).json({ message: "authorization failed" });
//     }
// }
// catch(err){
//     console.log(err)
//     res.status(404).json({ message: "authorization failed" });
// }
// }

app.get('/', async (req,res) => { 
    try {
        res.send("hai");
    }
    catch (error) {
        res.status(500).json({
            message: "Something Went Wrong"
        })
    }
})

app.get('/fetch', async (req, res) => {
    try {
        console.log("hello1");
        const client = await mongodb.connect(url, {
            useUnifiedTopology: true
        });
        const db = await client.db("test");
        const data1 = await db.collection("yuva").find().toArray();
        console.log(data1);
        await client.close();
        res.json({
            items: data1
        });
    } catch (error) {
        res.status(500).json({
            message: "Something Went Wrong"
        })
    }
})

app.post('/insert', async (req, res) => {
    console.log(req.body)
    try {
        const client = await mongodb.connect(url, {
            useUnifiedTopology: true
        });
        const db = await client.db("test");
        const data = await db.collection("yuva").insertOne(req.body);
        console.log(data);
        await client.close();
        res.json({
            message: "added"
        })
    } catch (err) {
        res.json({
            message: err.message
        })
    }
})


app.delete('/remove/:id', async (req, res) => {
    try {
        const client = await mongodb.connect(url, {
            useUnifiedTopology: true
        })
        const db = await client.db("test")
        const data = await db.collection("yuva").findOneAndDelete({
            "_id" : ObjectId(req.params.id)
        });
        await client.close();
        res.json({
            items: "removed"
        });
    } 
    catch (err) {
        res.json({
            message: err.message
        })
    }
})


app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});