function handleSuccess() {
  const wizardParametrsFromLocalStorage = JSON.parse(localStorage.getItem('wizardParametrs'));
  if (wizardParametrsFromLocalStorage) {
    const summaryItems = document.querySelectorAll('.wizard-summary__list-item');

    // go trough summary items and check data-item attr
    summaryItems.forEach(item => {
      const dataItem = item.getAttribute('data-item');

      const textElement = item.querySelector('.text-color-gray');

      if (dataItem === 'sides') {
        textElement.textContent = `S1 (${wizardParametrsFromLocalStorage[dataItem]["side-01"]["element-name"]}), S2 (${wizardParametrsFromLocalStorage[dataItem]["side-02"]["element-name"]}), S3 (${wizardParametrsFromLocalStorage[dataItem]["side-03"]["element-name"]}), S4 (${wizardParametrsFromLocalStorage[dataItem]["side-04"]["element-name"]})`;
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

  // get price, shipping and total price from local storage
  const price = localStorage.getItem('price');
  const shipping = localStorage.getItem('shipping');
  const total = localStorage.getItem('totalPrice');

  const checkoutSubtotal = document.querySelector('#subtotal');
  const checkoutShipping = document.querySelector('#shipping');
  const checkoutTotal = document.querySelector('#total');

  checkoutSubtotal.textContent = price;
  checkoutShipping.textContent = shipping;
  checkoutTotal.textContent = total;
}

export default handleSuccess;