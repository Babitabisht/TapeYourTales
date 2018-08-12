const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const FeedSchema = new Schema({

    name:{
        type:String,
       required:true
    },

    comment:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    id:{
        type:String,
        required:true
    } ,

    date:{
        type:Date,
        default:Date.now
    }





});

mongoose.model('feedback',FeedSchema);

