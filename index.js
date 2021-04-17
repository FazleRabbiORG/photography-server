const express = require('express')
require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser')
const port = 5000


const app = express()
app.use(cors())
app.use(bodyParser.json())

console.log('npm started')
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson')
const uri = `mongodb+srv://${process.env.USER_PASS}:${process.env.USER_PASS}@cluster0.x4mku.mongodb.net/logoBakery?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const orderCollection = client.db("logoBakery").collection("order");
  const reviewCollection = client.db("logoBakery").collection("review");
  const serviceCollection = client.db("logoBakery").collection("service");
  const adminCollection = client.db("logoBakery").collection("admin");
  console.log('connection succesfully done')

    app.post('/newOrder',(req,res)=>{ 
        orderCollection.insertOne(req.body)
        .then((result)=>{
          res.send(result.insertedCount>0)
          console.log(result)})
    })
    app.post('/addService',(req,res)=>{ 
      console.log("addService")
        serviceCollection.insertOne(req.body)
        .then((result)=>{
          res.send(result.insertedCount>0)
          console.log(result)}) 
    })
    app.post('/makeAdmin',(req,res)=>{ 
      console.log("makeAdmin")
        adminCollection.insertOne(req.body)
        .then((result)=>{
          res.send(result.insertedCount>0)
          console.log(result)}) 
    })
    app.post('/addReview',(req,res)=>{ 
      reviewCollection.insertOne(req.body)
        .then((result)=>{
          res.send(result.insertedCount>0)
          console.log(result)})
    })

    app.get('/review',(req,res)=>{
      reviewCollection.find({})
      .toArray((err,documents)=>res.send(documents))
    })
    app.get('/orders',(req,res)=>{
      orderCollection.find({})
      .toArray((err,documents)=>res.send(documents))
    })
    app.get('/service',(req,res)=>{
      serviceCollection.find({})
      .toArray((err,documents)=>res.send(documents))
    })
    app.get('/delete/:id',(req,res)=>{
      console.log(req.params.id)
      serviceCollection.deleteOne({_id:ObjectId(req.params.id)})
      .then(result=>{
        console.log(result)
        res.send(result.deletedCount>0)})
    })
    app.patch('/update/:id',(req,res)=>{
      console.log(req.params.id)
      const newStatus = req.body;
      orderCollection.updateOne({_id: ObjectId(req.params.id)},{
        $set:{status:newStatus}
       
      })
      .then(result=>{
        console.log(result)
        res.send(result.modifiedCount>0)})
    })

    app.get('/admin',(req,res)=>{

      adminCollection.find({})
      .toArray((err,documents)=>res.send(documents))
    })

  // client.close();
});
 

app.get('/', (req, res) => {
    console.log("started")
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)
