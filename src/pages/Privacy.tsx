import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobilePageHeader from "@/components/layout/MobilePageHeader";
import SEO from "@/components/SEO";
import { pageMetadata } from "@/data/seo";

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={pageMetadata.privacy.title}
        description={pageMetadata.privacy.description}
        keywords={pageMetadata.privacy.keywords}
        url={pageMetadata.privacy.canonicalUrl}
      />

      {/* Desktop Header */}
      <Header />

      {/* Mobile Header */}
      <MobilePageHeader title="Privacy Policy" />

      <main className="pt-32">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#212282] to-[#1a1b68] text-white py-10 lg:py-14">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-3xl font-black mb-2">
                Privacy Policy
              </h1>
              <p className="text-white/60 text-sm">Last updated: {lastUpdated}</p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Section 1 */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  1. Information We Collect
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  When you place an order with 9Yards Food, we collect your
                  name, phone number, delivery address, and order preferences.
                  This information is essential for processing and delivering
                  your order.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1.5 ml-1">
                  <li>Process and deliver your orders</li>
                  <li>Communicate with you about your order status</li>
                  <li>Improve our services and menu offerings</li>
                  <li>Send promotional offers (with your consent)</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  3. Data Protection
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We take reasonable measures to protect your personal
                  information. Your data is stored securely and is only
                  accessible to authorized personnel who need it to process your
                  orders.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  4. Third-Party Services
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We use WhatsApp for order communication. When you place an
                  order via WhatsApp, your communication is subject to
                  WhatsApp's privacy policy. We do not sell your personal
                  information to third parties.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  5. Contact Us
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  If you have questions about this Privacy Policy, please
                  contact us at{" "}
                  <a
                    href="mailto:deliveries@9yards.co.ug"
                    className="text-[#E6411C] hover:underline"
                  >
                    deliveries@9yards.co.ug
                  </a>{" "}
                  or call{" "}
                  <a
                    href="tel:+256708899597"
                    className="text-[#E6411C] hover:underline"
                  >
                    +256 708 899 597
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom padding for mobile nav */}
        <div className="h-24 lg:hidden" />
      </main>

      <Footer />
    </div>
  );
}
