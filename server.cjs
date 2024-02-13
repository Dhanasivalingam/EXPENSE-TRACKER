const express=require('express')
const {connecttodb,getdb} = require('./dbconnection.cjs')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const { ObjectId } = require('mongodb')
app.use(bodyParser.json())
app.use(cors())

let db
connecttodb(function(error){
    if(error){
        console.log('Could not establish connection...')
    }
    else{
    app.listen(8000)
    db= getdb()
    console.log('Listening on port 8000')
    }
})
app.post('/add-entry',function(request,response){
    db.collection('expdata').insertOne(request.body).then(function(){
        response.status(201).json({
            "status" : "Entry added successfully"
        })
    }).catch(function(){
        response.status(500).json({
            "status" : "Entry not added"
        })
    })
})
app.get('/get-entries',function(request,response){
    const entries=[]
    db.collection('expdata').find()
    .forEach(entry=>entries.push(entry))
    .then(function(){
        response.status(200).json(entries)
    }).catch(function(){
        response.status(500).json({
            "Status":"Could not fetch doocument"
        })
    })
})
app.delete('/delete-entries',function(request,response){
    if(ObjectId.isValid(request.query.id)){
    db.collection('expdata').deleteOne({
        _id : new ObjectId(request.query.id)
    }).then(function(){
        response.status(200).json({
            "Status":"Deletion successfull"
        }).catch(function(){
            response.status(500).json({
                "Status":"Not deteleted"
            })
        })
    })
}
else{
    response.status(500).json({
        "Status":"Object not valid"
    })
}
})
app.patch('/update-entries/:id',function(request,response){
    if(ObjectId.isValid(request.params.id)){
    db.collection('expdata').updateOne(
        {_id:new ObjectId(request.params.id)},
        {$set:request.body}
    ).then(function(){
        response.status(200).json({
            "Status":"Update successfull"
        })
    }).catch(function(){
            response.status(500).json({
                "Status":"Update unsuccessfull"
            })
        })
}
else{
    response.status(500).json({
        "Status":"Invalid ObjectId"
    })
}
})