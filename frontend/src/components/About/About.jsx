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
import OurPolicy from "../OurPolicy/OurPolicy";

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

      <OurPolicy></OurPolicy>
    </main>
  );
};

export default About;
