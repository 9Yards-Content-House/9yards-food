import { Leaf, ChefHat, Award, Truck, ShieldCheck, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: '100% Natural Ingredients',
    description:
      'We use only fresh, locally sourced ingredients. No preservatives, no shortcuts—just authentic Ugandan flavors.',
    badge: 'No Preservatives',
    badgeColor: 'bg-green-500/10 text-green-600',
  },
  {
    icon: ChefHat,
    title: 'We Cook Our Own Food',
    description:
      'Unlike aggregators, we prepare every dish ourselves. Quality control from kitchen to your doorstep.',
    badge: null,
    badgeColor: '',
  },
  {
    icon: Award,
    title: 'Celebrity & Influencer Approved',
    description:
      'Trusted by Uganda\'s top personalities for authentic, delicious local cuisine.',
    badge: 'Verified',
    badgeColor: 'bg-blue-500/10 text-blue-600',
  },
  {
    icon: Truck,
    title: 'Fast & Reliable Delivery',
    description:
      'Hot food delivered in 30-45 minutes across Kampala. Track your order every step of the way.',
    badge: null,
    badgeColor: '',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-background to-muted/30">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"
                alt="Fresh Ugandan cuisine"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Floating card - 100% Natural */}
            <div className="absolute -bottom-6 -right-6 md:right-6 bg-card rounded-2xl shadow-elevated p-6 max-w-[240px] border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">100%</div>
                  <div className="text-sm text-muted-foreground font-medium">Natural</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Every ingredient is carefully selected for quality and freshness.
              </p>
            </div>

            {/* Quality badge */}
            <div className="absolute top-6 -left-4 md:left-6 bg-primary text-primary-foreground rounded-xl px-4 py-3 shadow-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-semibold text-sm">Quality Guaranteed</span>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <div>
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Why 9Yards Food
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                The 9Yards Difference
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                We're not just another food delivery service. We're passionate about 
                preserving and sharing the authentic flavors of Uganda with quality 
                you can taste in every bite.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-5">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-xl hover:bg-muted/50 hover:translate-x-2 transition-all cursor-default"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground">
                        {feature.title}
                      </h3>
                      {feature.badge && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${feature.badgeColor}`}>
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
