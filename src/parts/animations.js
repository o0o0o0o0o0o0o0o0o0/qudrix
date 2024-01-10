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
        const speed = 0.5 + Math.random() * 0.5;
        const xOffset = speed * 300;

        gsap.to(item.querySelectorAll('.image-full'), {
          x: () => `${xOffset}px`, // Apply the random 'x' offset
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
  let loaderDuration = 4;

  // If not a first-time visit in this tab
  if (sessionStorage.getItem("visited") !== null) {
    loaderDuration = 2;
    counter = {
      value: 75
    };
  }
  sessionStorage.setItem("visited", "true");

  function updateLoaderText() {
    let progress = Math.round(counter.value);
    $(".loader-number").text(progress);
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
    delay: loaderDuration + 0.25,
    duration: 0.5,
    ease: ".19,1,.22,1",
  }, 0);

  tl.to(".loader .image-mask.mask--horizontal", {
    width: "100%",
    delay: loaderDuration + .5, 
    duration: 1,
    ease: ".19,1,.22,1",
  }, 0);

  tl.to(".loader .image-mask.mask--vertical", {
    height: "100%",
    delay: loaderDuration + .5,
    duration: 1,
    ease: ".19,1,.22,1",
  }, 0);

  tl.to(".loader-number__wrapper", {
    width: "0%",
    height: "0%",
    delay: loaderDuration + .5,
    duration: 1,
    ease: ".19,1,.22,1",
  }, 0);

  gsap.from('.preloader-image', {
    scale: 1,
    duration: loaderDuration + 1,
    ease: '.19,1,.22,1',
  });

  tl.to(".loader", {
    opacity:0, 
    display:"none",
    delay: loaderDuration + 1, 
    ease: ".19,1,.22,1",
  }, 0);

  $("[animate]").each(function (index) {
    gsap.from($(this).find(".char"), {
      opacity: 0,
      yPercent: 100, 
      duration: 0.5, 
      stagger: { amount: 0.5 },
      delay: loaderDuration + 1.25, 
      ease: '.19,1,.22,1',
    })
  });

  gsap.from('.hero-background', {
    y: '-10%',
    "-webkit-filter":'blur(8px)', 
    "filter":'blur(8px)',
    opacity: 0,
    delay: loaderDuration + 2, 
    duration: 0.7,
    ease: '.19,1,.22,1',
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
        duration: 0.3, 
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

  $(".hero-background").each(function (index) {
    let triggerElement = $(this);
    let targetElement = $(this);

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    });

    tl.to(targetElement, {
      y: "-100%",
      duration: 1,
    });
  });

  // canvas animation on scroll
  function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
    if (arguments.length === 2) {
      x = y = 0;
      w = ctx.canvas.width;
      h = ctx.canvas.height;
    }
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;
    var iw = img.width,
      ih = img.height,
      r = Math.min(w / iw, h / ih),
      nw = iw * r,
      nh = ih * r,
      cx,
      cy,
      cw,
      ch,
      ar = 1;
    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
    nw *= ar;
    nh *= ar;
    cw = iw / (nw / w);
    ch = ih / (nh / h);
    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  }


  document.querySelectorAll(".sections-wrapper").forEach((element) => {
    const canvas = element.querySelector("canvas");
    const embed = element.querySelector(".embed");
    const context = canvas.getContext("2d");

    function setCanvasSize() {
      // Get the parent element's dimensions
      var parentWidth = embed.clientWidth;
      var parentHeight = embed.clientHeight;

      // Calculate canvas size in pixels based on percentages
      var canvasWidth = parentWidth * 1; // 50% of parent width
      var canvasHeight = 1280; // 95% of parent height

      // Set the canvas size
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }

    setCanvasSize();

    const frameCount = element.getAttribute("total-frames");
    const urlStart = element.getAttribute("url-start");
    const urlEnd = element.getAttribute("url-end");
    const floatingZeros = element.getAttribute("floating-zeros");

    const currentFrame = (i) =>
      `${urlStart}${(i + 1).toString().padStart(floatingZeros, "0")}${urlEnd}`;
    console.log(currentFrame(0));
    const images = [];
    const imageFrames = {
      frame: 0,
    };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    gsap.to(imageFrames, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: element.getAttribute("scroll-start"),
        end: element.getAttribute("scroll-end"),
        scrub: 0,
      },
      onUpdate: render,
    });

    images[0].onload = render;

    function render() {
      context.clearRect(0, 0, embed.offsetWidth, embed.offsetHeight);
      drawImageProp(
        context,
        images[imageFrames.frame],
        0,
        0,
        embed.offsetWidth,
        embed.offsetHeight,
        0.5,
        0.5
      );
    }

    let iOS = !!navigator.platform.match(/iPhone|iPod|iPad/);
    let resizeTimer;
    window.addEventListener("resize", function (e) {
      if (iOS) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          setCanvasSize();
          render();
        }, 250);
      } else {
        setCanvasSize();
        render();
      }
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

  // ---- End of Home page animations ----
  /*

  const filterFormRadioButtons = document.querySelectorAll('.filter-form__radio-button');

  if(filterFormRadioButtons.length > 0){
    filterFormRadioButtons.forEach((elem) => {
      elem.addEventListener('change', (e) => {
        const filterName = e.target.nextElementSibling.textContent.toLocaleLowerCase();
        window.location.hash = filterName;
      });
    });
  }

  if(window.location.hash){
    const hash = window.location.hash;
    const filterFormRadioLabel = document.querySelectorAll(`.filter-form__radio-label`);
    filterFormRadioLabel.forEach((elem) => {
      const filterName = elem.textContent.toLocaleLowerCase();
      if(filterName === hash.slice(1)){
        const filterFormRadio = document.querySelectorAll('.filter-form__radio');
        filterFormRadio.forEach((elem) => {
          elem.classList.remove('is-active');
        });
        elem.previousElementSibling.checked = true;
        elem.parentElement.classList.add('is-active');
      }
    });

    // go trough all filters and if there is no match, clear the hash
    let match = false;
    filterFormRadioLabel.forEach((elem) => {
      const filterName = elem.textContent.toLocaleLowerCase();
      if(filterName === hash.slice(1)){
        match = true;
      }
    });
    if(!match){
      window.location.hash = '';
    }
  }

  // get all videos
  const videos = document.querySelectorAll('video');

  // loop through all videos
  videos.forEach(video => {
    // check if video is in viewport
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          // play video
          video.play();
        } else {
          // pause video
          video.pause();
        }
      });
    });
    observer.observe(video);

    // check if device is iphone and on low power mode
    const isIphone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
    const isLowPowerMode = navigator.getBattery && navigator.getBattery().then(battery => battery.level < 0.2);
    // source of video
    const source = video.querySelector('source');
    // if iphone and on low power mode, hide video
    if (isIphone && isLowPowerMode) {
      video.style.display = 'none';
    } else if (source.getAttribute('src') !== "") {
      // find parent element and there siblings with tag img
      const parent = video.parentElement.parentElement;
      const siblings = parent.querySelectorAll('img');

      // hide siblings
      siblings.forEach(sibling => {
        sibling.style.display = 'none';
      });
    }
  });

      // check if device is iphone and on low power mode
    const isIphone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
    const isLowPowerMode = navigator.getBattery && navigator.getBattery().then(battery => battery.level < 0.2);
    // source of video
    const source = video.querySelector('source');
    // if iphone and on low power mode, hide video
    if (isIphone && isLowPowerMode) {
      video.style.display = 'none';
    } else if (source.getAttribute('src') !== "") {
      // find parent element and there siblings with tag img
      const parent = video.parentElement.parentElement;
      const siblings = parent.querySelectorAll('img');

      // hide siblings
      siblings.forEach(sibling => {
        sibling.style.display = 'none';
      });
    }
    */

};