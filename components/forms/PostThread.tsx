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
import { Textarea } from "@/components/ui/textarea"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { usePathname, useRouter } from "next/navigation"

import { updateUser } from "@/lib/actions/user.actions"
import { ThreadValidation } from '@/lib/validations/thread'
import { createThread } from "@/lib/actions/thread.actions"
import { useOrganization } from "@clerk/nextjs"


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

 

function PostThread({userId}:{userId:string}){
    //copied from acc prof
    const router = useRouter()
    const pathname = usePathname()
    const { organization } = useOrganization()
    const form = useForm({resolver:zodResolver(ThreadValidation),defaultValues:{thread:'', accountId: userId}})

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        await createThread({
            text:values.thread,
            author: userId,
            communityId: organization ? organization.id : null,
            path:pathname
        })
            router.push("/")
    }

    return(
        <Form {...form}>{/*same as account profile*/}
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10 mt-10">
            <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                        <FormLabel className="text-base-semibold text-light-2">Content</FormLabel>
                        <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                            <Textarea rows={15} {...field}/>
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type='submit' className="bg-primary-500">Post Thread</Button> {/*no need to have an onsubmit property in this button bc we linked it to the handler in the wrapping form element*/}
            </form>
        </Form>
    )
}

export default PostThread