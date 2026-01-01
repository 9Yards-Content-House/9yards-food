import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, MessageCircle, Clock, ChevronDown, ChevronRight,
  Zap, Check, ShieldCheck, Users, Sparkles, PartyPopper, Building2,
  Cake, Briefcase, Instagram, Youtube, Music2, ExternalLink, Copy
} from 'lucide-react';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { toast } from 'sonner';

// FAQ data
const faqs = [
  {
    question: 'How do I place an order?',
    answer: 'You can order in two ways: 1) Browse our menu, add items to cart, and send your order via WhatsApp. 2) Complete payment online through our secure checkout using Mobile Money or Card. Both methods are fast and easy!'
  },
  {
    question: 'What areas do you deliver to?',
    answer: 'We deliver across Kampala including Central, Nakawa, Kololo, Muyenga, Ntinda, Bukoto, Bugolobi, and many more areas. Check our Delivery Zones page for full coverage details and delivery fees.'
  },
  {
    question: 'How long does delivery take?',
    answer: 'Most deliveries arrive within 30-45 minutes, depending on your location in Kampala. During peak hours (lunch 12-2PM and dinner 6-8PM), it may take up to 60 minutes. We always cook fresh, so your food is never sitting around!'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept Cash on Delivery (via WhatsApp orders), Mobile Money (MTN MoMo and Airtel Money), and Credit/Debit Cards (Visa, Mastercard) via our secure online checkout.'
  },
  {
    question: 'Can I cancel or modify my order?',
    answer: 'Yes! Contact us via WhatsApp immediately if you need to modify or cancel. If we haven\'t started cooking yet, we can make changes. Once cooking begins, modifications may not be possible, but we\'ll always try our best.'
  },
  {
    question: 'Do you cater for events or bulk orders?',
    answer: 'Absolutely! We cater for weddings, corporate events, birthday parties, conferences, and more. Contact us for a custom quote - we offer special pricing for bulk orders and can customize menus for your event.'
  },
  {
    question: 'What if I\'m not satisfied with my order?',
    answer: 'Your satisfaction is our priority! If there\'s any issue with your order, contact us immediately via WhatsApp. We\'ll make it right - whether that means a refund, replacement, or credit for your next order.'
  },
  {
    question: 'Are your ingredients really 100% natural?',
    answer: 'Yes! We use only fresh, natural ingredients sourced from local Ugandan farmers and markets. No preservatives, no artificial flavors, no shortcuts. That\'s our promise to you.'
  },
];

// Inquiry types for form
const inquiryTypes = [
  { value: 'order', label: '🍽️ Order Question', icon: '🍽️' },
  { value: 'delivery', label: '🚚 Delivery Inquiry', icon: '🚚' },
  { value: 'bulk', label: '💰 Bulk/Catering Order', icon: '💰' },
  { value: 'business', label: '💼 Business Partnership', icon: '💼' },
  { value: 'issue', label: '🐛 Report an Issue', icon: '🐛' },
  { value: 'feedback', label: '💬 General Feedback', icon: '💬' },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number>(0); // First FAQ open by default
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    subject: '',
    message: '',
    optIn: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);

    try {
      // Submit to Netlify Forms
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataObj as any).toString(),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Message sent successfully! We\'ll respond within 2 hours.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          inquiryType: '',
          subject: '',
          message: '',
          optIn: false,
        });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try WhatsApp instead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <Header />
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-12 md:py-20">
          <div className="container-custom px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                We're Here to Help
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-6">
                Have a question? Need support? Want to place a bulk order?
                <br className="hidden md:block" /> We'd love to hear from you!
              </p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full"
              >
                <Zap className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium">Average Response Time: <span className="text-secondary font-bold">Under 2 Hours</span></span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Quick Action Buttons */}
        <section className="py-12 md:py-16 bg-card border-b border-border">
          <div className="container-custom px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8"
            >
              Choose How to Reach Us
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Call Card */}
              <motion.a
                href="tel:+256700488870"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className="bg-card border-2 border-border rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-secondary"
              >
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-2">Call Us</h3>
                <p className="text-muted-foreground text-sm mb-4">Instant Support</p>
                <div className="btn-secondary w-full">Call Now</div>
              </motion.a>

              {/* WhatsApp Card */}
              <motion.a
                href="https://wa.me/256700488870?text=Hi%209Yards%20Food!%20I%20have%20a%20question%20about..."
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className="bg-card border-2 border-green-500 rounded-2xl p-6 text-center cursor-pointer transition-all relative overflow-hidden"
              >
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Fastest
                </div>
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-2">WhatsApp</h3>
                <p className="text-muted-foreground text-sm mb-4">Fastest Response</p>
                <div className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg w-full">Chat Now</div>
              </motion.a>

              {/* Email Card */}
              <motion.a
                href="mailto:info@9yards.co.ug?subject=Inquiry%20from%20Website"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className="bg-card border-2 border-border rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-secondary"
              >
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground text-sm mb-4">Detailed Inquiries</p>
                <div className="btn-secondary w-full">Send Email</div>
              </motion.a>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-12 md:py-20">
          <div className="container-custom px-4">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Left: Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Get in Touch
                </h2>

                <div className="space-y-4">
                  {/* Call Us */}
                  <div className="bg-card border border-border rounded-xl p-4 hover:border-secondary transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">Call Us</h3>
                        <p className="text-lg text-foreground font-medium">+256 700 488 870</p>
                        <p className="text-sm text-muted-foreground mb-3">Available 7 days a week</p>
                        <a
                          href="tel:+256700488870"
                          className="text-sm font-bold text-secondary flex items-center gap-1 hover:underline"
                        >
                          Call Now <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                      <button
                        onClick={() => copyToClipboard('+256700488870')}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Copy number"
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="bg-card border-2 border-green-500/30 rounded-xl p-4 hover:border-green-500 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground">WhatsApp</h3>
                          <span className="bg-green-500/10 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">Fastest</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Chat with us directly - fastest response guaranteed</p>
                        <a
                          href="https://wa.me/256700488870?text=Hi%209Yards%20Food!%20I%20have%20a%20question%20about..."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Open WhatsApp <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="bg-card border border-border rounded-xl p-4 hover:border-secondary transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">Email</h3>
                        <p className="text-foreground">info@9yards.co.ug</p>
                        <p className="text-sm text-muted-foreground mb-3">We reply within 24 hours</p>
                        <a
                          href="mailto:info@9yards.co.ug"
                          className="text-sm font-bold text-secondary flex items-center gap-1 hover:underline"
                        >
                          Send Email <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                      <button
                        onClick={() => copyToClipboard('info@9yards.co.ug')}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Copy email"
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">Operating Hours</h3>
                        <p className="text-foreground">Monday - Sunday</p>
                        <p className="text-lg font-bold text-foreground">10:00 AM - 10:00 PM</p>
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 text-sm font-bold px-3 py-1 rounded-full">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          Open Every Day!
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-card border border-border rounded-xl p-4 hover:border-secondary transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">Location</h3>
                        <p className="text-foreground">Kampala, Uganda</p>
                        <p className="text-sm text-muted-foreground mb-3">(Online delivery only)</p>
                        <Link
                          to="/delivery-zones"
                          className="text-sm font-bold text-secondary flex items-center gap-1 hover:underline"
                        >
                          View Delivery Zones <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="bg-card border border-border rounded-xl p-4">
                    <h3 className="font-bold text-foreground mb-3">Follow Us</h3>
                    <div className="flex gap-3">
                      <a
                        href="https://instagram.com/9yardsfood"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                      >
                        <Instagram className="w-5 h-5 text-white" />
                      </a>
                      <a
                        href="https://tiktok.com/@9yardsfood"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-black rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                      >
                        <Music2 className="w-5 h-5 text-white" />
                      </a>
                      <a
                        href="https://youtube.com/@9yardsfood"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                      >
                        <Youtube className="w-5 h-5 text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-3"
              >
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. We'll get back to you within 2 hours.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/menu" className="btn-secondary">
                          View Our Menu
                        </Link>
                        <button
                          onClick={() => {
                            setIsSubmitted(false);
                            setFormData({
                              name: '',
                              email: '',
                              phone: '',
                              inquiryType: '',
                              subject: '',
                              message: '',
                              optIn: false,
                            });
                          }}
                          className="px-6 py-3 border-2 border-border rounded-lg font-semibold hover:bg-muted transition-colors"
                        >
                          Send Another Message
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                        Send Us a Message
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        What can we help you with today?
                      </p>

                      {/* Inquiry Type Selector */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                        {inquiryTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, inquiryType: type.value }))}
                            className={`p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                              formData.inquiryType === type.value
                                ? 'border-secondary bg-secondary/5 text-secondary'
                                : 'border-border hover:border-secondary/50'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="block mt-1">{type.label.replace(type.icon + ' ', '')}</span>
                          </button>
                        ))}
                      </div>

                      <form 
                        name="contact" 
                        method="POST" 
                        data-netlify="true" 
                        netlify-honeypot="bot-field"
                        onSubmit={handleSubmit} 
                        className="space-y-4"
                      >
                        {/* Hidden fields for Netlify */}
                        <input type="hidden" name="form-name" value="contact" />
                        <input type="hidden" name="inquiry-type" value={formData.inquiryType} />
                        <p className="hidden">
                          <label>Don't fill this out if you're human: <input name="bot-field" /></label>
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Your full name"
                              className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="you@example.com"
                              className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+256 700 000 000"
                              className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Subject <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="subject"
                              required
                              value={formData.subject}
                              onChange={handleInputChange}
                              placeholder="What's this about?"
                              className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Message <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="message"
                            required
                            rows={5}
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Tell us more about your inquiry..."
                            className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary resize-none"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {formData.message.length} characters
                          </p>
                        </div>

                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="optIn"
                            name="optIn"
                            checked={formData.optIn}
                            onChange={handleInputChange}
                            className="w-5 h-5 rounded border-border text-secondary focus:ring-secondary mt-0.5"
                          />
                          <label htmlFor="optIn" className="text-sm text-muted-foreground cursor-pointer">
                            I'd like to receive promotional offers and updates from 9Yards Food
                          </label>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full btn-secondary text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <ChevronRight className="w-5 h-5" />
                            </>
                          )}
                        </button>

                        <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                          <Zap className="w-4 h-4 text-secondary" />
                          We typically respond within 2 hours
                        </p>
                      </form>
                    </>
                  )}
                </div>

                {/* Trust Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
                >
                  {[
                    { icon: ShieldCheck, text: 'Verified Business' },
                    { icon: Users, text: '10,000+ Customers' },
                    { icon: Zap, text: 'Fast Response' },
                    { icon: Sparkles, text: 'Secure & Private' },
                  ].map((badge, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <badge.icon className="w-4 h-4 text-green-500" />
                      <span>{badge.text}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bulk/Catering CTA */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
          <div className="container-custom px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <PartyPopper className="w-8 h-8" />
                <span className="text-2xl md:text-3xl font-bold">Planning an Event?</span>
              </div>
              <p className="text-lg md:text-xl text-secondary-foreground/90 mb-6">
                We cater for parties, corporate events, and bulk orders
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-8">
                {[
                  { icon: PartyPopper, text: 'Weddings & Celebrations' },
                  { icon: Building2, text: 'Office Lunches' },
                  { icon: Cake, text: 'Birthday Parties' },
                  { icon: Briefcase, text: 'Conference Catering' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/256700488870?text=Hi%209Yards%20Food!%20I%27d%20like%20to%20get%20a%20quote%20for%20bulk%2Fcatering%20order%20for%20my%20event."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Get a Custom Quote
                <ChevronRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Operating Hours Visual */}
        <section className="py-12 md:py-16">
          <div className="container-custom px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
                When We're Available
              </h2>

              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <p className="text-center font-bold text-lg text-foreground mb-4">Monday - Sunday</p>
                
                {/* Timeline Visual */}
                <div className="relative mb-6">
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                      style={{ marginLeft: '25%', width: '50%' }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>6AM</span>
                    <span className="font-bold text-green-600">10AM</span>
                    <span className="text-center">
                      <span className="font-bold text-foreground">OPEN</span>
                    </span>
                    <span className="font-bold text-green-600">10PM</span>
                    <span>12AM</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-foreground">Open 7 Days a Week</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-foreground">Same-Day Delivery</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-foreground">Order 1 Hour Before Closing</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container-custom px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Quick answers to common questions
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-2 rounded-xl overflow-hidden transition-all ${
                    openFaq === index ? 'border-secondary bg-card shadow-lg' : 'border-border bg-card hover:border-secondary/50'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4"
                  >
                    <h3 className="font-bold text-foreground">{faq.question}</h3>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === index ? 'auto' : 0, opacity: openFaq === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <p className="text-muted-foreground mb-4">Still have questions?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/256700488870?text=Hi%209Yards%20Food!%20I%20have%20a%20question..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Support
                </a>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 border-2 border-border font-bold px-6 py-3 rounded-lg hover:bg-muted transition-colors"
                >
                  View How It Works
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
