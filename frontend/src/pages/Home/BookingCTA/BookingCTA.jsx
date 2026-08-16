import { Link } from "react-router";
import {
  CalendarCheck,
  PhoneCall,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const BookingCTA = () => {
  const guarantees = [
    { textEn: "Free Event Consultation", textBn: "বিনামূল্যে পরামর্শ" },
    { textEn: "Customized Budget Packages", textBn: "বাজেট অনুযায়ী প্যাকেজ" },
    { textEn: "Instant Date Confirmation", textBn: "দ্রুত বুকিং কনফার্মেশন" },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* =====================================================
          HEADER SECTION (Your Saved Header Structure)
      ===================================================== */}
      <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
        {/* Header Content */}
        <div className="max-w-2xl">
          {/* Decorative Line */}
          <div className="mb-4 flex items-center gap-2">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-semibold tracking-widest uppercase text-primary flex items-center gap-1.5">
              Book Your Date • রূপ দর্পণ
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-playfair text-4xl font-semibold leading-[1.05] text-base-content sm:text-5xl lg:text-6xl">
            Let's Capture Your{" "}
            <span className="italic text-primary font-instrument">
              Special Moments
            </span>
          </h2>

          {/* Description */}
          <p className="mt-5 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
            Planning a wedding, portrait shoot, or campus event? Secure your
            dates before slots fill up for this season.
            <br />
            <span className="text-xs text-base-content/50 sm:text-sm">
              আপনার বিশেষ দিনের ফ্রেমবন্দি পরিকল্পনা করতে এখনই আমাদের সাথে
              যোগাযোগ করুন অথবা বুকিং কনফার্ম করুন।
            </span>
          </p>
        </div>

        {/* Action Button */}
        <div>
          <Link
            to="/pricing"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-content sm:w-fit"
          >
            <Link to="/packages">View Pricing Packages</Link>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* =====================================================
          MAIN BANNER CARD
      ===================================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-base-200 via-base-300/60 to-base-200 p-8 sm:p-12 shadow-2xl">
        {/* Background Glow Overlay */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left Info Column */}
          <div className="space-y-6 max-w-xl">
            {/* Live Status Indicator */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 border border-primary/20 text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Booking Open for 2026 Events
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-playfair text-base-content leading-tight">
              Ready to create timeless visual stories together?
            </h3>

            {/* Benefit Highlights */}
            <ul className="space-y-2.5 pt-2">
              {guarantees.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-base-content/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    {item.textEn}{" "}
                    <span className="text-base-content/40">
                      ({item.textBn})
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <Link
              to="/packages"
              className="btn btn-primary btn-lg rounded-2xl gap-3 text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              <CalendarCheck className="w-5 h-5" />
              Book Your Slot Now
            </Link>

            <Link
              to="/contact"
              className="btn btn-outline border-primary/40 hover:border-primary text-base-content hover:bg-primary/10 btn-lg rounded-2xl gap-3 text-sm font-bold transition-all"
            >
              <PhoneCall className="w-5 h-5 text-primary" />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCTA;
