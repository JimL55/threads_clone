import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions"
import Link from "next/link"
import Image from "next/image"

async function Page(){
    const user = await currentUser()
    if(!user) return null

    const userInfo = await fetchUser(user.id) 

    if(!userInfo?.onboarded) redirect('/onboarding')

    //get activity
    const activity = await getActivity(userInfo._id)//so far each thing is literally the logic of finding the data from database is in user activity actions you just import the data into each page and pass it into a component to render

  return (
    <section>
        <h1 className='head-text mb-10'>Activity</h1>
        <section className="mt-10 flex flex-col gap-5">
          {activity.length > 0 ? (
            //there is activity
            <>
              {activity.map((activity)=>(
                <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                  <article className="activity-card">
                    <Image src={activity.author.image} alt='pfp' width={20} height={20} className='rounded-full object-cover'/>
                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        {activity.author.name}
                      </span>{' '}
                        replied to your thread
                    </p>
                  </article>
                </Link>
              ))}
            </>
          ):(
            //no activity
            <p className="!text-base-regular text-light-3">No activity yet</p>
          )}
        </section>
    </section>
  )
}

export default Page