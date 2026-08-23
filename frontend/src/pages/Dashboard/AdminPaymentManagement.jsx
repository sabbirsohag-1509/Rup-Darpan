import {
  CreditCard,
  Construction,
  Clock3,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const AdminPaymentManagement = () => {
  return (
    <>
      <title>Admin Payment Management | Rup Darpon</title>

      <main className="min-h-[calc(100vh-80px)] bg-base-200/40 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-144px)] max-w-6xl items-center justify-center">
          <div className="w-full max-w-4xl">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="mb-8 text-center">
              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-2xl bg-primary/10" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                  <CreditCard className="h-7 w-7" />
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Admin Panel
              </p>

              <h1 className="mt-2 font-playfair text-3xl font-semibold sm:text-4xl">
                Payment Management
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
                Manage payments, transactions, payment status, refunds, and
                financial records from one centralized dashboard.
              </p>
            </div>

            {/* =====================================================
                MAIN CARD
            ====================================================== */}

            <div className="overflow-hidden rounded-3xl border border-primary/10 bg-base-100 shadow-sm">

              {/* =================================================
                  BIG COMING SOON AREA
              ================================================== */}

              <div className="relative flex min-h-[340px] flex-col items-center justify-center overflow-hidden px-5 py-14 sm:min-h-[390px] sm:py-16">

                {/* Background Glow 1 */}
                <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary/5 blur-3xl" />

                {/* Background Glow 2 */}
                <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-warning/10 blur-2xl" />

                {/* Rotating Dashed Circle */}
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-primary/15 sm:h-80 sm:w-80" />

                {/* Second Rotating Circle */}
                <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 animate-[spin_12s_linear_infinite_reverse] rounded-full border border-dotted border-warning/20 sm:h-64 sm:w-64" />

                {/* Floating Particles */}
                <span className="absolute left-[15%] top-[25%] h-2 w-2 animate-bounce rounded-full bg-primary/40" />

                <span className="absolute right-[18%] top-[22%] h-2.5 w-2.5 animate-ping rounded-full bg-warning/40" />

                <span className="absolute bottom-[22%] left-[22%] h-1.5 w-1.5 animate-pulse rounded-full bg-info/50" />

                <span className="absolute bottom-[25%] right-[20%] h-2 w-2 animate-bounce rounded-full bg-success/40" />

                {/* Construction Icon */}
                <div className="relative z-10 mb-6 flex h-20 w-20 animate-[float_3s_ease-in-out_infinite] items-center justify-center rounded-full border border-warning/20 bg-warning/10 text-warning shadow-lg">
                  <Construction className="h-9 w-9" />
                </div>

                {/* =================================================
                    BIG COMING SOON
                ================================================== */}

                <div className="relative z-10 text-center">
                  <h2
                    className="
                      animate-[comingSoon_3s_ease-in-out_infinite]
                      bg-gradient-to-r
                      from-primary
                      via-base-content
                      to-primary
                      bg-[length:200%_auto]
                      bg-clip-text
                      text-transparent
                      font-black
                      uppercase
                      leading-none
                      tracking-tight
                      text-5xl
                      sm:text-6xl
                      md:text-7xl
                      lg:text-8xl
                    "
                  >
                    Coming Soon
                  </h2>

                  {/* Animated underline */}
                  <div className="mx-auto mt-5 h-1 w-32 overflow-hidden rounded-full bg-base-200">
                    <div className="h-full w-1/2 animate-[lineMove_2s_ease-in-out_infinite] rounded-full bg-primary" />
                  </div>

                  {/* Animated dots */}
                  <div className="mt-5 flex items-center justify-center gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />

                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />

                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
                  </div>
                </div>

                {/* Description */}
                <p className="relative z-10 mt-6 max-w-xl text-center text-sm leading-6 text-base-content/55">
                  Payment Management is currently under development.
                  Transaction tracking, payment history, refunds, and
                  financial management features will be available here soon.
                </p>
              </div>

              {/* =================================================
                  FUTURE FEATURES
              ================================================== */}

              <div className="border-t border-base-200 bg-base-200/20 p-5 sm:p-7">
                <div className="mb-5 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    What's Coming
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    Future Payment Features
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* Transaction */}
                  <div className="group rounded-2xl border border-base-200 bg-base-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                        <CreditCard className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold">
                          Transaction Management
                        </h3>

                        <p className="mt-1 text-xs text-base-content/50">
                          View and manage all transactions.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="group rounded-2xl border border-base-200 bg-base-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-success/20 hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success transition-transform duration-300 group-hover:scale-110">
                        <ShieldCheck className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold">
                          Payment Status
                        </h3>

                        <p className="mt-1 text-xs text-base-content/50">
                          Track successful and failed payments.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* History */}
                  <div className="group rounded-2xl border border-base-200 bg-base-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-info/20 hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-info/10 text-info transition-transform duration-300 group-hover:scale-110">
                        <Clock3 className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold">
                          Payment History
                        </h3>

                        <p className="mt-1 text-xs text-base-content/50">
                          Review complete payment history.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Refund */}
                  <div className="group rounded-2xl border border-base-200 bg-base-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/20 hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-transform duration-300 group-hover:scale-110">
                        <ArrowRight className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold">
                          Refund Management
                        </h3>

                        <p className="mt-1 text-xs text-base-content/50">
                          Handle refunds and payment adjustments.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-6 flex justify-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-warning/20 bg-warning/10 px-4 py-2 text-xs font-medium text-warning">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
                    </span>

                    Development in Progress
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <p className="mt-5 text-center text-xs text-base-content/40">
              Payment features will be added after the payment workflow and
              API integration are completed.
            </p>
          </div>
        </div>
      </main>

      {/* =========================================================
          CUSTOM ANIMATIONS
      ========================================================== */}

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes comingSoon {
          0%,
          100% {
            background-position: 0% 50%;
            transform: scale(1);
          }

          50% {
            background-position: 100% 50%;
            transform: scale(1.025);
          }
        }

        @keyframes lineMove {
          0% {
            transform: translateX(-100%);
          }

          50% {
            transform: translateX(100%);
          }

          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </>
  );
};

export default AdminPaymentManagement;