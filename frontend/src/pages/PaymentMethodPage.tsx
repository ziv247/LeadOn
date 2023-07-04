import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import CheckoutSteps from "../components/CheckoutSteps";
import { Button, Form } from "react-bootstrap";

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || "PayPal"
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  // const [address, setAddress] = useState(shippingAddress.address || "");
  // const [city, setCity] = useState(shippingAddress.city || "");
  // const [postalCode, setPostalCode] = useState(
  //   shippingAddress.postalCode || ""
  // );
  // const [country, setCountry] = useState(shippingAddress.country || "");

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch({
      type: "SAVE_PAYMENT_METHOD",
      payload: paymentMethodName,
    });
    localStorage.setItem("paymentMethod", paymentMethodName);

    navigate("/placeorder");
  };

  return (
    <div>
      <Helmet>
        <title>Payment Method</title>
      </Helmet>

      <CheckoutSteps step1 step2 step3></CheckoutSteps>

      <div className="container small-container">
        <h1 className="my-3">Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === "Stripe"}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
