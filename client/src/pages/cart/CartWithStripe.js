import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo } from "react";

import CartPage from "../../pages/cart/CartPage";

const CartWithStripe = () => {
  const stripePromise = useMemo(
    () => loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY),
    [],
  );

  return (
    <Elements stripe={stripePromise}>
      <CartPage />
    </Elements>
  );
};

export default CartWithStripe;
