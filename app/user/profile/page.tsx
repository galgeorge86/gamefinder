'use client'

import GeneralLayout from "@/components/layouts/generalLayout"
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import { redirect } from "next/navigation"
import { RiMapFill, RiMapPinFill, RiPuzzleFill } from "react-icons/ri"

export default function UserProfilePage () {

    const {isPending, isError, data: user} = useQuery({
        queryKey: ['user-profile'],
        queryFn: () => 
            fetch('/api/user/get-profile').then((res) => 
                res.json()
            )
    })

    const {isLoaded, isSignedIn} = useAuth()

    if(isLoaded && !isSignedIn) redirect('/auth/sign-in')

    return (
        <GeneralLayout>
            {isPending && <span className="m-auto">Loading...</span>}
            {!isPending && user && 
            
            <div className="m-auto w-md flex flex-col gap-4 p-4 rounded-xl border-1 border-foreground/5">
                <div className="flex flex-row gap-4">
                    <div className="rounded-full aspect-square h-fit mt-0 mb-auto w-1/4 overflow-hidden flex">
                        <img src={user.avatar_url}></img>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <span className="text-xl font-bold">{user.username}</span>
                            <span className="text-foreground/50">{user.bio}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-foreground/50 flex flex-row gap-2">
                                <RiMapPinFill className="my-auto"/> 
                                {user.location}
                            </span>
                            <div className="text-foreground/50 flex flex-row gap-2">
                                <RiPuzzleFill className="my-auto"/> 
                                {user.play_style}
                            </div>
                            <div className="text-foreground/50 flex flex-row gap-2">
                                <RiMapFill className="my-auto"/> 
                                {user.play_location}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2">
                        <span className="font-bold">
                            Magic: The Gathering
                        </span>
                        <span className="text-foreground/50">
                            ({user.decks.length} decks)
                        </span>
                    </div>
                    <div className="h-[1px] rounded-full w-full bg-foreground/5"/>
                    <ul>
                        {user.decks.map((deck: string, index: number) => (
                            <li key={index}>
                                {deck}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            }
        </GeneralLayout>
    )
}