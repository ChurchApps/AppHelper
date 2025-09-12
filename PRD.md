# Add Paypal as a second payment gateway in addition to Stripe.

## Playground Updates

1. There should be a single donation page on the playground of /donations. Remove the current /paypal-donations and /donation-components.
2. If the user is not currently logged in, just the non-auth donation form should show. Use the church with sitekey of "ironwood" or id of "AOjIt0W-SeY" for this form.
3. If the is logged in, they should see the rest of the donation components instead. (auth donation, payment methods, recurring donations, donation history)

## Component Updates

5. The donation forms should load the Stripe components only if the gateway is "Stripe". If it is Paypal it should use the paypal components (if they exist) to take the credit card input, instead of the Stripe components.
