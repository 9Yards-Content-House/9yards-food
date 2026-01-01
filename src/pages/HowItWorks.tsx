import { Link } from 'react-router-dom';
import { 
  UtensilsCrossed, ChefHat, Truck, MessageCircle, CreditCard, 
  Check, ChevronRight, ChevronDown, Star, Clock, Leaf, Award,
  Smartphone, Wallet, MapPin, Phone
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';

// Animated counter hook
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, isInView]);

  return { count, ref };
}

// FAQ data
const faqs = [
  {
    question: 'How long does delivery take?',
    answer: 'Most deliveries arrive within 30-45 minutes, depending on your location in Kampala. During peak hours (lunch and dinner), it may take up to 60 minutes.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept cash on delivery (via WhatsApp orders), Mobile Money (MTN, Airtel), and credit/debit cards (via online payment).'
  },
  {
    question: 'Do you deliver to my area?',
    answer: 'We deliver across Kampala including Central, Nakawa, Kololo, Muyenga, Ntinda, Bukoto, and more. Check our delivery areas page for full coverage details.'
  },
  {
    question: 'Can I customize my order?',
    answer: 'Absolutely! You can choose multiple main dishes, select your sauce, pick fried or boiled preparation, choose portion sizes, and add extras like natural juices and desserts.'
  },
  {
    question: 'Is there a minimum order amount?',
    answer: 'No minimum order! However, orders over 50,000 UGX qualify for FREE delivery. Orders under this amount have a small delivery fee based on your location.'
  },
];

// Step images (using Unsplash placeholders)
const stepImages = {
  choose: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
  customize: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
  order: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
  delivery: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600',
};

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <Header />
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container-custom px-4">
            <div
              className="max-w-4xl mx-auto text-center"
            >
              {/* Breadcrumb */}
              <div className="text-sm mb-6 opacity-80">
                <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-secondary font-medium">Order Guide</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Order Guide
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 leading-relaxed max-w-3xl mx-auto">
                Ordering authentic Ugandan food has never been easier.
                <br className="hidden md:block" />
                Follow these <span className="text-secondary font-bold">4 simple steps</span> to enjoy fresh, delicious meals delivered to your door.
              </p>

              {/* Trust Indicators */}
              <div
                className="flex flex-wrap items-center justify-center gap-6 text-sm"
              >
                <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Clock className="w-5 h-5 text-secondary" />
                  <span>30-45 min delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Leaf className="w-5 h-5 text-secondary" />
                  <span>100% Natural Ingredients</span>
                </div>
                <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Award className="w-5 h-5 text-secondary" />
                  <span>Celebrity Approved</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 1: Choose Your Food */}
        <section className="py-16 md:py-24">
          <div className="container-custom px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div
                className="order-2 md:order-1"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-secondary-foreground text-2xl font-bold shadow-lg">
                    1
                  </div>
                  <span className="text-secondary font-bold text-lg uppercase tracking-wide">Step 1</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Choose Your Food
                </h2>

                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Browse our menu and select from authentic Ugandan main dishes like Matooke, Posho, Rice, Cassava, and more.
                  <span className="text-secondary font-semibold"> Choose as many as you like</span> - they're all included in your combo!
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {[
                    'Select multiple main dishes (Matooke, Posho, Rice, etc.)',
                    'All authentic Ugandan staples prepared fresh daily',
                    'No extra charge for variety - mix and match!',
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/menu"
                  className="text-secondary font-bold flex items-center gap-2 hover:gap-3 transition-all group"
                >
                  View Our Menu
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Image */}
              <div
                className="order-1 md:order-2"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={stepImages.choose}
                    alt="Authentic Ugandan dishes"
                    className="w-full h-[350px] md:h-[400px] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-6 left-6 bg-card/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-sm font-bold text-foreground flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4 text-secondary" />
                      7 Main Dishes Available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Customize Your Combo */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container-custom px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={stepImages.customize}
                    alt="Customize your combo"
                    className="w-full h-[350px] md:h-[400px] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-6 right-6 bg-card/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-sm font-bold text-foreground flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-secondary" />
                      6 Delicious Sauces
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-secondary-foreground text-2xl font-bold shadow-lg">
                    2
                  </div>
                  <span className="text-secondary font-bold text-lg uppercase tracking-wide">Step 2</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Customize Your Combo
                </h2>

                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Pick your sauce (Meat, Chicken, Fish, G-Nuts, etc.), select preparation style, and choose your
                  <span className="text-green-600 font-semibold"> free side dish</span>. Make it exactly how you like it!
                </p>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {[
                    { text: 'Choose Fried or Boiled preparation (healthier option)', highlight: false },
                    { text: 'Select portion size based on your appetite', highlight: false },
                    { text: 'Pick a FREE side dish (Greens, Beans, Cabbage, etc.)', highlight: true },
                    { text: 'Add extras: Natural juices, desserts', highlight: false },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${feature.highlight ? 'text-green-500' : 'text-green-500'}`} />
                      <span className={`${feature.highlight ? 'text-green-600 font-medium' : 'text-foreground/80'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 3: Order via WhatsApp or Pay Online */}
        <section className="py-16 md:py-24">
          <div className="container-custom px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div
                className="order-2 md:order-1"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-secondary-foreground text-2xl font-bold shadow-lg">
                    3
                  </div>
                  <span className="text-secondary font-bold text-lg uppercase tracking-wide">Step 3</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Order via WhatsApp or Pay Online
                </h2>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Choose your preferred ordering method: Send your order directly to us via WhatsApp (pay on delivery)
                  or pay securely online with Mobile Money or card.
                </p>

                {/* Payment Options */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {/* WhatsApp Option */}
                  <div
                    className="border-2 border-green-500 rounded-xl p-6 bg-card transition-all cursor-pointer hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">WhatsApp Order</h3>
                    <p className="text-sm text-muted-foreground mb-3">Quick & convenient - pay on delivery</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Instant chat support</p>
                      <p className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Cash on delivery</p>
                      <p className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Real-time updates</p>
                    </div>
                  </div>

                  {/* Online Payment Option */}
                  <div
                    className="border-2 border-secondary rounded-xl p-6 bg-card transition-all cursor-pointer hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                      <CreditCard className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">Pay Online</h3>
                    <p className="text-sm text-muted-foreground mb-3">Secure payment - instant confirmation</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Mobile Money accepted</p>
                      <p className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Card payments</p>
                      <p className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Automatic receipt</p>
                    </div>
                  </div>
                </div>

                {/* Pro Tip */}
                <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                  <p className="text-sm text-foreground">
                    <span className="font-bold">💡 Pro tip:</span> Orders over 50,000 UGX qualify for FREE delivery!
                  </p>
                </div>
              </div>

              {/* Image */}
              <div
                className="order-1 md:order-2"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={stepImages.order}
                    alt="Easy payment options"
                    className="w-full h-[350px] md:h-[400px] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <div className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" /> MTN MoMo
                    </div>
                    <div className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5" /> Airtel Money
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 4: Fresh Delivery */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container-custom px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={stepImages.delivery}
                    alt="Fast delivery to your door"
                    className="w-full h-[350px] md:h-[400px] object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute top-6 left-6 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg shadow-lg"
                  >
                    <p className="text-sm font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      30-45 min delivery
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-secondary-foreground text-2xl font-bold shadow-lg">
                    4
                  </div>
                  <span className="text-secondary font-bold text-lg uppercase tracking-wide">Step 4</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Fresh Delivery
                </h2>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Your freshly prepared meal arrives hot at your doorstep within 30-45 minutes.
                  We cook and deliver ourselves - <span className="text-secondary font-semibold">no third parties</span>, just authentic quality.
                </p>

                {/* Delivery Timeline */}
                <div className="space-y-4">
                  {[
                    { title: 'Order Confirmed', desc: 'We receive your order and start preparing immediately', done: true },
                    { title: 'Cooking Fresh', desc: 'Your meal is prepared with 100% natural ingredients', done: true },
                    { title: 'On The Way', desc: 'Our delivery team brings it hot to your door', done: true },
                    { title: 'Enjoy!', desc: 'Your authentic Ugandan meal is ready to enjoy', done: false, celebrate: true },
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.celebrate ? 'bg-secondary text-secondary-foreground' : 'bg-green-500 text-white'
                      }`}>
                        {step.celebrate ? '🎉' : <Check className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{step.title}</p>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16 md:py-20">
          <div className="container-custom px-4">
            <div
              className="max-w-3xl mx-auto bg-card border-2 border-secondary/20 rounded-2xl p-8 shadow-xl text-center"
            >
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-secondary fill-secondary" />
                ))}
              </div>
              <p className="text-xl md:text-2xl text-foreground/90 italic mb-6 leading-relaxed">
                "The most authentic Ugandan food in Kampala! I order from 9Yards Food every week.
                The quality is unmatched and delivery is always fast. Highly recommended!"
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center text-lg font-bold text-secondary">
                  SD
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground">Spice Diana</p>
                  <p className="text-sm text-muted-foreground">Musician & Influencer</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container-custom px-4">
            <div className="max-w-3xl mx-auto">
              <div
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground">
                  Everything you need to know about ordering from 9Yards Food
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-xl overflow-hidden transition-all ${
                      openFaq === index ? 'border-secondary bg-card shadow-lg' : 'border-border bg-card hover:border-secondary/50'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4"
                    >
                      <h3 className="font-bold text-foreground text-lg">{faq.question}</h3>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`} />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                        {faq.answer}
                        {faq.question.includes('deliver to my area') && (
                          <Link to="/delivery-zones" className="text-secondary font-semibold hover:underline ml-1">
                            View delivery areas →
                          </Link>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="text-center mt-8"
              >
                <p className="text-muted-foreground mb-4">Still have questions?</p>
                <Link to="/contact" className="text-secondary font-bold hover:underline flex items-center justify-center gap-2">
                  Contact Us <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
          <div className="container-custom px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Ready to Experience Authentic Ugandan Cuisine?
                </h2>
                <p className="text-xl md:text-2xl text-primary-foreground/90 mb-2">
                  Join <span className="text-secondary font-bold">10,000+ happy customers</span> who trust 9Yards Food
                </p>
                <p className="text-lg text-primary-foreground/70 mb-8">
                  Celebrity-approved • 100% Natural • Fast Delivery
                </p>
              </div>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <Link
                  to="/menu"
                  className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2"
                >
                  🍽️ Start Your Order
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/menu"
                  className="bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground font-semibold px-8 py-4 rounded-lg transition-all hover:bg-primary-foreground/20 border-2 border-primary-foreground/30 flex items-center justify-center gap-2"
                >
                  📋 View Menu
                </Link>
              </div>

              {/* Stats */}
              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
              >
                <StatItem value={10000} suffix="+" label="Orders Delivered" />
                <StatItem value={4.9} suffix="★" label="Average Rating" isDecimal />
                <StatItem value={30} suffix="min" label="Avg Delivery" />
                <StatItem value={100} suffix="%" label="Natural Ingredients" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-card/95 backdrop-blur-md border-t border-border lg:hidden z-40 shadow-2xl">
        <Link
          to="/menu"
          className="w-full btn-secondary text-lg py-4 flex items-center justify-center gap-2"
        >
          🍽️ Start Your Order
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

// Stat item component with count-up
function StatItem({ value, suffix, label, isDecimal = false }: { value: number; suffix: string; label: string; isDecimal?: boolean }) {
  const { count, ref } = useCountUp(isDecimal ? Math.floor(value * 10) : value, 2000);
  const displayValue = isDecimal ? (count / 10).toFixed(1) : count.toLocaleString();

  return (
    <div ref={ref}>
      <p className="text-3xl md:text-4xl font-bold text-secondary mb-1">
        {displayValue}{suffix}
      </p>
      <p className="text-sm text-primary-foreground/70">{label}</p>
    </div>
  );
}
