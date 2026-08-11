import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ShieldCheck,
  Monitor,
  Smartphone,
  Globe,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const API_URL = "http://localhost:5000";

const LoginActivity = () => {
  const {
    data: activities = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["login-activity"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/users/login-activity`, {
        withCredentials: true,
      });

      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const formatDate = (date) => {
    if (!date) return "Unknown";

    return new Date(date).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getDeviceIcon = (device = "") => {
    const value = device.toLowerCase();

    if (
      value.includes("mobile") ||
      value.includes("android") ||
      value.includes("iphone")
    ) {
      return <Smartphone className="h-5 w-5" />;
    }

    return <Monitor className="h-5 w-5" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-32 animate-pulse rounded-3xl bg-base-200" />

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded-2xl bg-base-200"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <section className="rounded-3xl border border-error/20 bg-base-100 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
          <AlertCircle className="h-7 w-7 text-error" />
        </div>

        <h2 className="mt-4 font-playfair text-2xl font-semibold">
          Failed to Load Login Activity
        </h2>

        <p className="mt-2 text-sm text-base-content/60">
          Something went wrong while loading your recent login activity.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl border border-primary/10 bg-base-100 shadow-sm">
        <div className="bg-primary/5 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>

              <div>
                <h1 className="font-playfair text-2xl font-semibold sm:text-3xl">
                  Login Activity
                </h1>

                <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/60">
                  Review your recent account login activity and keep track of
                  where your account has been accessed.
                </p>
              </div>
            </div>

            <div className="badge badge-primary badge-outline gap-2 px-4 py-3">
              <ShieldCheck className="h-4 w-4" />
              Security
            </div>
          </div>
        </div>
      </section>

      {/* Activity List */}
      <section className="rounded-3xl border border-primary/10 bg-base-100 p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <h2 className="font-playfair text-xl font-semibold">
            Recent Sign-ins
          </h2>

          <p className="mt-1 text-xs text-base-content/50">
            Showing your latest account login activity.
          </p>
        </div>

        {activities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/40 p-10 text-center">
            <Clock3 className="mx-auto h-10 w-10 text-base-content/30" />

            <h3 className="mt-4 font-semibold">
              No Login Activity{" "}
              <span className="font-normal text-base-content/80 text-xs sm:text-sm">
                (কোনো লগইন অ্যাক্টিভিটি নেই)
              </span>
            </h3>

            <p className="mt-1 text-sm text-base-content/50">
              Your login activity will appear here after signing in.
            </p>
            <p className="mt-0.5 text-xs text-base-content/40">
              সাইন ইন করার পর আপনার লগইন হিস্ট্রি ও অ্যাক্টিভিটি এখানে দেখা
              যাবে।
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={activity._id || index}
                className="rounded-2xl border border-base-300 bg-base-200/40 p-4 transition hover:border-primary/20 hover:bg-base-200/70"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left */}
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {getDeviceIcon(activity.device)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          {activity.device || "Unknown Device"}
                        </h3>

                        <span className="badge badge-success badge-sm gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Successful
                        </span>
                      </div>

                      <div className="mt-2 grid gap-1 text-xs text-base-content/55 sm:grid-cols-2 sm:gap-x-6">
                        <span className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5" />
                          {activity.ip || "IP unavailable"}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatDate(activity.loginAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-medium text-base-content/40">
                      Login time
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {activity.loginAt
                        ? new Date(activity.loginAt).toLocaleTimeString(
                            "en-BD",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Security Notice */}
      <section className="rounded-3xl border border-warning/20 bg-warning/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />

          <div>
            <h3 className="font-semibold">
              Don't recognize a login?{" "}
              <span className="font-normal text-base-content/80 text-xs sm:text-sm">
                (অপরিচিত কোনো লগইন দেখছেন?)
              </span>
            </h3>

            <p className="mt-1 text-sm leading-6 text-base-content/60">
              If you notice an unfamiliar login, change your password
              immediately and review your account security.
            </p>
            <p className="mt-0.5 text-xs text-base-content/50">
              অপরিচিত কোনো স্থান বা ডিভাইস থেকে লগইন দেখতে পেলে সাথে সাথে আপনার
              পাসওয়ার্ড পরিবর্তন করুন এবং অ্যাকাউন্ট নিরাপত্তা যাচাই করুন।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginActivity;
