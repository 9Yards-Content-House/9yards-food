import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';

export default function TermsPage() {
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
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms & Conditions</h1>
              <p className="text-primary-foreground/70">
                Last updated: December 2024
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="card-premium p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    1. Order Acceptance
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By placing an order with 9Yards Food, you agree to these terms. All orders 
                    are subject to availability. We reserve the right to refuse or cancel orders 
                    at our discretion.
                  </p>
                </div>

                <div className="card-premium p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    2. Pricing & Payment
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    All prices are in Ugandan Shillings (UGX) and include applicable taxes. 
                    Delivery fees vary by location. Payment is accepted via:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Cash on Delivery</li>
                    <li>Mobile Money (MTN, Airtel)</li>
                    <li>Online Payment (coming soon)</li>
                  </ul>
                </div>

                <div className="card-premium p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    3. Delivery
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We deliver within Kampala and surrounding areas. Estimated delivery times 
                    are 30-45 minutes but may vary based on traffic and kitchen volume. 
                    Orders over 50,000 UGX qualify for free delivery.
                  </p>
                </div>

                <div className="card-premium p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    4. Order Cancellation
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Orders can be cancelled within 5 minutes of placement. Once preparation 
                    begins, cancellation may not be possible. Please contact us immediately 
                    if you need to modify or cancel an order.
                  </p>
                </div>

                <div className="card-premium p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    5. Food Quality
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We prepare all meals fresh with 100% natural ingredients. If you are 
                    unsatisfied with your order quality, please contact us within 30 minutes 
                    of delivery. We will work to resolve any issues.
                  </p>
                </div>

                <div className="card-premium p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    6. Contact
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    For questions about these terms, contact us at{' '}
                    <a 
                      href="mailto:info@9yards.co.ug" 
                      className="text-secondary hover:underline"
                    >
                      info@9yards.co.ug
                    </a>{' '}
                    or WhatsApp{' '}
                    <a 
                      href="https://wa.me/256700488870" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline"
                    >
                      +256 700 488 870
                    </a>.
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
