import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({
  title,
  description,
  keywords = "Ugandan food delivery, Kampala food delivery, Matooke, Posho, local food, African cuisine, 9Yards Food",
  image = "/og-image.png",
  url = "https://food.9yards.co.ug",
  type = "website",
}: SEOProps) => {
  const siteTitle = "9Yards Food";
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
  const fullUrl = url.startsWith("http")
    ? url
    : `https://food.9yards.co.ug${url}`;
  const fullImage = image.startsWith("http")
    ? image
    : `https://food.9yards.co.ug${image}`;

  // Schema.org Structured Data for Food Delivery Service
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FoodDelivery",
    name: "9Yards Food",
    image: [fullImage],
    description: description,
    url: "https://food.9yards.co.ug",
    telephone: "+256700000000", // Replace with actual number
    servesCuisine: "Ugandan",
    areaServed: "Kampala",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kampala",
      addressCountry: "UG",
    },
    // Add more specific details here if available like opening hours
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
