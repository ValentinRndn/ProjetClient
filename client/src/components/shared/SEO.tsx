import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Composant SEO pour mettre à jour les meta tags de chaque page
 * Utiliser sur les pages publiques pour améliorer le référencement
 */
export function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage = "https://www.vizionacademy.fr/og-image.png",
  noIndex = false,
}: SEOProps) {
  useEffect(() => {
    // Title
    const fullTitle = `${title} | Vizion Academy`;
    document.title = fullTitle;

    // Helper pour mettre à jour ou créer une meta tag
    const updateMetaTag = (
      selector: string,
      attribute: string,
      content: string
    ) => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        if (selector.includes("property=")) {
          element.setAttribute(
            "property",
            selector.match(/property="([^"]+)"/)?.[1] || ""
          );
        } else if (selector.includes("name=")) {
          element.setAttribute(
            "name",
            selector.match(/name="([^"]+)"/)?.[1] || ""
          );
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, content);
    };

    // Helper pour mettre à jour ou créer un link tag
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(
        `link[rel="${rel}"]`
      ) as HTMLLinkElement;
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // Meta description
    updateMetaTag('meta[name="description"]', "content", description);
    updateMetaTag('meta[name="title"]', "content", fullTitle);

    // Keywords
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', "content", keywords);
    }

    // Robots
    updateMetaTag(
      'meta[name="robots"]',
      "content",
      noIndex ? "noindex, nofollow" : "index, follow"
    );

    // Canonical
    if (canonical) {
      updateLinkTag("canonical", canonical);
    }

    // Open Graph
    updateMetaTag('meta[property="og:title"]', "content", fullTitle);
    updateMetaTag('meta[property="og:description"]', "content", description);
    if (canonical) {
      updateMetaTag('meta[property="og:url"]', "content", canonical);
    }
    if (ogImage) {
      updateMetaTag('meta[property="og:image"]', "content", ogImage);
    }

    // Twitter
    updateMetaTag('meta[property="twitter:title"]', "content", fullTitle);
    updateMetaTag(
      'meta[property="twitter:description"]',
      "content",
      description
    );
    if (ogImage) {
      updateMetaTag('meta[property="twitter:image"]', "content", ogImage);
    }
  }, [title, description, keywords, canonical, ogImage, noIndex]);

  return null;
}
