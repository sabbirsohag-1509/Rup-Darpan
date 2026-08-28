
import { CreditCard } from "lucide-react";
import axios from "axios";
import { toast } from 'react-hot-toast';

const PaymentBtn = ({
  bookingId,
  packagePrice,
  minimumAdvance,
  customerName,
  customerEmail,
  isFailed = false,
}) => {
  const handlePayment = async () => {
    try {
      console.log("💳 Starting SSLCommerz payment...", {
        bookingId,
        packagePrice,
        minimumAdvance,
        customerName,
        customerEmail,
      });

      const response = await axios.post(
        "http://localhost:5000/payment/init",
        {
          amount: packagePrice,
          customerName,
          customerEmail,
          bookingId,
        },
        {
          withCredentials: true,
        },
      );

      console.log("✅ Payment init response:", response.data);

      if (response.data?.success && response.data?.paymentUrl) {
        window.location.href = response.data.paymentUrl;
        return;
      }

      console.error("❌ Payment URL not found:", response.data);

      toast.error(
        response.data?.message ||
          "Failed to start payment. Please try again.",
      );
    } catch (error) {
      console.error(
        "❌ SSLCommerz payment initialization error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to start payment. Please try again.",
      );
    }
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
