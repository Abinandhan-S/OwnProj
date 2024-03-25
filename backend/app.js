// UserName: abinandhan445567
// Password: 2001_Abi

// MongoDB: E:\MEAN_Project\MongoDB\


// ================================================================
// //This is the first Middleware
// app.use((req, res, next)=>{
//     console.log("First Middleware Request");
//     next()
// })

// // first Middleware is sending request to second middlware, once request received second Middleware is responding to first middleware

// //This is the second Middleware
// app.use((req, res, next)=>{
//     console.log("my reponse");
//     res.send("Hi, This is my reponse");

// })
// ================================================================

// Express adds more features while building apps. 
// Node is just a Javascript environment with libraries to make it easy to write software, 
// whereas Express extends Node specifically to add middleware, routing, and much more.
const express =require('express')

// Express body-parser is an npm module used to process data sent in an HTTP request body. 
// It provides four express middleware for parsing JSON, Text, URL-encoded, and raw data sets over an HTTP request body. 
// Before the target controller receives an incoming request, these middleware routines handle it.

const bodyParser= require('body-parser')

const app = express()

const path = require('path')
 
// Mongoose is a JavaScript object-oriented programming library that creates a connection between MongoDB and the Node.js JavaScript runtime environment.
// Mongoose is a better fit for applications that demand a consistent data model, extensive data validation, and a more organized data management approach.
const mongoose=require('mongoose')

// MoongoseModel
// const PostMongooseModel = require('./models/post')


// mongoose.connect is using to connecting our MongoDb database

const postRoutes=require('./routes/posts')
mongoose
.connect(
    'mongodb+srv://abinandhan445567:2001_Abi@cluster0.m0m0yt2.mongodb.net/MyDatabase?retryWrites=true&w=majority&appName=Cluster0'
    )
.then(()=>{
    console.log("Connected to the database!");
})
.catch(()=>{
    console.log("Connection Failure!");
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use('/images',express.static(path.join('backend/images')))

app.use((req, res, next)=>{
    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
        );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
        );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE,  OPTIONS"
    );
    next()
})

// // This middleware is using for store the data to mongoDB
// app.post('/api/posts',(req, res, next)=>{
//     const reqBodyPost=new PostMongooseModel({
        
//         title:req.body.title,
//         content:req.body.content
//     })

//     // .save() using to store data in database
//     reqBodyPost.save()
//     .then(createdPost=>{
//         res.status(201).json({
//             message:"Post Stored successfully into the Server",
//             createdPostId:createdPost._id
//         })
//     })
//     console.log(reqBodyPost);
    
// })



// // This middleware is using for Edit the data in mongoDB
// app.put('/api/posts/:id',(req, res, next)=>{

//     const postEditData= new PostMongooseModel({
//          _id:req.body.id,
//          title:req.body.title,
//          content:req.body.content
//      })
 
//      PostMongooseModel.updateOne(
//         {_id:req.params.id}, 
//         postEditData
//     ).then(result=>{
//         //  console.log(result);
//          res.status(200).json(
//             {
//              message:'Updated Successfully!'
//             }
//         )
//      })
//  })
// // This middleware is using for Fetching the data for Edit in mongoDB
//  app.get('/api/posts/:id',(req, res, next)=>{
    
//     PostMongooseModel.findById(req.params.id)
//     .then(post=>{
//         if(post){
//             res.status(200).json(post)
//         }
//         else{
//             res.status(404).json({
//                 message:"Post not found!"
//             })
//         }
//     })
// }

// )

// // This middleware is using for fetching data from mongoDB 
// app.get('/api/posts',(req, res, next)=>{

//     // const posts=[
//     // {
//     //     id:'edsjhd378',
//     //     title:'Title1',
//     //     content:'This Content1 coming from the server',
//     // },
//     // {
//     //     id:'vdfvvfs354',
//     //     title:'Title2',
//     //     content:'This Content2 coming from the server',
//     // }]

//     // res.status(200).json({
//     //     message:'Stored PostMongooseModel successfully passed to the UI',
//     //     post:posts
//     // }
//     // A status code of 200 means that the request was successful and that the server was able to fulfill it. 
//     // For example, if a client sends a GET request to a server to retrieve details of a user, 
//     // the server might respond with a status code of 200 and the user's details in a JSON format.

//     // )

//     PostMongooseModel.find().then(
//         documents=>{
//             res.status(200).json({
//                 message:'Post Fetched successfully!',
//                 posts:documents
//             })
//         }
//     )
//     console.log("Server Got the Request! Server Loaded!");
   
// })


// app.delete('/api/posts/:id',(req, res, next)=>{
//     // console.log("id of the post:"+" "+req.params.id);
//     PostMongooseModel.deleteOne(
//         {_id: req.params.id}
//     ).then(result=>{
//         console.log(result);
//         res.status(200).json(
//             {
//             message:"Post deleted Successfully!"
//             }
//         )
//     })
    
// })

app.use('/api/posts',postRoutes)

module.exports=app