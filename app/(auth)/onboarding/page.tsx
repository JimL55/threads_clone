import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs"; //data about current use

async function Page(){

    const user = await currentUser(); //user will hold the current users info

    const userInfo = {};

    const userData = {
        id:user?.id, //aka if there is a current user, the id is user.id, user is an instance of currentUser wich is from clerk
        objectId: userInfo?._id, //this comes from our database
        username:userInfo?.username || user?.username, //either method works, remember user is from clerk and userInfo is just our copy of the data from clerk
        name: userInfo?.name || user?.firstName || '',
        bio: userInfo?.bio || '',
        image:userInfo?.image || user?.imageUrl,
    }

    return(
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2 ">Comeplete your profile to use Threads</p>
            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile user={userData} btnTitle='continue'/>
            </section>
        </main>
    )
}

export default Page;