import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobilePageHeader from "@/components/layout/MobilePageHeader";
import SEO from "@/components/SEO";
import { pageMetadata } from "@/data/seo";

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={pageMetadata.terms.title}
        description={pageMetadata.terms.description}
        keywords={pageMetadata.terms.keywords}
        url={pageMetadata.terms.canonicalUrl}
      />

      {/* Desktop Header */}
      <Header />

      {/* Mobile Header */}
      <MobilePageHeader title="Terms & Conditions" />

      <main className="pt-32">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#212282] to-[#1a1b68] text-white py-10 lg:py-14">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-3xl font-black mb-2">
                Terms & Conditions
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
                  1. Order Acceptance
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  By placing an order with 9Yards Food, you agree to these terms.
                  All orders are subject to availability. We reserve the right to
                  refuse or cancel orders at our discretion.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  2. Pricing & Payment
                </h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  All prices are in Ugandan Shillings (UGX) and include applicable
                  taxes. Delivery fees vary by location. Payment is accepted via:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1.5 ml-1">
                  <li>Cash on Delivery</li>
                  <li>Mobile Money (MTN, Airtel)</li>
                  <li>Online Payment (coming soon)</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  3. Delivery
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We deliver within Kampala and surrounding areas. Estimated
                  delivery times are 30-45 minutes but may vary based on traffic
                  and kitchen volume. Orders over 50,000 UGX qualify for free
                  delivery.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  4. Order Cancellation
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Orders can be cancelled within 5 minutes of placement. Once
                  preparation begins, cancellation may not be possible. Please
                  contact us immediately if you need to modify or cancel an order.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  5. Food Quality
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We prepare all meals fresh with 100% natural ingredients. If you
                  are unsatisfied with your order quality, please contact us within
                  30 minutes of delivery. We will work to resolve any issues.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  6. Contact
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  For questions about these terms, contact us at{" "}
                  <a
                    href="mailto:deliveries@9yards.co.ug"
                    className="text-[#E6411C] hover:underline"
                  >
                    deliveries@9yards.co.ug
                  </a>{" "}
                  or WhatsApp{" "}
                  <a
                    href="https://wa.me/256708899597"
                    target="_blank"
                    rel="noopener noreferrer"
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
