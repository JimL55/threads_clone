"use server"
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";

interface Params{
    text: string;
    author: string,
    communityId: string | null,
    path: string
}

export async function createThread({text,author,communityId,path}:Params){
    try{
        connectToDB()

        const createdThread = await Thread.create({
            text,author,community:null,
        })
    
        //update user model
        await User.findByIdAndUpdate(author,{
            $push:{threads:createdThread._id}
        })
    
        revalidatePath(path)
    }catch(error:any){
        throw new Error(`Error created thread ${error.message}`)
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20){
    connectToDB();//connect to db first as usual

    //calc the number of posts to skip depending on page num
    const skipAmount = (pageNumber-1)*pageSize;

    //fetch the posts without parents aka top level threads, aka not a comment
    const postQuery = Thread.find({parentId:{$in:[null,undefined]}})
    .sort({createdAt:'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate({path:'author',model:User})
    .populate({path:'children',populate:{path:'author',model:User, select:'_id name parentId image'}}) //recursion to select the children comments

    const totalPostsCount = await Thread.countDocuments({parentId:{$in:[null,undefined]}})
    const posts = await postQuery.exec() //execute aka get all the posts in this page

    const isNext = totalPostsCount > skipAmount + posts.length;
    return {posts, isNext}
}

export async function fetchThreadById(id: string){
    connectToDB()
    try{
        //yea I got nothing here, path model and select seem pretty obvious, I got no clue what the populate does
        /*
        In MongoDB, Population is the process of replacing the specified path in the document of one collection with the actual document from the other collection.
        */
        const thread = await Thread.findById(id).populate({
            path:'author',
            model:User,
            select:'_id id name image'
        }).populate({
            path:'children',
            populate:[
                {
                    path:'author',
                    model: User,
                    select:'_id id name parentId image'
                },
                {
                    path:'children',
                    model:Thread,
                    populate:{
                        path:'author',
                        model:User,
                        select:'_id id name parentId image'
                    }
                }
            ]
        }).exec() //execute on the query

        return thread

    }catch(error:any){
        throw new Error(`Error fetching thread, check thread.actions.ts and ${error.message}`)
    }
}

export async function addCommentToThread(threadId:string, commentText:string, userId:string, path:string){
    connectToDB()

    try{
        //find original thread first
        const originalThread = await Thread.findById(threadId);
        if(!originalThread){
            throw new Error('Thread not found')
        } 
        
        //create a comment with a new thread, remember comments are threads
        const commentThread = new Thread({
            text:commentText,
            author:userId,
            parentId: threadId,
        })

        //save the new thread
        const savedCommentThread = await commentThread.save()

        //update original thread to include the new comment
        originalThread.children.push(savedCommentThread._id)

        //save original thread
        await originalThread.save()

        revalidatePath(path) //so the comment displays instantly
        
    }catch(error:any){
        throw new Error(`Error adding comment: ${error.message}`)
    }
}
