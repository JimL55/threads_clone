import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";

import Topbar from '@/components/shared/Topbar';
import Bottombar from '@/components/shared/Bottombar';
import LeftSidebar from '@/components/shared/LeftSidebar';
import RightSidebar from '@/components/shared/RightSidebar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = { 
  title: 'Threads',
  description: 'A Next.js Threads Clone'
}

export default function RootLayout({children,}: {children: React.ReactNode}) {
  //I guess the whole point of next js is to have this layout.tsx page to layout how the website is going to work, notice how we divided each section of the website into a smaller component
  return (
    <ClerkProvider>{/*wrap clerkprovider around everything*/}
      <html lang='en'>
        <body className={inter.className}>
          <Topbar />
          <main className='flex flex-row'>
            <LeftSidebar/>
            <section className='main-container'>
              <div className='w-full max-w-4xl'>
                {children}
              </div>
            </section>
            <RightSidebar/>
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  )
}
