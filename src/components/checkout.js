import { loadStripe } from '@stripe/stripe-js';

const checkout = async (sessionId, amount) => {
  initialize();
  async function initialize() {
    const response = await fetch(`https://api3dwizard.ozero.aegas.it/sessions/${sessionId}/checkout`, {
      method: 'GET',
      redirect: 'follow'
    });
    const stripe = await loadStripe("pk_test_51MUELBG2BGcSuzlBbE8Y3jkJMllhaLM6RzCOnVVMtyRgrS4OJkC4KeKE5paS5jqx1okOXjl8xWqKaIvCrqztjWq400m2Qg3JWN");

    const { clientSecret } = await response.json();

    const addressOptions = { mode: 'shipping' };

    const appearance = {
      theme: 'flat',
    };

    const options = {
      currency: 'usd',
      amount: amount,
    };

    const elements = stripe.elements({
      appearance, 
      clientSecret,
      options
    });


    const addressElement = elements.create('address', addressOptions);
    const paymentElement = elements.create('payment');

    addressElement.mount('#address-element');
    paymentElement.mount('#payment-element');
  }
};

/*
const checkout = async (sessionId) => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch(`https://api3dwizard.ozero.aegas.it/sessions/${sessionId}/checkout`, requestOptions)
    .then(response => response.text())
    .then(async result => {
      const stripePromise = loadStripe("pk_test_51MUELBG2BGcSuzlBbE8Y3jkJMllhaLM6RzCOnVVMtyRgrS4OJkC4KeKE5paS5jqx1okOXjl8xWqKaIvCrqztjWq400m2Qg3JWN");
      
      // getting client secret
      result = JSON.parse(result);
      const clientSecret = result.clientSecret;

      const initializeStripe = async () => {
        try {
          const stripe = await stripePromise;
          console.log('Fetched Stripe instance:', stripe);

          // Confirm the value of clientSecret
          console.log('Client Secret:', clientSecret);

          // Verify the format and content of clientSecret
          if (!clientSecret.startsWith('cs_')) {
            throw new Error('Invalid client secret format');
          }

          // Use stripe.initEmbeddedCheckout
          const checkout = await stripe.initEmbeddedCheckout({
            clientSecret,
          });

          // Ensure checkout object is properly initialized
          console.log('Initialized Checkout:', checkout);

          // Proceed with other checkout logic
          checkout.mount('#checkout');
        } catch (error) {
          console.error('Error initializing Stripe:', error);
        }
      };

      initializeStripe();
    })
    .catch(error => console.log('error', error));
};
*/

export default checkout;