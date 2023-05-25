'use strict';


// UPDATE WITH TEST PK
var stripePk = 'pk_test_xxxxxxx';

// UPDATE WITH STRIPE ACCOUNT ID
var stripeAccountId = 'acct_xxxxxxxxx';

// UPDATE WITH SECRET FROM A SETUP_INTENT
var clientSecret = 'seti_1NBlWXT6HohJS0qUVn3KIeoy_secret_NxguG0xtnhsNT5iVz77taxLfkc81aYD'; 



const stripe = Stripe(stripePk, {
  stripeAccount: stripeAccountId
});

// Set up Stripe.js and Elements to use in checkout form
var elements = stripe.elements();
var style = {
  base: {
    color: "#32325d",
  }
};

var card = elements.create("card", { style: style });
card.mount("#card-element");

card.on('change', ({error}) => {
  let displayError = document.getElementById('card-errors');
  if (error) {
    displayError.textContent = error.message;
  } else {
    displayError.textContent = '';
  }
});

var form = document.getElementById('payment-form');

form.addEventListener('submit', function(ev) {
  ev.preventDefault();
  // If the client secret was rendered server-side as a data-secret attribute
  // on the <form> element, you can retrieve it here by calling `form.dataset.secret`

  stripe.confirmCardSetup(clientSecret, {
    payment_method: {
      card: card,
      billing_details: {
        name: 'xxx'
      }
    }
  }).then(function(result) {
    if (result.error) {
      // Show error to your customer (for example, insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.setupIntent.status === 'succeeded') {
        document.getElementById('messages').innerHTML = '<br>setup_intent: ' + result.setupIntent.id + '<br>payment_method: ' + result.setupIntent.payment_method + '<br>';
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  });
});

