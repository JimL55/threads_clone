//so the filenames actually have something to do with the url like root/thread/[id]/page like the [id] is probably going to be the thread id
import ThreadCard from "@/components/cards/ThreadCard"
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import Comment from "@/components/forms/Comment";

const Page = async ({params}:{params:{id:string}}) => {
//params of type params with an id of string

    if(!params.id) return null;

    const user = await currentUser(); //so this is going to be pretty standard to get all the info from the user we do import current user and user = await currentuser
    if(!user) return null;

    const userInfo = await fetchUser(user.id)
    if(!userInfo?.onboarded) redirect('/onboarding')

    const thread = await fetchThreadById(params.id)

    return(
        <section className="relative">
            <div>
                <ThreadCard key={thread._id} id={thread._id} currentUserId={user?.id || ''} parentId={thread.parentId} content={thread.text} author={thread.author} community={thread.community} createdAt={thread.createdAt} comments={thread.children}/>
            </div>
            <div className="mt-7">
                <Comment threadId={thread.id} currentUserImg={userInfo.image} currentUserId={JSON.stringify(userInfo._id)}/>
            </div>

            <div className="mt-10">
                {thread.children.map((child:any)=>( //comments are literally just threads, mapping over all the children of the selected thread and displaying em
                    <ThreadCard key={child._id} id={child._id} currentUserId={child?.id || ''} parentId={child.parentId} content={child.text} author={child.author} community={child.community} createdAt={child.createdAt} comments={child.children} isComment={true}/>
                ))}
            </div>
        </section>
    )    
}


export default Page