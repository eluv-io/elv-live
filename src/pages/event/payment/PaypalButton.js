import React, { useState, useRef, useEffect } from 'react';
import { Redirect } from 'react-router-dom'
import { useHistory } from "react-router";

const PaypalButton = ({ product, email, turnOffModal }) => {
  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState(null);
  const [stateEmail, setEmail] = useState(email);

  const paypalRef = useRef();
  const history = useHistory();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: function(data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
          purchase_units: [{
            description:"RO3 Paypal Test",
            amount: {
              currency_code: 'USD',
              value: 30
            }
          }]
        });
      },
      style: {
        color:  'gold',
        shape:  'pill',
        label:  'paypal',
        size: 'responsive',
        height: 45
      },
      funding: {
        allowed: [ paypal.FUNDING.CARD ],
        disallowed: [ paypal.FUNDING.CREDIT ]
       },
       onApprove: function(data, actions) {
        // const order = await actions.order.capture();
        turnOffModal();
        history.push({
          pathname: `/success/test@gmail.com/testID123`
         });
      },

        // onError: err => {
        //   setError(err);
        //   console.error(err);
        // },
      })
      .render(paypalRef.current);
  }, []);

  if (paidFor) {
    return (
      <div>
        <img alt={product.description} src={gif} />
      </div>
    );
  }

  return (
    <div>
      <div ref={paypalRef} />
    </div>
  );
};
export default PaypalButton;
