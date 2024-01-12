import initSession from "../parts/initSession";
import updateSession from "../parts/updateSession";

const initializeWizard = () => {
  // Selecting DOM elements
  const codeElement = document.querySelector('pre');
  const wizardTabLinks = document.querySelectorAll('.wizard-tab__nav-link div');
  const wizardTab = document.querySelectorAll('.wizard-tab__content-item');
  const totalPriceText = document.querySelector('#total-price');
  const wizardModelWrapper = document.querySelector('#model-wrapper');
  const wizardAccessoriesTriggers = document.querySelectorAll('.accessories-button');
  const wizardAccessoriesSidebar = document.querySelector('.wizard-sidebar__accessories-sidebar');
  const wizardAccessoriesSidebarClose = document.querySelector('.wizard-sidebar__accessories-sidebar-close');
  const wizardAccessoriesWrappers = document.querySelectorAll('.wizard-sidebar__accessories-wrapper');

  // Session id
  let sessionId;
  let amount = 0;

  // Creating wizardParametrs object
  const wizardParametrs = {};

  // Function to handle change icon from default to active
  const changeIcon = (element) => {
    const wizardElementIconDefault = element.querySelector('.wizard-element__icon-default');
    const wizardElementIconActive = element.querySelector('.wizard-element__icon-active');

    wizardElementIconActive.style.display = 'block';
    wizardElementIconDefault.style.display = 'none';
  };
  // Function to handle change icon from active to default
  const changeIconBack = (element) => {
    const wizardElementIconDefault = element.querySelector('.wizard-element__icon-default');
    const wizardElementIconActive = element.querySelector('.wizard-element__icon-active');

    wizardElementIconActive.style.display = 'none';
    wizardElementIconDefault.style.display = 'block';
  };

  // Function to handle radio list click event
  function handleRadioListClick(e) {
    const clickedElement = e.target;
    // Check if the click was on a label or an input
    if (clickedElement.tagName === 'LABEL' || clickedElement.tagName === 'INPUT') {
      const radioList = clickedElement.closest('.radio-trigger');
      if (radioList) {
        const labels = radioList.querySelectorAll('label');

        // Remove 'active' class from all labels
        labels.forEach(label => {
          label.classList.remove('active');
          // change icon
          changeIconBack(label);
        });

        // Add 'active' class to the clicked label or its parent label
        if (clickedElement.tagName === 'LABEL') {
          clickedElement.classList.add('active');
          clickedElement.querySelector('input').checked = true;
          // change icon
          changeIcon(clickedElement);
        } else if (clickedElement.tagName === 'INPUT') {
          clickedElement.parentElement.classList.add('active');
          clickedElement.checked = true;

          // change icon
          changeIcon(clickedElement.parentElement);
        }
      }
    }
  }

  // Adding a click event listener to the document to handle all clicks
  document.addEventListener('click', handleRadioListClick);

    // Function to update codeElement content based on wizardParametrs object
    const updateCodeElement = () => {
      codeElement.textContent = JSON.stringify(wizardParametrs, null, 2).replace(/,/g, ',\n');
    };

    // Creating wizardParametrs object based on wizardTabLinks
    wizardTabLinks.forEach((link, i) => {
      const linkText = link.textContent.trim().toLowerCase();
      if (linkText !== 'summary') {
        wizardParametrs[linkText] = {};
        wizardTab[i].setAttribute('data-tab', linkText);
      }
    });

    // default configuration
    wizardParametrs['size'] = {"element-name": "Q1"};
    wizardParametrs['roof'] = {"element-name": "Solid Panels"};
    wizardParametrs['sides'] = {
      'side-01': {"element-name": "Solid Panels"},
      'side-02': {"element-name": "Solid Panels"},
      'side-03': {"element-name": "Solid Panels"},
      'side-04': {"element-name": "Solid Panels"},
    };
    wizardParametrs['attachment'] = {"element-name": ""};
    wizardParametrs['light'] = {"element-name": ""};
    wizardParametrs['floor'] = {"element-name": ""};

    const wizardTabContent = document.querySelectorAll('[data-tab]');

    wizardTabContent.forEach(tab => {
      // based on default configuration, set active class to radio buttons
      const radioButtons = tab.querySelectorAll('input');
      const tabName = tab.getAttribute('data-tab');
      radioButtons.forEach(radio => {
        const dataName = radio.parentElement.getAttribute('data-name');
        const tabName = tab.getAttribute('data-tab');
        const side = radio.closest('[data-side]');
        const sideText = side ? side.dataset.side : null;

        if (sideText) {
          if (wizardParametrs[tabName][sideText]) {
            if (wizardParametrs[tabName][sideText]["element-name"] === dataName) {
              radio.parentElement.classList.add('active');
              radio.checked = true;

              // change icon
              changeIcon(radio.parentElement);

            }
          }
        } else if (wizardParametrs[tabName]) {
          if (wizardParametrs[tabName]["element-name"] === dataName) {
            radio.parentElement.classList.add('active');
            radio.checked = true;

            // change icon
            changeIcon(radio.parentElement);
          }
        } else if(tabName === 'size') {
          if (wizardParametrs[tabName]["element-name"] === dataName) {
            radio.parentElement.classList.add('active');
            radio.checked = true;

            // change icon
            changeIcon(radio.parentElement);
          }
        }
      });

      // Adding click event listeners to wizardTabLinks
      tab.addEventListener('click', (e) => {
        const side = e.target.closest('[data-side]');
        const sideText = side ? side.dataset.side : null;
        const tabText = tab.dataset.tab;
        if (sideText) {
          handleSideClick(tabText, sideText, e.target.parentElement);
        } else if (tabName !== 'summary') {
          handleClick(tabText, e.target.parentElement);
        }

        // check if q2 is selected
        if (wizardParametrs['size']['element-name'] === 'Q2') {
          document.querySelector('.tab-content__size-notification').style.display = 'block';
        } else {
          document.querySelector('.tab-content__size-notification').style.display = 'none';
        }
      });
    });

    function handleSideClick(tabText, sideText, target) {
      const dataName = target.getAttribute('data-name');
      if(sideText !== 'null' && sideText !== null && dataName !== 'null' && dataName !== null) {
        wizardParametrs[tabText][sideText]= {"element-name": dataName};
      }  
      updateCodeElement();
      handleSession();
    }

    function handleClick(tabText, target) {
      const dataName = target.getAttribute('data-name');
      if( dataName !== 'null' && dataName !== null) {
        wizardParametrs[tabText] = {"element-name": dataName};
      }
      updateCodeElement();
      handleSession();
    };

    // function to open accessories sidebar
    function openAccessoriesSidebar() {
      wizardAccessoriesSidebar.classList.add('active');
    };

    // function to close accessories sidebar
    function closeAccessoriesSidebar() {
      wizardAccessoriesSidebar.classList.remove('active');
      wizardAccessoriesWrappers.forEach(wrapper => {  
        wrapper.classList.remove('active');
      });
    };

    // function to handle building sidebar with accessories for elements that have accessories
    const handleAccessories = (element) => {
      // get accessories data name and option from parent sibling element with class wizard-sidebar__element-button
      const accessoriesDataName = element.parentElement.parentElement.querySelector('.wizard-sidebar__element-button').getAttribute('data-name');
      const accessoriesOption = element.parentElement.parentElement.querySelector('.wizard-sidebar__element-button').getAttribute('data-option');

      // open accessories sidebar, add go trough wizardAccessoriesWrappers and find the one with data-name and data-option
      openAccessoriesSidebar();

      wizardAccessoriesWrappers.forEach(wrapper => {
        const wrapperDataName = wrapper.getAttribute('data-name');
        const wrapperDataOption = wrapper.getAttribute('data-option');

        if (wrapperDataName === accessoriesDataName && wrapperDataOption === accessoriesOption) {
          wrapper.classList.add('active');
        }
      });
    };

    // Adding click event listeners to wizardAccessoriesTriggers
    wizardAccessoriesTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        handleAccessories(e.target);
      }
    )});

    // Adding click event listeners to wizardAccessoriesSidebarClose
    wizardAccessoriesSidebarClose.addEventListener('click', closeAccessoriesSidebar);

    updateCodeElement();
    // Handling init and update session
    function handleSession(){
      if(!sessionId){
        // init session
        initSession(wizardParametrs)
          .then(sessionData => {
            // update price
            updatePrice(sessionData.price);
            // update session id
            sessionId = sessionData.sessionId;
            // add sessionId to cookie
            document.cookie = `sessionId=${sessionId}`;
            // adding iframe to wizardModelWrapper
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', `https://spiffy-frangollo-487b0a.netlify.app/?sessionId=${sessionId}`);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.setAttribute('scrolling', 'no');
            iframe.setAttribute('style', 'width: 100%; height: 100%;');
            wizardModelWrapper.appendChild(iframe);

            // opacity 0 for loader and then display none
            const loader = document.querySelector('.preloader');
            
            setTimeout(() => {
              loader.style.opacity = 0;
              setTimeout(() => {
                loader.style.display = 'none';
              }, 500);
            }, 400);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else {
        // update session
        updateSession(wizardParametrs, sessionId)
          .then(updatedData => {
            // update price
            updatePrice(updatedData.calculatedPrice);
          })
          .catch(error => {
            console.error('Error updating session:', error);
          });
      }
    };

    handleSession();

    
    // Handling update price
    const updatePrice = (price) => {
      // chenge the price view, if price 1500, then 1,500 etc
      const priceString = price.toString();
      if(priceString.length > 3) {
        const priceArr = priceString.split('');
        priceArr.splice(priceArr.length - 3, 0, ',');
        price = priceArr.join('');
      }

      // add price to amount
      amount = price;
      // add amout to cookies
      document.cookie = `amount=${amount}`;

      totalPriceText.textContent = `$${price}`
    };
};

export default initializeWizard;