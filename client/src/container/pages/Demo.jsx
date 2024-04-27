import React, { useState } from "react";
import PaystackPop from "@paystack/inline-js";
import { PaystackButton } from "react-paystack";
const Demo = () => {
  const publicKey = "pk_test_c9783c7a643288a4ebcd278485b2d1328e19c05c";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);
  const paywithStack = (e) => {
    e.preventDefault();
    const payStack = new PaystackPop();
    payStack.newTransaction({
      key: publicKey,
      amount: amount * 100,
      email,
      name,
      ref: "" + Math.floor(Math.random() * 1000000000 + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      // label: "Optional string that replaces customer email"
      onClose: function () {
        alert("Window closed.");
      },
      callback: function (response) {
        let message = "Payment complete! Reference: " + response.reference;
        alert(message);
        console.log(response);
      },
    });
  };

  return (
    <div>
      <form className="container">
        <div className="item">
          <div className="overlay-effect"></div>

          <div className="item-details">
            <label htmlFor="amount">Amount</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <div className="checkout">
          <div className="checkout-form">
            <div className="checkout-field">
              <label>Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="checkout-field">
              <label>Email</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="checkout-field">
              <label>Phone</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <button onClick={paywithStack}>Pay</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Demo;
