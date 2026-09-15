import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, Clock3, ReceiptText } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useApiConfig } from "../../hooks/apiConfig";

const PaymentSuccess = () => {
  const { API_URL } = useApiConfig();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("tran_id");
  const [status, setStatus] = useState("loading");
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    if (!transactionId) {
      setStatus("missing");
      return;
    }

    axios
      .get(`${API_URL}/payment/status/${encodeURIComponent(transactionId)}`, {
        withCredentials: true,
      })
      .then((response) => {
        setTransaction(response.data.transaction);
        setStatus(response.data.transaction.status);
      })
      .catch(() => setStatus("processing"));
  }, [API_URL, transactionId]);

  const isPaid = status === "paid";
  const isProcessing = status === "loading" || status === "processing";

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-16">
      <section className="w-full max-w-lg rounded-2xl border border-primary/10 bg-base-100 p-8 text-center shadow-sm">
        {isPaid ? (
          <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
        ) : (
          <Clock3 className="mx-auto h-16 w-16 text-warning" />
        )}
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          SSLCommerz Payment
        </p>
        <h1 className="mt-2 font-playfair text-3xl font-semibold">
          {isPaid ? "Payment Verified" : "Payment Processing"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-base-content/60">
          {isPaid
            ? "Your payment has been verified successfully."
            : "Your gateway response was received. Final confirmation will appear after server verification."}
        </p>
        {transaction && (
          <div className="mt-6 space-y-2 rounded-xl bg-base-200 p-4 text-left text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <ReceiptText className="h-4 w-4 text-primary" />
              Transaction details
            </div>
            <div className="flex justify-between gap-4 text-base-content/60">
              <span>Amount</span>
              <span className="font-semibold text-base-content">
                {transaction.currency}{" "}
                {Number(transaction.amount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-base-content/60">
              <span>Status</span>
              <span className="font-semibold capitalize text-base-content">
                {transaction.status}
              </span>
            </div>
          </div>
        )}
        {transactionId && (
          <p className="mt-4 break-all text-xs text-base-content/45">
            Transaction ID: {transactionId}
          </p>
        )}
        <Link to="/dashboard/bookings" className="btn btn-primary mt-7">
          View My Bookings
        </Link>
      </section>
    </main>
  );
};

export default PaymentSuccess;
