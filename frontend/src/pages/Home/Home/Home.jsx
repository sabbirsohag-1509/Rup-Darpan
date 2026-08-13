import FeaturedGallery from "../FeaturedGallery/FeaturedGallery";
import FeaturedGalleryVideos from "../FeaturedGalleryVideos/FeaturedGalleryVideos";
import Hero from "../Hero/Hero";

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
        
      </section>
    </div>
  );
};

export default Home;
