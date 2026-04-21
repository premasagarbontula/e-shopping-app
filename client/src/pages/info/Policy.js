import React from "react";
import Layout from "../../components/layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Our Company Policy"}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <img
              src="/images/privacy-policy-img.jpg"
              alt="policy"
              className="w-full max-w-md rounded-xl shadow-md"
            />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white bg-gray-800 text-center py-2 rounded-md mb-4">
              PRIVACY POLICY
            </h1>

            <p className="text-gray-600 leading-relaxed">
              We encourage you to read this policy carefully to understand the
              Company's policies and practices regarding your information. By
              accessing or using its Services or its Platform, registering an
              account with the Company, becoming a supplier, reseller or
              customer on the Platform, or by attempting to become a supplier,
              reseller or customer, you expressly agree to be bound by the terms
              and conditions of this privacy policy.
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              This policy may change from time to time. Your continued use of
              the Company's Services after it makes any change is deemed to be
              acceptance of those changes, so please check the policy
              periodically for updates.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
