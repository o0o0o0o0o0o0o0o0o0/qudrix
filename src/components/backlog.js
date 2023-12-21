
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
  

  // Popups
  const sliderPopupButtons = document.querySelectorAll('[data-sidebar="slider"]'),
  			formPopupButtons = document.querySelectorAll('[data-sidebar="form"]'),
  			sliderPopupClose = document.querySelectorAll('[data-sidebar="slider-close"]'),
        formPopupClose = document.querySelectorAll('[data-sidebar="form-close"]'),
     		ctaPopupClose = document.querySelectorAll('[data-sidebar="cta-close"]'),
        ctaMobile = document.querySelectorAll('[data-sidebar="cta-mobile"]'),
  			sliderPopup = document.querySelector('.is--slider-popup'),
        formPopup = document.querySelector('.is--form-popup'),
        ctaPopup = document.querySelector('.is--cta-popup');
        
  const openSidebar = (popupElem) => {
  	popupElem.classList.add('popup-open');
    lenis.stop();
    let popupContent = popupElem.querySelector('.popup-content');
		popupContent.style.cssText = 'animation:slide-in .5s ease; animation-fill-mode: forwards;';
  };
  
  const closeSidebar = (popupElem) => {
    let popupContent = popupElem.querySelector('.popup-content');
    if(!popupContent.classList.contains('is--cta-content')){
    	lenis.start();
			popupContent.style.cssText = 'animation:slide-out .5s ease; animation-fill-mode: forwards;';
    } else {
    	popupContent.style.cssText = 'opacity: 0;';
    }

    setTimeout(() => {
  		popupElem.classList.remove('popup-open');
      if(popupElem.classList.contains('is--open-mobile')){
    		popupElem.classList.remove('is--open-mobile')
    	}
		}, 500);
  };
  
  const openCtaPopup = (popupElem, additionalClass) => {
  	popupElem.classList.add('popup-open');
    if(additionalClass){
    	popupElem.classList.add(additionalClass)
    }
    let popupContent = popupElem.querySelector('.popup-content');
		popupContent.style.cssText = 'opacity: 1;';
  };
  
  setTimeout(function() {
  	openCtaPopup(ctaPopup);
	},50000);
  
  
  ctaMobile.forEach((button) => {
  	button.addEventListener('click', (e) => {
    	openCtaPopup(ctaPopup, 'is--open-mobile');
    });
  });
  
  ctaPopupClose.forEach(closer => {
  	window.addEventListener('click', (e) => {
      if (e.target === closer || e.target.parentElement === closer || e.target.parentElement.parentElement === closer) {
				closeSidebar(ctaPopup);
      }
		});
  });
  
  sliderPopupButtons.forEach((button) => {
  	button.addEventListener('click', () => {
    	openSidebar(sliderPopup)
    });
  });
  
  sliderPopupClose.forEach(closer => {
  	window.addEventListener('click', (e) => {
      if (e.target === closer || e.currentTarget.parentNode === closer) {
				closeSidebar(sliderPopup);
      }
		});
  });
  
  formPopupButtons.forEach((button) => {
  	button.addEventListener('click', () => {
    	openSidebar(formPopup)
    });
  });
  
  formPopupClose.forEach(closer => {
  	window.addEventListener('click', (e) => {
      if (e.target === closer || e.currentTarget.parentNode === closer) {
				closeSidebar(formPopup);
      }
		});
  });
  
  // Navbar
	const navButton = document.getElementById('nav-button');
  
  if(navButton){
  	navButton.addEventListener('click', () => {
  		checkForClass(navButton)
  	});
  }
  

  
	function checkForClass(navButton) {
		const navButtonText = navButton.querySelector('.text-size-0-625');
    if (!navButton.classList.contains("w--open")) {
        navButtonText.textContent = 'Close menu';
        lenis.stop();
    } else {
        navButtonText.textContent = 'Menu';
        lenis.start();
    }
	}
  
  
  const items = document.querySelectorAll('.faq-content__main-number');

  items.forEach(function(item, index) {
    const currentIndex = index + 1;
    item.textContent = currentIndex;
  });

  const images = document.querySelectorAll('img');

  images.forEach((image) => {
    image.removeAttribute('srcset');
  });
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
       	console.log(x, y, rEffect)
      });
    });
  },
};

Button.init();

const cardWrappers = document.querySelectorAll('.card-link__wrapper');
const cardCursors = document.querySelectorAll('.card-cursor');
let timeout;

let mouseX = 0;
let mouseY = 0;

window.addEventListener('load', () => {
  if (isDesktop()) {
    cardCursors.forEach((cursor, index) => {
      updateCursorPosition({ clientX: mouseX, clientY: mouseY }, cursor);
    });
  }
});

window.addEventListener('resize', () => {
  if (isDesktop()) {
    // Додайте обробники для курсора на подію ресайзу вікна
    cardCursors.forEach((cursor, index) => {
      updateCursorPosition({ clientX: mouseX, clientY: mouseY }, cursor);
    });
  }
});

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener('scroll', () => {
  if (isDesktop()) {
    cardCursors.forEach((cursor, index) => {
      updateCursorPosition({ clientX: mouseX, clientY: mouseY }, cursor);
    });
  }
});

cardWrappers.forEach((card, index) => {
  card.addEventListener('mouseenter', (e) => {
    if (isDesktop()) {
      const cursor = cardCursors[index];
      cursor.classList.add('cursor--showing');
      updateCursorPosition(e, cursor);
    }
  });

  card.addEventListener('mousemove', (e) => {
    if (isDesktop()) {
      const cursor = cardCursors[index];
      updateCursorPosition(e, cursor);
    }
  });

  card.addEventListener('mouseleave', (e) => {
    if (isDesktop()) {
      const cursor = cardCursors[index];
      cursor.classList.remove('cursor--showing');
    }
  });

  card.addEventListener('mouseenter', (e) => {
    const cursor = cardCursors[index];
  });
});

function updateCursorPosition(event, cursor) {
  const xOffset = event.clientX - cursor.clientWidth / 2;
  const yOffset = event.clientY - cursor.clientHeight / 2 - (cursor.clientHeight / 2);

  const cardRect = cursor.closest('.card-link__wrapper').getBoundingClientRect();

  const xInCard = Math.max(0, Math.min(cardRect.width - cursor.clientWidth, xOffset - cardRect.left));
  const yInCard = Math.max(0, Math.min(cardRect.height - cursor.clientHeight, yOffset - cardRect.top));

  cursor.style.transform = `translate(${xInCard}px, ${yInCard}px)`;
}

function isDesktop() {
  return window.innerWidth >= 1024;
}

// Filter
	const dropdownItem = document.querySelectorAll('.filters-dropdown__list--item');
  const filterWrapper = document.querySelectorAll('.filter-collection__wrapper');
  const resetFilter = document.querySelector('.filter-form__radio-label.is--reset');
  
  dropdownItem.forEach((item, i) => {
    item.addEventListener('click', () => {
      handleRemoveActiveClass();
      handleFilterClick(item, filterWrapper[i]);
      resetFilter.click();
    });
  });

  // handle adding active class to filter and dropdown item if clicked item has the same data-filter-name attr
  function handleFilterClick(filterDropdownItem, filterWrapper) {
    const dropdownFilterName = filterDropdownItem.getAttribute('data-filter-name');
    const filterWrapperFilterName = filterWrapper.getAttribute('data-filter-name');

    if (dropdownFilterName === filterWrapperFilterName) {
      filterDropdownItem.classList.add('active');
      filterWrapper.classList.add('active');
    } else {
      filterDropdownItem.classList.remove('active');
      filterWrapper.classList.remove('active');
    }
  };

  // handling remove all active classes from filter and dropdown items
  function handleRemoveActiveClass() {
    dropdownItem.forEach((item) => {
      item.classList.remove('active');
    });

    filterWrapper.forEach((item) => {
      item.classList.remove('active');
    });
  };

  // show first filter by default
