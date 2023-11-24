import SplitType from 'split-type'
import { gsap } from 'gsap'
import Lenis from '@studio-freight/lenis'
import ScrollTrigger from 'gsap/ScrollTrigger'

export default function initializeAnimations() {

  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis()

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  const horizontalItems = document.querySelectorAll('.horizontal-item');
  const horizontalSection = document.querySelector('.horizontal-section');
  const horizontalStickyElement = document.querySelector('.horizontal-sticky__content');
  if(horizontalStickyElement){
  	const height = horizontalStickyElement.offsetWidth;
      const width = (horizontalItems.length - 1) * 100;
  
  const updateSectionSize = () => {
  	if(window.innerWidth > 991){
      horizontalSection.style.height = `${height / 16}rem`;
    } else {
    	horizontalSection.style.height = `auto`;
    }
  };
  updateSectionSize()
  window.addEventListener('resize', updateSectionSize);
  
  const horizontalScrollAnimation = gsap.matchMedia();

  horizontalScrollAnimation.add("(min-width: 991px)", () => {
    gsap.to('.horizontal-item', {
      xPercent: -width,
      ease: 'none',
      scrollTrigger: {
        trigger: '.horizontal-section',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
  	});

    horizontalItems.forEach(item => {
      gsap.to(item.querySelectorAll('.image-full'), {
        x: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: '.horizontal-section',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        }
      });
    });
  });
  
  }

  // ---- Home page animations ----
 let typeSplit = new SplitType("[text-split], [from-bottom]", {
    types: "words, chars",
    tagName: "span"
  });

  let counter = {
    value: 0
  };
  let loaderDuration = 6;

  // If not a first-time visit in this tab
  if (sessionStorage.getItem("visited") !== null) {
    loaderDuration = 3;
    counter = {
      value: 75
    };
  }
  sessionStorage.setItem("visited", "true");

  function updateLoaderText() {
    let progress = Math.round(counter.value);
    $(".loader-number").text(progress);
  }

  function endLoaderAnimation() {
    $(".trigger").click();
  }

  let tl = gsap.timeline();

  tl.to(counter, {
    value: 100,
    onUpdate: updateLoaderText,
    duration: loaderDuration,
    ease: ".19,1,.22,1",
  });

  tl.to(".loader .image-mask.mask--horizontal", {
    width: "calc(0% + 24px)",
    duration: loaderDuration,
    ease: ".19,1,.22,1",
  }, 0);

  tl.to(".loader .image-mask.mask--vertical", {
    height: "calc(0% + 24px)",
    duration: loaderDuration,
    ease: ".19,1,.22,1",
  }, 0);

  tl.to(".loader-number__wrapper", {
    width: "calc(100% - 24px)",
    height: "calc(100% - 24px)",
    duration: loaderDuration,
    ease: ".19,1,.22,1",
  }, 0);

  tl.to(".loader-number, .loader-number--percent", {
    opacity: 0,
    delay: loaderDuration + 0.5,
    duration: 0.5,
    ease: ".19,1,.22,1",
  }, 0);

  tl.to(".loader .image-mask.mask--horizontal", {
    width: "100%",
    delay: loaderDuration + 1, 
    duration: 1,
    ease: ".19,1,.22,1",
  }, 0);

  tl.to(".loader .image-mask.mask--vertical", {
    height: "100%",
    delay: loaderDuration + 1,
    duration: 1,
    ease: ".19,1,.22,1",
  }, 0);

  tl.to(".loader-number__wrapper", {
    width: "0%",
    height: "0%",
    delay: loaderDuration + 1,
    duration: 1,
    ease: ".19,1,.22,1",
  }, 0);

  gsap.from('.preloader-image', {
    scale: 1,
    duration: loaderDuration + 2,
    ease: '.19,1,.22,1',
  });

  tl.to(".loader", {
    opacity:0, 
    display:"none",
    delay: loaderDuration + 2, 
    ease: ".19,1,.22,1",
  }, 0);

  gsap.from('[nav-animation]', {
    y: '100%',
    opacity: 0,
    delay: loaderDuration + 2, 
    duration: 0.6,
    stagger: 0.1,
    ease: '.19,1,.22,1',
  })


  gsap.from('.hero-background', {
    y: '-10%',
    "-webkit-filter":'blur(8px)', 
    "filter":'blur(8px)',
    opacity: 0,
    delay: loaderDuration + 3, 
    duration: 0.7,
    ease: '.19,1,.22,1',
  });


    /*      
  gsap.from('[animate]', {
    opacity: 0, 
    yPercent: 100, 
    duration: 0.5, 
    ease: "back.out(2)", 
    stagger: { amount: 0.5 },
    delay: loaderDuration + 4, 
    ease: '.19,1,.22,1',
  })*/

  $("[animate]").each(function (index) {
    gsap.from($(this).find(".char"), {
      opacity: 0,
      yPercent: 100, 
      duration: 0.7, 
      stagger: { amount: 0.5 },
      delay: loaderDuration + 3.5, 
      ease: '.19,1,.22,1',
    })
  });

    // Link timelines to scroll position
    function createScrollTrigger(triggerElement, timeline) {
      // Reset tl when scroll out of view past bottom of screen
      ScrollTrigger.create({
        trigger: triggerElement,
        start: "top bottom",
        onLeaveBack: () => {
          timeline.progress(0);
          timeline.pause();
        }
      });
      // Play tl when scrolled into view (60% from top of screen)
      ScrollTrigger.create({
        trigger: triggerElement,
        start: "top 80%",
        onEnter: () => {
          timeline.play();
        }
      });
    }
    
    
    $("[from-bottom]").each(function (index) {
      let tl = gsap.timeline({ paused: true });
      tl.from($(this).find(".char"), {
        opacity: 0,
        yPercent: 100, 
        duration: 0.7, 
        stagger: { amount: 0.5 },
        ease: '.19,1,.22,1',
      });
      createScrollTrigger($(this), tl);
    });
    
  $(".content-full__asset").each(function(index) {
    let tl = gsap.timeline({ paused: true });

    let verticalMaskAnimation = gsap.from(
      $(this).find(".image-mask.mask--vertical-full"),
      {
        height: "100%",
        duration: 1,
        ease: ".19,1,.22,1",
      }
    );

    let horizontalMaskAnimation = gsap.from(
      $(this).find(".image-mask.mask--horizontal-full"),
      {
        width: "100%",
        duration: 1,
        ease: ".19,1,.22,1",
      }
    );

    let assetImageAnimation = gsap.from($(this).find(".content-full__asset-image"), {
      scale: 1.2,
      duration: 1,
      ease: ".19,1,.22,1",
    });
    
    let triangleMaskAnimation = gsap.from($(this).find(".triangle-wrapper"), {
      width: "0%",
      height: "0%",
      duration: 1,
      ease: ".19,1,.22,1",
    });

    // Add all animations to the main timeline
    tl.add([verticalMaskAnimation, horizontalMaskAnimation, assetImageAnimation, triangleMaskAnimation], 0);

    createScrollTrigger($(this), tl);
  });

  $(".hero-background__image").each(function (index) {
    let triggerElement = $(this);
    let targetElement = $(this);

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        // trigger element - viewport
        start: "bottom bottom",
        end: "bottom top",
        scrub: 1
      }
    });
    tl.to(targetElement, {
      y: "-20%",
      duration: 1
    });
  });

  $(".customize-content__main-link").each(function (index) {
    let triggerElement = $(this);
    let targetElement = $(this);

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        // trigger element - viewport
        start: 'top bottom', // Delay the start by 0.5 seconds
        end: 'bottom top',
        scrub: 1
      }
    });
    tl.to(targetElement, {
      y: "-30%",
      duration: 1
    });
  });

  const stepTrigger = document.querySelector('.step-content__grid');
  const stepElements = document.querySelectorAll(".step-grid__item-number");
  let triggered = false;

  const removeActiveStep = () => {
    stepElements.forEach(elem => {
      elem.classList.remove('is--active');
    });
  };

  const addActiveStep = (element) => {
    element.classList.add('is--active');
  };

  stepElements.forEach((item, i) => {
    gsap.to(item, {
      scrollTrigger: {
        trigger: stepTrigger,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        onEnter: () => {
          if (!triggered) {
            triggered = true;
            removeActiveStep();
            applySequentially(stepElements, addActiveStep);
          }
        },
        onLeaveBack: () => {
          // If needed
        },
      },
    });
  });

  function applySequentially(elements, callback) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        removeActiveStep();
        callback(element);
      }, index * 500);
    });
  }
};