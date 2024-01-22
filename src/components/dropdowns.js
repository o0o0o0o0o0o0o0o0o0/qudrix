function handleDropdown() {
  // Get the dropdowns element
  const dropdown = document.querySelectorAll('.dropdown');

  // function to open dropdown
  const openDropdown = (elem) => {
    elem.classList.add('dropdown-open');
  };

  // function to close dropdown
  const closeDropdown = (elem) => {
    elem.classList.remove('dropdown-open');
  };

  // function to toggle dropdown
  const toggleDropdown = (elem) => {
    if (elem.classList.contains('dropdown-open')) {
      closeDropdown(elem);
    } else {
      openDropdown(elem);
    }
  };

  // first dropdown is open by default
  openDropdown(dropdown[0]);

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
}

export default handleDropdown;