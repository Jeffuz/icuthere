import { Safari } from "@/components/ui/safari"

export default function Demo() {
    return (
        <div className="relative rounded-lg mx-auto max-w-[1100px] max-xl:px-6 w-full h-full z-10">
            <div className="relative w-full h-full overflow-hidden rounded-lg">
                <Safari url="ICUthere.tech" className="size-full" />
            </div>
        </div>
    )
}