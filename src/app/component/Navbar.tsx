import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Atom } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b max-xl:px-6 bg-black/30 border-gray-800 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-[1100px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Atom className="h-6 w-6 text-[#BD8AFC] lime-400" />
          <div className="font-bold text-xl text-[#F3F4F6]">ICUthere</div>
        </Link>
        <div className="flex items-center gap-4">
          <Button
            size="default"
            className="bg-transparent hover:bg-transparent hover:text-[#BD8AFC] transition duration-300"
            asChild
          >
            <Link href="/">Log In</Link>
          </Button>
          <Button
            size="default"
            className="bg-[#1E1E1E] hover:bg-[#1E1E1E]/80 hover:text-[#BD8AFC] text-white"
            asChild
          >
            <Link href="/">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
