import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container-custom px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Privacy Policy
              </h1>
              <p className="text-primary-foreground/70">
                Last updated: December 2024
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto prose prose-lg">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="card-premium p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    1. Information We Collect
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    When you place an order with 9Yards Food, we collect your
                    name, phone number, delivery address, and order preferences.
                    This information is essential for processing and delivering
                    your order.
                  </p>
                </div>

                <div className="card-premium p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    2. How We Use Your Information
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use your information to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Process and deliver your orders</li>
                    <li>Communicate with you about your order status</li>
                    <li>Improve our services and menu offerings</li>
                    <li>Send promotional offers (with your consent)</li>
                  </ul>
                </div>

                <div className="card-premium p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    3. Data Protection
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We take reasonable measures to protect your personal
                    information. Your data is stored securely and is only
                    accessible to authorized personnel who need it to process
                    your orders.
                  </p>
                </div>

                <div className="card-premium p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    4. Third-Party Services
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We use WhatsApp for order communication. When you place an
                    order via WhatsApp, your communication is subject to
                    WhatsApp's privacy policy. We do not sell your personal
                    information to third parties.
                  </p>
                </div>

                <div className="card-premium p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    5. Contact Us
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have questions about this Privacy Policy, please
                    contact us at{" "}
                    <a
                      href="mailto:info@9yards.co.ug"
                      className="text-secondary hover:underline"
                    >
                      info@9yards.co.ug
                    </a>{" "}
                    or call{" "}
                    <a
                      href="tel:+256700488870"
                      className="text-secondary hover:underline"
                    >
                      +256 700 488 870
                    </a>
                    .
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
