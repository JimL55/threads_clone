'use client'//bc we used router
import { sidebarLinks } from "@/constants"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from 'next/navigation'

//literally only used for mobile, wont ever been seen on desktop
function Bottombar(){

    const router = useRouter()
    const pathname = usePathname()
    return (
        <section className="bottombar">
            <div className="bottombar_container">
            {sidebarLinks.map((link)=> {
                    //literally just copied the entire links section from leftbar to stick into bottom bar
                    //look at url to see which section is active
                    const isActive = (pathname.includes(link.route)&&link.route.length>1) || pathname === link.route

                    return (                                                            //conditional styling for which is currently selected
                    <Link href={link.route} key={link.label} className={`bottombar_link ${isActive&&'bg-primary-500'}`}>
                        <Image src={link.imgURL} alt={link.label} width={24} height={24}/>            
                        <p className='text-subtle-medium text-light-1 max-sm:hidden'>{link.label.split(/\s+/)[0]}</p> {/*only display first word for label, just so that create thread shows "create" and doesnt look too squished*/}
                    </Link>
                )}
                )}
            </div>
        </section>
    )
}

export default Bottombar