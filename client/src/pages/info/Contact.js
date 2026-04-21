import React from "react";
import Layout from "../../components/layout/Layout";
import { MdEmail, MdOutlinePhoneInTalk, MdHeadsetMic } from "react-icons/md";

const Contact = () => {
  return (
    <Layout title={"Contact : 24x7"}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <img
              src="/images/contact-us-img.png"
              alt="contact-us"
              className="w-full max-w-md rounded-xl shadow-md"
            />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white bg-gray-800 text-center py-2 rounded-md mb-4">
              CONTACT US
            </h1>

            <p className="text-gray-600 leading-relaxed">
              Welcome to 24x7 Help Line. Contact us for any product-related or
              order-related enquiries.
            </p>

            <div className="mt-6 space-y-4 text-gray-700">
              <a
                href="mailto:customersupport@gmail.com"
                className="flex items-center gap-3 hover:text-indigo-600 transition"
              >
                <MdEmail className="text-indigo-600 text-xl" />
                customersupport@gmail.com
              </a>

              <a
                href="tel:+91987654321"
                className="flex items-center gap-3 hover:text-indigo-600 transition"
              >
                <MdOutlinePhoneInTalk className="text-indigo-600 text-xl" />
                +91 987654321
              </a>

              <p className="flex items-center gap-3">
                <MdHeadsetMic className="text-indigo-600 text-xl" />
                1800-0123456
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
