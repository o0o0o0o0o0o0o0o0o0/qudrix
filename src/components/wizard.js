import initSession from "../parts/initSession";
import updateSession from "../parts/updateSession";
import handleDropdown from "./dropdowns";
import formatingPrice from "./formatingPrice";

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
  const colorToggle = document.querySelector('.combine-color-checkbox');
  const colorToggleWrapper = document.querySelector('.combine-color__wrapper');
  const colorElements = document.querySelectorAll('.color-element__button');
  const colorElementsWrapper = document.querySelectorAll('.color-elements__list');
  const swivelPerogla = document.querySelector('[data-name="Swivel Sliding pergola Q25"]');
  const automaticSunscreen = document.querySelectorAll('[data-accessory-name="Automatic sunscreen"]');
  const swivelPeroglaColors = document.querySelector('[data-colors="roof"]');
  const automaticSunscreenColors = document.querySelector('[data-colors="sunscreen"]');
  const summaryItems = document.querySelectorAll('.wizard-summary__list-item');
  const checkoutSubtotal = document.querySelector('#subtotal');
  const checkoutShipping = document.querySelector('#shipping');
  const checkoutTotal = document.querySelector('#total');
  const wizardButtonSidebar = document.querySelector('.wizard-open__button');
  const wizardSidebarClose = document.querySelector('.wizard-sidebar__overlay');
  const wizardSidebar = document.querySelector('#wizard-sidebar');


  // function to open side bar
  const openSidebar = () => {
    wizardSidebar.classList.add('is--open');
  };

  // function to close side bar
  const closeSidebar = () => {
    wizardSidebar.classList.remove('is--open');
  };

  if (wizardButtonSidebar) {
    wizardButtonSidebar.addEventListener('click', openSidebar);
  }

  if (wizardSidebarClose) {
    wizardSidebarClose.addEventListener('click', () => {
      closeSidebar()
    });
  }
  // formating price
  formatingPrice();

  const checkIfHasActiveClass = (elem) => {
    if (elem.classList.contains('active') || elem.firstChild.classList.contains('active')) {
      return true;
    } else {
      return false;
    }
  };

  const checkIfShowcolors = () => {
    let showColors = false;
    let sunscreenFlag = false;
    // call checkIfHasActiveClass to check if swivelPerogla and automaticSunscreen have active class
    if (checkIfHasActiveClass(swivelPerogla)) {
      swivelPeroglaColors.classList.add('is--default');
      handleFirstColorActive();
      showColors = true;
    } else {
      swivelPeroglaColors.classList.remove('is--default');
    }

    // go trough automaticSunscreen and check if there is active class, if only on of them is active
    automaticSunscreen.forEach(sunscreen => {
      if (checkIfHasActiveClass(sunscreen)) {
        sunscreenFlag = true;
        showColors = true;
      }
    });
    if (sunscreenFlag) {
      automaticSunscreenColors.classList.add('is--default');
      handleFirstColorActive();
    } else {
      if (automaticSunscreenColors.classList.contains('is--default')) {
        automaticSunscreenColors.classList.remove('is--default');
      }
    }

    if (showColors) {
      colorToggleWrapper.classList.add('is--visible');
    }
  };

  // if page is /wizard/cube, then get wizardParametrs from local storage and update codeElement
  if (window.location.pathname === '/wizard/cube') {
    handleDropdown();
  }
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
    if (wizardElementIconDefault && wizardElementIconActive) {
      wizardElementIconActive.style.display = 'block';
      wizardElementIconDefault.style.display = 'none';
    }
  };

  // Function to handle change icon from active to default
  const changeIconBack = (element) => {
    const wizardElementIconDefault = element.querySelector('.wizard-element__icon-default');
    const wizardElementIconActive = element.querySelector('.wizard-element__icon-active');

    if (wizardElementIconDefault && wizardElementIconActive) {
      wizardElementIconActive.style.display = 'none';
      wizardElementIconDefault.style.display = 'block';
    }
  };

  // Function to handle radio list click event
  function handleRadioListClick(e) {
    const clickedElement = e.target;
    // Check if the click was on a label or an input
    if (clickedElement.tagName === 'LABEL' || clickedElement.tagName === 'INPUT' && clickedElement.type === 'radio' && !clickedElement.classList.contains('color-element__button') && !clickedElement.parentElement.classList.contains('color-element__button')) {
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
      // check if 
      handleAccessoriesInactiveElements()
      checkIfShowcolors();

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
      if (clickedElement.parentElement.parentElement.getAttribute('data-accessory-name') === 'No accessories') {
        const accessories = clickedElement.closest('.wizard-sidebar__accessories-sidebar').querySelectorAll('.wizard-sidebar__element.visible');
        accessories.forEach(accessory => {
          if (accessory.getAttribute('data-accessory-name') !== 'No accessories') {
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
        if (accessories.length > 0) {
          accessories.forEach(accessory => {
            if (accessory.getAttribute('data-accessory-name') === 'No accessories') {
              accessory.firstChild.classList.remove('active');
              accessory.querySelector('input').checked = false;

              // change icon
              changeIconBack(accessory);
            }
          });
        }
      }

      // check all visible accessories, if no one is active, then add None to wizardParametrs and add active class to No accessories
      const accessories = clickedElement.closest('.wizard-sidebar__accessories-sidebar').querySelectorAll('.wizard-sidebar__element.visible');
      let activeAccessory = false;
      accessories.forEach(accessory => {
        if (accessory.getAttribute('data-accessory-name') !== 'No accessories') {
          if (accessory.querySelector('input').checked) {
            activeAccessory = true;
          }
        }
      });
      if (!activeAccessory) {
        accessories.forEach(accessory => {
          if (accessory.getAttribute('data-accessory-name') === 'No accessories') {
            accessory.firstChild.classList.add('active');
            accessory.querySelector('input').checked = true;

            // change icon
            changeIcon(accessory.firstChild);
          }
        });
      }
      handleAccessoriesInactiveElements()
      checkIfShowcolors();
    }
  }

  // Adding a click event listener to the document to handle all clicks
  document.addEventListener('click', handleRadioListClick);

  // Function to update codeElement content based on wizardParametrs object
  const updateCodeElement = () => {
    codeElement.textContent = JSON.stringify(wizardParametrs, null, 2).replace(/,/g, ',\n');
    console.log(codeElement.textContent)
    // convert wizardParametrs to json, and add or update in local storage
    localStorage.setItem('wizardParametrs', JSON.stringify(wizardParametrs));

    // go trough summary items and check data-item attr
    summaryItems.forEach(item => {
      const dataItem = item.getAttribute('data-item');

      const textElement = item.querySelector('.text-color-gray');

      if (dataItem === 'sides') {
        textElement.textContent = `S1 (${wizardParametrs[dataItem]["side-01"]["element-name"]}), S2 (${wizardParametrs[dataItem]["side-02"]["element-name"]}), S3 (${wizardParametrs[dataItem]["side-03"]["element-name"]}), S4 (${wizardParametrs[dataItem]["side-04"]["element-name"]})`;
      } else if (dataItem === 'color') {
        textElement.textContent = `Frame (${wizardParametrs[dataItem]["frame"] ? wizardParametrs[dataItem]["frame"] : "None"}), Roof (${wizardParametrs[dataItem]["roof"] ? wizardParametrs[dataItem]["roof"] : "None"}), Sunscreen (${wizardParametrs[dataItem]["sunscreen"] ? wizardParametrs[dataItem]["sunscreen"] : "None"}),`;
      } else if (dataItem === 'size') {
        if (wizardParametrs[dataItem]["element-name"] === 'Q1') {
          textElement.textContent = '3.1 X 3.1 YD';
        } else if (wizardParametrs[dataItem]["element-name"] === 'Q2') {
          textElement.textContent = '4.1 X 4.1 YD';
        }
      } else {
        textElement.textContent = wizardParametrs[dataItem] ? wizardParametrs[dataItem]["element-name"] : "None";
      }
    });
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
  wizardParametrs['size'] = { "element-name": "Q01" };
  wizardParametrs['roof'] = { "element-name": "Solid Panels", "accessory1-name": "None" };
  wizardParametrs['sides'] = {
    'side-01': { "element-name": "Slider Door", "accessory1-name": "None", "accessory2-name": "None" },
    'side-02': { "element-name": "Glass Window", "accessory1-name": "None", "accessory2-name": "None" },
    'side-03': { "element-name": "Solid Panels", "accessory1-name": "None", "accessory2-name": "None" },
    'side-04': { "element-name": "Solid Panels", "accessory1-name": "None", "accessory2-name": "None" },
  };
  wizardParametrs['attachment'] = { "element-name": "" };
  wizardParametrs['light'] = { "element-name": "" };
  wizardParametrs['color'] = { "frame": "Black" };

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
      } else if (tabName !== 'last') {
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

  function reactiveAccesory(accessory) {
    accessory.firstChild.classList.remove('active');
    // change icon to default
    changeIconBack(accessory.firstChild);
  };

  function handleClick(tabText, target) {
    const dataName = target.getAttribute('data-name');
    const dataTab = target.closest('[data-tab]').getAttribute('data-tab');
    if (dataName !== 'null' && dataName !== null) {
      wizardParametrs[tabText] = { "element-name": dataName };
    }
    updateCodeElement();
    handleSession();
  };


  function handleAccessoriesClick(tabText, target) {
    const dataAccessory = target.parentElement.getAttribute('data-accessory-name');
    const dataSide = target.parentElement.getAttribute('data-side') ? target.parentElement.getAttribute('data-side') : null;
    const dataTab = target.closest('[data-tab]').getAttribute('data-tab');
    // get index of clicked element with visible class
    const index = [...target.parentElement.parentElement.querySelectorAll('.wizard-sidebar__element.visible')].indexOf(target.parentElement);

    if (dataAccessory !== 'null' && dataAccessory !== null && dataSide === null) {
      if (!target.classList.contains('active')) {
        if (dataAccessory === 'No accessories') {
          for (let i = 0; i < 6; i++) {
            delete wizardParametrs[tabText][`accessory0${i}-name`];
          }
          wizardParametrs[tabText][`accessory1-name`] = 'None';
        } else {
          // remove None from wizardParametrs[tabText][`accessory0-name`]
          if (wizardParametrs[tabText][`accessory1-name`] === 'None') {
            delete wizardParametrs[tabText][`accessory1-name`];
          }
          wizardParametrs[tabText][`accessory${index}-name`] = dataAccessory;
        }
      } else {
        // remove current accessory from wizardParametrs
        delete wizardParametrs[tabText][`accessory${index}-name`];

        // check if there is no active accessory, then add No accessories to the wizardParametrs as None
        const accessories = target.parentElement.parentElement.querySelectorAll('.wizard-sidebar__element.visible');
        let activeAccessory = false;
        accessories.forEach(accessory => {
          if (accessory.getAttribute('data-accessory-name') !== 'No accessories') {
            if (accessory.querySelector('input').checked) {
              activeAccessory = true;
            }
          }
        });
        if (!activeAccessory) {
          // add None to wizardParametrs
          wizardParametrs[tabText][`accessory1-name`] = 'None';
        }
      }
      // add target parent to accessoriesParametrs
      accessoriesParametrs[dataTab] = target.parentElement;
    }
    updateCodeElement();
    handleSession();
  };

  function handleAccessoriesSideClick(tabText, target) {
    const dataAccessory = target.parentElement.getAttribute('data-accessory-name');
    const dataSide = target.parentElement.getAttribute('data-side') ? target.parentElement.getAttribute('data-side') : null;
    const dataTab = target.closest('[data-tab]').getAttribute('data-tab');
    // get index of clicked element with visible class
    const index = [...target.parentElement.parentElement.querySelectorAll('.wizard-sidebar__element.visible')].indexOf(target.parentElement);

    if (dataAccessory !== 'null' && dataAccessory !== null && dataSide !== 'null' && dataSide !== null) {

      if (!target.classList.contains('active')) {
        if (dataAccessory === 'No accessories') {
          for (let i = 0; i < 6; i++) {
            delete wizardParametrs[tabText][dataSide][`accessory${i}-name`];
          }
          wizardParametrs[tabText][dataSide][`accessory1-name`] = 'None';
        } else {
          // remove None from wizardParametrs[tabText][`accessory0-name`]
          if (wizardParametrs[tabText][dataSide][`accessory1-name`] === 'None') {
            delete wizardParametrs[tabText][dataSide][`accessory1-name`];
          }
          wizardParametrs[tabText][dataSide][`accessory${index}-name`] = dataAccessory;
        }
      } else {
        // remove current accessory from wizardParametrs
        delete wizardParametrs[tabText][dataSide][`accessory${index}-name`];

        // check if there is no active accessory, then add No accessories to the wizardParametrs as None
        const accessories = target.parentElement.parentElement.querySelectorAll('.wizard-sidebar__element.visible');
        let activeAccessory = false;
        accessories.forEach(accessory => {
          if (accessory.getAttribute('data-accessory-name') !== 'No accessories') {
            if (accessory.querySelector('input').checked) {
              activeAccessory = true;
            }
          }
        });
        if (!activeAccessory) {
          // add None to wizardParametrs
          wizardParametrs[tabText][dataSide][`accessory1-name`] = 'None';
        }
      }
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
    wizardAccessoriesSidebar.style.display = "block";
    wizardAccessoriesSidebar.classList.add('active');

    checkIfAccessoriesHasActiveElement()
  };

  // function to close accessories sidebar
  function closeAccessoriesSidebar() {
    wizardAccessoriesSidebar.classList.remove('active');

    setTimeout(() => { wizardAccessoriesSidebar.style.display = "none" }, 500);

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
        if (elementDataSide === accessoriesDataSide && element.getAttribute('data-accessory-to') === accessoriesDataName) {
          // add class visible to wizardAccessoriesWrapper
          element.classList.add('visible');
        } else {
          element.classList.remove('visible');
        }
      });
    } else if (accessoriesDataName !== 'null' && accessoriesDataName !== null && accessoriesDataSide === 'null' || accessoriesDataSide === null) {
      // go trough wizardAccessoriesWrappers and find the one with data-name and data-option
      accessoriesElements.forEach(element => {
        const elementDataName = element.getAttribute('data-accessory-to');
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
      const elementDataName = element.getAttribute('data-accessory-name');
      // check in object if there is element-accessory and if it is equal to elementDataName
      if (accessoriesDataSide === null || accessoriesDataSide === 'null') {
        // get wizardParametrs[accessoriesDataTab] and go trough all values and check if there is element-accessory and if it is equal to elementDataName
        if (wizardParametrs[accessoriesDataTab]) {
          Object.values(wizardParametrs[accessoriesDataTab]).forEach(value => {
            if (value === elementDataName) {
              console.log(elementDataName)
              // add class active to input
              element.firstElementChild.classList.add('active');
              // add checked attribute to input
              element.firstElementChild.setAttribute('checked', true);
              activeElement = true;
            }
          });
        }
      } else if (accessoriesDataSide !== null || accessoriesDataSide !== 'null') {
        // get wizardParametrs[accessoriesDataTab][accessoriesDataSide] and go trough all values and check if there is element-accessory and if it is equal to elementDataName
        if (wizardParametrs[accessoriesDataTab][accessoriesDataSide]) {
          Object.values(wizardParametrs[accessoriesDataTab][accessoriesDataSide]).forEach(value => {
            if (value === elementDataName) {
              // add class active to input
              element.firstElementChild.classList.add('active');
              // add checked attribute to input
              element.firstElementChild.setAttribute('checked', true);
              activeElement = true;
            }
          });
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
    if (element.getAttribute('data-accessory-name') === 'No accessories') {
      // add class active to input
      accessoryLabel.classList.add('active');
      // add checked attribute to input
      accessoryLabel.setAttribute('checked', true);
      // add first order in grid to element
      element.style.order = -1;
      // change icon
      changeIcon(accessoryLabel);

      // update price
      updateCodeElement();
      handleSession();
    }
  };

  // function to check if visible elems has active class besides No accessories
  function checkIfAccessoriesHasActiveElement() {
    //get visible accessories elements
    let visibleAccessoriesElements = document.querySelectorAll('.wizard-sidebar__elements-list.is--accessories .wizard-sidebar__element.visible');

    // check if any of visible elements have active class besides No accessories, if no one has, then add active class to No accessories
    let activeElement = false;
    visibleAccessoriesElements.forEach(element => {
      if (element.getAttribute('data-accessory-name') !== 'No accessories') {
        if (element.firstChild.classList.contains('active')) {
          activeElement = true;
        }
      }
    });
    if (!activeElement) {
      visibleAccessoriesElements.forEach(element => {
        handleAccessoriesNoAccessories(element);
      });
      activeElement = false;
    } else {
      // reactive No accessories
      visibleAccessoriesElements.forEach(element => {
        if (element.getAttribute('data-accessory-name') === 'No accessories') {
          reactiveAccesory(element);
        }
      });
    }
  }

  // function to inactive elements in accessories sidebar if they are not in wizardParametrs
  function handleAccessoriesInactiveElements() {
    // go through all accessories elements
    accessoriesElements.forEach(element => {
      // get data-accessory-to
      const elementDataName = element.getAttribute('data-accessory-to');
      // get data-side
      const elementDataSide = element.getAttribute('data-side') ? element.getAttribute('data-side') : null;

      // check if elementDataSide is null or not
      if (elementDataSide === null || elementDataSide === 'null') {
        // dive loop for nested object wizardParametrs
        let activityFlag = false;
        for (const [key, value] of Object.entries(wizardParametrs)) {
          // check if value is object
          if (typeof value === 'object') {
            // go trough all values in object
            Object.values(value).forEach(val => {
              // check if val is equal to elementDataName
              if (val === elementDataName) {
                activityFlag = true;
              }
            });
          } else {
            // check if value is equal to elementDataName
            if (value === elementDataName) {
              activityFlag = true;
            }
          }
        }

        // if activityFlag is false, then remove active class from element
        if (!activityFlag) {
          element.firstChild.classList.remove('active');
          // change icon to default
          changeIconBack(element.firstChild);
        }

      } else if (elementDataSide !== null || elementDataSide !== 'null') {
        // dive loop for nested object wizardParametrs
        let activityFlag = false;
        for (const [key, value] of Object.entries(wizardParametrs)) {
          // check if value is object
          if (typeof value === 'object') {
            // go trough all values in object
            Object.values(value).forEach(val => {
              // check if val is object
              if (typeof val === 'object') {
                // go trough all values in object
                Object.values(val).forEach(v => {
                  // check if v is equal to elementDataName
                  if (v === elementDataName) {
                    activityFlag = true;
                  }
                });
              }
            });
          }
        }

        // if activityFlag is false, then remove active class from element
        if (!activityFlag) {
          element.firstChild.classList.remove('active');
          // change icon to default
          changeIconBack(element.firstChild);
        }
      }
    });
  };


  // Adding click event listeners to wizardAccessoriesTriggers
  wizardAccessoriesTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      handleAccessories(e.target);
      // add to accessoriesParametrs object data-tab 
      accessoriesParametrs[e.target.closest('[data-tab]').getAttribute('data-tab')] = {};
      checkIfAccessoriesHasActiveElement()
    });
  });

  // ----------------- Handling color toggle -----------------
  // on click toggle color elements
  if (colorToggle) {
    colorToggle.addEventListener('click', (e) => {
      // if colorToggle has active class, then remove it and remove active class from all color elements
      if (e.target.classList.contains('is--active')) {
        e.target.classList.remove('is--active');
      } else {
        e.target.classList.add('is--active');
      }

      colorElements.forEach(element => {
        element.addEventListener('click', (e) => {
          // get input inside
          if (colorToggle.classList.contains('is--active')) {
            const input = e.currentTarget.querySelector('input').value;

            // find all input with other value in .color-tab__content-raw.is--default and deactivate it
            const otherInputs = document.querySelectorAll(`.color-tab__content-raw.is--default input:not([value="${input}"])`);
            console.log(otherInputs)
            otherInputs.forEach(input => {
              input.parentElement.checked = false;
              input.previousElementSibling.classList.remove('w--redirected-checked');
            });


            // find all input with same value in .color-tab__content-raw.is--default and activate it
            const sameInputs = document.querySelectorAll(`.color-tab__content-raw.is--default input[value="${input}"]`);
            console.log(sameInputs)
            sameInputs.forEach(input => {
              input.parentElement.checked = true;
              input.previousElementSibling.classList.add('w--redirected-checked');
            });
          }
        });
      });
    });
  }

  // function to handle first color elements
  function handleFirstColorActive() {
    if (colorElementsWrapper) {
      colorElementsWrapper.forEach(wrapper => {
        const visibilityParent = wrapper.closest('.color-tab__content-raw.is--default');

        if (visibilityParent) {
          const radioElements = wrapper.querySelectorAll('.w-form-formradioinput--inputType-custom');

          radioElements.forEach((element, i) => {
            if (i === 0) {
              element.parentElement.checked = true;
              element.classList.add('w--redirected-checked');
            } else {
              element.parentElement.checked = false;
              element.classList.remove('w--redirected-checked');
            }
          });

        }
      });
    }
  }
  handleFirstColorActive();

  //go trough color wrappers and add event listener on click, get data-color, add this color as key to wizardParametrs and add value of clicked element as value
  colorElementsWrapper.forEach(wrapper => {
    wrapper.addEventListener('click', (e) => {
      // if colorToggle has active class, then get from all wrappers data-color
      if (colorToggle.classList.contains('is--active')) {
        const colors = document.querySelectorAll('.color-tab__content-raw.is--default .color-elements__list');
        colors.forEach(color => {
          const dataColor = color.getAttribute('data-color');
          const input = color.querySelector('.color-radio__button.w--redirected-checked').nextElementSibling.value;

          wizardParametrs["color"][dataColor] = input;
        });
      } else {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') {
          // get data-color from wrapper
          const dataColor = wrapper.getAttribute('data-color');
          // get value of clicked element if it is input, else get value of input inside
          const value = e.target.tagName === 'INPUT' ? e.target.value : e.target.querySelector('input').value;

          // add to wizardParametrs
          wizardParametrs["color"][dataColor] = value;
        }
      }
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

  // Handling formating the price view, if price 1500, then 1,500 etc
  function transfroPriceToString(price) {
    // change the price to string
    const priceString = price.toString();

    // if price is more than 3 digits, then add comma
    if (priceString.length > 3) {
      const priceArr = priceString.split('');
      priceArr.splice(priceArr.length - 3, 0, ',');
      price = priceArr.join('');
    }

    return price;
  }

  // Handling update price
  const updatePrice = (price) => {
    // const checkoutShipping = document.querySelector('#shipping');
    // const checkoutTotal = document.querySelector('#total');
    if (price === undefined || price === null) {
      console.error('Price is undefined or null');
      return;
    } else {
      // get shipping text and transform it to number
      const shippingText = checkoutShipping.textContent;
      const shipping = parseInt(shippingText.replace(/\D/g, ''));

      const totalPrice = price + shipping;

      // add price to amount
      amount = price;
      // add amout to cookies
      document.cookie = `amount=${amount}`;

      totalPriceText.textContent = '$' + transfroPriceToString(price);
      checkoutSubtotal.textContent = '$' + transfroPriceToString(price);
      checkoutShipping.textContent = '$' + transfroPriceToString(shipping);
      checkoutTotal.textContent = '$' + transfroPriceToString(totalPrice);

      // add price, shipping and total price to local storage
      localStorage.setItem('price', checkoutSubtotal.textContent);
      localStorage.setItem('shipping', checkoutShipping.textContent);
      localStorage.setItem('totalPrice', checkoutTotal.textContent);
    }
  };
};

export default initializeWizard;