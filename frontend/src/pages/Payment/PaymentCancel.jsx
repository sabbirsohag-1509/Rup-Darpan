import { Ban } from "lucide-react";
import { Link, useSearchParams } from "react-router";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("tran_id");

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-16">
      <section className="w-full max-w-lg rounded-2xl border border-warning/20 bg-base-100 p-8 text-center shadow-sm">
        <Ban className="mx-auto h-16 w-16 text-warning" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-warning">
          Payment Cancelled
        </p>
        <h1 className="mt-2 font-playfair text-3xl font-semibold">
          Payment was cancelled
        </h1>
        <p className="mt-3 text-sm leading-6 text-base-content/60">
          Your booking was not charged. You may return to your booking and start
          a new payment attempt.
        </p>
        {transactionId && (
          <p className="mt-4 break-all text-xs text-base-content/45">
            Transaction ID: {transactionId}
          </p>
        )}
        <Link to="/dashboard/bookings" className="btn btn-primary mt-7">
          Return to My Bookings
        </Link>
      </section>
    </main>
  );
};

export default PaymentCancel;
