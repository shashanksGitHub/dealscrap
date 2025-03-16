import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  description?: string;
  noindex?: boolean;
  pathname?: string;
}

export function SEO({ 
  title = "LeadScraper - Intelligente B2B Lead-Generierung für den deutschen Markt",
  description = "Generieren Sie hochwertige B2B Leads für Ihr Unternehmen. Nutzen Sie unsere KI-gestützte Plattform für präzise Leads im DACH-Raum.",
  noindex = false,
  pathname = ""
}: SEOProps) {
  const websiteUrl = window.location.origin;
  const currentUrl = `${websiteUrl}${pathname}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Lokalisierung */}
      <meta property="og:locale" content="de_DE" />
      <link rel="alternate" href={currentUrl} hrefLang="de-DE" />
      
      {/* Zusätzliche SEO-relevante Meta-Tags */}
      <meta name="author" content="LeadScraper" />
      <meta name="publisher" content="LeadScraper" />
      <meta name="copyright" content={`© ${new Date().getFullYear()} LeadScraper`} />
    </Helmet>
  );
}
