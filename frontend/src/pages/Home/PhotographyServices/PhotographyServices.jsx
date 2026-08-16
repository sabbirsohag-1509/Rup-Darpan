
import { Link } from 'react-router';
import { 
  HeartHandshake, 
  UserCheck, 
  GraduationCap, 
  PartyPopper, 
  Sparkles, 
  Video, 
  PhoneCall, 
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';

const PhotographyServices = () => {
  const services = [
    {
      id: 1,
      icon: HeartHandshake,
      titleEn: "Wedding & Pre-Wedding",
      titleBn: "বিবাহ ও প্রি-ওয়েডিং কভারেজ",
      descriptionEn: "Capturing eternal vows, holud, and reception moments with royal elegance.",
      descriptionBn: "গায়ে হলুদ, বিবাহ ও রিসেপশনের প্রতিটি আবেগঘন মুহূর্ত ফ্রেমে বন্দি করা।",
      features: ["Cinematic Teaser", "Full Event Coverage", "Custom Photo Album"],
      popular: true,
    },
    {
      id: 2,
      icon: UserCheck,
      titleEn: "Model & Portrait Shoot",
      titleBn: "মডেল ও পোর্ট্রেট ফটোশুট",
      descriptionEn: "Professional indoor & outdoor shoots highlighting your best angles.",
      descriptionBn: "আপনার ব্যক্তিত্ব ও সৌন্দর্য ফুটিয়ে তুলতে হাই-এন্ড আউটডোর ও ইনডোর শুট।",
      features: ["Best Angle Focus", "Color Grading", "High-Res Digital Copies"],
      popular: false,
    },
    {
      id: 3,
      icon: GraduationCap,
      titleEn: "Academic & Campus Events",
      titleBn: "একাডেমিক ও ক্যাম্পাস ইভেন্ট",
      descriptionEn: "Fresher's reception, rag day, and farewell events covered with precision.",
      descriptionBn: "নবীন বরণ, র‍্যাগ ডে ও বিদায় সংবর্ধনার আনন্দময় মুহূর্তের ভিজ্যুয়াল আর্ট।",
      features: ["Group Portraits", "Reels & Highlights", "Fast Delivery"],
      popular: false,
    },
    {
      id: 4,
      icon: PartyPopper,
      titleEn: "Family & Private Events",
      titleBn: "পারিবারিক অনুষ্ঠান ও উৎসব",
      descriptionEn: "Birthdays, anniversaries, and traditional celebrations made timeless.",
      descriptionBn: "জন্মদিন, বিবাহবার্ষিকী এবং যেকোনো পারিবারিক উৎসবের স্মরণীয় চিত্র।",
      features: ["Candid Moments", "Family Portraits", "HD Video Output"],
      popular: false,
    },
    {
      id: 5,
      icon: Video,
      titleEn: "Cinematic Videography",
      titleBn: "সিনেম্যাটিক ভিডিওগ্রাফি",
      descriptionEn: "Storytelling short films, teasers, and dynamic social media reels.",
      descriptionBn: "গল্পভিত্তিক ট্রেইলার, সিনেম্যাটিক ভিডিও এবং আকর্ষণীয় সোশ্যাল মিডিয়া রিলস।",
      features: ["4K Resolution", "4K Drone Shots (Optional)", "Professional Audio"],
      popular: false,
    },
    {
      id: 6,
      icon: Sparkles,
      titleEn: "Post-Production & Retouching",
      titleBn: "পোস্ট-প্রোডাকশন ও রিটাচিং",
      descriptionEn: "Premium color grading, photo retouching, and custom album design.",
      descriptionBn: "অত্যাধুনিক কালার গ্রেডিং, ফটো রিটাচিং এবং প্রিমিয়াম অ্যালবামের ছোঁয়া।",
      features: ["Magazine Quality", "Color Correction", "Print-Ready Layouts"],
      popular: false,
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* =====================================================
          HEADER SECTION (Updated with your custom layout)
      ===================================================== */}
      <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
        
        {/* Header Content */}
        <div className="max-w-2xl">
          {/* Decorative Line & Subtitle */}
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">
              RupDarpon Services
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-playfair text-4xl font-semibold leading-[1.05] text-base-content sm:text-5xl lg:text-6xl">
            Capturing Your{" "}
            <span className="italic text-primary font-instrument">
              Best Angles
            </span>
          </h2>

          {/* Description */}
          <p className="mt-5 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
            Every smile, every tradition, every golden moment—let us help you make them timeless.
            <br />
            <span className="mt-2 block text-xs text-base-content/50 sm:text-sm">
              আপনার বিশেষ মুহূর্তগুলোকে ফ্রেমে বন্দি করতে আমাদের সেবাগুলো দেখুন।
            </span>
          </p>
        </div>

      </div>

      {/* =====================================================
          SERVICES GRID
      ===================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              className={`relative group rounded-box bg-base-200/50 p-6 sm:p-8 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                service.popular
                  ? "border-primary/50 shadow-lg shadow-primary/5 bg-base-200"
                  : "border-base-300 hover:border-primary/30"
              }`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <span className="absolute -top-3 right-6 bg-primary text-primary-content text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Most Requested
                </span>
              )}

              {/* Icon Container */}
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 transition-transform duration-300 group-hover:scale-110">
                <IconComponent className="w-6 h-6" />
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl font-bold text-base-content font-playfair group-hover:text-primary transition-colors">
                {service.titleEn}
              </h3>
              <p className="text-xs font-medium text-primary/80 mt-0.5">
                {service.titleBn}
              </p>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-base-content/70 leading-relaxed">
                {service.descriptionEn}
              </p>
              <p className="mt-1 text-xs text-base-content/50">
                {service.descriptionBn}
              </p>

              {/* Feature List */}
              <ul className="mt-6 pt-6 border-t border-base-300/60 space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs text-base-content/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* =====================================================
          CALL TO ACTION BANNER
      ===================================================== */}
      <div className="mt-16 rounded-box border border-primary/20 bg-gradient-to-r from-base-200 via-base-300/40 to-base-200 p-8 sm:p-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div>
          <h4 className="text-xl sm:text-2xl font-bold font-playfair text-base-content">
            Ready to Plan Your Special Event?
          </h4>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">
            যেকোনো ইভেন্ট বুকিং অথবা তথ্যের জন্য সরাসরি আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
          <Link
            to="/booking"
            className="btn btn-primary gap-2 text-xs sm:text-sm shadow-md hover:shadow-primary/20 transition-all font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            Book Now • বুকিং করুন
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/contact"
            className="btn btn-outline border-primary/40 hover:border-primary text-base-content hover:bg-primary/10 gap-2 text-xs sm:text-sm transition-all font-semibold"
          >
            <PhoneCall className="w-4 h-4 text-primary" />
            Contact Us • যোগাযোগ করুন
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PhotographyServices;