import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Camera,
  ArrowRight,
  Crown,
} from "lucide-react";
import { Link } from "react-router";

// =====================================================
// CREW IMAGES
// =====================================================

import HridoyImage from "../../assets/crew/hridoy.jpg";
import KomonImage from "../../assets/crew/komon.jpg";
import KanchanImage from "../../assets/crew/kanchan.jpg";
import SuponImage from "../../assets/crew/supon.jpg";
import AnupomImage from "../../assets/crew/anupom.jpg";

// =====================================================
// CREW DATA
// =====================================================

const crewMembers = [
  {
    name: "Hridoy",
    role: "Founder & CEO",
    phone: "01824-269459",
    image: HridoyImage,
    featured: true,
  },
  {
    name: "Komon",
    role: "Photography Crew",
    phone: "01601-138738",
    image: KomonImage,
  },
  {
    name: "Kanchan",
    role: "Photography Crew",
    phone: "01706-086820",
    image: KanchanImage,
  },
  {
    name: "Supon",
    role: "Photography Crew",
    phone: "01701-568180",
    image: SuponImage,
  },
  {
    name: "Anupom",
    role: "Photography Crew",
    phone: "01820-073239",
    image: AnupomImage,
  },
];

// =====================================================
// CONTACT ACTIONS
// =====================================================

const getWhatsAppLink = (phone) => {
  const number = `88${phone.replace(/\D/g, "")}`;

  return `https://wa.me/${number}`;
};

const getCallLink = (phone) => {
  return `tel:${phone}`;
};

const getSmsLink = (phone) => {
  return `sms:${phone}`;
};

// =====================================================
// CREW CARD
// =====================================================

const CrewCard = ({ member }) => {
  return (
    <article
      className={`
        group relative overflow-hidden
        rounded-2xl
        border
        bg-base-100
        shadow-sm
        transition-all duration-500
        hover:-translate-y-2
        hover:shadow-2xl

        ${
          member.featured
            ? "border-primary/30 lg:scale-[1.02]"
            : "border-base-content/10"
        }
      `}
    >
      {/* =================================================
          IMAGE
      ================================================= */}

      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={member.image}
          alt={`${member.name} - ${member.role}`}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-105
          "
          loading="lazy"
        />

        {/* Image Overlay */}

        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black/75
            via-black/10
            to-transparent
            opacity-80
          "
        />

        {/* CEO Badge */}

        {member.featured && (
          <div
            className="
              absolute
              left-4
              top-4
              flex
              items-center
              gap-1.5
              rounded-full
              bg-primary
              px-3
              py-1.5
              text-xs
              font-semibold
              text-primary-content
              shadow-lg
            "
          >
            <Crown className="h-3.5 w-3.5" />
            Founder & CEO
          </div>
        )}

        {/* Name on Image */}

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            p-5
            text-white
          "
        >
          <h3 className="font-playfair text-2xl font-semibold">
            {member.name}
          </h3>

          <p className="mt-1 text-sm text-white/75">{member.role}</p>
        </div>
      </div>

      {/* =================================================
          CONTACT ACTIONS
      ================================================= */}

      <div className="p-4">
        <p className="mb-3 text-center text-sm font-medium text-base-content/65">
          {member.phone}
        </p>

        <div className="grid grid-cols-3 gap-2">
          {/* Call */}

          <a
            href={getCallLink(member.phone)}
            className="
              btn btn-sm
              btn-ghost
              border
              border-base-content/10
              gap-1
              transition-all
              hover:border-primary/30
              hover:bg-primary/10
              hover:text-primary
            "
            aria-label={`Call ${member.name}`}
          >
            <Phone className="h-3.5 w-3.5" />

            <span className="hidden sm:inline">Call</span>
          </a>

          {/* WhatsApp */}

          <a
            href={getWhatsAppLink(member.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="
              btn btn-sm
              btn-ghost
              border
              border-base-content/10
              gap-1
              transition-all
              hover:border-primary/30
              hover:bg-primary/10
              hover:text-primary
            "
            aria-label={`WhatsApp ${member.name}`}
          >
            <MessageCircle className="h-3.5 w-3.5" />

            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* SMS */}

          <a
            href={getSmsLink(member.phone)}
            className="
              btn btn-sm
              btn-ghost
              border
              border-base-content/10
              gap-1
              transition-all
              hover:border-primary/30
              hover:bg-primary/10
              hover:text-primary
            "
            aria-label={`SMS ${member.name}`}
          >
            <Mail className="h-3.5 w-3.5" />

            <span className="hidden sm:inline">SMS</span>
          </a>
        </div>
      </div>
    </article>
  );
};

// =====================================================
// CONTACT PAGE
// =====================================================

const Contact = () => {
  return (
    <main className="min-h-screen bg-base-100">
      <title>Contact | Rup Darpon</title>
      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-base-content/5
        "
      >
        {/* Background Decoration */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-80
            w-80
            rounded-full
            bg-primary/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            -left-32
            h-96
            w-96
            rounded-full
            bg-primary/5
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-7xl
            px-4
            py-20
            sm:px-6
            lg:px-8
            lg:py-28
          "
        >
          <div className="mx-auto max-w-3xl text-center">
            {/* Heading */}
            <h1
              className="
                font-playfair
                text-4xl
                font-semibold
                leading-tight
                sm:text-5xl
                lg:text-6xl
              "
            >
              Let's Create
              <span className="block text-primary">Something Beautiful</span>
            </h1>

            {/* Description */}

            <p
              className="
                mx-auto
                mt-6
                max-w-2xl
                text-base
                leading-7
                text-base-content/65
                sm:text-lg
              "
            >
              আপনি কোনো বিয়ের পরিকল্পনা করছেন, বিশেষ কোনো উদযাপন, ব্যক্তিগত
              পোর্ট্রেট সেশন কিংবা সাধারণ কোনো সুন্দর মুহূর্তকে ফ্রেমে বন্দি
              করতে চান—আপনার সেই মুহূর্তগুলোকে চিরস্মরণীয় স্মৃতিতে রূপ দিতে রূপ
              দর্পণ (RUP DARPON) টিম সবসময় আপনার পাশে আছে।
            </p>

            {/* Location */}

            <div
              className="
                mt-7
                flex
                items-center
                justify-center
                gap-2
                text-sm
                text-base-content/60
              "
            >
              <MapPin className="h-4 w-4 text-primary" />
              Available for photography & event coverage
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CREW SECTION
      ================================================= */}

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        {/* Section Heading */}

        <div className="mb-10 text-center sm:mb-14">
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-primary
            "
          >
            The People Behind The Lens
          </p>

          <h2
            className="
              mt-2
              font-playfair
              text-3xl
              font-semibold
              sm:text-4xl
              lg:text-5xl
            "
          >
            Meet the RUP DARPON Crew
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-sm
              leading-6
              text-base-content/60
              sm:text-base
            "
          >
            A passionate team dedicated to capturing genuine emotions, beautiful
            details, and unforgettable moments.
          </p>
        </div>

        {/* Crew Grid */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {crewMembers.map((member) => (
            <CrewCard key={member.name} member={member} />
          ))}
        </div>
      </section>

      {/* =================================================
          BOOKING CTA
      ================================================= */}

      <section
        className="
          border-t
          border-base-content/5
          bg-base-200/30
        "
      >
        <div
          className="
            mx-auto
            max-w-5xl
            px-4
            py-20
            text-center
            sm:px-6
            lg:py-24
          "
        >
          <div
            className="
              mx-auto
              mb-5
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-primary/10
              text-primary
            "
          >
            <Camera className="h-6 w-6" />
          </div>

          <h2
            className="
              font-playfair
              text-3xl
              font-semibold
              sm:text-4xl
            "
          >
            Ready to Capture Your Story?
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-sm
              leading-6
              text-base-content/60
              sm:text-base
            "
          >
            Let's discuss your event, your vision, and how we can turn your
            special moments into photographs you'll treasure forever.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/packages"
              className="
                btn
                btn-primary
                gap-2
                px-6
                font-semibold
                text-primary-content
              "
            >
              Explore Packages
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={getCallLink("01824-269459")}
              className="
                btn
                btn-outline
                gap-2
                border-primary
                px-6
                text-primary
                hover:bg-primary
                hover:text-primary-content
              "
            >
              <Phone className="h-4 w-4" />
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
