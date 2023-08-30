//this is the layout of the auth folder/page, meaning the structure and styles defined here only apply to the stuff in the (auth) subgroup
import '../globals.css'
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { Inter } from "next/font/google";
//this is for SEO aka make it easier for search engines to find you 
export const metadata = { 
    title: 'Threads',
    description: 'A Next.js Threads Clone'
}

//font
const inter = Inter({ subsets: ['latin']})

//remember in typescript you always have to define the type of the props
                                                //this is how you define the type in the same file
export default function RootLayout({ children } : { children: React.ReactNode}){
    return (
        //we are using a package called clerk to do all of the auth sign ups and accounts thing
        <ClerkProvider> 
            <html lang='en'>
                <body className={`${inter.className} bg-dark-1`}> {/*what this does is that it applies the inter font across all of the files aka its like a global font now*/}
                    <div className='w-full flex justify-center items-center min-h-screen'>
                        {children} {/*remember from the car app this children is just everything else in the layout aka all the rest of the code, I guess layout really is just a layout aka it defines the structure*/}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}