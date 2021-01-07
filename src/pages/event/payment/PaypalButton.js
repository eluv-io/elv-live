import React, { useState, useRef, useEffect } from 'react';
import { Redirect } from 'react-router-dom'
import { useHistory } from "react-router";

const PaypalButton = ({ product, email }) => {
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
            description: "product.description",
            amount: {
              currency_code: 'USD',
              value: 420
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
          history.push({
            pathname: `/success/alec.jo@berkeley.edu/12345test`
         });
          // const order = await actions.order.capture();
          // setPaidFor(true);
          // console.log(order);
        },
        // onError: err => {
        //   setError(err);
        //   console.error(err);
        // },
      })
      .render(paypalRef.current);
  }, [product.description, product.price]);

  if (paidFor) {
    return (
      <div>
        <img alt={product.description} src={gif} />
      </div>
    );
  }

  return (
    <div>
      {/* {error && <div>Uh oh, an error occurred! {error.message}</div>} */}
      <div ref={paypalRef} />
    </div>
  );
};
export default PaypalButton;

//   const [paidFor, setPaidFor] = useState(false);
//   const [error, setError] = useState(null);

//   const paypalRef = useRef();

//   const history = useHistory();



//   useEffect(() => {
//     window.paypal.Buttons({
//       createOrder: function(data, actions) {
//         // This function sets up the details of the transaction, including the amount and line item details.
//         return actions.order.create({
//           purchase_units: [{
//             description: product.description,
//             amount: {
//               currency_code: 'USD',
//               value: product.price
//             }
//           }]
//         });
//       },
//       style: {
//         color:  'gold',
//         shape:  'pill',
//         label:  'paypal',
//         size: 'responsive',
//         height: 45
//       },
//       funding: {
//         allowed: [ paypal.FUNDING.CARD ],
//         disallowed: [ paypal.FUNDING.CREDIT ]
//        },
//        onApprove: function(data, actions) {
//         // This function captures the funds from the transaction.
//       //   let id = "adno18nsd";
//       //   let url = `/success/${emailRedirect}/${id}`;

//       //   console.log(url);
//       //   history.push({
//       //     pathname: url
//       //  });
//         history.push({
//           pathname: `/success/${email}/12345test`
//       });

        

//         return actions.order.capture().then(function(details) {

//           history.push({
//             pathname: `/success/${email}/12345test`
//          });



//         });
//       }
  
//       // onError: function(err) {
//       //   setError(err);
//       //   console.error(err);
//       // }
//     }).render(paypalRef.current);
//   }, [product,email]);


//   return (
//     <div>
//       {error && <div>Uh oh, an error occurred! {error.message}</div>}
//       <div ref={paypalRef} />
//     </div>
//   );
// };

// export default PaypalButton;


// // oaypal returns this in details
// // create_time: "2021-01-07T07:26:24Z"
// // id: "7GR36650EJ248711X"
// // intent: "CAPTURE"
// // links: Array(1)
// // 0: {href: "https://api.sandbox.paypal.com/v2/checkout/orders/7GR36650EJ248711X", rel: "self", method: "GET", title: "GET"}
// // length: 1
// // __proto__: Array(0)
// // payer: {email_address: "sb-eztfq4565738@personal.example.com", payer_id: "HMTJC9ZX63CP8", address: {…}, name: {…}}
// // purchase_units: [{…}]
// // status: "COMPLETED"
// // update_time: "2021-01-07T07:26:49Z"
// // __proto__: Object