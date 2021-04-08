const express = require('express')
const app = express()
const cors=require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectID;
require('dotenv').config()
const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Welcome to Gadget Mart')
})


//
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oagdq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("gadgetMart").collection("products");
  const orderCollection = client.db("gadgetMart").collection("orders");
  

  //addProucts
  app.post('/addProduct',(req,res)=>{
    const newProduct=req.body
    productCollection.insertOne(newProduct)
    .then(result=>{
        res.send(result.insertedCount>0)
    })

    })
    //getProducts
    app.get('/getProducts',(req,res)=>{
        productCollection.find()
        .toArray((error,items)=>{
            res.send(items)
    })
    //loadSIngleProduct
    app.get('/singleProduct/:id',(req,res)=>{
        productCollection.find({_id: ObjectId(req.params.id)})
        .toArray((error,documents)=>{
            res.send(documents)
        })
    })
    //DeleteItem
    app.delete('/delete/:id',(req,res)=>{
        productCollection.findOneAndDelete({_id: ObjectId(req.params.id)})
        .then((error,result)=>{
            console.log(result)
        })
    })

    //postOrderData
    app.post('/newOrder',(req,res)=>{
        const newOrderInfo=req.body
        orderCollection.insertOne(newOrderInfo)
        .then(result=>{
            res.send(result.insertedCount>0)
        })
    })

    //getOrderData
    app.get('/orderProduct',(req,res)=>{
        orderCollection.find({email: req.query.email})
        .toArray((error,result)=>{
            res.send(result)
        })
    })
    

})
  


});




app.listen(port)