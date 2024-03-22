const mongoose = require('mongoose')

// Here Schema is for the blueprint(definition of model)
const postSchema = mongoose.Schema({
   
    title:{ type:String, required: true },
    content:{ type:String, required: true }
})

// module.exports can be used for outside of the file(post.js)

// 'Post' is a model name

module.exports = mongoose.model('Post',postSchema)