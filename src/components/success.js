function handleSuccess() {
  const wizardParametrsFromLocalStorage = JSON.parse(localStorage.getItem('wizardParametrs'));
  if (wizardParametrsFromLocalStorage) {
    const summaryItems = document.querySelectorAll('.wizard-summary__list-item');

    // go trough summary items and check data-item attr
    summaryItems.forEach(item => {
      const dataItem = item.getAttribute('data-item');

      const textElement = item.querySelector('.text-color-gray');

      if (dataItem === 'sides') {
        textElement.textContent = `Side 1 (${wizardParametrsFromLocalStorage[dataItem]["side-01"]["element-name"]}), Side 2 (${wizardParametrsFromLocalStorage[dataItem]["side-02"]["element-name"]}), Side 3 (${wizardParametrsFromLocalStorage[dataItem]["side-03"]["element-name"]}), Side 4 (${wizardParametrsFromLocalStorage[dataItem]["side-04"]["element-name"]})`;
      } else if (dataItem === 'color') {
        textElement.textContent = `Frame (${wizardParametrsFromLocalStorage[dataItem]["frame"] ? wizardParametrsFromLocalStorage[dataItem]["frame"] : "None"}), Roof (${wizardParametrsFromLocalStorage[dataItem]["roof"] ? wizardParametrsFromLocalStorage[dataItem]["roof"] : "None"}), Sunscreen (${wizardParametrsFromLocalStorage[dataItem]["sunscreen"] ? wizardParametrsFromLocalStorage[dataItem]["sunscreen"] : "None"}),`;
      } else if (dataItem === 'size') {
        if (wizardParametrsFromLocalStorage[dataItem]["element-name"] === 'Q1') {
          textElement.textContent = '3.1 X 3.1 YD';
        } else if (wizardParametrsFromLocalStorage[dataItem]["element-name"] === 'Q2') {
          textElement.textContent = '4.1 X 4.1 YD';
        }
      } else {
        textElement.textContent = wizardParametrsFromLocalStorage[dataItem] ? wizardParametrsFromLocalStorage[dataItem]["element-name"] : "None";
      }
    });
  }
}

export default handleSuccess;