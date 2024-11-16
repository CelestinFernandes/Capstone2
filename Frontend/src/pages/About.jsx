import React, { useState } from "react";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      title: "Data Analysis",
      description: "Our advanced algorithms analyze vast amounts of historical movie data, including box office performance, audience demographics, and critical reception to provide accurate predictions.",
      image: "images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3"
    },
    {
      title: "Machine Learning",
      description: "Utilizing cutting-edge machine learning models, we process multiple factors such as cast influence, genre trends, and market conditions to forecast movie success.",
      image: "images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3"
    },
    {
      title: "Real-time Updates",
      description: "Stay ahead with real-time updates on market trends, audience preferences, and industry shifts that could impact your movie's success potential.",
      image: "images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3"
    },
    {
      title: "Comprehensive Reports",
      description: "Receive detailed reports with actionable insights, revenue projections, and recommended strategies to maximize your movie's success in the market.",
      image: (
        <div style={{ width: "100%", height: 0, paddingBottom: "76%", position: "relative" }}>
          <iframe
            src="https://giphy.com/embed/26tk0W5vYC2zV1wEE"
            width="100%"
            height="100%"
            style={{ position: "absolute" }}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Introduction Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 md:p-12">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Predict Your Movie's Success</h1>
            <p className="text-xl text-white/90 max-w-3xl">
              Welcome to the future of movie success prediction. We analyzes multiple factors to provide accurate forecasts for your film's performance, helping you make data-driven decisions throughout your movie's journey.
            </p>
          </div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
        
        {/* Carousel Section */}
        <div className="relative">
          <div className="overflow-hidden rounded-xl shadow-2xl bg-white">
            <div className="flex items-center">
              <button
                onClick={prevSlide}
                className="absolute left-4 z-10 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all"
              >
                <MdKeyboardDoubleArrowLeft className="w-6 h-6 text-gray-800" />
              </button>

              <div className="flex flex-col md:flex-row items-center p-6 md:p-12 w-full">
                <div className="w-full md:w-1/2 mb-8 md:mb-0">
                  {/* Render either image or JSX (iframe or img) */}
                  {typeof features[currentSlide].image === "string" ? (
                    <img
                      src={features[currentSlide].image}
                      alt={features[currentSlide].title}
                      className="rounded-lg object-cover w-full h-[300px] md:h-[400px]"
                    />
                  ) : (
                    features[currentSlide].image // This renders the JSX (iframe)
                  )}
                </div>
                <div className="w-full md:w-1/2 md:pl-12">
                  <div className="bg-gray-50 rounded-xl p-8 shadow-inner">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {features[currentSlide].title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {features[currentSlide].description}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={nextSlide}
                className="absolute right-4 z-10 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all"
              >
                <MdKeyboardDoubleArrowRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index ? "bg-indigo-600 w-6" : "bg-gray-300"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;