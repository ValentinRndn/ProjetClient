import { getAllIntervenants, type Intervenant } from "@/services/intervenants";
import { MonitorIcon, BookOpen, Search, MapPin } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { IntervenantCard } from "./IntervenantCard";

export function IntervenantSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIntervenants = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Filtrer uniquement les intervenants approuvés pour l'affichage public
        const data = await getAllIntervenants({
          status: "approved",
          take: 100,
        });
        setIntervenants(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des intervenants";
        setError(errorMessage);
        console.error("Error fetching intervenants:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIntervenants();
  }, []);

  const allCities = ["Paris", "Lyon", "Marseille", "Toulouse", "Bordeaux"];
  const allThemes = ["Intelligence Artificielle", "Data Science", "Innovation"];
  const allFormats = ["Présentiel", "Distanciel", "Hybride"];

  // Filtrer les intervenants selon les critères
  const filteredIntervenants = useMemo(() => {
    return intervenants.filter((intervenant: Intervenant) => {
      // Filtre de recherche (nom, email, bio)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const fullName = [intervenant.firstName, intervenant.lastName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const email = intervenant.user?.email?.toLowerCase() || "";
        const bio = intervenant.bio?.toLowerCase() || "";

        if (
          !fullName.includes(query) &&
          !email.includes(query) &&
          !bio.includes(query)
        ) {
          return false;
        }
      }

      // Filtre par ville (pour l'instant côté client, à implémenter côté API si nécessaire)
      // Pour l'instant, on ne peut pas filtrer par ville car pas stockée dans la DB
      // On pourrait chercher dans la bio, mais c'est approximatif
      // Pour le MVP, on ignore ce filtre jusqu'à ce que la ville soit ajoutée au modèle
      if (selectedCity !== "all") {
        // TODO: Implémenter quand la ville sera disponible dans les données
      }

      // Filtre par thème (chercher dans la bio)
      if (selectedTheme !== "all") {
        const bio = intervenant.bio?.toLowerCase() || "";
        const themeLower = selectedTheme.toLowerCase();
        if (!bio.includes(themeLower)) {
          return false;
        }
      }

      // Filtre par format (pour l'instant non disponible dans les données)
      // On pourrait utiliser disponibility, mais ce n'est pas standardisé
      // Pour le MVP, on peut ignorer ce filtre
      if (selectedFormat !== "all") {
        // TODO: Implémenter quand le format sera disponible dans les données
      }

      return true;
    });
  }, [intervenants, searchQuery, selectedCity, selectedTheme, selectedFormat]);
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#505081] focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#505081] focus:border-transparent transition appearance-none bg-white cursor-pointer"
              >
                <option value="all">Toutes les villes</option>
                {allCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#505081] focus:border-transparent transition appearance-none bg-white cursor-pointer"
              >
                <option value="all">Toutes les thématiques</option>
                {allThemes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <MonitorIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#505081] focus:border-transparent transition appearance-none bg-white cursor-pointer"
              >
                <option value="all">Tous les formats</option>
                {allFormats.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-center">
            <span className="inline-flex items-center px-6 py-2 bg-[#8686AC]/20 text-[#272757] rounded-full font-semibold">
              {isLoading
                ? "Chargement..."
                : `${filteredIntervenants.length} intervenant(s) trouvé(s)`}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="max-w-7xl mx-auto mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredIntervenants.length === 0 ? (
        <div className="max-w-7xl mx-auto mt-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">
              Aucun intervenant trouvé avec ces critères.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredIntervenants.map((intervenant) => (
              <IntervenantCard key={intervenant.id} intervenant={intervenant} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export function InputSearch() {
  const [searchQuery, setSearchQuery] = useState("all");
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-violet focus:outline-none transition-colors text-bleu-nuit"
      />
    </div>
  );
}
