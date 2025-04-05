import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BlurFade } from '@/components/ui/blur-fade'
import { TextAnimate } from '@/components/ui/text-animate'

const Hero = () => {
    return (
        <div className="relative mx-auto max-w-[1100px] z-10 flex flex-col items-center justify-center px-6">
            <div className="text-center text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl mx-auto leading-[1.1]">
                <TextAnimate animation="slideDown" by="word" startOnView={false}>
                    Automate your workflow with AI
                </TextAnimate>
            </div>
            <BlurFade delay={0.4} inView={false}>
                <div className="mt-6 text-center  text-md md:text-lg  text-gray-400 max-w-2xl mx-auto">
                    <TextAnimate animation="slideDown" by="word" startOnView={false}>
                        No matter what problem you have, our AI can help you solve it.
                    </TextAnimate>
                </div>
            </BlurFade>

            <BlurFade delay={0.6} inView={false}>
                <Button size="lg" className="mt-10 bg-white text-black hover:bg-white/90" asChild>
                    <Link href="/" className="inline-flex items-center transition duration-200">
                        Get Started for free
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </BlurFade>

        </div>
    )
}

export default Hero