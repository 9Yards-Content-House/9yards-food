import { Link } from 'react-router-dom';
import { 
  Leaf, ChefHat, Award, Heart, Truck, Users, Star, Play,
  Check, ChevronRight, MapPin, Wheat, Package, Car, Home,
  Instagram, Quote, X
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/SEO';

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

// Stats data
const stats = [
  { value: 10000, suffix: '+', label: 'Happy Customers Served' },
  { value: 5, suffix: '', label: 'Delivery Areas Covered' },
  { value: 30, suffix: '-45', label: 'Minutes Avg. Delivery' },
  { value: 100, suffix: '%', label: 'Natural Ingredients' },
];

// Celebrity endorsements data
const celebrities = [
  {
    name: 'Spice Diana',
    title: 'Musician',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    quote: 'This food reminds me of home! The best matooke I\'ve had.',
    video: '#',
  },
  {
    name: 'DJ Roja',
    title: 'Radio Personality',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    quote: 'Best local food in Kampala. I order weekly!',
    video: '#',
  },
  {
    name: 'Martha Kay',
    title: 'Comedian & Actress',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    quote: 'Real Ugandan taste, delivered fast. Love it!',
    video: '#',
  },
  {
    name: 'Sheila Gashumba',
    title: 'Media Personality',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    quote: 'Finally, authentic food that meets my standards!',
    video: '#',
  },
];

// Team members data
const teamMembers = [
  {
    name: 'Chef Mary Namuddu',
    role: 'Head Chef',
    image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400',
    description: '15 years cooking traditional Ugandan cuisine',
  },
  {
    name: 'John Kasozi',
    role: 'Delivery Lead',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    description: 'Fast & friendly service guaranteed',
  },
  {
    name: 'Grace Nakato',
    role: 'Kitchen Manager',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    description: 'Quality is our promise',
  },
  {
    name: 'Peter Ssempala',
    role: 'Operations Manager',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    description: 'Ensuring smooth daily operations',
  },
  {
    name: 'Sarah Atim',
    role: 'Customer Success',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
    description: 'Your satisfaction is my priority',
  },
  {
    name: 'David Opio',
    role: 'Procurement',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    description: 'Sourcing the freshest ingredients',
  },
];

// Process steps
const processSteps = [
  { icon: Wheat, title: 'Fresh Ingredients', desc: 'We source from local farmers daily' },
  { icon: ChefHat, title: 'Cook With Love', desc: 'Every meal is made fresh' },
  { icon: Check, title: 'Quality Check', desc: 'Our team checks taste and temp' },
  { icon: Package, title: 'Fast Pack & Seal', desc: 'Secure packaging keeps food hot' },
  { icon: Home, title: 'Deliver With Care', desc: '30-45 mins to your door' },
];

// Values with checkmarks
const values = [
  {
    icon: Leaf,
    title: '100% Natural',
    description: 'No preservatives, no shortcuts. Just fresh, natural ingredients in every dish.',
    points: ['No chemicals or additives', 'Fresh ingredients daily', 'Locally sourced produce'],
  },
  {
    icon: ChefHat,
    title: 'We Cook It All',
    description: 'Every meal is prepared in our own kitchen with quality control at every step.',
    points: ['Our own kitchen', 'Quality control at every step', 'No shortcuts taken'],
  },
  {
    icon: Heart,
    title: 'Made With Love',
    description: 'Traditional recipes passed down through generations, cooked with passion.',
    points: ['Family recipes', 'Passed down generations', '100% authentic taste'],
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Hot food delivered to your door in 30-45 minutes across Kampala.',
    points: ['30-45 minute delivery', 'Kampala-wide coverage', 'Real-time tracking'],
  },
  {
    icon: Award,
    title: 'Quality First',
    description: 'Celebrity-approved quality that you can taste in every single bite.',
    points: ['Celebrity approved', 'Top DJs love us', '4.9/5 customer rating'],
  },
  {
    icon: Users,
    title: 'Community Focus',
    description: 'Supporting local farmers and creating jobs in our community.',
    points: ['Local farmer support', 'Jobs created in Kampala', 'Sustainable practices'],
  },
];

// Customer testimonials
const testimonials = [
  {
    name: 'Sarah Nakabugo',
    location: 'Nakawa',
    credential: 'Orders 3x per week',
    avatar: 'SN',
    quote: "I've tried every food delivery service in Kampala, and nothing compares to 9Yards. The matooke tastes exactly like my mother's!",
  },
  {
    name: 'James Mukasa',
    location: 'Kololo',
    credential: 'Verified Customer',
    avatar: 'JM',
    quote: "As someone who works late, 9Yards is a lifesaver. Real Ugandan food, not fast food nonsense. The fish is always fresh!",
  },
  {
    name: 'Patricia Namuli',
    location: 'Kampala Central',
    credential: 'Food Blogger',
    avatar: 'PN',
    quote: "Finally, someone who understands that food delivery should be about quality, not just speed. Worth every shilling!",
  },
];

// Behind the scenes gallery
const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400', alt: 'Cooking in kitchen' },
  { src: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400', alt: 'Quality check' },
  { src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400', alt: 'Packaging' },
  { src: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400', alt: 'Delivery team' },
  { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', alt: 'Happy customers' },
];

// Instagram posts mock data
const instagramPosts = [
  { likes: 234, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=300' },
  { likes: 456, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300' },
  { likes: 189, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300' },
  { likes: 678, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300' },
  { likes: 345, image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300' },
  { likes: 567, image: 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=300' },
];

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value);
  
  return (
    <div ref={ref} className="text-center">
      <div className="flex items-center justify-center text-3xl md:text-4xl font-bold text-secondary mb-2">
        <span>{count}</span>
        <span>{suffix}</span>
      </div>
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}

export default function AboutPage() {
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <SEO 
        title="Our Story | Authentic Ugandan Cuisine"
        description="Learn about 9Yards Food, our mission to bring authentic Ugandan cuisine to your doorstep, and the team behind your meals."
        url="/about"
      />
      <Header />
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container-custom px-4">
            <div
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block bg-secondary text-secondary-foreground font-bold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6">
                Authentic Ugandan Cuisine
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Our Story: From Kampala's Kitchen to Your Doorstep
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed mb-8 max-w-2xl mx-auto">
                Founded in 2023, 9Yards Food was born from a simple passion: sharing authentic 
                Ugandan flavors with busy Kampalans who deserve better than fast food.
              </p>
              <Link
                to="/menu"
                className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4"
              >
                Order Your First Meal
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Statistics Bar */}
        <section className="py-12 md:py-16 bg-card border-b border-border">
          <div className="container-custom px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <StatItem key={index} {...stat} />
              ))}
            </div>
          </div>
        </section>

        {/* The 9Yards Story */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container-custom px-4">
            <div className="grid md:grid-cols-5 gap-12 items-center">
              <div
                className="md:col-span-3"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800"
                    alt="9Yards Food kitchen team cooking"
                    className="w-full h-[350px] md:h-[450px] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white text-sm font-medium">Our kitchen team in action</p>
                  </div>
                </div>
              </div>

              <div
                className="md:col-span-2"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Why We Started 9Yards Food
                </h2>
                <div className="relative">
                  <Quote className="w-10 h-10 text-secondary/20 absolute -top-2 -left-2" />
                  <blockquote className="text-lg text-muted-foreground leading-relaxed italic pl-6">
                    "As Ugandans, we noticed something missing in Kampala's food delivery scene—authentic 
                    local cuisine made with care. We're not aggregating restaurants. We're not cutting corners. 
                    We're your neighbors cooking the food we grew up eating, using recipes passed down through generations."
                  </blockquote>
                </div>
                <p className="mt-6 font-bold text-foreground">— The 9Yards Food Team</p>
              </div>
            </div>
          </div>
        </section>

        {/* Celebrity Endorsements */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container-custom px-4">
            <div
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by Uganda's Finest
              </h2>
              <p className="text-primary-foreground/70">
                See what celebrities and influencers are saying about our food
              </p>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 scrollbar-hide">
              {celebrities.map((celeb, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[260px] md:w-full"
                >
                  <div
                    className="relative rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => setVideoModal(celeb.video)}
                  >
                    <img
                      src={celeb.image}
                      alt={celeb.name}
                      className="w-full h-[320px] object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                      >
                        <Play className="w-7 h-7 text-secondary-foreground ml-1" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="font-bold text-white text-lg">{celeb.name}</p>
                      <p className="text-white/70 text-sm mb-2">{celeb.title}</p>
                      <p className="text-white/90 text-sm italic">"{celeb.quote}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 md:py-24">
          <div className="container-custom px-4">
            <div
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe every Ugandan deserves access to delicious, freshly prepared 
                local cuisine without compromising on quality or authenticity.
              </p>
            </div>

            {/* Large Food Photo */}
            <div
              className="mb-12"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200"
                  alt="Delicious Ugandan food combo"
                  className="w-full h-[300px] md:h-[450px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div
              className="max-w-3xl mx-auto text-center"
            >
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                That's why we cook every dish ourselves, using only 100% natural ingredients 
                sourced from local farmers and markets.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Unlike food aggregators, we don't just connect you to restaurants—we ARE the kitchen. 
                Every meal is prepared with love, care, and decades of culinary expertise passed down 
                through generations.
              </p>
            </div>
          </div>
        </section>

        {/* Meet Our Team */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container-custom px-4">
            <div
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                The People Behind Your Meal
              </h2>
              <p className="text-muted-foreground">
                Meet the dedicated team that makes 9Yards Food possible
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow"
                >
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-secondary/20">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-bold text-xl text-foreground">{member.name}</h3>
                  <p className="text-secondary font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm italic">"{member.description}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Do It (Process) */}
        <section className="py-16 md:py-24">
          <div className="container-custom px-4">
            <div
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                From Farm to Your Fork
              </h2>
              <p className="text-muted-foreground">
                Our commitment to quality at every step
              </p>
            </div>

            {/* Desktop: Horizontal flow */}
            <div className="hidden md:flex items-start justify-between gap-4 max-w-5xl mx-auto">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center flex-1 relative"
                >
                  <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4">
                    <step.icon className="w-10 h-10 text-secondary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                  
                  {index < processSteps.length - 1 && (
                    <div className="absolute top-10 -right-4 w-8 h-0.5 bg-border hidden lg:block">
                      <ChevronRight className="w-4 h-4 text-muted-foreground absolute -right-1 -top-1.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: Vertical stack */}
            <div className="md:hidden space-y-6">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4"
                >
                  <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-7 h-7 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Stand For (Values) */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container-custom px-4">
            <div
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What We Stand For
              </h2>
              <p className="text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border border-border"
                >
                  <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4">
                    <value.icon className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{value.description}</p>
                  <ul className="space-y-2">
                    {value.points.map((point, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-foreground/80">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Success Stories */}
        <section className="py-16 md:py-24">
          <div className="container-custom px-4">
            <div
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What Our Customers Say
              </h2>
              <p className="text-muted-foreground">
                Real reviews from our happy customers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-6 shadow-lg border border-border"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-secondary fill-secondary" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-foreground leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Customer Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-secondary font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {testimonial.location} • {testimonial.credential}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Behind The Scenes */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container-custom px-4">
            <div
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                See How We Work
              </h2>
              <p className="text-muted-foreground">
                A peek inside our kitchen and daily operations
              </p>
            </div>

            {/* Main Video */}
            <div
              className="max-w-4xl mx-auto mb-8"
            >
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={() => setVideoModal('#')}
              >
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200"
                  alt="A Day at 9Yards Food Kitchen"
                  className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                  <div
                    className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110"
                  >
                    <Play className="w-9 h-9 text-secondary-foreground ml-1" />
                  </div>
                  <p className="text-white font-bold text-xl">A Day at 9Yards Food Kitchen</p>
                  <p className="text-white/70 text-sm">▶️ Play Video - 2:30</p>
                </div>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {galleryImages.map((img, index) => (
                <div
                  key={index}
                  className="relative rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setLightboxImage(img.src)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-32 md:h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instagram Feed */}
        <section className="py-16 md:py-24">
          <div className="container-custom px-4">
            <div
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Follow Our Food Journey
              </h2>
              <a
                href="https://www.instagram.com/9yards_food/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary font-bold text-lg hover:underline flex items-center justify-center gap-2"
              >
                <Instagram className="w-5 h-5" />
                @9yards_food
              </a>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-5xl mx-auto">
              {instagramPosts.map((post, index) => (
                <a
                  key={index}
                  href="https://www.instagram.com/9yards_food/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative rounded-xl overflow-hidden group"
                >
                  <img
                    src={post.image}
                    alt={`Instagram post ${index + 1}`}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <p className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Heart className="w-4 h-4 fill-white" /> {post.likes}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div
              className="text-center mt-8"
            >
              <a
                href="https://www.instagram.com/9yards_food/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Instagram className="w-5 h-5" />
                Follow Us on Instagram
              </a>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
          <div className="container-custom px-4">
            <div
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Taste the Difference?
              </h2>
              <p className="text-xl md:text-2xl text-secondary-foreground/90 mb-8">
                Experience authentic Ugandan cuisine delivered fresh to your door
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link
                  to="/menu"
                  className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  View Our Menu
                </Link>
                <Link
                  to="/menu"
                  className="bg-secondary-foreground/10 backdrop-blur-sm text-secondary-foreground font-bold px-8 py-4 rounded-xl border-2 border-secondary-foreground/30 hover:bg-secondary-foreground/20 transition-colors flex items-center justify-center gap-2"
                >
                  Order Now - Get 10% Off
                </Link>
              </div>

              <p className="text-secondary-foreground/70 text-sm">
                Use code <span className="font-bold text-secondary-foreground">FIRST10</span> on your first order
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />

      {/* Video Modal */}
      {videoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setVideoModal(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-secondary transition-colors"
            onClick={() => setVideoModal(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="bg-card rounded-2xl p-8 text-center max-w-md" onClick={(e) => e.stopPropagation()}>
            <Play className="w-16 h-16 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Video Coming Soon!</h3>
            <p className="text-muted-foreground">
              Our celebrity testimonial videos are being produced. Check back soon!
            </p>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-secondary transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightboxImage.replace('w=400', 'w=1200')}
            alt="Gallery image"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
