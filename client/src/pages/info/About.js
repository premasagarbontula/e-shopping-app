import React from "react";
import Layout from "../../components/layout/Layout";

const About = () => {
  return (
    <Layout title={"About Our Company"}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <img
              src="/images/about-us-img.png"
              alt="aboutus"
              className="w-full max-w-md rounded-xl shadow-md"
            />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white bg-gray-800 text-center py-2 rounded-md mb-4">
              ABOUT US
            </h1>

            <p className="text-gray-600 leading-relaxed">
              Ecommerce: Affordable Online Shopping at Your Fingertips. There
              are many benefits of shopping online. You can take your time and
              explore different options to find exactly what you want. It’s easy
              to compare prices online and get the best deals available.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              With Ecommerce, you can shop for anything at competitive prices.
              Whether you're looking for essentials or gifts for your friends
              and family, you’ll find a wide range of options conveniently
              available online.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
