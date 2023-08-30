import mongoose from "mongoose";
import { string } from "zod";

//I guess this is just specifying what kind of data we went to the db
const userSchema = new mongoose.Schema({
    id:{type: String, required: true},
    username:{type: String, required: true, unique: true},
    name:{type: String, required: true},
    image: String,
    bio: String,
    threads:[ //one user can have multiple threads
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Thread'
        }
    ],
    onboarded:{
        type:Boolean,
        default:false,
    },
    communities:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Community'
        }
    ]
})
            //first time no user    //after that users will exits
const User = mongoose.models.User || mongoose.model('User',userSchema)

export default User;