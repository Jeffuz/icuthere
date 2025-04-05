import { Safari } from "@/components/ui/safari"
import { BorderBeam } from "@/components/ui/border-beam"

export default function Demo() {
    return (
        <div className="relative rounded-lg mx-auto max-w-[1100px] max-xl:px-6 w-full h-full z-10">
            <div className="relative w-full h-full overflow-hidden rounded-lg">
                <Safari url="Fluxbit.com" className="size-full" />
                <BorderBeam />
            </div>
        </div>
    )
}