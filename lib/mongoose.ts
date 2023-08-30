import mongoose from "mongoose";

let isConnected = false //check connection status

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)

    if(!process.env.MONGODB_URL) return console.log('MONGODB not found')
    if(isConnected) return console.log('Already connected')

    try{
        await mongoose.connect(process.env.MONGODB_URL)
        isConnected = true;
        console.log('connected to db')
    }catch(error){
        console.log('an error as occured')
    }


}