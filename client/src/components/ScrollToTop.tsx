import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * ScrollToTop - Fait defiler automatiquement vers le haut de la page
 * lors d'un changement de route
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}
