
import prisma from "@/utils/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest) {
    const user = getAuth(req)
    if(!user.userId) {
        return new NextResponse("Unauthorized", {status: 401})
    }
    try {
        const userData = await prisma.users.findUnique({
            where: { clerk_user_id: user.userId },
            select: {
                username: true,
                avatar_url: true,
                bio: true,
                play_location: true,
                location: true,
                decks: true,
                play_style: true,
            }
        })
        if(userData) {
            return new NextResponse(JSON.stringify(userData), {status: 200})
        } else {
            return new NextResponse("User not found", {status: 404})
        }
    } catch (e) {
        console.log(e)
        return new NextResponse("Error while fetching user data", {status: 500})
    }
}