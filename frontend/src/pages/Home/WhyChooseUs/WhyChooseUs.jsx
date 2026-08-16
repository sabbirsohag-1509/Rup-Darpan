
import { Link } from 'react-router';
import { 
  Camera, 
  Sparkles, 
  HeartHandshake, 
  Clock, 
  Award, 
  ArrowUpRight,
  ShieldCheck 
} from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: Camera,
      titleEn: "High-End Equipment",
      titleBn: "অত্যাধুনিক ক্যামেরা প্রযুক্তি",
      descriptionEn: "We use top-tier full-frame cameras, prime lenses, and professional cinema gear for crisp visuals.",
      descriptionBn: "সেরা ভিজ্যুয়াল কোয়ালিটি নিশ্চিত করতে আমরা ব্যবহার করি প্রিমিয়াম ফুল-ফ্রেম ক্যামেরা ও সিনেমা লেন্স।"
    },
    {
      id: 2,
      icon: Sparkles,
      titleEn: "Artistic Storytelling",
      titleBn: "গল্পধর্মী সিনেম্যাটিক আর্ট",
      descriptionEn: "We don't just click photos; we weave your special moments into emotional, visual stories.",
      descriptionBn: "শুধু ছবি নয়, আপনার বিশেষ মুহূর্তগুলোকে আবেগঘন এবং সিনেম্যাটিক গল্পে রূপান্তর করি।"
    },
    {
      id: 3,
      icon: HeartHandshake,
      titleEn: "Client-Centric Approach",
      titleBn: "আপনার পছন্দের প্রাধান্য",
      descriptionEn: "Your comfort and pose naturalness are our priority during every indoor or outdoor shoot.",
      descriptionBn: "শুটের পুরোটা সময় আপনার স্বাচ্ছন্দ্য এবং প্রাকৃতিক পোজ ফুটিয়ে তোলা আমাদের মূল লক্ষ্য।"
    },
    {
      id: 4,
      icon: Clock,
      titleEn: "On-Time Delivery",
      titleBn: "দ্রুত ও সঠিক সময়ে ডেলিভারি",
      descriptionEn: "We value your time and deliver high-resolution edited photos and videos within schedule.",
      descriptionBn: "সময়ের মূল্য দিয়ে নির্ধারিত সময়ের মধ্যেই আমরা হাই-রেজুলেশন এডিটেড ছবি ও ভিডিও প্রদান করি।"
    },
    {
      id: 5,
      icon: Award,
      titleEn: "Experienced Team",
      titleBn: "অভিজ্ঞ ও দক্ষ ফটোগ্রাফার",
      descriptionEn: "Years of expertise in wedding, portrait, and event photography across Bangladesh.",
      descriptionBn: "ওয়েডিং, মডেল ও ইভেন্ট কভারেজে দীর্ঘদিনের অভিজ্ঞতা সম্পন্ন প্রফেশনাল টিম।"
    },
    {
      id: 6,
      icon: ShieldCheck,
      titleEn: "Affordable Packages",
      titleBn: "সাশ্রয়ী বাজেট প্যাকেজ",
      descriptionEn: "Premium quality photography services tailored perfectly to fit your event budget.",
      descriptionBn: "কোয়ালিটির সাথে আপস না করে আপনার বাজেটের মধ্যে সেরা ফটোগ্রাফি প্যাকেজ।"
    }
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
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">
              RupDarpon Specialty
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-playfair text-4xl font-semibold leading-[1.05] text-base-content sm:text-5xl lg:text-6xl">
            Why Choose{" "}
            <span className="italic text-primary font-instrument">
              Us
            </span>
          </h2>

          {/* Description */}
          <p className="mt-5 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
            Discover why hundreds of clients trust us to preserve their most cherished memories.
            <br />
            <span className="text-xs text-base-content/50 sm:text-sm">
              কেন আপনার জীবনের সেরা মুহূর্তগুলো ফ্রেমবন্দি করতে রূপ দর্পণকেই বেছে নেবেন, তার কিছু বিশেষ কারণ।
            </span>
          </p>
        </div>

        {/* Action Button */}
        <div>
          <Link
            to="/about"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-content sm:w-fit"
          >
            <span>Learn More About Us</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

      </div>

      {/* =====================================================
          FEATURES GRID
      ===================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={feature.id}
              className="group relative rounded-box bg-base-200/40 p-6 sm:p-8 border border-base-300 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:bg-base-200 hover:shadow-xl"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-content">
                <IconComponent className="w-6 h-6" />
              </div>

              {/* Title En & Bn */}
              <h3 className="text-xl font-bold text-base-content font-playfair group-hover:text-primary transition-colors">
                {feature.titleEn}
              </h3>
              <p className="text-xs font-medium text-primary/80 mt-0.5">
                {feature.titleBn}
              </p>

              {/* Description En & Bn */}
              <p className="mt-4 text-xs sm:text-sm text-base-content/70 leading-relaxed">
                {feature.descriptionEn}
              </p>
              <p className="mt-1.5 text-xs text-base-content/50 leading-normal">
                {feature.descriptionBn}
              </p>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default WhyChooseUs;