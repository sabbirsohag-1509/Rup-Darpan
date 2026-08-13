import FeaturedGallery from "../FeaturedGallery/FeaturedGallery";
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
      </section>
    </div>
  );
};

export default Home;
