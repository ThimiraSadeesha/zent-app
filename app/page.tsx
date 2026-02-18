import { BackgroundBeamsDemo } from "@/app/components/login/background";

export default function Home() {
    return (
        <main>
            <BackgroundBeamsDemo />
            <div className="absolute bottom-4 w-full text-center text-xs text-neutral-600">
                Developed and Designed by Lumiraq Team
            </div>
        </main>
    );
}
