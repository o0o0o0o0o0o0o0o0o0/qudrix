function formatingPrice() {
  // get all .item-price elements
  const itemPrice = document.querySelectorAll('.item-price');

  // loop through all .item-price elements
  itemPrice.forEach((elem) => {
    // check if element has textContent 
    if (elem.textContent !== '') {
      // get textContent from element and convert it from 5000 to +$5,000
      let price = elem.textContent;
      price = price.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
      price = `+$${price}`;
      // set new textContent to element
      elem.textContent = price;
    }
  });
}

export default formatingPrice;