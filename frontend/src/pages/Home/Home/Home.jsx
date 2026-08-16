import BookingCTA from "../BookingCTA/BookingCTA";
import FeaturedGallery from "../FeaturedGallery/FeaturedGallery";
import FeaturedGalleryVideos from "../FeaturedGalleryVideos/FeaturedGalleryVideos";
import Hero from "../Hero/Hero";
import PhotographyServices from "../PhotographyServices/PhotographyServices";
import WhyChooseUs from "../WhyChooseUs/WhyChooseUs";

const Home = () => {
  return (
    <div>
      <section>
        <Hero></Hero>
      </section>
      <section>
        <FeaturedGallery></FeaturedGallery>
      </section>
      <section>
        <FeaturedGalleryVideos></FeaturedGalleryVideos>
      </section>
      <section>
        <PhotographyServices></PhotographyServices>
      </section>
      <section>
        <WhyChooseUs></WhyChooseUs>
      </section>

      <section>
        <BookingCTA></BookingCTA>
      </section>
    </div>
  );
};

export default Home;
