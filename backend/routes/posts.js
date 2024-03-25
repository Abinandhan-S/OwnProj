const express = require('express')
const PostMongooseModel = require('../models/post')
const multer = require('multer')

const router = express.Router()

const MIME_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpg',
    'image/jpg':'jpg'
}

const storage= multer.diskStorage({
    destination:(req, file, callback)=>{
        const isValid = MIME_TYPE_MAP[file.mimetype]
        let error = new Error("Invalid MimneType!")
        if(isValid){
            error=null
        }
        callback(error,'backend/images')
    },
    filename:(req, file, callback)=>{
        const name= file.originalname.toLowerCase().split(' ').join('-')
        const ext= MIME_TYPE_MAP[file.mimetype]
        callback(null, name+'-'+Date.now()+'.'+ext)
    }
})

    // This middleware is using for store the data to mongoDB
    router.post('',multer({storage:storage}).single("image"),(req, res, next)=>{
        const url = req.protocol+"://"+req.get('host')
        const reqBodyPost=new PostMongooseModel({
            
            title:req.body.title,
            content:req.body.content,
            imagePath: url+"/images/"+req.file.filename
        })

        // .save() using to store data in database
        reqBodyPost.save()
        .then(createdPost=>{
            res.status(201).json({
                message:"Post Stored successfully into the Server",
                // createdPostId:createdPost._id
                postOfData:{
                    ...createdPost,
                    id:createdPost._id,
                    // title:createdPost.title,
                    // content:createdPost.content,
                    // imagePath:createdPost.imagePath
                }
            })
        })
        console.log(reqBodyPost);
        
    })



    // This middleware is using for Edit the data in mongoDB
    router.put('/:id',(req, res, next)=>{

        const postEditData= new PostMongooseModel({
            _id:req.body.id,
            title:req.body.title,
            content:req.body.content
        })
    
        PostMongooseModel.updateOne(
            {_id:req.params.id}, 
            postEditData
        ).then(result=>{
            //  console.log(result);
            res.status(200).json(
                {
                message:'Updated Successfully!'
                }
            )
        })
    })

    
    // This middleware is using for Fetching the data for Edit in mongoDB
    router.get('/:id',(req, res, next)=>{
        
        PostMongooseModel.findById(req.params.id)
        .then(post=>{
            if(post){
                res.status(200).json(post)
            }
            else{
                res.status(404).json({
                    message:"Post not found!"
                })
            }
        })
    })

    // This middleware is using for fetching data from mongoDB 
    router.get('',(req, res, next)=>{

        PostMongooseModel.find().then(
            documents=>{
                res.status(200).json({
                    message:'Post Fetched successfully!',
                    posts:documents
                })
            }
        )
        console.log("Server Got the Request! Server Loaded!");
    
    })

    // This middleware is using for delete data in mongoDB 
    router.delete('/:id',(req, res, next)=>{
        
        PostMongooseModel.deleteOne(
            {_id: req.params.id}
        ).then(result=>{
            console.log(result);
            res.status(200).json(
                {
                message:"Post deleted Successfully!"
                }
            )
        })    
    })

module.exports=router

