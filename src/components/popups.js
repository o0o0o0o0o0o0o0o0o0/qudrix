import Lenis from '@studio-freight/lenis'

function initializePopups(){
  const lenis = new Lenis();
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
  
  if(ctaPopup){
    setTimeout(function() {
  	  openCtaPopup(ctaPopup);
	  },50000);
  }
  
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
};

export default initializePopups;
/*
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
  */