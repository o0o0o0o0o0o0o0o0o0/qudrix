import './styles/style.css'

const radioLists = document.querySelectorAll('.wizard-sidebar__elements-list');
const codeElement = document.querySelector('pre');
const wizardTabLinks = document.querySelectorAll('.wizard-tab__nav-link div');
const wizardTab  = document.querySelectorAll('.wizard-tab__content-item');

const wizardParametrs = {};

radioLists.forEach(radioList => {
  // on click on list check if event target is label or radio button
  radioList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LABEL') {
      radioList.querySelectorAll('label').forEach(label => {
        label.classList.remove('active');
      });
      e.target.classList.add('active');
    }
    if (e.target.tagName === 'INPUT') {
      radioList.querySelectorAll('label').forEach(label => {
        label.classList.remove('active');
      });
      e.target.parentElement.classList.add('active');
    }
  });
});

// based on wizardTabLinks text content add this text to wizardParametrs object
wizardTabLinks.forEach((link, i) => {
  // if it's not Summury
  if (link.textContent !== 'Summary') {
    wizardParametrs[link.textContent.toLocaleLowerCase()] = {};
    wizardTab[i].setAttribute('data-tab', link.textContent.toLocaleLowerCase());
  }
});

// fuctionn to update codeElement content based on wizardParametrs object
const updateCodeElement = () => {
  codeElement.textContent = JSON.stringify(wizardParametrs, null, 2).replace(/,/g, ',\n');
}


// get elements with data-tab attribute
const wizardTabContent = document.querySelectorAll('[data-tab]');

// check inside wizardTabContent if it has elements with attr data-side and add side to wizardParametrs with the same key as data-tab
wizardTabContent.forEach(tab => {
  const wizardTabSide = tab.querySelectorAll('[data-side]');
  wizardTabSide.forEach(side => {
    wizardParametrs[tab.dataset.tab][side.dataset.side] = {};
    // add inside each side param keys "basic options" and "variations" with {} as value
    wizardParametrs[tab.dataset.tab][side.dataset.side]['basic-options'] = {};
    wizardParametrs[tab.dataset.tab][side.dataset.side]['variations'] = {};
    // add event listener to each side on click
    side.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT') {
        const dataOption = e.target.parentElement.getAttribute('data-option');
        const dataName = e.target.parentElement.getAttribute('data-name');

        if (dataOption === 'basic-options') {
          if (wizardParametrs[tab.dataset.tab][side.dataset.side]['basic-options'].hasOwnProperty(dataName)) {
            // Element exists, replace its value with a new name
            wizardParametrs[tab.dataset.tab][side.dataset.side]['basic-options']["element-name"] = dataName;
          } else {
            // Element doesn't exist, add a new element
            wizardParametrs[tab.dataset.tab][side.dataset.side]['basic-options']["element-name"] = dataName;
          }
        } else {
          if (wizardParametrs[tab.dataset.tab][side.dataset.side]['variations'].hasOwnProperty(dataName)) {
            // Element exists, replace its value with a new name
            wizardParametrs[tab.dataset.tab][side.dataset.side]['variations']["element-name"] = dataName;
          } else {
            // Element doesn't exist, add a new element
            wizardParametrs[tab.dataset.tab][side.dataset.side]['variations']["element-name"] = dataName;
          }
        }
        updateCodeElement();
      }
    });
  });
});





updateCodeElement();