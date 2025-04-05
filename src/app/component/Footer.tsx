import Link from "next/link";
// import { Atom } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full py-10 px-6">
            <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 items-center justify-between text-gray-600 gap-4">
                <Link href="/" className="flex items-center gap-2">
                    {/* <Atom className="h-6 w-6 text-[#49BCF7]" /> */}
                    <span className="font-bold text-xl text-[#023E8A]">ICUthere</span>
                </Link>
                <nav className="mt-4 md:mt-0 flex gap-6 text-sm justify-center">
                    <Link href="/" className="hover:text-gray-500">About</Link>
                    <Link href="/" className="hover:text-gray-500">Pricing</Link>
                    <Link href="/" className="hover:text-gray-500">Contact</Link>
                    <Link href="/" className="hover:text-gray-500">Privacy</Link>
                </nav>
                <div className="mt-4 md:mt-0 text-sm text-gray-600 text-end">
                    © {new Date().getFullYear()} ICUthere. All rights reserved.
                </div>
            </div>
        </footer>
    );
}