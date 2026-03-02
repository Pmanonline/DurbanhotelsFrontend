import React, { useState, useEffect } from "react";
import HeroSection from "./homePageComponents/HeroSection";
import OurStory from "./homePageComponents/OurStory";
import LocationAmenities from "./homePageComponents/Locationamenities";
import ExploreRooms from "./homePageComponents/Explorerooms";
import { ServicesSection } from "./Services";
import { TestimonialsSlider } from "./testimonial";
import HotelCustomerCare from "./homePageComponents/hotelCustomerCare";
const Home = () => {
  return (
    <>
      <HeroSection />
      <OurStory />
      <LocationAmenities />
      <ExploreRooms />
      <ServicesSection />
      <HotelCustomerCare />
      <TestimonialsSlider />
    </>
  );
};

export default Home;
