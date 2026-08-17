import {
  BadgeCheck,
  Banknote,
  Camera,
  CheckCircle2,
  Clock3,
  FileImage,
  HardDriveDownload,
  LockKeyhole,
  RefreshCcw,
  UserCheck,
  WandSparkles,
} from "lucide-react";
import { Link } from "react-router";

const OurPolicy = () => {
  return (
    <section className="border-t border-base-200 bg-base-200/30 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        {/* =====================================================
            HEADING
        ===================================================== */}

        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            আমাদের নীতিমালা
          </span>

          <h2 className="mt-3 font-playfair text-3xl font-semibold sm:text-4xl">
            Rup Darpon-এর সাথে কাজ করার আগে
            <span className="italic text-primary"> কিছু বিষয় জেনে নিন</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-base-content/60 sm:text-base">
            আমাদের সেবার মান, কাজের স্বচ্ছতা এবং আপনার অভিজ্ঞতা আরও সুন্দর রাখতে
            নিচের বিষয়গুলো আগে থেকে জেনে রাখা গুরুত্বপূর্ণ।
          </p>
        </div>

        {/* =====================================================
            POLICY GRID
        ===================================================== */}

        <div className="grid gap-4 md:grid-cols-2">
          {/* =================================================
              BOOKING CONFIRMATION
          ================================================= */}

          <PolicyCard
            icon={<BadgeCheck className="h-5 w-5" />}
            title="বুকিং ও নিশ্চিতকরণ"
          >
            প্রজেক্ট বুকিং ও তারিখ নিশ্চিত করার জন্য মোট প্যাকেজ মূল্যের
            <span className="font-semibold text-base-content/80">
              {" "}
              ৩০% অগ্রিম পেমেন্ট
            </span>{" "}
            প্রদান করা আবশ্যক। অগ্রিম পেমেন্ট সম্পন্ন হওয়ার পর নির্ধারিত তারিখ
            ও সেবা বুকিং হিসেবে নিশ্চিত করা হবে।
          </PolicyCard>

          {/* =================================================
              PAYMENT POLICY
          ================================================= */}

          <PolicyCard
            icon={<Banknote className="h-5 w-5" />}
            title="পেমেন্ট নীতিমালা"
          >
            বুকিং নিশ্চিত করার সময়
            <span className="font-semibold text-base-content/80">
              {" "}
              ৩০% পেমেন্ট
            </span>{" "}
            প্রয়োজন। কাজ সম্পন্ন হওয়ার পর
            <span className="font-semibold text-base-content/80">
              {" "}
              ৫০% পেমেন্ট
            </span>{" "}
            প্রদান করতে হবে। অবশিষ্ট
            <span className="font-semibold text-base-content/80">
              {" "}
              ২০% পেমেন্ট
            </span>{" "}
            ডেলিভারি সম্পন্ন করার সময় পরিশোধ করতে হবে।
            <SmallNote>
              অর্থাৎ সম্পূর্ণ ডেলিভারি ও final handover-এর সময় মোট ১০০% পেমেন্ট
              পরিশোধিত থাকতে হবে।
            </SmallNote>
          </PolicyCard>

          {/* =================================================
              PHOTOGRAPHY & COVERAGE
          ================================================= */}

          <PolicyCard
            icon={<Camera className="h-5 w-5" />}
            title="ফটোগ্রাফি ও কভারেজ"
          >
            নির্ধারিত প্যাকেজ ও আলোচনার ভিত্তিতে ফটোগ্রাফি বা ভিডিও কভারেজ
            প্রদান করা হবে। ইভেন্টের সময়সূচি, লোকেশন এবং প্রয়োজনীয় কভারেজ
            সম্পর্কে আগে থেকে সঠিক তথ্য প্রদান করা অনুরোধ করা হচ্ছে।
            <SmallNote>
              গুরুত্বপূর্ণ কোনো বিশেষ মুহূর্ত বা নির্দিষ্ট শটের প্রয়োজন থাকলে
              তা বুকিংয়ের আগে জানানো ভালো।
            </SmallNote>
          </PolicyCard>

          {/* =================================================
              CLIENT COOPERATION
          ================================================= */}

          <PolicyCard
            icon={<UserCheck className="h-5 w-5" />}
            title="ক্লায়েন্টের সহযোগিতা"
          >
            সুন্দর ও স্বাভাবিক ছবি ও ভিডিও ধারণের জন্য ক্লায়েন্ট এবং সংশ্লিষ্ট
            ব্যক্তিদের সময়মতো উপস্থিতি ও প্রয়োজনীয় সহযোগিতা গুরুত্বপূর্ণ।
            ইভেন্টের গুরুত্বপূর্ণ মুহূর্ত ও সময়সূচি সম্পর্কে আমাদের আগে জানালে
            কাজ আরও সুন্দরভাবে সম্পন্ন করা সম্ভব হবে।
          </PolicyCard>

          {/* =================================================
              PHOTO & VIDEO QUALITY
          ================================================= */}

          <PolicyCard
            icon={<FileImage className="h-5 w-5" />}
            title="ছবি ও ভিডিওর মান"
          >
            ছবি ধারণের ক্ষেত্রে প্রয়োজন অনুযায়ী
            <span className="font-semibold text-base-content/80"> RAW</span> ও
            <span className="font-semibold text-base-content/80">
              {" "}
              Edited JPG
            </span>{" "}
            ফরম্যাট ব্যবহার করা হয়।
            <p className="mt-2">
              ভিডিও সম্পাদনার ক্ষেত্রে
              <span className="font-semibold text-base-content/80">
                {" "}
                1920 × 1080
              </span>{" "}
              রেজোলিউশনে Full HD quality-তে edited video প্রদান করা হবে।
            </p>
          </PolicyCard>

          {/* =================================================
              PHOTO / VIDEO DELIVERY
          ================================================= */}

          <PolicyCard
            icon={<HardDriveDownload className="h-5 w-5" />}
            title="ছবি ও ভিডিও ডেলিভারি"
          >
            ছবি ও ভিডিও সম্পাদনার পর নির্ধারিত প্রক্রিয়ায় ক্লায়েন্টকে প্রদান
            করা হবে। ডেলিভারির মাধ্যম হিসেবে
            <span className="font-semibold text-base-content/80">
              {" "}
              Google Drive অথবা WhatsApp
            </span>{" "}
            ব্যবহার করা হতে পারে।
            <p className="mt-2">
              প্রয়োজন অনুযায়ী edited ছবি, RAW/original file এবং final video
              আলাদাভাবে প্রদান করা যেতে পারে।
            </p>
            <SmallNote>
              সম্পূর্ণ পেমেন্ট পরিশোধ না হওয়া পর্যন্ত ছবি ও ভিডিওর সম্পূর্ণ
              final handover/ডেলিভারি সম্পন্ন করা হবে না।
            </SmallNote>
          </PolicyCard>

          {/* =================================================
              DELIVERY TIMELINE
          ================================================= */}

          <PolicyCard
            icon={<Clock3 className="h-5 w-5" />}
            title="ডেলিভারি সংগ্রহের সময়সীমা"
          >
            প্রজেক্টের কাজ সম্পন্ন হওয়ার পর ক্লায়েন্টকে
            <span className="font-semibold text-base-content/80">
              {" "}
              ৩ মাসের মধ্যে
            </span>{" "}
            তাঁর সকল ছবি, ভিডিও এবং প্রয়োজনীয় ফাইল সংগ্রহ করে নেওয়ার অনুরোধ
            করা হচ্ছে।
            <SmallNote>
              ৩ মাসের পর পুরোনো project files আমাদের storage থেকে মুছে ফেলা হতে
              পারে। তাই নির্ধারিত সময়ের মধ্যে সকল ফাইল download করে নিরাপদ
              স্থানে সংরক্ষণ করা ক্লায়েন্টের দায়িত্ব।
            </SmallNote>
          </PolicyCard>

          {/* =================================================
              EDITING & RETOUCHING
          ================================================= */}

          <PolicyCard
            icon={<WandSparkles className="h-5 w-5" />}
            title="এডিটিং ও রিটাচিং"
          >
            Rup Darpon-এর নিজস্ব এডিটিং স্টাইল ও কালার গ্রেডিং অনুসরণ করে ছবি ও
            ভিডিও সম্পাদনা করা হবে। অতিরিক্ত বা বিশেষ ধরনের রিটাচিং প্রয়োজন হলে
            তা আগে থেকে আলোচনা করে নির্ধারণ করা হবে।
            <SmallNote>
              Final editing সম্পন্ন হওয়ার পর অতিরিক্ত বড় ধরনের পরিবর্তন বা
              পুনরায় সম্পাদনার প্রয়োজন হলে তা আলাদাভাবে আলোচনা করা হবে।
            </SmallNote>
          </PolicyCard>

          {/* =================================================
              CANCELLATION / RESCHEDULING
          ================================================= */}

          <PolicyCard
            icon={<RefreshCcw className="h-5 w-5" />}
            title="বাতিল ও সময় পরিবর্তন"
          >
            বুকিং বাতিল বা তারিখ পরিবর্তনের প্রয়োজন হলে যত দ্রুত সম্ভব আমাদের
            জানাতে হবে। নতুন তারিখের availability এবং পূর্বের বুকিংয়ের
            পরিস্থিতির ওপর ভিত্তি করে পরিবর্তনের বিষয়টি নির্ধারণ করা হবে।
            <SmallNote>
              Rescheduling-এর ক্ষেত্রে নতুন তারিখের availability নিশ্চিত হওয়া
              আবশ্যক।
            </SmallNote>
          </PolicyCard>

          {/* =================================================
              PRIVACY & IMAGE USAGE
          ================================================= */}

          <div className="group rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-md md:col-span-2">
            <div className="flex items-start gap-4">
              <PolicyIcon>
                <LockKeyhole className="h-5 w-5" />
              </PolicyIcon>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">
                  গোপনীয়তা ও ছবি ব্যবহারের নীতি
                </h3>

                <p className="mt-2 text-sm leading-6 text-base-content/60">
                  ক্লায়েন্টের ব্যক্তিগত তথ্য এবং কাজের সঙ্গে সম্পর্কিত
                  বিষয়গুলো যথাসম্ভব গোপনীয়ভাবে পরিচালনা করা হবে।
                </p>

                <p className="mt-2 text-sm leading-6 text-base-content/60">
                  কোনো ছবি বা ভিডিও Rup Darpon-এর portfolio, website, Facebook
                  page, social media অথবা promotional কাজে ব্যবহার করার প্রয়োজন
                  হলে, ব্যবহারের বিষয়টি ক্লায়েন্টের সঙ্গে আগে থেকে আলোচনা করা
                  হবে।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            FINAL NOTE
        ===================================================== */}

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-primary/10 bg-primary/5 px-5 py-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

          <p className="text-xs leading-6 text-base-content/55 sm:text-sm">
            Rup Darpon-এর লক্ষ্য হলো প্রতিটি প্রজেক্টে স্বচ্ছতা, সুন্দর যোগাযোগ
            এবং মানসম্মত কাজ নিশ্চিত করা। বুকিংয়ের আগে কোনো বিষয় নিয়ে প্রশ্ন
            থাকলে আমাদের সঙ্গে আলোচনা করতে পারেন।{" "}
            <span>
              <Link
                to="/contact"
                className="ml-2 inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-content shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                Contact
              </Link>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   REUSABLE POLICY CARD
========================================================= */

const PolicyCard = ({ icon, title, children }) => {
  return (
    <div className="group rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-md">
      <div className="flex items-start gap-4">
        <PolicyIcon>{icon}</PolicyIcon>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">{title}</h3>

          <p className="mt-2 text-sm leading-6 text-base-content/60">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   POLICY ICON
========================================================= */

const PolicyIcon = ({ children }) => {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/15">
      {children}
    </div>
  );
};

/* =========================================================
   SMALL NOTE
========================================================= */

const SmallNote = ({ children }) => {
  return (
    <p className="mt-2 text-xs leading-5 text-base-content/45">{children}</p>
  );
};

export default OurPolicy;
