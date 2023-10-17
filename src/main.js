import './styles/style.css'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger' // Updated import

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// smooth scroll
const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// horizontal scroll
const horizontalItems = document.querySelectorAll('.horizontal-item')
const height = document.querySelector('.horizontal-sticky__content').offsetWidth
const width = (horizontalItems.length - 1) * 100

document.querySelector('.horizontal-section').style.height = `${height/16}rem`

gsap.to('.horizontal-item', {
  xPercent: -width,
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-section',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
  },
})

horizontalItems.forEach(item => {
  gsap.to(item.querySelectorAll('.image-full'), {
    xPercent: 25,
    ease: 'none',
    scrollTrigger: {
      trigger: '.horizontal-section',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    }
  })
})