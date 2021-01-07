// import React, { useState, useRef, useEffect } from 'react';
// import { Redirect } from 'react-router-dom'
// import { useHistory } from "react-router";


// class Paypal extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       paypalRef: null,

//     };
//   }

//   async componentDidMount() {
//     const history = useHistory();

//     window.paypal.Buttons({
//         createOrder: function(data, actions) {
//         // This function sets up the details of the transaction, including the amount and line item details.
//         return actions.order.create({
//           purchase_units: [{
//             description:" product.description",
//             amount: {
//               currency_code: 'USD',
//               value: 50
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
//         // const order = await actions.order.capture();
//         history.push({
//           pathname: `/success/${this.props.email}/${"testID"}`
//          });
//       },

//         // onError: err => {
//         //   setError(err);
//         //   console.error(err);
//         // },
//       })
//       .render(paypalRef.current);
//   }

//   render() {
//     const paypalRef = useRef();
//     this.setState({paypalRef: paypalRef});


//     return (
//       <div>
//         <div ref={paypalRef} />
//       </div>
//     );
//   }
// }

// export default Paypal;