function handleDropdown() {
  // Get the dropdowns element
  const dropdown = document.querySelectorAll('.dropdown');

  // function to open dropdown
  const openDropdown = (elem) => {
    elem.classList.add('dropdown-open');
    // find dropdown-list and add height of content inside it
    const dropdownList = elem.querySelector('.dropdown-list');

    // get height of dropdown-list
    const height = dropdownList.querySelector('.dropdown-list__content');

    // add height to dropdown-list
    dropdownList.style.height = `${height.offsetHeight}px`;
  };

  // function to close dropdown
  const closeDropdown = (elem) => {
    elem.classList.remove('dropdown-open');
    // find dropdown-list and remove height of content inside it
    const dropdownList = elem.querySelector('.dropdown-list');
    dropdownList.style.height = '0px';
  };

  // function to toggle dropdown
  const toggleDropdown = (elem) => {
    if (elem.classList.contains('dropdown-open')) {
      closeDropdown(elem);
    } else {
      openDropdown(elem);
    }
  };



  // loop through all dropdowns
  dropdown.forEach((elem, i) => {
    // get dropdown button
    const dropdownButton = elem.querySelector('.dropdown-toggle');
    // on click dropdown button close all dropdowns and open clicked dropdown
    dropdownButton.addEventListener('click', () => {
      dropdown.forEach((elem) => {
        closeDropdown(elem);
      });
      toggleDropdown(elem);
    });
  });

  // on page load open first dropdown
  window.addEventListener('DOMContentLoaded', () => {
    openDropdown(dropdown[0]);
  });
}

export default handleDropdown;