import mongoose from "mongoose";
import { string } from "zod";

//I guess this is just specifying what kind of data we went to the db
const communitySchema = new mongoose.Schema({
    id:{type: String, required: true},
    username:{type: String, required: true, unique: true},
    name:{type: String, required: true},
    image: String,
    bio: String,
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    threads:[ //one user can have multiple threads
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Thread'
        }
    ],
   members:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
   ]
})
            //same as user models except now its a community
const Community = mongoose.models.Community || mongoose.model('Community',communitySchema)

export default Community;