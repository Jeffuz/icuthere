import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/ui/text-animate";

const Hero = () => {
  return (
    <div className="relative mx-auto max-w-[1100px] z-10 flex flex-col items-center justify-center px-6">
      <div className="text-center text-5xl font-bold tracking-tight text-[#023E8A] sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl mx-auto leading-[1.1]">
        <TextAnimate animation="slideDown" by="word" startOnView={false}>
          AI-Powered Triage for Emergencies
        </TextAnimate>
      </div>
      <BlurFade delay={0.4} inView={false}>
        <div className="mt-6 text-center  text-md md:text-lg  text-gray-500 max-w-2xl mx-auto">
          <TextAnimate animation="slideDown" by="word" startOnView={false}>
            Behind every alert, every scan, every suggestion — is a nurse making
            a life-saving choice. We’re just here to help.
          </TextAnimate>
        </div>
      </BlurFade>

      <BlurFade delay={0.6} inView={false} className="flex gap-4">
        <Button
          size="lg"
          className="mt-10 text-white h-[48px] bg-[#023E8A] hover:bg-[#023E8A]/80"
          asChild
        >
          <Link
            href="/demo"
            className="inline-flex items-center transition duration-200"
          >
            Get Started
          </Link>
        </Button>   
        <Button
          size="lg"
          className="mt-10 bg-white text-black hover:bg-white/90 h-[48px]"
          asChild
          variant={"outline"}
        >
          <Link
            href="/demo"
            className="inline-flex items-center transition duration-200"
          >
            Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </BlurFade>
    </div>
  );
};

export default Hero;
