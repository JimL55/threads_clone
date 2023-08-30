
//ok so theres a new filenaming structure in nextjs called routes
//basically the top level file has (name) around its name

import { UserButton } from "@clerk/nextjs";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";
import ThreadCard from "@/components/cards/ThreadCard";
export default async function Home() {

  const user = await currentUser()
  const result = await fetchPosts(1,30)
  console.log(result)
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {/*so whats going on here is that if the fetch post returns nothing we print a p tag with no threads found, if the fetch post does return something then we map over it
        for every post in the returns use it to make a threadcard
        also to mix rendering html with ternary statements put a () around it like condition?(htmlstuff):(morehtmlstuff)
        */}
        {result.posts.length===0?(<p className="no-result">No threads found</p>):(
          <>
          {result.posts.map((post)=>(
            <ThreadCard key={post._id} id={post._id} currentUserId={user?.id || ''} parentId={post.parentId} content={post.text} author={post.author} community={post.community} createdAt={post.createdAt} comments={post.children}/>
          ))}
          </>
        )}
      </section>
    </>
  )
}