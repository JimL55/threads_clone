'use client' //bc using forms

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import React, { ChangeEvent,useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserValidation } from '@/lib/validations/user'
import * as z from 'zod'
import Image from "next/image"
import { isBase64Image } from "@/lib/utils"
import { useUploadThing } from '@/lib/uploadthing' 
import { updateUser } from "@/lib/actions/user.actions"
import { usePathname, useRouter } from "next/navigation"

interface Props{
    user:{
        id: string,
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle:string;
}

//yea I got lost here, all i know is we installed a form component from shadcn and it takes care of everything
const AccountProfile = ({user,btnTitle}:Props) => {
    
    //this is for uploading personal images into the pfp, typescript mandates the file type hene <File>
    const [files, setFiles] = useState<File[]>([])
    const { startUpload } = useUploadThing("media") //using another package we got called upload thing, the code for it is in api upload thing
    const router = useRouter()
    const pathname = usePathname()
    const form = useForm({resolver:zodResolver(UserValidation),defaultValues:{profile_photo:user?.image || '' ,name:user?.name || '' ,username:user?.username || '' ,bio:user?.bio || '' }})

    const handleImage = (event: ChangeEvent<HTMLInputElement>, fieldChange: (value:string)=>void) =>{
        event.preventDefault()//no need to reload page once image uploads

        //init a file reader
        const fileReader = new FileReader()

        //I guess event is like thing that records an event change, in this case if event.target.files exists then set the file = to that
        if(event.target.files && event.target.files.length > 0){
            const file = event.target.files[0] 

            //update state to hold new file
            setFiles(Array.from(event.target.files))

            if(!file.type.includes('image')) return;

            fileReader.onload = async (e) =>{
                const imageDataUrl = e.target?.result?.toString() || ''
                fieldChange(imageDataUrl)
            }

            fileReader.readAsDataURL(file)
        }
    }

    const onSubmit = async (values:z.infer<typeof UserValidation>) => {
        //value of image is called a blob
        const blob = values.profile_photo

        const hasImageChanged = isBase64Image(blob)

        if(hasImageChanged){ //image has changed
            const imgRes = await startUpload(files)

            if(imgRes && imgRes[0].fileUrl){
                values.profile_photo = imgRes[0].fileUrl;
            }
        }

        //submit the rest of the data and update user profile
        //very important THE ORDER OF WHICH YOU PASS THESE VALUES matter, they must match the order they are defined as in user.actions.ts
        //or you can stick everything as properties of an obj and pass that obj
        await updateUser({username:values.username, name:values.name, bio:values.bio, image:values.profile_photo, userId:user.id, path:pathname})
        
        if(pathname==='/profile/edit'){
            router.back() //go back
        }else{
            router.push('/')//go to home
        } 
    }


      //tldr what ive gotten so far is that for every form input, we just installed the corresponding component from shadcn and used it
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
                {/*image*/}
                <FormField
                control={form.control}
                name="profile_photo"
                render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                    <FormLabel className="account-form_image-label">{
                        //I think this is the form for uplodaing a pfp, if we already have a pfp show it, else show the default no pfp image
                        field.value?(
                            <Image src={field.value} alt='pfp' width={96} height={96} priority className="rounded-full object-contain"/>
                        ):(
                            <Image src='/assets/profile.svg' alt='pfp' width={24} height={24}  className="object-contain"/>
                        )
                    }</FormLabel>
                    <FormControl className="flex-1 text-base-semibold text-gray-200">
                        <Input type='file' accept='image/*' placeholder="Upload a photo" className="account-form_image-input" onChange={(event)=>handleImage(event,field.onChange)}/>
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                )}
                />{/*this is the end of teh form field, apparently formfield is self closing*/}
                {/*name*/}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                        <FormLabel className="text-base-semibold text-light-2">Name</FormLabel>
                        <FormControl>
                            <Input type='text' className="account-form_input no-focus" {...field}/>
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                    )}
                />
                {/*username*/}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                        <FormLabel className="text-base-semibold text-light-2">Username</FormLabel>
                        <FormControl>
                            <Input type='text' className="account-form_input no-focus" {...field}/>
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                    )}
                />
                {/*bio*/}
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                        <FormLabel className="text-base-semibold text-light-2">Bio</FormLabel>
                        <FormControl>
                            <Textarea rows={10} className="account-form_input no-focus" {...field}/>
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="bg-primary-500">Submit</Button>
            </form>
        </Form>
  )
}

export default AccountProfile