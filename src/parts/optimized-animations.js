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


  function loaderAnimation(loadingDuration) {

    document.querySelectorAll('[animate]').forEach(function (element, index) {
      gsap.from(element.querySelectorAll('.char'), {
        opacity: 0,
        yPercent: 100,
        duration: 0.5,
        stagger: { amount: 0.5 },
        delay: loadingDuration,
        ease: '.19,1,.22,1',
      });
    });

    gsap.from('.hero-background', {
      y: '-10%',
      "-webkit-filter": 'blur(8px)',
      "filter": 'blur(8px)',
      opacity: 0,
      delay: loadingDuration + .25,
      duration: 0.7,
      ease: '.19,1,.22,1',
    });
  }

  loaderAnimation(2.4);

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
    const canvasElement = document.querySelector(".sections-wrapper");

    function resizeCanvas() {
      initCanvas(canvasElement, 0.75, 0.75);
    }

    if (canvasElement && window.innerWidth > 768 && window.scrollY > window.innerHeight * 4) {
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

      // start on enter, on desktop should be "top 90%" but on mobile it should be earler
      const startOnEnter = window.innerWidth > 991 ? "top 90%" : "top bottom";
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
        start: startOnEnter,
        onEnter: () => {
          timeline.play();
        }
      });
    };

    // Stagger text animations
    $("[from-bottom]").each(function (index) {
      let delay = $(this).attr("from-bottom");
      const yPercent = window.innerWidth > 991 ? 100 : 50;
      let tl = gsap.timeline({ paused: true });
      tl.from($(this).find(".char"), {
        opacity: 0,
        yPercent: yPercent,
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
        duration: 0.5,
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
              console.log('triggered');
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
  setTimeout(stepAnimation, 2000);

  // ---- Footer animation ----
  function footerAnimation() {
    // when footer is in viewport, hide .cta-trigger button, and show when footer is out of viewport
    const footer = document.querySelector('.footer');
    const ctaTrigger = document.querySelector('.cta-trigger');

    if (footer && ctaTrigger) {
      const footerObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (footer) {
          if (footer.isIntersecting) {
            ctaTrigger.classList.add('is--hidden');
          } else {
            ctaTrigger.classList.remove('is--hidden');
          }
        });
      });
      footerObserver.observe(footer);
    }
  };

  footerAnimation();

  // Get all checkbox elements
  const checkboxes = document.querySelectorAll('.w-checkbox-input--inputType-custom');

  function handleClassListChange(mutationsList) {
    mutationsList.forEach(mutation => {
      if (mutation.type === "attributes" && mutation.attributeName === "class") {
        const targetElement = mutation.target;

        if (targetElement.classList.contains("cc-error")) {
          const parentElement = targetElement.parentElement;
          if (parentElement) {
            parentElement.classList.add("cc-error");
          }
        } else {
          const parentElement = targetElement.parentElement;
          if (parentElement) {
            parentElement.classList.remove("cc-error");
          }
        }
      }
    });
  }

  checkboxes.forEach(div => {
    const observer = new MutationObserver(handleClassListChange);

    const config = { attributes: true, attributeFilter: ["class"] };
    observer.observe(div, config);
  });

  // Button ripple
  const Button = {
    init: () => {
      Button.rippleEffectMovement();
    },

    rippleEffectMovement: () => {
      const buttonsNodeList = document.querySelectorAll(".submit-button");
      buttonsNodeList.forEach((btn) => {
        const rEffect = btn.querySelector('.span');

        btn.addEventListener("mousemove", function (e) {
          const buttonRect = btn.getBoundingClientRect();
          const x = e.clientX - buttonRect.left;
          const y = e.clientY - buttonRect.top;

          rEffect.style.left = `${x}px`;
          rEffect.style.top = `${y}px`;
        });
      });
    },
  };

  Button.init();

  // handling form submit

  var submitButtons = document.querySelectorAll('.submit-button');

  if (submitButtons.length > 0) {
    submitButtons.forEach(function (submitButton) {
      submitButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default form submission
        var parentForm = submitButton.nextElementSibling; // Find the parent form element

        if (parentForm) {
          parentForm.click(); // Submit the form
        } else {
          console.error('Parent form not found');
        }
      });
    });
  }

  // Get all elements with the class 'nav-link'
  const navLinks = document.querySelectorAll('.nav-link, a.is--nav');

  // Function to trigger the click event of 'navbar-menu__open-button'
  const triggerOpenButtonClick = () => {
    const openButton = document.querySelector('.navbar-menu__open-button');
    openButton.click();
  };

  // Add click event listener to each 'nav-link' element
  navLinks.forEach(navLink => {
    navLink.addEventListener('click', triggerOpenButtonClick);
  });

  // Navbar
  const navButton = document.getElementById('nav-button');

  navButton.addEventListener('click', () => {
    checkForClass(navButton)
  });

  function checkForClass(navButton) {
    const navButtonText = navButton.querySelector('.text-size-0-625');
    if (!navButton.classList.contains("w--open")) {
      document.querySelector('body').classList.add('overflow-hidden');
      lenis.stop();
    } else {
      document.querySelector('body').classList.remove('overflow-hidden');
      lenis.start();
    }
  }


  const items = document.querySelectorAll('.faq-content__main-number');

  items.forEach(function (item, index) {
    const currentIndex = index + 1;
    item.textContent = currentIndex;
  });

  const images = document.querySelectorAll('img');

  images.forEach((image) => {
    image.removeAttribute('srcset');
  });
  const swiper = new Swiper(".swiper", {
    spaceBetween: 20,
    navigation: {
      nextEl: '.slider-button__next',
      prevEl: '.slider-button__prev',
    },
  });

  // get data-sidebar="slider" elems
  const sidebarSliders = document.querySelectorAll('[data-sidebar="slider"]');

  // loop through all elems
  sidebarSliders.forEach((item, i) => {
    // on click on item slideTo swiper slide with index i
    item.addEventListener('click', () => {
      swiper.slideTo(i);
    }
    )
  });
}

export default initializeAnimations;