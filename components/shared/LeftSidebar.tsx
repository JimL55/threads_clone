'use client' //bc router only works on client side
import { sidebarLinks } from '@/constants'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { SignedIn, SignOutButton, useAuth } from '@clerk/nextjs'

function LeftSidebar(){

    const router = useRouter()
    const pathname = usePathname()
    const {userId} = useAuth()

    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {sidebarLinks.map((link)=> {
                    
                    //we have an extra{} because we want to do more than just map over hense its no longer a single return function hence the extra return and {}
                    
                    //I think what this does is checks the currently url to see if we are currently in selected selections on the left and updates the var
                    //assuming this is for conditional styling if we are in a particular section
                    const isActive = (pathname.includes(link.route)&&link.route.length>1) || pathname === link.route

                    if(link.route ==='/profile') link.route = `${link.route}/${userId}`

                    return ( //mapping over an array of objects each with 3 properties, a url to the image, a label and a path
                    <Link href={link.route} key={link.label} className={`leftsidebar_link ${isActive&&'bg-primary-500'}`}>
                        <Image src={link.imgURL} alt={link.label} width={24} height={24}/>
                        <p className='text-light-1 max-lg:hidden'>{link.label}</p>
                    </Link>
                )}
                )}
            </div>
            
            {/*this is the logout icon at the bottom of the left par*/}
            <div className='mt-10 px-6'>
                <SignedIn>
                    {/* call back function so that once you click the signout button it takes you back to the sign in page*/}
                    <SignOutButton signOutCallback={()=>router.push('/sign-in')}>
                        <div className="flex cursor-pointer gap-4 p-4">
                            <Image src='/assets/logout.svg' alt='logout' width={24} height={24}/>
                            {/*the max-lg hidden means its hidden on mobile devices aka no logout text on small screens*/}
                            <p className='text-light-2 max-lg:hidden'>Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    )
}

export default LeftSidebar