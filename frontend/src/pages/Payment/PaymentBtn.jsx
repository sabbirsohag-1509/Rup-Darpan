import { CreditCard } from "lucide-react";

const PaymentBtn = ({
  bookingId,
  packagePrice,
  minimumAdvance,
  isFailed = false,
}) => {
  const handlePayment = () => {
    console.log("Start SSLCommerz payment", {
      bookingId,
      packagePrice,
      minimumAdvance,
    });
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary w-full"
        onClick={handlePayment}
      >
        <CreditCard className="h-4 w-4" />

        {isFailed ? "Try Again" : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentBtn;