import { Helmet } from "react-helmet-async";
import { globalMetadata } from "@/data/seo";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  jsonLd?: Record<string, any>;
  noIndex?: boolean;
}

const SEO = ({
  title,
  description,
  keywords = globalMetadata.organizationSchema.description, // Fallback if needed, though keywords usually specific
  image = globalMetadata.organizationSchema.image,
  url = globalMetadata.organizationSchema.url,
  type = "website",
  jsonLd,
  noIndex = false,
}: SEOProps) => {
  const siteTitle = globalMetadata.siteName;
  // If the title already contains the site name or is the site name, use it as is, otherwise append
  const fullTitle = title === siteTitle || title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;
  const fullUrl = url.startsWith("http")
    ? url
    : `https://food.9yards.co.ug${url}`;
  const fullImage = image.startsWith("http")
    ? image
    : `https://food.9yards.co.ug${image}`;

  // Default Schema.org Structured Data
  // We use the global organization schema as a base for defaults or generic pages
  const defaultStructuredData = {
    ...globalMetadata.organizationSchema,
    image: [fullImage],
    description: description,
    url: fullUrl,
  };

  const finalStructuredData = jsonLd ? { ...defaultStructuredData, ...jsonLd } : defaultStructuredData;

  const aiMeta = globalMetadata.aiMetadata;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content={aiMeta.robots} />
      )}
      <meta name="messages" content="AI-crawler-friendly" />
      
      {/* AI & Crawler Specific */}
      <meta name="googlebot" content={aiMeta.googlebot} />
      <meta name="bingbot" content={aiMeta.bingbot} />
      <meta name="author" content={aiMeta.author} />
      <meta name="generator" content={aiMeta.generator} />
      <meta name="citation_publisher" content={aiMeta.citation_publisher} />
      <meta name="citation_online_date" content={aiMeta.citation_online_date} />

      <link rel="canonical" href={fullUrl} />
      <link rel="icon" type="image/jpeg" href="/images/logo/9Yards-Food-Coloured-favicon.jpg" />
      <link rel="shortcut icon" type="image/jpeg" href="/images/logo/9Yards-Food-Coloured-favicon.jpg" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content={globalMetadata.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content={globalMetadata.twitterCard} />
      <meta name="twitter:site" content={globalMetadata.twitterSite} />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
