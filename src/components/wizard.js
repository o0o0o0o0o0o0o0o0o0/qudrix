import initSession from "../parts/initSession";
import updateSession from "../parts/updateSession";
import handleDropdown from "./dropdowns";

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
  const accessoriesElements = document.querySelectorAll('.wizard-sidebar__elements-list.is--accessories .wizard-sidebar__element');

  handleDropdown();

  // Session id
  let sessionId;
  let amount = 0;

  // Creating wizardParametrs object
  const wizardParametrs = {};
  const accessoriesParametrs = {};

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
    if (clickedElement.tagName === 'LABEL' || clickedElement.tagName === 'INPUT' && clickedElement.type === 'radio') {
      const radioList = clickedElement.closest('.radio-trigger');
      const checkboxList = clickedElement.closest('.checkbox-trigger');
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
      } else if (checkboxList) {
        const labels = checkboxList.querySelectorAll('label');

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
    } else if (clickedElement.type === 'checkbox') {
      // if clicked element is checkbox, then add or remove class active
      if (clickedElement.parentElement.classList.contains('active')) {
        clickedElement.parentElement.classList.remove('active');
        clickedElement.checked = false;

        // change icon
        changeIconBack(clickedElement.parentElement);
      } else {
        clickedElement.parentElement.classList.add('active');
        clickedElement.checked = true;

        // change icon
        changeIcon(clickedElement.parentElement);
      }
      // if clicked element if No accessories, then remove active class from all other elements
      if (clickedElement.parentElement.getAttribute('data-accessory') === 'No accessories') {
        const accessories = clickedElement.closest('.wizard-sidebar__accessories-sidebar').querySelectorAll('.wizard-sidebar__element.visible');
        accessories.forEach(accessory => {
          if (accessory.querySelector('label').getAttribute('data-accessory') !== 'No accessories') {
            accessory.firstChild.classList.remove('active');
            accessory.querySelector('input').checked = false;

            // change icon
            changeIconBack(accessory.firstChild);
          }
        });
        clickedElement.parentElement.classList.add('active');
        clickedElement.checked = true;
        changeIcon(clickedElement.parentElement);
      } else {
        // if clicked element is not No accessories, then remove active class from No accessories
        const accessories = clickedElement.closest('.wizard-sidebar__accessories-sidebar').querySelectorAll('.wizard-sidebar__element.visible');
        accessories.forEach(accessory => {
          if (accessory.querySelector('label').getAttribute('data-accessory') === 'No accessories') {
            accessory.firstChild.classList.remove('active');
            accessory.querySelector('input').checked = false;

            // change icon
            changeIconBack(accessory);
          }
        });
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
  wizardParametrs['size'] = { "element-name": "Q1" };
  wizardParametrs['roof'] = { "element-name": "Solid Panels" };
  wizardParametrs['sides'] = {
    'side-01': { "element-name": "Solid Panels" },
    'side-02': { "element-name": "Solid Panels" },
    'side-03': { "element-name": "Solid Panels" },
    'side-04': { "element-name": "Solid Panels" },
  };
  wizardParametrs['attachment'] = { "element-name": "" };
  wizardParametrs['light'] = { "element-name": "" };

  const wizardTabContent = document.querySelectorAll('[data-tab], .wizard-sidebar__accessories-sidebar');

  wizardTabContent.forEach(tab => {
    // based on default configuration, set active class to radio buttons
    const radioButtons = tab.querySelectorAll('input[type="radio"]');
    const tabName = tab.getAttribute('data-tab');
    radioButtons.forEach(radio => {
      const dataName = radio.parentElement.getAttribute('data-name');
      const tabName = tab.getAttribute('data-tab');
      const side = radio.closest('[data-side]');
      const sideText = side ? side.dataset.side : null;

      if (sideText !== 'null' && sideText !== null) {
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
      } else if (tabName === 'size') {
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
        handleAccessoriesSideClick(tabText, e.target.parentElement);
      } else if (tabName !== 'summary') {
        handleClick(tabText, e.target.parentElement);
        handleAccessoriesClick(tabText, e.target.parentElement);
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
    if (sideText !== 'null' && sideText !== null && dataName !== 'null' && dataName !== null) {
      wizardParametrs[tabText][sideText] = { "element-name": dataName };
    }
    updateCodeElement();
    handleSession();
  }

  function handleClick(tabText, target) {
    const dataName = target.getAttribute('data-name');
    const dataTab = target.closest('[data-tab]').getAttribute('data-tab');
    if (dataName !== 'null' && dataName !== null) {
      wizardParametrs[tabText] = { "element-name": dataName };
    }
    // if clicked element is not accessories button, then find accessories in wizard-sidebar__accessories-sidebar with the same data-tab and remove active class
    if (!target.classList.contains('is--accessory')) {
      if (!checkIfHasAccessoryTrigger(target.parentElement)) {
        const accessoryTab = document.querySelector(`.wizard-sidebar__accessories-sidebar[data-tab="${dataTab}"]`);

        if (accessoryTab) {
          const accessories = accessoryTab.querySelectorAll('.wizard-sidebar__element');
          accessories.forEach(accessory => {
            let accessoryLabel = accessory.querySelector('.wizard-sidebar__element-button');

            if (accessoryLabel.getAttribute('data-accessory') !== 'No accessories') {
              reactiveAccesory(accessory);
            }
          });
        }
      }
    }

    updateCodeElement();
    handleSession();
  };

  function reactiveAccesory(accessory) {
    accessory.firstChild.classList.remove('active');
    // change icon to default
    changeIconBack(accessory.firstChild);
  };

  function handleAccessoriesClick(tabText, target) {
    const dataAccessory = target.getAttribute('data-accessory');
    const dataSide = target.parentElement.getAttribute('data-side') ? target.parentElement.getAttribute('data-side') : null;
    const dataTab = target.closest('[data-tab]').getAttribute('data-tab');

    if (dataAccessory !== 'null' && dataAccessory !== null && dataSide === null) {
      wizardParametrs[tabText]["element-accessory"] = dataAccessory;


      // add target parent to accessoriesParametrs
      accessoriesParametrs[dataTab] = target.parentElement;

    }
    updateCodeElement();
    handleSession();
  };

  function handleAccessoriesSideClick(tabText, target) {
    const dataAccessory = target.getAttribute('data-accessory');
    const dataSide = target.parentElement.getAttribute('data-side') ? target.parentElement.getAttribute('data-side') : null;
    const dataTab = target.closest('[data-tab]').getAttribute('data-tab');
    if (dataAccessory !== 'null' && dataAccessory !== null && dataSide !== 'null' && dataSide !== null) {
      wizardParametrs[tabText][dataSide]["element-accessory"] = dataAccessory;


      // add target parent to accessoriesParametrs
      accessoriesParametrs[dataTab][dataSide] = target.parentElement;
    }
    updateCodeElement();
    handleSession();
  };

  // function to check if clicked element have accessory trigger
  function checkIfHasAccessoryTrigger(element) {
    const elementAccessoryTrigger = element.parentElement.querySelector('.accessories-button');

    if (elementAccessoryTrigger === null) {
      return false;
    }
    if (elementAccessoryTrigger.classList.contains('w-condition-invisible')) {
      return false;
    } else {
      return true;
    }
  };

  // function to open accessories sidebar
  function openAccessoriesSidebar() {
    wizardAccessoriesSidebar.classList.add('active');
  };

  // function to close accessories sidebar
  function closeAccessoriesSidebar() {
    wizardAccessoriesSidebar.classList.remove('active');
    accessoriesElements.forEach(element => {
      element.classList.remove('visible');
    });
  };

  // function to handle building sidebar with accessories for elements that have accessories
  const handleAccessories = (element) => {
    const accessoriesDataName = element.parentElement.parentElement.querySelector('.wizard-sidebar__element-button').getAttribute('data-name');
    const accessoriesDataSide = element.closest('[data-side]') ? element.closest('[data-side]').getAttribute('data-side') : null;
    const accessoriesDataTab = element.closest('.wizard-tab__content-item').getAttribute('data-tab');
    // add to sidebar attr data-tab with value of data tab
    wizardAccessoriesSidebar.setAttribute('data-tab', accessoriesDataTab);
    // open accessories sidebar, add go trough wizardAccessoriesWrappers and find the one with data-name and data-option
    openAccessoriesSidebar();

    if (accessoriesDataSide !== 'null' && accessoriesDataSide !== null && accessoriesDataName !== 'null' && accessoriesDataName !== null) {
      // go trough wizardAccessoriesWrappers and find the one with data-name and data-option
      accessoriesElements.forEach(element => {
        const elementDataSide = element.getAttribute('data-side');
        if (elementDataSide === accessoriesDataSide && element.getAttribute('data-accessory') === accessoriesDataName) {
          // add class visible to wizardAccessoriesWrapper
          element.classList.add('visible');
        } else {
          element.classList.remove('visible');
        }
      });
    } else if (accessoriesDataName !== 'null' && accessoriesDataName !== null && accessoriesDataSide === 'null' || accessoriesDataSide === null) {
      // go trough wizardAccessoriesWrappers and find the one with data-name and data-option
      accessoriesElements.forEach(element => {
        const elementDataName = element.getAttribute('data-accessory');
        if (elementDataName === accessoriesDataName) {
          // add class visible to wizardAccessoriesWrapper
          element.classList.add('visible');

        } else {
          element.classList.remove('visible');
        }
      });
    }

    // get visible accessories elements
    let visibleAccessoriesElements = document.querySelectorAll('.wizard-sidebar__elements-list.is--accessories .wizard-sidebar__element.visible');
    let activeElement = false;
    // check if visible elements with is in wizardParametrs
    visibleAccessoriesElements.forEach(element => {
      const elementDataName = element.firstChild.getAttribute('data-accessory');
      // check in object if there is element-accessory and if it is equal to elementDataName
      if (accessoriesDataSide === null || accessoriesDataSide === 'null') {
        if (wizardParametrs[accessoriesDataTab]["element-accessory"] === elementDataName) {
          console.log(elementDataName)
          // add class active to input
          element.firstElementChild.classList.add('active');
          // add checked attribute to input
          element.firstElementChild.setAttribute('checked', true);
          activeElement = true;
        }
      } else if (accessoriesDataSide !== null || accessoriesDataSide !== 'null') {
        if (wizardParametrs[accessoriesDataTab][accessoriesDataSide]["element-accessory"] === elementDataName) {
          console.log(activeElement)
          // add class active to input
          console.log('element-accessory side active');
          element.firstElementChild.classList.add('active');
          // add checked attribute to input
          element.firstElementChild.setAttribute('checked', true);

          activeElement = true;
        }
      }
    });

    // if in visible elements there is no active element, then add class active to No accessories
    if (!activeElement) {
      visibleAccessoriesElements.forEach(element => {
        handleAccessoriesNoAccessories(element);
      });
      activeElement = false;
    }

  };

  // function to handle activate "no accessories" option
  function handleAccessoriesNoAccessories(element) {
    let accessoryLabel = element.querySelector('.wizard-sidebar__element-button');
    if (element.querySelector('.wizard-sidebar__element-button').getAttribute('data-accessory') === 'No accessories') {
      // add class active to input
      accessoryLabel.classList.add('active');
      // add checked attribute to input
      accessoryLabel.setAttribute('checked', true);
      // add first order in grid to element
      element.style.order = -1;
      // change icon
      changeIcon(accessoryLabel);
    }
  };

  // Adding click event listeners to wizardAccessoriesTriggers
  wizardAccessoriesTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      handleAccessories(e.target);
      // add to accessoriesParametrs object data-tab 
      accessoriesParametrs[e.target.closest('[data-tab]').getAttribute('data-tab')] = {};
    });
  });

  // Adding click event listeners to wizardAccessoriesSidebarClose
  wizardAccessoriesSidebarClose.addEventListener('click', closeAccessoriesSidebar);

  updateCodeElement();
  // Handling init and update session
  function handleSession() {
    if (!sessionId) {
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
    if (priceString.length > 3) {
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