import Header from "@/components/layout/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <SEO 
        title="Privacy Policy | 9Yards Food"
        description="Read our privacy policy to understand how we collect, use, and protect your personal information when you order from 9Yards Food."
        url="/privacy"
      />
      <Header />
      <main className="pt-16 md:pt-20">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container-custom px-4">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Privacy Policy
              </h1>
              <p className="text-primary-foreground/70">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto prose prose-lg">
              <div className="space-y-8">
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
                      href="mailto:deliveries@9yards.co.ug"
                      className="text-secondary hover:underline"
                    >
                      deliveries@9yards.co.ug
                    </a>{" "}
                    or call{" "}
                    <a
                      href="tel:+256708899597"
                      className="text-secondary hover:underline"
                    >
                      +256 708 899 597
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
