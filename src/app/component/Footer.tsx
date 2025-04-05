import Link from "next/link";
import { Atom } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full py-10 px-6">
            <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between text-gray-300">
                <Link href="/" className="flex items-center gap-2">
                    <Atom className="h-6 w-6 text-[#BD8AFC]" />
                    <span className="font-bold text-xl text-white">Fluxbit</span>
                </Link>
                <nav className="mt-4 md:mt-0 flex gap-6 text-sm">
                    <Link href="/" className="hover:text-white">About</Link>
                    <Link href="/" className="hover:text-white">Pricing</Link>
                    <Link href="/" className="hover:text-white">Contact</Link>
                    <Link href="/" className="hover:text-white">Privacy</Link>
                </nav>
                <div className="mt-4 md:mt-0 text-sm text-gray-400">
                    © {new Date().getFullYear()} Fluxbit. All rights reserved.
                </div>
            </div>
        </footer>
    );
}