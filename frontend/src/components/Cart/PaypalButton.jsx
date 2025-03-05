import React from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'


const PaypalButton = ({ amount, onSuccess, onError }) => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": "Aa6tt8pSvdrKNdvljnWFZ8ZZe6KdBjqFNf__y6ILo1boBxaLrYQByTVkZo7DZQgd3CTc_hMsdipL-mlP"
      }}>

      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: amount } }],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(onSuccess);
        }}
        onError={onError}
      />

    </PayPalScriptProvider>
  )
}

export default PaypalButton