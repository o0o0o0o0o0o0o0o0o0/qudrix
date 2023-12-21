import { loadStripe } from '@stripe/stripe-js';

const checkout = async (sessionId) => {
  const stripe = await loadStripe("pk_test_51MUELBG2BGcSuzlBbE8Y3jkJMllhaLM6RzCOnVVMtyRgrS4OJkC4KeKE5paS5jqx1okOXjl8xWqKaIvCrqztjWq400m2Qg3JWN");
  let elements = await initialize();

  document
    .getElementById("payment-form")
    .addEventListener("submit", handleSubmit);
  async function initialize() {
    const response = await fetch(`https://api3dwizard.ozero.aegas.it/sessions/${sessionId}/checkout`, {
      method: 'GET',
      redirect: 'follow'
    });
    

    const { clientSecret } = await response.json();

    const addressOptions = { 
      mode: 'shipping',
    };

    const appearance = {
      theme: 'flat',
    };

    let elements = stripe.elements({
      appearance, 
      clientSecret
    });


    const addressElement = elements.create('address', addressOptions);
    const paymentElement = elements.create('payment');

    addressElement.mount('#address-element');
    paymentElement.mount('#payment-element');

    return elements;
  }



  async function handleSubmit(e) {
    e.preventDefault();
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://qudrix.webflow.io/success",
      },
    });
    if (error.type === "card_error" || error.type === "validation_error") {
      showMessage(error.message);
    } else {
      showMessage("An unexpected error occurred.");
    }

    setLoading(false);
  }


    /*
  // Fetches the payment intent status after payment submission
  async function checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

    switch (paymentIntent.status) {
      case "succeeded":
        showMessage("Payment succeeded!");
        break;
      case "processing":
        showMessage("Your payment is processing.");
        break;
      case "requires_payment_method":
        showMessage("Your payment was not successful, please try again.");
        break;
      default:
        showMessage("Something went wrong.");
        break;
    }
  }
  */
};

export default checkout;