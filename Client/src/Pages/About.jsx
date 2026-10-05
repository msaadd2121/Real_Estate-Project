import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-700 text-center mb-8">
          About <span className="text-green-700">Sahand Estate</span>
        </h1>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-10">
          <p className="text-slate-600 text-base sm:text-lg leading-8">
            Sahand Estate is a leading real estate agency that specializes in
            helping clients buy, sell, and rent properties in the most
            desirable neighborhoods. Our team of experienced agents is
            dedicated to providing exceptional service and making the buying
            and selling process as smooth as possible.
          </p>

          <p className="text-slate-600 text-base sm:text-lg leading-8 mt-6">
            Our mission is to help our clients achieve their real estate goals
            by providing expert advice, personalized service, and a deep
            understanding of the local market. Whether you are looking to buy,
            sell, or rent a property, we are here to help you every step of the
            way.
          </p>

          <p className="text-slate-600 text-base sm:text-lg leading-8 mt-6">
            Our team of agents has a wealth of experience and knowledge in the
            real estate industry, and we are committed to providing the highest
            level of service to our clients. We believe that buying or selling
            a property should be an exciting and rewarding experience, and we
            are dedicated to making that a reality for each and every one of
            our clients.
          </p>
        </div>

        {/* Bottom text */}
        <div className="text-center mt-8">
          <p className="text-green-700 font-semibold text-lg">
            Your dream property is just a step away!
          </p>
        </div>

      </div>
    </div>
  );
}