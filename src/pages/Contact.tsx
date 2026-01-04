import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Check,
  ExternalLink,
  Copy,
} from "lucide-react";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);

    try {
      // Submit to Netlify Forms
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formDataObj as any).toString(),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success("Message sent successfully! We'll get back to you soon.");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try WhatsApp instead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <Header />
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-12 md:py-20">
          <div className="container-custom px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                We're Here to Help
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-6">
                Have a question? Need support? Want to place a bulk order?
                <br className="hidden md:block" /> We'd love to hear from you!
              </p>
            </div>
          </div>
        </section>

        {/* Quick Action Buttons */}
        <section className="py-12 md:py-16 bg-card border-b border-border">
          <div className="container-custom px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
              Choose How to Reach Us
            </h2>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Call Card */}
              <a
                href="tel:+256708899597"
                className="bg-card border-2 border-border rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-secondary hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-2">
                  Call Us
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Instant Support
                </p>
                <div className="btn-secondary w-full">Call Now</div>
              </a>

              {/* WhatsApp Card */}
              <a
                href="https://wa.me/256708899597?text=Hi%209Yards%20Food!%20I%20have%20a%20question%20about..."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card border-2 border-green-500 rounded-2xl p-6 text-center cursor-pointer transition-all relative overflow-hidden hover:shadow-xl"
              >
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Fastest
                </div>
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <WhatsAppIcon className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-2">
                  WhatsApp
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Fastest Response
                </p>
                <div className="bg-green-500 text-white font-bold py-3 px-6 rounded-xl w-full">
                  Chat Now
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:deliveries@9yards.co.ug?subject=Inquiry%20from%20Website"
                className="bg-card border-2 border-border rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-secondary hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-2">
                  Email
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Detailed Inquiries
                </p>
                <div className="btn-secondary w-full">Send Email</div>
              </a>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-12 md:py-20">
          <div className="container-custom px-4">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Left: Contact Info */}
              <div className="lg:col-span-2">
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
                        <p className="text-lg text-foreground font-medium">
                          +256 708 899 597
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">
                          Available 7 days a week
                        </p>
                        <a
                          href="tel:+256708899597"
                          className="text-sm font-bold text-secondary flex items-center gap-1 hover:underline"
                        >
                          Call Now <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                      <button
                        onClick={() => copyToClipboard("+256708899597")}
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
                        <WhatsAppIcon className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground">
                            WhatsApp
                          </h3>
                          <span className="bg-green-500/10 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            Fastest
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Chat with us directly - fastest response guaranteed
                        </p>
                        <a
                          href="https://wa.me/256708899597?text=Hi%209Yards%20Food!%20I%20have%20a%20question%20about..."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
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
                        <p className="text-foreground">
                          deliveries@9yards.co.ug
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">
                          We reply within 24 hours
                        </p>
                        <a
                          href="mailto:deliveries@9yards.co.ug"
                          className="text-sm font-bold text-secondary flex items-center gap-1 hover:underline"
                        >
                          Send Email <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard("deliveries@9yards.co.ug")
                        }
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
                        <h3 className="font-bold text-foreground">
                          Operating Hours
                        </h3>
                        <p className="text-foreground">Monday - Sunday</p>
                        <p className="text-lg font-bold text-foreground">
                          10:00 AM - 10:00 PM
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 text-sm font-bold px-3 py-1 rounded-full">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          Open Every Day!
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="bg-card border border-border rounded-xl p-4">
                    <h3 className="font-bold text-foreground mb-3">
                      Follow Us
                    </h3>
                    <div className="flex gap-3">
                      <a
                        href="https://www.instagram.com/9yards_food/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                      >
                        <i className="fa-brands fa-instagram text-white text-xl"></i>
                      </a>
                      <a
                        href="https://www.tiktok.com/@9yardsfood"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-black rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                      >
                        <i className="fa-brands fa-tiktok text-white text-xl"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Contact Form */}
              <div className="lg:col-span-3">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. We'll get back to you soon.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/menu" className="btn-secondary">
                          View Our Menu
                        </Link>
                        <button
                          onClick={() => {
                            setIsSubmitted(false);
                            setFormData({
                              name: "",
                              email: "",
                              phone: "",
                              subject: "",
                              message: "",
                            });
                          }}
                          className="px-6 py-3 border-2 border-border rounded-xl font-semibold hover:bg-muted transition-colors"
                        >
                          Send Another Message
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                        Send Us a Message
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        What can we help you with today?
                      </p>

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
                        <p className="hidden">
                          <label>
                            Don't fill this out if you're human:{" "}
                            <input name="bot-field" />
                          </label>
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
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Operating Hours Visual */}
        <section className="py-12 md:py-16">
          <div className="container-custom px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
                When We're Available
              </h2>

              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <p className="text-center font-bold text-lg text-foreground mb-4">
                  Monday - Sunday
                </p>

                {/* Timeline Visual */}
                <div className="relative mb-6">
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                      style={{ marginLeft: "25%", width: "50%" }}
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
                    <span className="text-foreground">
                      Order 1 Hour Before Closing
                    </span>
                  </div>
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
