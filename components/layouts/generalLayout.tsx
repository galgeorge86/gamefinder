import Navigation from "../navigation/navigation";

export default function GeneralLayout ({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <main className="min-h-dvh w-full flex flex-col">
            <Navigation/>
            {children}
        </main>
    )
}