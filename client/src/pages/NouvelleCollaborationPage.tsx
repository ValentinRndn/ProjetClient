/**
 * Page de création d'une nouvelle collaboration
 */
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  createCollaboration,
  searchEcoles,
  searchIntervenants,
  type EcoleSearch,
  type IntervenantSearch,
} from "@/services/collaborations";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  Handshake,
  ArrowLeft,
  Save,
  Building2,
  User,
  Calendar,
  Euro,
  FileText,
  Search,
  Check,
  X,
} from "lucide-react";

export default function NouvelleCollaborationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [montantHT, setMontantHT] = useState("");
  const [notes, setNotes] = useState("");

  // Partner search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<(EcoleSearch | IntervenantSearch)[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<EcoleSearch | IntervenantSearch | null>(null);

  const isEcole = user?.role === "ECOLE";
  const isIntervenant = user?.role === "INTERVENANT";

  const dashboardLink = isEcole ? "/dashboard/ecole" : "/dashboard/intervenant";

  // Search for partner
  useEffect(() => {
    const searchPartner = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        if (isEcole) {
          const results = await searchIntervenants(searchQuery);
          setSearchResults(results);
        } else if (isIntervenant) {
          const results = await searchEcoles(searchQuery);
          setSearchResults(results);
        }
      } catch (err) {
        console.error("Erreur recherche:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchPartner, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, isEcole, isIntervenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPartner) {
      setError(`Veuillez sélectionner ${isEcole ? "un intervenant" : "une école"}`);
      return;
    }

    if (!titre.trim()) {
      setError("Le titre est requis");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = {
        titre: titre.trim(),
        description: description.trim() || undefined,
        dateDebut: dateDebut || undefined,
        dateFin: dateFin || undefined,
        montantHT: montantHT ? Math.round(parseFloat(montantHT) * 100) : undefined,
        notes: notes.trim() || undefined,
        ...(isEcole
          ? { intervenantId: selectedPartner.id }
          : { ecoleId: selectedPartner.id }),
      };

      const collab = await createCollaboration(data);
      navigate(`/collaborations/${collab.id}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la création";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getPartnerDisplayName = (partner: EcoleSearch | IntervenantSearch) => {
    if ("name" in partner) {
      // C'est une école
      return partner.name;
    } else {
      // C'est un intervenant
      const name = `${partner.firstName || ""} ${partner.lastName || ""}`.trim();
      return name || partner.user?.email || "Intervenant";
    }
  };

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header avec bannière */}
      <div
        style={{ backgroundColor: "#1c2942", minHeight: "150px" }}
        className="flex items-center"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to="/collaborations"
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(235, 242, 250, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux collaborations
          </Link>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#6d74b5" }}
            >
              <Handshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Nouvelle Collaboration</h1>
              <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                Déclarez une collaboration avec {isEcole ? "un intervenant" : "une école"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection du partenaire */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff" }}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "#1c2942" }}>
              {isEcole ? (
                <User className="w-5 h-5" style={{ color: "#6d74b5" }} />
              ) : (
                <Building2 className="w-5 h-5" style={{ color: "#6d74b5" }} />
              )}
              {isEcole ? "Sélectionner un intervenant" : "Sélectionner une école"}
            </h2>

            {selectedPartner ? (
              <div
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ backgroundColor: "#ebf2fa" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#6d74b5" }}
                  >
                    {isEcole ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Building2 className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: "#1c2942" }}>
                      {getPartnerDisplayName(selectedPartner)}
                    </p>
                    {"contactEmail" in selectedPartner && selectedPartner.contactEmail && (
                      <p className="text-sm" style={{ color: "#6d74b5" }}>
                        {selectedPartner.contactEmail}
                      </p>
                    )}
                    {"user" in selectedPartner && selectedPartner.user?.email && (
                      <p className="text-sm" style={{ color: "#6d74b5" }}>
                        {selectedPartner.user.email}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPartner(null)}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: "#6d74b5" }} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: "#6d74b5" }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Rechercher par nom ${isEcole ? "de l'intervenant" : "de l'école"}...`}
                    className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all"
                    style={{ borderColor: "#ebf2fa" }}
                  />
                </div>

                {/* Résultats de recherche */}
                {searchResults.length > 0 && (
                  <div
                    className="absolute z-10 w-full mt-2 rounded-xl shadow-lg border max-h-60 overflow-y-auto"
                    style={{ backgroundColor: "#ffffff", borderColor: "#ebf2fa" }}
                  >
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => {
                          setSelectedPartner(result);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="w-full flex items-center gap-3 p-4 hover:bg-[#ebf2fa] transition-colors text-left border-b last:border-b-0"
                        style={{ borderColor: "#ebf2fa" }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: "#ebf2fa" }}
                        >
                          {isEcole ? (
                            <User className="w-5 h-5" style={{ color: "#6d74b5" }} />
                          ) : (
                            <Building2 className="w-5 h-5" style={{ color: "#6d74b5" }} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: "#1c2942" }}>
                            {getPartnerDisplayName(result)}
                          </p>
                          {"user" in result && result.user?.email && (
                            <p className="text-sm" style={{ color: "#6d74b5" }}>
                              {result.user.email}
                              {result.city && ` • ${result.city}`}
                            </p>
                          )}
                          {"address" in result && result.address && (
                            <p className="text-sm" style={{ color: "#6d74b5" }}>
                              {result.address}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {isSearching && (
                  <div className="absolute z-10 w-full mt-2 p-4 rounded-xl shadow-lg border" style={{ backgroundColor: "#ffffff", borderColor: "#ebf2fa" }}>
                    <p className="text-center" style={{ color: "#6d74b5" }}>
                      Recherche en cours...
                    </p>
                  </div>
                )}

                {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                  <div className="absolute z-10 w-full mt-2 p-4 rounded-xl shadow-lg border" style={{ backgroundColor: "#ffffff", borderColor: "#ebf2fa" }}>
                    <p className="text-center" style={{ color: "#6d74b5" }}>
                      Aucun résultat trouvé
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Informations de la collaboration */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff" }}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "#1c2942" }}>
              <FileText className="w-5 h-5" style={{ color: "#6d74b5" }} />
              Informations
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                  Titre de la collaboration *
                </label>
                <input
                  type="text"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Ex: Intervention Marketing Digital"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all"
                  style={{ borderColor: "#ebf2fa" }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Décrivez la collaboration..."
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all resize-none"
                  style={{ borderColor: "#ebf2fa" }}
                />
              </div>
            </div>
          </div>

          {/* Dates et montant */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff" }}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "#1c2942" }}>
              <Calendar className="w-5 h-5" style={{ color: "#6d74b5" }} />
              Dates et rémunération
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                  Date de début
                </label>
                <input
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all"
                  style={{ borderColor: "#ebf2fa" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                  Date de fin
                </label>
                <input
                  type="date"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all"
                  style={{ borderColor: "#ebf2fa" }}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                  <Euro className="w-4 h-4 inline mr-1" />
                  Montant HT (€)
                </label>
                <input
                  type="number"
                  value={montantHT}
                  onChange={(e) => setMontantHT(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all"
                  style={{ borderColor: "#ebf2fa" }}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff" }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: "#1c2942" }}>
              Notes (optionnel)
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Notes partagées avec le partenaire..."
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all resize-none"
              style={{ borderColor: "#ebf2fa" }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link to="/collaborations">
              <Button type="button" variant="secondary" style={{ borderColor: "#ebf2fa" }}>
                Annuler
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isLoading || !selectedPartner}
              className="bg-[#6d74b5] hover:bg-[#5a61a0]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Créer la collaboration
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
