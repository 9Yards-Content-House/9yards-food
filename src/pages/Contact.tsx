import { Link } from "react-router-dom";
import { Phone, Mail, Clock, Check, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobilePageHeader from "@/components/layout/MobilePageHeader";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { pageMetadata } from "@/data/seo";
import { haptics } from "@/lib/utils/ui";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Contact methods
const contactMethods = [
  {
    id: "whatsapp",
    title: "WhatsApp",
    subtitle: "Fastest Response",
    description: "Chat with us directly",
    icon: WhatsAppIcon,
    href: "https://wa.me/256708899597?text=Hello%2C%20I%20have%20a%20question",
    color: "bg-green-500",
    bgLight: "bg-green-50",
    textColor: "text-green-600",
    badge: "Recommended",
    external: true,
  },
  {
    id: "call",
    title: "Call Us",
    subtitle: "+256 708 899 597",
    description: "Mon-Sun, 10am-10pm",
    icon: Phone,
    href: "tel:+256708899597",
    color: "bg-blue-500",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
    external: false,
  },
  {
    id: "email",
    title: "Email",
    subtitle: "deliveries@9yards.co.ug",
    description: "We'll reply within 24hrs",
    icon: Mail,
    href: "mailto:deliveries@9yards.co.ug",
    color: "bg-[#E6411C]",
    bgLight: "bg-orange-50",
    textColor: "text-[#E6411C]",
    external: false,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    haptics.medium();

    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formDataObj as any).toString(),
      });

      if (response.ok) {
        setIsSubmitted(true);
        haptics.success();
        toast.success("Message sent! We'll get back to you soon.");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      haptics.error();
      toast.error("Failed to send. Please try WhatsApp instead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={pageMetadata.contact.title}
        description={pageMetadata.contact.description}
        keywords={pageMetadata.contact.keywords}
        url={pageMetadata.contact.canonicalUrl}
        jsonLd={pageMetadata.contact.schema}
      />

      {/* Desktop Header */}
      <Header />

      {/* Mobile Header */}
      <MobilePageHeader title="Contact" subtitle="Get in touch" />

      <main className="pt-32">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#212282] via-[#2a2b9a] to-[#1a1b68] text-white pt-12 pb-12 lg:pt-16 lg:pb-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#E6411C]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="max-w-2xl mx-auto text-center"
            >
              <h1 className="text-3xl sm:text-4xl font-black mb-3">
                We're Here to Help
              </h1>
              <p className="text-white/80">
                Questions about orders, bulk catering, or feedback? Reach out anytime.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-10 lg:py-14 -mt-6">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <motion.a
                    key={method.id}
                    href={method.href}
                    target={method.external ? "_blank" : undefined}
                    rel={method.external ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => haptics.medium()}
                    className={`relative bg-white rounded-2xl p-5 text-center shadow-lg border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
                      method.id === "whatsapp"
                        ? "border-green-500"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    {method.badge && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {method.badge}
                      </div>
                    )}

                    <div
                      className={`w-14 h-14 ${method.bgLight} rounded-xl flex items-center justify-center mx-auto mb-3`}
                    >
                      <Icon className={`w-7 h-7 ${method.textColor}`} />
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg">{method.title}</h3>
                    <p className={`text-sm font-medium ${method.textColor} mt-1`}>
                      {method.subtitle}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-10 lg:py-14 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl font-black text-gray-900 mb-2">
                  Send a Message
                </h2>
                <p className="text-gray-600 text-sm">
                  Or fill out the form and we'll get back to you
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      We'll get back to you as soon as possible.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link
                        to="/menu"
                        onClick={() => haptics.medium()}
                        className="bg-[#E6411C] hover:bg-[#d13a18] text-white font-bold px-6 py-3 rounded-xl transition-colors"
                      >
                        View Menu
                      </Link>
                      <button
                        onClick={() => {
                          haptics.light();
                          setIsSubmitted(false);
                        }}
                        className="px-6 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                      >
                        Send Another
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    name="contact"
                    method="POST"
                    data-netlify="true"
                    netlify-honeypot="bot-field"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <input type="hidden" name="form-name" value="contact" />
                    <p className="hidden">
                      <label>
                        Don't fill this out: <input name="bot-field" />
                      </label>
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#212282] focus:ring-1 focus:ring-[#212282] transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+256..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#212282] focus:ring-1 focus:ring-[#212282] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#212282] focus:ring-1 focus:ring-[#212282] transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Message
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="How can we help?"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#212282] focus:ring-1 focus:ring-[#212282] resize-none transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#212282] hover:bg-[#1a1b68] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Operating Hours */}
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Clock className="w-4 h-4" />
                Open 7 Days a Week
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-2">
                10:00 AM – 10:00 PM
              </h2>
              <p className="text-gray-600 text-sm">
                Last orders accepted 1 hour before closing
              </p>
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
