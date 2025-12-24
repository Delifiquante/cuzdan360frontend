import { Toaster } from "@/components/ui/toaster";
import { AppDock } from "@/components/layout/app-dock";

export default function Layout({ children }) {
    return (
        <>
            <Toaster />
            <div className="relative">
                <AppDock />
                <div className="pl-20">{children}</div>
            </div>
        </>
    )
}