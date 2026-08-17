import {
  Camera,
  Heart,
  Image,
  MapPin,
  Phone,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

const About = () => {
  return (
    <main className="bg-base-100">
      {/* =======================================================
          HERO
      ======================================================== */}

      <section className="relative overflow-hidden border-b border-base-200">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* LEFT */}

            <div>
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Camera className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  About Rup Darpon
                </span>
              </div>

              <h1 className="font-playfair text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Every frame tells a{" "}
                <span className="italic text-primary">beautiful story.</span>
              </h1>

              <p className="mt-5 text-sm leading-7 text-base-content/65 sm:text-base">
                Rup Darpon is more than a photography brand—it is a journey of
                preserving genuine emotions, timeless memories, and
                unforgettable celebrations through creative storytelling.
              </p>

              <p className="mt-3 text-sm leading-7 text-base-content/55">
                আমাদের বিশ্বাস, প্রতিটি মুহূর্তই একটি গল্প। সেই গল্পকে
                সুন্দরভাবে ছবির মাধ্যমে আজীবন স্মরণীয় করে রাখাই আমাদের লক্ষ্য।
              </p>
            </div>

            {/* RIGHT */}

            <div>
              <img
                src="/about/about-hero.jpg"
                alt="Rup Darpon Team"
                className="h-[420px] w-full rounded-3xl object-cover shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          STATS
      ======================================================== */}

      <section className="py-10 sm:py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:px-8 lg:px-10">
          {[
            ["500+", "Moments Captured"],
            ["120+", "Happy Clients"],
            ["5+", "Photography Services"],
            ["100%", "Passion & Quality"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-primary/10 bg-base-100 p-5 text-center shadow-sm"
            >
              <h3 className="text-3xl font-bold text-primary">{number}</h3>
              <p className="mt-2 text-xs text-base-content/55">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =======================================================
          OUR STORY
      ======================================================== */}

      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="grid items-center gap-10 rounded-3xl border border-primary/10 bg-base-100 p-6 shadow-sm lg:grid-cols-2 lg:p-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Our Story
              </span>

              <h2 className="mt-3 font-playfair text-3xl font-semibold">
                Capturing memories that last forever.
              </h2>

              <p className="mt-5 text-sm leading-7 text-base-content/65">
                We started Rup Darpon with one simple belief—every smile, every
                emotion, and every celebration deserves to be remembered. From
                weddings to portraits, our goal is to transform real moments
                into timeless visual stories.
              </p>

              <p className="mt-3 text-sm leading-7 text-base-content/55">
                আমরা কেবল ছবি তুলি না, আমরা মানুষের জীবনের সবচেয়ে মূল্যবান
                মুহূর্তগুলোকে শিল্পের মতো সংরক্ষণ করি।
              </p>
            </div>

            <img
              src="/about/story.jpg"
              alt="Our Story"
              className="h-[340px] w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* =======================================================
          WHY CHOOSE US
      ======================================================== */}

      <section className="bg-base-200/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Why Choose Rup Darpon
            </span>

            <h2 className="mt-3 font-playfair text-3xl font-semibold sm:text-4xl">
              What makes us different?
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Camera,
                title: "Creative Vision",
                desc: "Unique compositions with artistic storytelling.",
              },
              {
                icon: Heart,
                title: "Real Emotions",
                desc: "Natural moments instead of forced poses.",
              },
              {
                icon: Sparkles,
                title: "Premium Editing",
                desc: "Elegant colors with timeless finishing.",
              },
              {
                icon: Users,
                title: "Client First",
                desc: "Friendly experience from booking to delivery.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 font-semibold">{item.title}</h3>

                <p className="mt-2 text-sm leading-6 text-base-content/60">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =======================================================
          SERVICES
      ======================================================== */}

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Photography Services
            </span>

            <h2 className="mt-3 font-playfair text-3xl font-semibold">
              Moments we love to capture
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Wedding Photography",
              "Pre-Wedding Session",
              "Portrait Photography",
              "Event Coverage",
              "Outdoor Couple Shoot",
              "Cinematic Video",
            ].map((service) => (
              <div
                key={service}
                className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm"
              >
                <Image className="h-5 w-5 text-primary" />
                <span className="font-medium">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =======================================================
          CONTACT STRIP
      ======================================================== */}

      <section className="border-t border-base-200 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-primary/10 p-5">
              <Phone className="h-8 w-8 text-primary" />
              <div>
                <p className="text-xs text-base-content/45">Phone</p>
                <h3 className="font-semibold">+8801723-473804</h3>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-primary/10 p-5">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <p className="text-xs text-base-content/45">Location</p>
                <h3 className="font-semibold">Dinajpur, Bangladesh</h3>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-primary/10 p-5">
              <Star className="h-8 w-8 text-primary" />
              <div>
                <p className="text-xs text-base-content/45">Commitment</p>
                <h3 className="font-semibold">Quality • Passion • Trust</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* =======================================================
    OUR POLICIES
======================================================= */}

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
              আমাদের সেবার মান, কাজের স্বচ্ছতা এবং আপনার অভিজ্ঞতা আরও সুন্দর
              রাখতে নিচের বিষয়গুলো আগে থেকে জেনে রাখা গুরুত্বপূর্ণ।
            </p>
          </div>

          {/* =====================================================
        POLICIES
    ===================================================== */}

          <div className="grid gap-4 md:grid-cols-2">
            {/* =================================================
          BOOKING CONFIRMATION
      ================================================= */}

            <div className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
              <h3 className="font-semibold">বুকিং ও নিশ্চিতকরণ</h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                প্রজেক্ট বুকিং ও তারিখ নিশ্চিত করার জন্য মোট প্যাকেজ মূল্যের
                <span className="font-semibold text-base-content/80">
                  {" "}
                  ৩০% অগ্রিম পেমেন্ট
                </span>{" "}
                প্রদান করা আবশ্যক। অগ্রিম পেমেন্ট সম্পন্ন হওয়ার পর নির্ধারিত
                তারিখ ও সেবা বুকিং হিসেবে নিশ্চিত করা হবে।
              </p>
            </div>

            {/* =================================================
          PAYMENT POLICY
      ================================================= */}

            <div className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
              <h3 className="font-semibold">পেমেন্ট নীতিমালা</h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
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
              </p>

              <p className="mt-2 text-xs leading-5 text-base-content/45">
                অর্থাৎ সম্পূর্ণ ডেলিভারি ও final handover-এর সময় মোট ১০০%
                পেমেন্ট পরিশোধিত থাকতে হবে।
              </p>
            </div>

            {/* =================================================
          PHOTOGRAPHY & COVERAGE
      ================================================= */}

            <div className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
              <h3 className="font-semibold">ফটোগ্রাফি ও কভারেজ</h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                নির্ধারিত প্যাকেজ ও আলোচনার ভিত্তিতে ফটোগ্রাফি বা ভিডিও কভারেজ
                প্রদান করা হবে। ইভেন্টের সময়সূচি, লোকেশন এবং প্রয়োজনীয় কভারেজ
                সম্পর্কে আগে থেকে সঠিক তথ্য প্রদান করা অনুরোধ করা হচ্ছে।
              </p>

              <p className="mt-2 text-xs leading-5 text-base-content/45">
                গুরুত্বপূর্ণ কোনো বিশেষ মুহূর্ত বা নির্দিষ্ট শটের প্রয়োজন থাকলে
                তা বুকিংয়ের আগে জানানো ভালো।
              </p>
            </div>

            {/* =================================================
          CLIENT COOPERATION
      ================================================= */}

            <div className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
              <h3 className="font-semibold">ক্লায়েন্টের সহযোগিতা</h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                সুন্দর ও স্বাভাবিক ছবি ও ভিডিও ধারণের জন্য ক্লায়েন্ট এবং
                সংশ্লিষ্ট ব্যক্তিদের সময়মতো উপস্থিতি ও প্রয়োজনীয় সহযোগিতা
                গুরুত্বপূর্ণ। ইভেন্টের গুরুত্বপূর্ণ মুহূর্ত ও সময়সূচি সম্পর্কে
                আমাদের আগে জানালে কাজ আরও সুন্দরভাবে সম্পন্ন করা সম্ভব হবে।
              </p>
            </div>

            {/* =================================================
          PHOTO & VIDEO QUALITY
      ================================================= */}

            <div className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
              <h3 className="font-semibold">ছবি ও ভিডিওর মান</h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                ছবি ধারণের ক্ষেত্রে প্রয়োজন অনুযায়ী
                <span className="font-semibold text-base-content/80">
                  {" "}
                  RAW
                </span>{" "}
                ও
                <span className="font-semibold text-base-content/80">
                  {" "}
                  Edited JPG
                </span>{" "}
                ফরম্যাট ব্যবহার করা হয়।
              </p>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                ভিডিও সম্পাদনার ক্ষেত্রে
                <span className="font-semibold text-base-content/80">
                  {" "}
                  1920 × 1080
                </span>{" "}
                রেজোলিউশনে Full HD quality-তে edited video প্রদান করা হবে।
              </p>
            </div>

            {/* =================================================
          PHOTO / VIDEO DELIVERY
      ================================================= */}

            <div className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
              <h3 className="font-semibold">ছবি ও ভিডিও ডেলিভারি</h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                ছবি ও ভিডিও সম্পাদনার পর নির্ধারিত প্রক্রিয়ায় ক্লায়েন্টকে
                প্রদান করা হবে। ডেলিভারির মাধ্যম হিসেবে
                <span className="font-semibold text-base-content/80">
                  {" "}
                  Google Drive অথবা WhatsApp
                </span>{" "}
                ব্যবহার করা হতে পারে।
              </p>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                প্রয়োজন অনুযায়ী edited ছবি, RAW/original file এবং final video
                আলাদাভাবে প্রদান করা যেতে পারে।
              </p>

              <p className="mt-2 text-xs leading-5 text-base-content/45">
                সম্পূর্ণ পেমেন্ট পরিশোধ না হওয়া পর্যন্ত ছবি ও ভিডিওর সম্পূর্ণ
                final handover/ডেলিভারি সম্পন্ন করা হবে না।
              </p>
            </div>

            {/* =================================================
          DELIVERY TIMELINE
      ================================================= */}

            <div className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
              <h3 className="font-semibold">ডেলিভারি সংগ্রহের সময়সীমা</h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                প্রজেক্টের কাজ সম্পন্ন হওয়ার পর ক্লায়েন্টকে
                <span className="font-semibold text-base-content/80">
                  {" "}
                  ৩ মাসের মধ্যে
                </span>{" "}
                তাঁর সকল ছবি, ভিডিও এবং প্রয়োজনীয় ফাইল সংগ্রহ করে নেওয়ার
                অনুরোধ করা হচ্ছে।
              </p>

              <p className="mt-2 text-xs leading-5 text-base-content/45">
                ৩ মাসের পর পুরোনো project files আমাদের storage থেকে মুছে ফেলা
                হতে পারে। তাই নির্ধারিত সময়ের মধ্যে সকল ফাইল download করে
                নিরাপদ স্থানে সংরক্ষণ করা ক্লায়েন্টের দায়িত্ব।
              </p>
            </div>

            {/* =================================================
          EDITING & RETOUCHING
      ================================================= */}

            <div className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
              <h3 className="font-semibold">এডিটিং ও রিটাচিং</h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                Rup Darpon-এর নিজস্ব এডিটিং স্টাইল ও কালার গ্রেডিং অনুসরণ করে
                ছবি ও ভিডিও সম্পাদনা করা হবে। অতিরিক্ত বা বিশেষ ধরনের রিটাচিং
                প্রয়োজন হলে তা আগে থেকে আলোচনা করে নির্ধারণ করা হবে।
              </p>

              <p className="mt-2 text-xs leading-5 text-base-content/45">
                Final editing সম্পন্ন হওয়ার পর অতিরিক্ত বড় ধরনের পরিবর্তন বা
                পুনরায় সম্পাদনার প্রয়োজন হলে তা আলাদাভাবে আলোচনা করা হবে।
              </p>
            </div>

            {/* =================================================
          CANCELLATION / RESCHEDULING
      ================================================= */}

            <div className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
              <h3 className="font-semibold">বাতিল ও সময় পরিবর্তন</h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                বুকিং বাতিল বা তারিখ পরিবর্তনের প্রয়োজন হলে যত দ্রুত সম্ভব
                আমাদের জানাতে হবে। নতুন তারিখের availability এবং পূর্বের
                বুকিংয়ের পরিস্থিতির ওপর ভিত্তি করে পরিবর্তনের বিষয়টি নির্ধারণ
                করা হবে।
              </p>

              <p className="mt-2 text-xs leading-5 text-base-content/45">
                Rescheduling-এর ক্ষেত্রে নতুন তারিখের availability নিশ্চিত হওয়া
                আবশ্যক।
              </p>
            </div>

            {/* =================================================
          PRIVACY & IMAGE USAGE
      ================================================= */}

            <div className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm md:col-span-2">
              <h3 className="font-semibold">গোপনীয়তা ও ছবি ব্যবহারের নীতি</h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                ক্লায়েন্টের ব্যক্তিগত তথ্য এবং কাজের সঙ্গে সম্পর্কিত বিষয়গুলো
                যথাসম্ভব গোপনীয়ভাবে পরিচালনা করা হবে।
              </p>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                কোনো ছবি বা ভিডিও Rup Darpon-এর portfolio, website, Facebook
                page, social media অথবা promotional কাজে ব্যবহার করার প্রয়োজন
                হলে, ব্যবহারের বিষয়টি ক্লায়েন্টের সঙ্গে আগে থেকে আলোচনা করা
                হবে।
              </p>
            </div>
          </div>

          {/* =====================================================
        FINAL NOTE
    ===================================================== */}

          <div className="mt-8 rounded-2xl border border-primary/10 bg-primary/5 px-5 py-4 text-center">
            <p className="text-xs leading-6 text-base-content/55 sm:text-sm">
              Rup Darpon-এর লক্ষ্য হলো প্রতিটি প্রজেক্টে স্বচ্ছতা, সুন্দর
              যোগাযোগ এবং মানসম্মত কাজ নিশ্চিত করা। বুকিংয়ের আগে কোনো বিষয়
              নিয়ে প্রশ্ন থাকলে আমাদের সঙ্গে আলোচনা করতে পারেন।
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
