import initSession from "../parts/initSession";
import updateSession from "../parts/updateSession";

const initializeWizard = () => {
  // Selecting DOM elements
  const codeElement = document.querySelector('pre');
  const wizardTabLinks = document.querySelectorAll('.wizard-tab__nav-link div');
  const wizardTab = document.querySelectorAll('.wizard-tab__content-item');
  const totalPriceText = document.querySelector('#total-price');
  // Session id
  let sessionId;

  // Creating wizardParametrs object
  const wizardParametrs = {};

  // Function to handle radio list click event
  function handleRadioListClick(e) {
    const clickedElement = e.target;
    console.log(clickedElement)
    // Check if the click was on a label or an input
    if (clickedElement.tagName === 'LABEL' || clickedElement.tagName === 'INPUT') {
      const radioList = clickedElement.closest('.radio-trigger'); // Replace with your radio list class
      console.log(clickedElement)
      if (radioList) {
        const labels = radioList.querySelectorAll('label');

        // Remove 'active' class from all labels
        labels.forEach(label => {
          label.classList.remove('active');
        });

        // Add 'active' class to the clicked label or its parent label
        if (clickedElement.tagName === 'LABEL') {
          clickedElement.classList.add('active');
          clickedElement.querySelector('input').checked = true;
        } else if (clickedElement.tagName === 'INPUT') {
          clickedElement.parentElement.classList.add('active');
          clickedElement.checked = true;
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
    wizardParametrs['roof'] = {"element-name": "Mirror Glass"};
    wizardParametrs['sides'] = {
      'side-01': {"element-name": "Panel Wall"},
      'side-02': {"element-name": "Panel Wall"},
      'side-03': {"element-name": "Panel Wall"},
      'side-04': {"element-name": "Panel Wall"},
    };
    wizardParametrs['attachment'] = {"element-name": ""};
    wizardParametrs['light'] = {"element-name": ""};
    wizardParametrs['floor'] = {"element-name": "Laminate"};
    wizardParametrs['accessories'] = {"element-name": ""};

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
            }
          }
        } else if (wizardParametrs[tabName]) {
          if (wizardParametrs[tabName]["element-name"] === dataName) {
            radio.parentElement.classList.add('active');
            radio.checked = true;
          }
        } else if(tabName === 'size') {
          if (wizardParametrs[tabName]["element-name"] === dataName) {
            radio.parentElement.classList.add('active');
            radio.checked = true;
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
    }

    updateCodeElement();

    // Handling init and update session
    function handleSession(){
      if(!sessionId){
        // init session
        initSession(wizardParametrs)
          .then(sessionData => {
            console.log(sessionData.sessionId);
            // update price
            updatePrice(sessionData.price);
            // update session id
            sessionId = sessionData.sessionId;
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
      totalPriceText.textContent = `$${price}`
    };
};

export default initializeWizard;