import initializeAnimations from './parts/animations';
import initializePopups from './components/popups';


// ---- Init animations ----
// init animation if it's not /404 url page
if(window.location.pathname !== '/404' && window.location.pathname !== '/wizard/cube') {
  initializeAnimations();
  initializePopups();
}




// Selecting DOM elements
const radioLists = document.querySelectorAll('.radio-trigger');
const codeElement = document.querySelector('pre');
const wizardTabLinks = document.querySelectorAll('.wizard-tab__nav-link div');
const wizardTab = document.querySelectorAll('.wizard-tab__content-item');
const wizardParametrs = {};

if(wizardTabLinks.length > 0) {
// Function to handle radio list click events
function handleRadioListClick(e, radioList) {
  radioLists.forEach(radioList => {
    // on click on list check if event target is label or radio button
    radioList.addEventListener('click', (e) => {
      if (e.target.tagName === 'LABEL') {
        radioList.querySelectorAll('label').forEach(label => {
          label.classList.remove('active');
        });
        e.target.classList.add('active');
        e.target.querySelector('input').checked = true;
      }
      if (e.target.tagName === 'INPUT') {
        radioList.querySelectorAll('label').forEach(label => {
          label.classList.remove('active');
        });
        e.target.parentElement.classList.add('active');
        e.target.checked = true;
      }
    });
  });
};

// Adding click event listeners to radio lists
radioLists.forEach(radioList => {
  radioList.addEventListener('click', (e) => {
    handleRadioListClick(e, radioList);
  });
});

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
wizardParametrs['roof'] = {"element-name": "Panel Wall"};
wizardParametrs['sides'] = {
  'side-01': {"element-name": "Mirror Glass"},
  'side-02': {"element-name": "Mirror Glass"},
  'side-03': {"element-name": "Mirror Glass"},
  'side-04': {"element-name": "Mirror Glass"},
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
}

function handleClick(tabText, target) {
  const dataName = target.getAttribute('data-name');
  if( dataName !== 'null' && dataName !== null) {
    wizardParametrs[tabText] = {"element-name": dataName};
  }
  updateCodeElement();
}

updateCodeElement();
}

