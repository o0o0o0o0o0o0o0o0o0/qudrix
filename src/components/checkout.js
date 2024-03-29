import { loadStripe } from '@stripe/stripe-js';

const checkout = async (sessionId) => {
  const devHost = "https://api3dwizard.ozero.aegas.it";
  const prodHost = "https://api.qudrix.com";
  const devPK = "pk_test_51MUELBG2BGcSuzlBbE8Y3jkJMllhaLM6RzCOnVVMtyRgrS4OJkC4KeKE5paS5jqx1okOXjl8xWqKaIvCrqztjWq400m2Qg3JWN";
  const prodPK = "pk_live_51NlJI1BXPjHeXiPV5ekd4In9FDE98fb2V9L53O0ESqmurFepdbWzqBsZyqUvFtYSUpVTcSMIVmuX9TSngLo4N6px00SSWa3Kro";

  const url = window.location.href;
  const host = url.includes("webflow") ? devHost : prodHost;
  const pk = url.includes("webflow") ? devPK : prodPK;
  console.log(pk, host)

  const stripe = await loadStripe(pk);
  let elements = await initialize();



  document
    .getElementById("payment-form")
    .addEventListener("submit", handleSubmit);
  async function initialize() {
    const response = await fetch(`${host}/sessions/${sessionId}/checkout`, {
      method: 'GET',
      redirect: 'follow'
    });


    const { clientSecret } = await response.json();

    const addressOptions = {
      mode: 'shipping',
    };

    const appearance = {
      theme: 'flat',
      rules: {
        '.p-Field': {
          position: 'relative',
          fontFamily: 'Aeonik, sans-serif',
        },
        '.Input': {
          backgroundColor: 'transparent',
          borderBottom: '1px solid #C4C4C4',
          height: '3.56rem',
          letterSpacing: '.0125rem',
          textTransform: 'uppercase',
          marginBottom: '0',
          fontSize: '.625rem',
          borderRadius: '0',
          paddingLeft: '0',
          paddingBottom: '0.88rem',
          paddingTop: '0.38rem',
          marginBottom: '1.5rem',
        },
        '.Input:focus': {
          boxShadow: 'none',
          borderColor: '#161616',
        },
        '.Input--invalid': {
          borderColor: '#CC0300',
          boxShadow: 'none',
        },
        '.Input:autofill': {
          backgroundColor: 'transparent',
        },
        '.Error': {
          color: '#CC0300',
          fontSize: '.625rem',
          letterSpacing: '.0125rem',
          textTransform: 'uppercase',
          marginTop: '0.25rem',
          marginBottom: '0.25rem',
        },
        '.Label': {
          fontSize: '.625rem',
          textTransform: 'uppercase',
          letterSpacing: '.0125rem',
          color: '#161616',
        },
        '.Label--invalid': {
          color: '#CC0300',
        },
        '.CheckboxInput': {
          backgroundColor: 'transparent',
          borderRadius: '100%',
          border: '1px solid #161616',
        },
        '.CheckboxInput--checked': {
          backgroundColor: '#161616',
          borderRadius: '100%',
        },
        '.p-CheckboxInput--focused': {
          boxShadow: 'none',
          outline: 'none',
        },
        '.CheckboxLabel': {
          fontSize: '.625rem',
          textTransform: 'uppercase',
          letterSpacing: '.0125rem',
          color: '#161616',
        },
      }
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
    const prodURL = "https://www.qudrix.com/success";
    const devURL = "https://qudrix.webflow.io/success";

    // check curent url
    const url = window.location.href;
    const returnUrl = url.includes("webflow") ? devURL : prodURL;
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
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