const express = require('express');
const mongodb = require('mongodb');
const app = express();
const bodyParser = require('body-parser');
const mongoClient= mongodb.MongoClient;
const url = 'mongodb://locallhost:27017';
app.use(bodyParser.json());

/* Creating a Room */

app.post('/admin/create-room',async function(req,res){
    mongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true },async function(err,client){
        if(err) throw err;
        let createdb = client.db('hallbooking');
        let data = await db.collection("newroom").insertOne(req.body);
        client.close();
        res.json(data);
    })
})

/* Fetching Customer Data */

app.get('/customer-data',function(req,res){
    mongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true },function(req,res){
        if(err) throw err;
        let db = client.db('hallbooking');
        let cursor = db.collection('customer-data').find().toArray();
        cursor.then(function(data){
        res.send(data);
        client.close();
        })
    })
})

/* Fetching Room Data */

app.get('/room-data',function(req,res){
    mongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true },function(req,res){
        if(err) throw err;
        let db = client.db('hallbooking');
        let cursor = db.collection("room-data").find({ "BookedStatus":"Yes" }).toArray();
        cursor.then(function(data){
        res.send(data);
        client.close();
        })
    })
})


/* Room Booking */

app.put("/booking/:id/:customername/:date/:starttime/:endtime", function(req,res){
    mongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true },function(err,client){
        console.log(req.body);
        if(err) throw err;
        var db = client.db("hallbooking");
        let cursor = db.collection("room-data").find({
            $and: [{ roomId: parseInt(req.params.id) },{ startTime: req.params.starttime },{ endTime: req.params.endtime },{ date: req.params.date },
            ],
          }).count();
        cursor.then(function(data){
            if(data!=0){
                res.json({
                    message:"Sorry for the inconvinence. The selected room is already Booked! Try Another Room!"
                })
            }
            else
            {
                let result = db.collection("room-data").insertOne({
                    _id:mongodb.ObjectID(req.params.id),
                    customerName: req.params.name,
                    date: req.params.date,
                    startTime: req.params.starttime,
                    endTime: req.params.endtime,
                    status: "booked",
                })
            }
        })
    })
})