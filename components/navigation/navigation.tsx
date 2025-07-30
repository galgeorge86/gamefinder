import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"

const Navigation: React.FC = () => {
    return (
        <div className="sticky top-0 flex w-full items-center border-b-1 border-foreground/5 bg-background">
            <header className="p-4 flex w-full justify-between max-w-[1280px] mx-auto">
                {/* Gamefinder Logo (To be added) */}
                <div className="flex flex-row my-auto gap-2">
                    <a href="/"> 
                        <span className="text-2xl font-bold my-auto">GameFindr</span>
                    </a>
                    <div className="flex py-1 px-2 h-fit w-fit my-auto rounded-full bg-white text-black">
                        <span className="text-xs">dev</span>
                    </div>
                </div>

                {/* Auth / User Menu */}
                <div className="flex flex-row gap-2">
                <SignedOut>
                    <SignInButton fallbackRedirectUrl={"/"}
                    signUpFallbackRedirectUrl={"/onboarding"}>
                        
                    </SignInButton>
                    <Link href={"/auth/sign-up"}>
                        <button className="p-2 bg-[#6c47ff] px-4 flex items-center rounded-full hover:bg-foreground hover:text-background duration-100 text-foreground">
                            Sign Up
                        </button>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <UserButton/>
                </SignedIn>
                </div>
            </header>
        </div>
    )
}

export default Navigation