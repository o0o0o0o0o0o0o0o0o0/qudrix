import initializeAnimations from './parts/animations';
import initializePopups from './components/popups';
import initializeWizard from './components/wizard.js';
import checkout from './components/checkout.js';


// ---- Init animations ----
// init animation if it's not /404 url page
if(window.location.pathname !== '/404' && window.location.pathname !== '/wizard/cube') {
  initializeAnimations();
  initializePopups();
} else if(window.location.pathname === '/wizard/cube' || window.location.pathname === '/checkout') {
  initializeWizard();

  const popupElem = document.querySelector('.is--checkout-popup');


  const openSidebar = (popupElem) => {
    popupElem.classList.add('popup-open');
    let popupContent = popupElem.querySelector('.popup-content');
    popupContent.style.cssText = 'animation:slide-in .5s ease; animation-fill-mode: forwards;';
  };
  
  const closeSidebar = (popupElem) => {
    let popupContent = popupElem.querySelector('.popup-content');
    if(!popupContent.classList.contains('is--cta-content')){
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

  const handlingCheckout = async () => {
    // getting sessionId from cookie
    const sessionId = document.cookie.split(';').find(item => item.includes('sessionId')).split('=')[1];
    // getting amount from cookie
    const amount = document.cookie.split(';').find(item => item.includes('amount')).split('=')[1];
    checkout(sessionId, amount);

    // trigger popup
    openSidebar(popupElem);
  };

  // getting button to tregger checkout
  const checkoutButton = document.querySelector('#checkout-button');
  checkoutButton.addEventListener('click', handlingCheckout);

  // close popup
  const checkoutPopupClose = document.querySelectorAll('[data-sidebar="checkout-close"]');

  checkoutPopupClose.forEach(closer => {
  	window.addEventListener('click', (e) => {
      if (e.target === closer || e.currentTarget.parentNode === closer) {
				closeSidebar(popupElem);
      }
		});
  });

}