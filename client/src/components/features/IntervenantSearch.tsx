import { getAllIntervenants, type Intervenant } from "@/services/intervenants";
import { MonitorIcon, BookOpen, Search, MapPin, Users, ChevronDown, Languages } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { IntervenantCard } from "./IntervenantCard";

export function IntervenantSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
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
  const allLanguages = ["Français", "Anglais", "Espagnol", "Allemand", "Italien", "Portugais", "Arabe", "Chinois"];

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

      // Filtre par langue (chercher dans la bio ou les langues si disponibles)
      if (selectedLanguage !== "all") {
        const bio = intervenant.bio?.toLowerCase() || "";
        const languageLower = selectedLanguage.toLowerCase();
        if (!bio.includes(languageLower)) {
          return false;
        }
      }

      return true;
    });
  }, [intervenants, searchQuery, selectedCity, selectedTheme, selectedFormat, selectedLanguage]);

  return (
    <section id="liste-intervenants" className="bg-white">
      {/* Barre de filtres */}
      <div className="bg-[#1c2942] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Recherche */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6d74b5] w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un intervenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6d74b5] focus:bg-white/15 transition"
              />
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap justify-center gap-3 w-full lg:w-auto">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6d74b5] w-4 h-4 pointer-events-none" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 pointer-events-none" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#6d74b5] transition appearance-none cursor-pointer min-w-[160px]"
                >
                  <option value="all" className="text-[#1c2942]">Toutes les villes</option>
                  {allCities.map((city) => (
                    <option key={city} value={city} className="text-[#1c2942]">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6d74b5] w-4 h-4 pointer-events-none" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 pointer-events-none" />
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#6d74b5] transition appearance-none cursor-pointer min-w-[180px]"
                >
                  <option value="all" className="text-[#1c2942]">Toutes thématiques</option>
                  {allThemes.map((theme) => (
                    <option key={theme} value={theme} className="text-[#1c2942]">
                      {theme}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <MonitorIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6d74b5] w-4 h-4 pointer-events-none" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 pointer-events-none" />
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#6d74b5] transition appearance-none cursor-pointer min-w-[160px]"
                >
                  <option value="all" className="text-[#1c2942]">Tous formats</option>
                  {allFormats.map((format) => (
                    <option key={format} value={format} className="text-[#1c2942]">
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6d74b5] w-4 h-4 pointer-events-none" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 pointer-events-none" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#6d74b5] transition appearance-none cursor-pointer min-w-[160px]"
                >
                  <option value="all" className="text-[#1c2942]">Toutes langues</option>
                  {allLanguages.map((language) => (
                    <option key={language} value={language} className="text-[#1c2942]">
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Compteur */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#6d74b5] rounded-full">
              <Users className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm">
                {isLoading ? "..." : filteredIntervenants.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des intervenants */}
      <div className="py-12 px-4 bg-[#ebf2fa]">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 animate-pulse shadow-sm"
                >
                  <div className="h-12 w-12 rounded-full bg-[#ebf2fa] mb-4"></div>
                  <div className="h-4 bg-[#ebf2fa] rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-[#ebf2fa] rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-[#ebf2fa] rounded w-full mb-2"></div>
                  <div className="h-3 bg-[#ebf2fa] rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : filteredIntervenants.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-12 text-center shadow-sm">
              <Users className="w-12 h-12 text-[#6d74b5]/30 mx-auto mb-4" />
              <p className="text-[#1c2942]/60 text-lg">
                Aucun intervenant trouvé avec ces critères.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredIntervenants.map((intervenant) => (
                <IntervenantCard
                  key={intervenant.id}
                  intervenant={intervenant}
                />
              ))}
            </div>
          )}
        </div>
      </div>
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
