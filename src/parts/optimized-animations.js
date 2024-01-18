import SplitType from 'split-type'
import { gsap } from 'gsap'
import Lenis from '@studio-freight/lenis'
import ScrollTrigger from 'gsap/ScrollTrigger'

function initializeAnimations() {
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis();
  let tl = gsap.timeline();

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // ---- Home page animation ----
  let typeSplit = new SplitType("[text-split], [from-bottom]", {
    types: "words, chars",
    tagName: "span"
  });

  // Horizontal scroll section animation
  function horizontalScrollAnimation() {
    const horizontalItems = document.querySelectorAll('.horizontal-item');
    const horizontalSection = document.querySelector('.horizontal-section');
    const horizontalStickyElement = document.querySelector('.horizontal-sticky__content');

    if (horizontalStickyElement) {
      const height = horizontalStickyElement.offsetWidth;
      const width = (horizontalItems.length - 1) * 100;

      const updateSectionSize = () => {
        if (window.innerWidth > 991) {
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
    };
  }

  horizontalScrollAnimation();



  // Preloader with cookie check
  let loadingDuration = 3;

  function loaderAnimation(loadingDuration) {
    let counter = {
      value: 0
    };


    function updateLoaderText() {
      let progress = Math.round(counter.value);
      $(".loader-number").text(progress);
    }

    // add line to cookies when user has visited the site, so we can check it later
    document.cookie = "visited=true; max-age=31536000; path=/";
    // check if user has visited the site before and if so, decrease loading delay
    if (document.cookie.split(';').find(item => item.includes('visited'))) {
      loadingDuration = 1.5;
    }

    gsap.to(counter, {
      value: 100,
      onUpdate: updateLoaderText,
      duration: loadingDuration,
      ease: ".19,1,.22,1",
    });

    gsap.to(".loader .image-mask.mask--horizontal", {
      width: "calc(0% + 24px)",
      duration: loadingDuration,
      ease: ".19,1,.22,1",
    });

    gsap.to(".loader .image-mask.mask--vertical", {
      height: "calc(0% + 24px)",
      duration: loadingDuration,
      ease: ".19,1,.22,1",
    });

    gsap.to(".loader-number__wrapper", {
      width: "calc(100% - 24px)",
      height: "calc(100% - 24px)",
      duration: loadingDuration,
      ease: ".19,1,.22,1",
    });

    gsap.to(".loader-number, .loader-number--percent", {
      opacity: 0,
      delay: loadingDuration + 0.10,
      duration: 0.5,
      ease: ".19,1,.22,1",
    });

    gsap.to(".loader .image-mask.mask--horizontal", {
      width: "100%",
      delay: loadingDuration + .15,
      duration: 1,
      ease: ".19,1,.22,1",
    }, 0);

    gsap.to(".loader .image-mask.mask--vertical", {
      height: "100%",
      delay: loadingDuration + .15,
      duration: 1,
      ease: ".19,1,.22,1",
    }, 0);

    gsap.to(".loader-number__wrapper", {
      width: "0%",
      height: "0%",
      delay: loadingDuration + .15,
      duration: 1,
      ease: ".19,1,.22,1",
    }, 0);

    gsap.from('.preloader-image', {
      scale: 1,
      duration: loadingDuration + 0.3,
      ease: '.19,1,.22,1',
    });

    gsap.to(".loader", {
      opacity: 0,
      display: "none",
      delay: loadingDuration + .7,
      ease: ".19,1,.22,1",
    }, 0);

    document.querySelectorAll('[animate]').forEach(function (element, index) {
      gsap.from(element.querySelectorAll('.char'), {
        opacity: 0,
        yPercent: 100,
        duration: 0.5,
        stagger: { amount: 0.5 },
        delay: loadingDuration + 1.25,
        ease: '.19,1,.22,1',
      });
    });

    gsap.from('.hero-background', {
      y: '-10%',
      "-webkit-filter": 'blur(8px)',
      "filter": 'blur(8px)',
      opacity: 0,
      delay: loadingDuration + 2,
      duration: 0.7,
      ease: '.19,1,.22,1',
    });
  }

  loaderAnimation(loadingDuration);

  // ---- Canvas animation ----

  function canvasAnimation() {
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

    function initCanvas(element, width, height) {
      const canvas = element.querySelector("canvas");
      const context = canvas.getContext("2d");
      const frameCount = element.getAttribute("total-frames");
      const urlStart = element.getAttribute("url-start");
      const urlEnd = element.getAttribute("url-end");
      const floatingZeros = element.getAttribute("floating-zeros");
      const frameLoop = element.getAttribute("data-loop");

      function setCanvasSize() {
        // if screen size bigger than 1700px set canvas size to 1200px, else set canvas size to actual screen size
        let canvasWidth = window.innerWidth > 1700 ? 1200 : window.innerWidth * width;
        let canvasHeight = window.innerWidth > 1700 ? 1200 * height : window.innerWidth * height;

        // Set the canvas size
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }

      const currentFrame = (i) => `${urlStart}${(i + 1).toString().padStart(floatingZeros, "0")}${urlEnd}`;

      const images = [];
      const imageFrames = {
        frame: 0,
      };

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
      }

      const frameInterval = 1000 / 24;
      let frameDirection = 1;

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

      // render first image frame on load
      images[0].onload = render;

      function render() {
        setCanvasSize();
        drawImageProp(
          context,
          images[imageFrames.frame],
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      function resizeAndRender() {
        setCanvasSize();
        render();
      }

      resizeAndRender();
    }

    // get all canvas elements with class .sections-wrapper
    const canvasElement = document.querySelectorAll(".sections-wrapper");

    function resizeCanvas() {
      initCanvas(canvasElement[0], 0.75, 0.75);
    }

    if (canvasElement && window.innerWidth > 768) {
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
    }
    /*
    function callAditionalCanvas() {
      if (window.scrollY > window.innerHeight * 4 && document.querySelector('.customize-content__main-link canvas').getAttribute('width') !== 'null') {
        initCanvas(canvasElement[1], 0.7, 1);
      }
    }
    */

  }

  canvasAnimation();

  // ---- hero animation home page ----
  function heroAnimation(element, start, end, y) {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: start,
        end: end,
        scrub: 1,
      },
    });

    tl.to(element, {
      y: y,
      duration: 1,
    });
  }

  // Call the function for each '.hero-background' element after a delay
  const parallaxElements = document.querySelectorAll('.hero-background, .customize-content__main');
  heroAnimation(parallaxElements[0], 'top top', 'bottom top', '-100%');
  heroAnimation(parallaxElements[1], 'top bottom', 'bottom top', '-20%');
  // ---- Text animation ----
  function textAnimation() {
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
        start: "top 90%",
        onEnter: () => {
          timeline.play();
        }
      });
    };

    // Stagger text animations
    $("[from-bottom]").each(function (index) {
      let delay = $(this).attr("from-bottom");

      let tl = gsap.timeline({ paused: true });
      tl.from($(this).find(".char"), {
        opacity: 0,
        yPercent: 100,
        duration: 0.3,
        stagger: { amount: 0.5 },
        ease: '.19,1,.22,1',
        delay: delay ? parseFloat(delay) : 0
      });

      createScrollTrigger($(this), tl);
    });

    $("[data-bottom]").each(function (index) {
      let tl = gsap.timeline({ paused: true });
      tl.from($(this).find("[data-animate]"), {
        opacity: 0,
        yPercent: 50,
        duration: 0.4,
        stagger: { amount: 0.4 },
        ease: '.19,1,.22,1',
      });

      createScrollTrigger($(this), tl);
    });

    // Iterate over elements with class "content-full__asset"
    document.querySelectorAll(".content-full__asset").forEach(function (element, index) {
      // Create a timeline
      let tl = gsap.timeline({ paused: true });

      // Vertical Mask Animation
      let verticalMaskAnimation = gsap.from(element.querySelector(".image-mask.mask--vertical-full"), {
        height: "100%",
        duration: 0.8,
        ease: ".19,1,.22,1",
      });

      // Horizontal Mask Animation
      let horizontalMaskAnimation = gsap.from(element.querySelector(".image-mask.mask--horizontal-full"), {
        width: "100%",
        duration: 0.8,
        ease: ".19,1,.22,1",
      });

      // Asset Image Animation
      let assetImageAnimation = gsap.from(element.querySelector(".content-full__asset-image"), {
        scale: 1.2,
        duration: 0.8,
        ease: ".19,1,.22,1",
      });

      // Triangle Mask Animation
      let triangleMaskAnimation = gsap.from(element.querySelector(".triangle-wrapper"), {
        width: "0%",
        height: "0%",
        duration: 0.8,
        ease: ".19,1,.22,1",
      });

      // Add all animations to the main timeline
      tl.add([verticalMaskAnimation, horizontalMaskAnimation, assetImageAnimation, triangleMaskAnimation], 0);

      // Call the function to create a scroll trigger
      createScrollTrigger(element, tl);
    });
  }

  // call function text animation with delay for better performance
  textAnimation();

  // ---- Step animation ----
  function stepAnimation() {
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

    function applySequentially(elements, callback) {
      elements.forEach((element, index) => {
        setTimeout(() => {
          removeActiveStep();
          callback(element);
        }, index * 500);
      });
    }

    const handleStepAnimation = (element, i) => {
      gsap.to(element, {
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
    };
    stepElements.forEach((elem, i) => { handleStepAnimation(elem, i) });
  }

  // call step animation function with delay for better performance
  setTimeout(stepAnimation, 4000);

}

export default initializeAnimations;