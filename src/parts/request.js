const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "size": {},
  "roof": {},
  "sides": {
    "side-01": {
      "basic-options": {
        "element-name": "Glass Window"
      },
      "variations": {
        "element-name": "Smart Glass Window"
      }
    },
    "side-02": {
      "basic-options": {
        "element-name": "Panel Wall"
      },
      "variations": {
        "element-name": "Portal Window"
      }
    },
    "side-03": {
      "basic-options": {
        "element-name": "Panel Wall"
      },
      "variations": {
        "element-name": "Smart Glass Window"
      }
    },
    "side-04": {
      "basic-options": {
        "element-name": "Panel Wall"
      },
      "variations": {
        "element-name": "Smart Glass Window"
      }
    }
  },
  "attachment": {},
  "light": {},
  "floor": {},
  "accessories": {}
});

const raw2 = JSON.stringify({
  "size": {},
  "roof": {},
  "sides": {
    "side-01": {
      "basic-options": {
        "element-name": "Panel Wall"
      },
      "variations": {
        "element-name": "Portal Window"
      }
    },
    "side-02": {
      "basic-options": {
        "element-name": "Panel Wall"
      },
      "variations": {
        "element-name": "Portal Window"
      }
    },
    "side-03": {
      "basic-options": {
        "element-name": "Panel Wall"
      },
      "variations": {
        "element-name": "Smart Glass Window"
      }
    },
    "side-04": {
      "basic-options": {
        "element-name": "Panel Wall"
      },
      "variations": {
        "element-name": "Smart Glass Window"
      }
    }
  },
  "attachment": {},
  "light": {},
  "floor": {},
  "accessories": {}
});


console.log(raw)

// Step 1: Create a session
const sessionCreateOptions = {
  method: 'POST',
  headers: myHeaders, // Define your headers
  body: raw, // Define your request body
  redirect: 'follow'
};

fetch("https://api3dwizard.ozero.aegas.it/sessions?projectId=1", sessionCreateOptions)
  .then(response => response.json()) // Assuming the response is JSON
  .then(sessionData => {
    const sessionId = sessionData.sessionId; // Assuming the ID is accessible in the session data
    console.log(sessionId)

    var rawRequestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw2,
      redirect: 'follow'
    };
    
    fetch(`https://api3dwizard.ozero.aegas.it/sessions/${sessionId}/raw-data`, rawRequestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)

        const requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        
        fetch(`https://api3dwizard.ozero.aegas.it/sessions/${sessionId}`, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
    

      })
      .catch(error => console.log('error', error));


    // Step 2: Fetch checkout information using the obtained session ID
    /*
    const stripeRequestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch(`https://api3dwizard.ozero.aegas.it/sessions/${sessionId}/checkout`, stripeRequestOptions)
      .then(response => response.json()) // Assuming the response is JSON
      .then(async checkoutData => {
        const clientSecret = checkoutData.client_secret; // Assuming client_secret is accessible in the checkout data
        
        // Step 3: Use the client secret for Stripe Checkout
        const stripe = await loadStripe('pk_test_51AROWSJX9HHJ5bycpEUP9dK39tXufyuWogSUdeweyZEXy3LC7M8yc5d9NlQ96fRCVL0BlAu7Nqt4V7N5xZjJnrkp005fDiTMIr'); // Replace with your Stripe public key
        stripe.redirectToCheckout({ sessionId: clientSecret })
          .then(result => {
            if (result.error) {
              console.error(result.error);
              // Handle any errors during redirect to Checkout
            }
          });
      })
      .catch(error => console.log('Error fetching checkout data:', error));
      */
  })
  .catch(error => console.log('Error creating session:', error));