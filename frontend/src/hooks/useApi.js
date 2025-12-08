import { useState, useCallback } from "react";

/**
 * Hook générique pour les appels API
 * Gère automatiquement les états de chargement et d'erreur
 * @param {Function} apiFunction - Fonction API à exécuter
 * @returns {Object} { data, loading, error, execute }
 */
export function useApi(apiFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Exécute la fonction API
   * @param {...any} args - Arguments à passer à la fonction API
   */
  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        const errorMessage = err.message || "Une erreur est survenue";
        setError(errorMessage);
        setData(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  return {
    data,
    loading,
    error,
    execute,
  };
}
