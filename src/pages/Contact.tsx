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
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { toast } from "sonner";
import SEO from "@/components/SEO";

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
      <SEO 
        title="Contact Us | Support & Inquiries"
        description="Get in touch with 9Yards Food. Call us, WhatsApp us, or send an email for support, questions, or bulk orders."
        url="/contact"
      />
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
                className="bg-card border-2 border-border rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-secondary hover:bg-secondary/5"
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
                className="bg-card border-2 border-green-500 rounded-2xl p-6 text-center cursor-pointer transition-all relative overflow-hidden hover:bg-green-50"
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
                className="bg-card border-2 border-border rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-secondary hover:bg-secondary/5"
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
            <div className="grid lg:grid-cols-5 gap-12 items-start">
              {/* Left: Contact Info */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Get in Touch
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Have questions or need assistance? We're here to help you.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Call Us */}
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                      <p className="text-muted-foreground mb-2 text-sm">Mon-Sun from 10am to 10pm.</p>
                      <a href="tel:+256708899597" className="text-foreground hover:text-blue-600 transition-colors font-medium">
                        +256 708 899 597
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                      <WhatsAppIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                      <p className="text-muted-foreground mb-2 text-sm">Chat with us directly.</p>
                      <a 
                        href="https://wa.me/256708899597" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-green-600 transition-colors font-medium"
                      >
                        Start Chat
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <p className="text-muted-foreground mb-2 text-sm">Our friendly team is here to help.</p>
                      <a href="mailto:deliveries@9yards.co.ug" className="text-foreground hover:text-orange-600 transition-colors font-medium">
                        deliveries@9yards.co.ug
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://www.instagram.com/9yards_food/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50 transition-all"
                    >
                      <i className="fa-brands fa-instagram text-xl"></i>
                    </a>
                    <a
                      href="https://www.tiktok.com/@9yardsfood"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-black hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      <i className="fa-brands fa-tiktok text-xl"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right: Contact Form */}
              <div className="lg:col-span-3">
                <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                        <Check className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Message Sent</h3>
                      <p className="text-muted-foreground mb-8">
                        Thank you for reaching out. We'll get back to you soon.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/menu" className="btn-secondary min-w-[160px]">
                          View Menu
                        </Link>
                        <button
                          onClick={() => {
                            setIsSubmitted(false);
                            setFormData({
                              name: '',
                              email: '',
                              phone: '',
                              subject: '',
                              message: '',
                            });
                          }}
                          className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary/5 transition-colors min-w-[160px]"
                        >
                          Send Another
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-foreground mb-2">
                          Send a Message
                        </h2>
                        <p className="text-muted-foreground">
                          Fill out the form below and we'll get back to you.
                        </p>
                      </div>

                      <form 
                        name="contact" 
                        method="POST" 
                        data-netlify="true" 
                        netlify-honeypot="bot-field"
                        onSubmit={handleSubmit} 
                        className="space-y-5"
                      >
                        <input type="hidden" name="form-name" value="contact" />
                        <p className="hidden">
                          <label>Don't fill this out if you're human: <input name="bot-field" /></label>
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-5">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                            <input
                              type="text"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Your full name"
                              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="you@example.com"
                              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
                            <input
                              type="tel"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+256..."
                              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Subject</label>
                            <input
                              type="text"
                              name="subject"
                              required
                              value={formData.subject}
                              onChange={handleInputChange}
                              placeholder="Topic"
                              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                          <textarea
                            name="message"
                            required
                            rows={5}
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="How can we help?"
                            className="w-full p-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary resize-none transition-all"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full btn-secondary text-base py-3.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            'Send Message'
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
    </div>
  );
}
