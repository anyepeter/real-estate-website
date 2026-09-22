import Hero from "@/components/sections/Hero";
import WhyUs from "@/components/sections/WhyUs";
import Arrows from "@/components/sections/Arrows";
import Rewired from "@/components/sections/Rewired";
import ForAgents from "@/components/sections/ForAgents";
import Testimonials from "@/components/sections/Testimonials";
import Services from "@/components/sections/Services";
import Features from "@/components/sections/Features";
import LatestPosts from "@/components/sections/LatestPosts";
import Outro from "@/components/sections/Outro";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyUs />
      <Arrows />
      <Rewired />
      <ForAgents />
      <Testimonials />
      <Services />
      <Features />
      <LatestPosts />
      <Outro />
    </>
  );
}
