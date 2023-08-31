/*'use server'
import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User  from "../models/user.model";
import { connectToDB } from "../mongoose"


 //use server side actions
//recieving as an object to be extra sure we each property passed matches

//I really hate typescript and making me define the types
interface Params{
    username: string; 
    name: string; 
    bio: string; 
    image: string; 
    userId: string; 
    path: string;
}
export async function updateUser({username, name, bio, image, userId, path}: Params): Promise<void>{
    connectToDB(); //function is coded in mongoose.ts

        try{//you always want to stick stuff in a try and catch block when working with a db
            //I think this bit of code finds a user by its id and updates everything in the db
            await User.findOneAndUpdate({id: userId },
                {
                    username:username.toLowerCase(),
                    name,
                    bio,
                    image,
                    onboarded:true
                },
                {upsert:true} //means update and insert in one command
                )
        
                if(path === '/profile/edit'){
                    revalidatePath(path)
                }
        }catch(error: any){//any is a type of error
            throw new Error(`Failed to create/update user: ${error.message}`)
        }
}

export async function fetchUser(userId: string){
    try{
        connectToDB()
        return await User.findOne({id:userId})//.populate({path: 'communities', model:Community})
    }catch(error:any){
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
}

export async function fetchUserPosts(userId: string){
    try{
        connectToDB();
        
        //find all threads wrriten by user by userid
        const threads = await User.findOne({id:userId}).populate({
            path:'threads',
            model:Thread,
            populate:{
                path:'children',
                model:Thread,
                populate:{
                    path:'author',
                    model:User,
                    select:'name image id'
                }
            }
        })
        return threads;
    }catch(error:any){
        throw new Error(`Failed to fetch user posts:${error.message}`)
    }
}

export async function fetchUsers({
    userId, 
    searchString='',
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc'
}:{
    userId:string
    searchString?: string
    pageNumber?: number
    pageSize?: number
    sortBy?: SortOrder
}){
    try{
        connectToDB()

        const skipAmount = (pageNumber-1) * pageSize

        const regex = new RegExp(searchString, 'i')

        const query: FilterQuery<typeof User> = {
            id:{$ne:userId} //filter out current user
        }

        if(searchString.trim() !== ''){
            query.$or = [
                {username:{$regex:regex}}, //can search for either username or name either should return
                {name:{$regex:regex}}
            ]
        }

        const sortOptions = {createdAt: sortBy};

        const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize)

        const totalUsersCount = await User.countDocuments(query)

        const users = await usersQuery.exec()

        const isNext = totalUsersCount > skipAmount + users.length

        return {users, isNext}

    }catch(error:any){
        throw new Error(`failed to fetch users: ${error.message}`)
    }
}

export async function getActivity(userId:string){
    try{
        connectToDB();

        //find all threads created by user
        //an array of multiple objects each containing a thread and each object will have a array called children that contain all child thread ids
        const userThreads = await Thread.find({author:userId})

        //collect all child thread id aka replies from the child field
        //litterally all this does is for each object in userThreads loop through all the children threads for each thread and add em to an array
        //so basically you now have an array of all the children threads from all the user threads
        const childThreadIds = userThreads.reduce((acc,userThread)=>{
            return acc.concat(userThread.children)
        },[]) //the [] is a default 

        const replies = await Thread.find({
            _id:{$in:childThreadIds}, //find all child threads that match 2 conditons, firstly id is in child thread ids and secondly the author is not currently the user
            author:{$ne:userId}
        }).populate({ //what this does its that from all those child threads it found, find the name image and id of each thread and stick em in replies
            path:'author',
            model: User,
            select: 'name image _id'
        }) //I think populate is just get data and stick it into some sort of data structure probably an array

        return replies

    }catch(error:any){
        throw new Error (`failed to fetch activity:${error.message}`)
    }
}*/

"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}