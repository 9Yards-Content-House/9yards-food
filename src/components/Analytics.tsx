import { Helmet } from 'react-helmet-async';
import { globalMetadata } from '@/data/seo';

export const Analytics = () => {
  const gaId = globalMetadata.marketing.googleAnalyticsId;

  // Don't render if ID is placeholder or missing
  if (!gaId || gaId === "G-MEASUREMENT_ID") {
    return null;
  }

  return (
    <Helmet>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaId}');
        `}
      </script>
    </Helmet>
  );
};
