const mongoose = require('mongoose');
const bcrypt = require("bcrypt")

const Schema = mongoose.Schema;

const Job = new Schema({

    user:{
     type: String
    },
    title:{
     type: String
    },
    
    location: {
     type: String
    },
    url: {
        type: String
    },
    likes: {
        type: Number
    },
    dislikes: {
        type: Number
    }
},
    {
        collection: 'Job'
    }
);

module.exports = mongoose.model('Job', Job);