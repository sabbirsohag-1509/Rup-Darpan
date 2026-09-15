import { XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router";

const PaymentFail = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("tran_id");

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-16">
      <section className="w-full max-w-lg rounded-2xl border border-error/20 bg-base-100 p-8 text-center shadow-sm">
        <XCircle className="mx-auto h-16 w-16 text-error" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-error">
          Payment Unsuccessful
        </p>
        <h1 className="mt-2 font-playfair text-3xl font-semibold">
          Payment could not be completed
        </h1>
        <p className="mt-3 text-sm leading-6 text-base-content/60">
          No successful payment was recorded. You can safely try again from your
          bookings page.
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

export default PaymentFail;
