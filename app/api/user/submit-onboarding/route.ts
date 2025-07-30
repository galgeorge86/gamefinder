import prisma from "@/utils/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest) {
    const user = getAuth(req)
    if(!user || !user.userId) {
        return new NextResponse("Unauthorized", {status: 401})
    }

    try {
        const {username, bio, play_style, location, preferred_play_location, decks} = await req.json()

        const decksJson = decks.map((deck: string) => ({title: deck}))

        const updateUser = await prisma.users.update({
            where: {clerk_user_id: user.userId},
            data: {
                username: username as string,
                bio: bio as string,
                play_style: play_style as string,
                location: location as string,
                play_location: preferred_play_location as string,
                decks: decksJson
            }
        })
        if(updateUser) {
            return new NextResponse("Completed user onboarding", {status: 200})
        } else {
            return new NextResponse("Error submitting user onboarding.", {status: 500})
        }
        
    } catch (e) {
        console.log("Error submiting user onboarding: ", e)
        return new NextResponse("Error submitting user onboarding.", {status: 500})
    }

}