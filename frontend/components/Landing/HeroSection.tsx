import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

function HeroSection() {
    const heroRef = useRef(null)
  
    useEffect(() => {
      const ctx = gsap.context(() => {
        gsap.from('.hero-text', {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out"
        })
      }, heroRef)
  
      return () => ctx.revert()
    }, [])
  
    return (
      <section ref={heroRef} className="pt-24 pb-16 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="hero-text text-4xl md:text-7xl lg:text-6xl font-bold text-[#1e3a8a] leading-tight">
                Financial
                <span className="block text-[#2E9BB9]">Landing Page</span>
              </h1>
              <p className="hero-text text-lg text-gray-600 max-w-xl">
                An ideal tool for professional financial professionals to demonstrate their skills 
                and reach in the most effective way
              </p>
              <div className="hero-text flex flex-wrap gap-4">
                <Button className="bg-[#2E9BB9] hover:bg-[#247A94] text-white px-8 py-6 rounded-lg text-lg">
                  Get Started
                </Button>
                <Button variant="outline" className="px-8 py-6 rounded-lg text-lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -z-10 w-full h-full bg-gradient-to-r from-teal-50 to-blue-50 rounded-3xl transform rotate-3"></div>
              <Image
                src="/dashboard.png" // Add your dashboard image
                alt="Financial Dashboard"
                width={700}
                height={500}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    )
  }
  export default HeroSection;