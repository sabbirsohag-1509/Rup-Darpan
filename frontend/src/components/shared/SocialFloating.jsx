import { FaFacebookF, FaWhatsapp } from "react-icons/fa";

const SocialFloating = () => {
  return (
    <div className="fixed z-50 right-4 bottom-4 lg:right-5 lg:top-[80%] lg:bottom-auto lg:-translate-y-1/2">
      <div className="flex flex-row gap-2 lg:flex-col lg:gap-3">

        {/* Facebook */}
        <a
          href="https://www.facebook.com/profile.php?id=61559974675020"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Rup Darpon on Facebook"
          className="group flex items-center"
        >
          {/* Desktop Label */}
          <span className="mr-2 hidden overflow-hidden whitespace-nowrap rounded-full bg-base-100 px-0 py-2 text-sm font-medium shadow-lg opacity-0 transition-all duration-300 lg:block lg:max-w-0 group-hover:max-w-28 group-hover:px-4 group-hover:opacity-100">
            Facebook
          </span>

          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-lg transition-transform duration-300 hover:scale-110 lg:h-12 lg:w-12">
            <FaFacebookF className="text-base lg:text-xl" />
          </span>
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/8801824269459"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact Rup Darpon on WhatsApp"
          className="group flex items-center"
        >
          {/* Desktop Label */}
          <span className="mr-2 hidden overflow-hidden whitespace-nowrap rounded-full bg-base-100 px-0 py-2 text-sm font-medium shadow-lg opacity-0 transition-all duration-300 lg:block lg:max-w-0 group-hover:max-w-28 group-hover:px-4 group-hover:opacity-100">
            WhatsApp
          </span>

          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-110 lg:h-12 lg:w-12">
            <FaWhatsapp className="text-base lg:text-xl" />
          </span>
        </a>

      </div>
    </div>
  );
};

export default SocialFloating;