import Image from "next/image"
interface Props{
    accountId: string,
    authUserId: string,
    name:string,
    imgUrl:string,
    bio:string,
    username:string,
    type?: 'User' | 'Community'
}

const ProfileHeader = ({accountId,authUserId,name,username,imgUrl,bio,type}:Props) => {
    return(
        <div className="flex w-full flex-col justify-start">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative h-20 w-20 object-cover"> {/*notice how we defined the height and width of parent div bc image takes entire parent div's space*/}
                        <Image src={imgUrl} alt='pfp' fill className="rounded-full object-cover shadow-2xl"/> {/*fill means fill the space of the parent div*/}
                    </div>

                    <div className="flex-1">
                        <h2 className="text-left text-heading3-bold text-light-1">{name}</h2>
                        <p className="text-base-medium text-gray-1">@{username}</p>
                    </div>
                </div>
            </div>
            {/*todo community*/}
            <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
            <div className="mt-12 h-0.5 w-full bg-dark-3"/>
        </div>
    )
}

export default ProfileHeader