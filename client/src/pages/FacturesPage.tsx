/**
 * ============================================
 * Vizion Academy - Page Factures
 * Gestion des factures avec filtres
 * ============================================
 */

import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  Calendar,
  Euro,
  Building,
  User,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Receipt,
} from "lucide-react";
import {
  getFactures,
  envoyerFacture,
  marquerPayee,
  deleteFacture,
  genererPDF,
  telechargerPDF,
  formatMontant,
  getStatusLabel,
  getStatusColor,
  type Facture,
  type FacturesQueryParams,
} from "@/services/factures";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export default function FacturesPage() {
  const { user } = useAuth();
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totaux, setTotaux] = useState({ montantHT: 0, montantTTC: 0 });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  // Filtres
  const [filters, setFilters] = useState<FacturesQueryParams>({
    page: 1,
    limit: 20,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Charger les factures
  const loadFactures = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFactures(filters);
      setFactures(response.data);
      setTotaux(response.totaux);
      setPagination(response.pagination);
    } catch (err) {
      setError("Erreur lors du chargement des factures");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFactures();
  }, [filters]);

  // Actions sur les factures
  const handleEnvoyer = async (id: string) => {
    try {
      setActionLoading(id);
      await envoyerFacture(id);
      await loadFactures();
    } catch (err) {
      console.error("Erreur lors de l'envoi:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarquerPayee = async (id: string) => {
    try {
      setActionLoading(id);
      await marquerPayee(id);
      await loadFactures();
    } catch (err) {
      console.error("Erreur lors du marquage:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette facture brouillon ?")) return;
    try {
      setActionLoading(id);
      await deleteFacture(id);
      await loadFactures();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenererPDF = async (facture: Facture) => {
    try {
      setActionLoading(facture.id);
      await genererPDF(facture.id);
      await loadFactures();
    } catch (err) {
      console.error("Erreur lors de la génération du PDF:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleTelechargerPDF = async (facture: Facture) => {
    try {
      setActionLoading(facture.id);
      await telechargerPDF(facture.id, facture.numero);
    } catch (err) {
      console.error("Erreur lors du téléchargement:", err);
      if (confirm("Le PDF n'existe pas encore. Voulez-vous le générer ?")) {
        await handleGenererPDF(facture);
        await telechargerPDF(facture.id, facture.numero);
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Filtrage local par recherche
  const filteredFactures = factures.filter((f) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      f.numero.toLowerCase().includes(search) ||
      f.mission?.title?.toLowerCase().includes(search) ||
      f.description?.toLowerCase().includes(search)
    );
  });

  // Statistiques
  const stats = {
    total: pagination.total,
    brouillons: factures.filter((f) => f.status === "brouillon").length,
    envoyees: factures.filter((f) => f.status === "envoyee").length,
    payees: factures.filter((f) => f.status === "payee").length,
    enRetard: factures.filter((f) => f.status === "en_retard").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "brouillon":
        return <FileText className="w-4 h-4" />;
      case "envoyee":
        return <Send className="w-4 h-4" />;
      case "payee":
        return <CheckCircle className="w-4 h-4" />;
      case "annulee":
        return <XCircle className="w-4 h-4" />;
      case "en_retard":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header compact */}
      <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to="/dashboard/admin"
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(235, 242, 250, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#6d74b5" }}
              >
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Facturation</h1>
                <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  Gérez vos factures et suivez les paiements
                </p>
              </div>
            </div>

            {user?.role === "ADMIN" && (
              <Button
                variant="primary"
                className="bg-[#6d74b5] hover:bg-[#5a61a0]"
              >
                <Plus className="w-4 h-4" />
                Nouvelle facture
              </Button>
            )}
          </div>

          {/* Stats inline */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20">
            {[
              { value: stats.total, label: "Total" },
              { value: stats.brouillons, label: "Brouillons" },
              { value: stats.envoyees, label: "Envoyées" },
              { value: stats.payees, label: "Payées" },
              { value: stats.enRetard, label: "En retard", highlight: stats.enRetard > 0 },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: stat.highlight ? "rgba(251, 191, 36, 0.2)" : "rgba(255, 255, 255, 0.1)" }}
              >
                <span
                  className="font-bold"
                  style={{ color: stat.highlight ? "#fbbf24" : "#ffffff" }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-sm ml-2"
                  style={{ color: stat.highlight ? "#fbbf24" : "rgba(235, 242, 250, 0.7)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Totaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: "#6d74b5" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Euro className="w-6 h-6 text-white/80" />
              <span className="text-white/80">Total HT</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatMontant(totaux.montantHT)}</p>
          </div>
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: "#1c2942" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Euro className="w-6 h-6 text-white/80" />
              <span className="text-white/80">Total TTC</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatMontant(totaux.montantTTC)}</p>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: "#6d74b5" }}
              />
              <input
                type="text"
                placeholder="Rechercher par numéro, mission..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:outline-none"
                style={{ borderColor: "#ebf2fa", color: "#1c2942" }}
              />
            </div>

            {/* Bouton filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition"
              style={{
                backgroundColor: showFilters ? "#ebf2fa" : "#ffffff",
                borderColor: showFilters ? "#6d74b5" : "#ebf2fa",
                color: "#1c2942",
              }}
            >
              <Filter className="w-5 h-5" />
              Filtres
            </button>

            {/* Rafraîchir */}
            <button
              onClick={loadFactures}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition disabled:opacity-50"
              style={{ borderColor: "#ebf2fa", color: "#1c2942" }}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Panneau de filtres */}
          {showFilters && (
            <div
              className="pt-4 mt-4"
              style={{ borderTopWidth: "1px", borderColor: "#ebf2fa" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#1c2942" }}>
                    Type
                  </label>
                  <select
                    value={filters.type || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        type: e.target.value as "ecole" | "intervenant" | undefined,
                        page: 1,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none"
                    style={{ borderColor: "#ebf2fa", color: "#1c2942" }}
                  >
                    <option value="">Tous</option>
                    <option value="ecole">École</option>
                    <option value="intervenant">Intervenant</option>
                  </select>
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#1c2942" }}>
                    Statut
                  </label>
                  <select
                    value={filters.status || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value, page: 1 })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none"
                    style={{ borderColor: "#ebf2fa", color: "#1c2942" }}
                  >
                    <option value="">Tous</option>
                    <option value="brouillon">Brouillon</option>
                    <option value="envoyee">Envoyée</option>
                    <option value="payee">Payée</option>
                    <option value="annulee">Annulée</option>
                    <option value="en_retard">En retard</option>
                  </select>
                </div>

                {/* Date début */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#1c2942" }}>
                    Date début
                  </label>
                  <input
                    type="date"
                    value={filters.startDate || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, startDate: e.target.value, page: 1 })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none"
                    style={{ borderColor: "#ebf2fa", color: "#1c2942" }}
                  />
                </div>

                {/* Date fin */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#1c2942" }}>
                    Date fin
                  </label>
                  <input
                    type="date"
                    value={filters.endDate || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, endDate: e.target.value, page: 1 })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none"
                    style={{ borderColor: "#ebf2fa", color: "#1c2942" }}
                  />
                </div>
              </div>

              {/* Bouton reset */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setFilters({ page: 1, limit: 20 });
                    setSearchTerm("");
                  }}
                  className="text-sm hover:underline"
                  style={{ color: "#6d74b5" }}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Liste des factures */}
        {error ? (
          <div
            className="rounded-xl p-6 text-center"
            style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
          >
            <AlertCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "#ef4444" }} />
            <p style={{ color: "#b91c1c" }}>{error}</p>
            <button
              onClick={loadFactures}
              className="mt-4 px-4 py-2 text-white rounded-lg"
              style={{ backgroundColor: "#ef4444" }}
            >
              Réessayer
            </button>
          </div>
        ) : loading ? (
          <div
            className="rounded-xl p-12 text-center"
            style={{ backgroundColor: "#ffffff" }}
          >
            <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: "#6d74b5" }} />
            <p style={{ color: "#6d74b5" }}>Chargement des factures...</p>
          </div>
        ) : filteredFactures.length === 0 ? (
          <div
            className="rounded-xl p-12 text-center"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#ebf2fa" }}
            >
              <FileText className="w-10 h-10" style={{ color: "#6d74b5" }} />
            </div>
            <p className="text-lg font-medium" style={{ color: "#1c2942" }}>Aucune facture trouvée</p>
          </div>
        ) : (
          <div
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: "#ebf2fa" }}>
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#1c2942" }}>
                      Facture
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#1c2942" }}>
                      Mission
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#1c2942" }}>
                      Montant
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#1c2942" }}>
                      Statut
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#1c2942" }}>
                      Date
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#1c2942" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "#ebf2fa" }}>
                  {filteredFactures.map((facture) => (
                    <tr
                      key={facture.id}
                      className="hover:bg-[#ebf2fa]/50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{
                              backgroundColor: facture.type === "ecole" ? "#ebf2fa" : "#f3e8ff",
                            }}
                          >
                            {facture.type === "ecole" ? (
                              <Building className="w-5 h-5" style={{ color: "#6d74b5" }} />
                            ) : (
                              <User className="w-5 h-5" style={{ color: "#9333ea" }} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: "#1c2942" }}>
                              {facture.numero}
                            </p>
                            <p className="text-xs capitalize" style={{ color: "#6d74b5" }}>
                              {facture.type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {facture.mission ? (
                          <p className="text-sm truncate max-w-[200px]" style={{ color: "#1c2942" }}>
                            {facture.mission.title}
                          </p>
                        ) : (
                          <span className="text-sm" style={{ color: "#6d74b5" }}>-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium" style={{ color: "#1c2942" }}>
                            {formatMontant(facture.montantTTC)}
                          </p>
                          {facture.tva > 0 && (
                            <p className="text-xs" style={{ color: "#6d74b5" }}>
                              HT: {formatMontant(facture.montantHT)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(facture.status)}`}
                        >
                          {getStatusIcon(facture.status)}
                          {getStatusLabel(facture.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm" style={{ color: "#6d74b5" }}>
                          <Calendar className="w-4 h-4" />
                          {facture.dateEmission
                            ? new Date(facture.dateEmission).toLocaleDateString("fr-FR")
                            : new Date(facture.createdAt).toLocaleDateString("fr-FR")}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Voir détails */}
                          <button
                            onClick={() => {
                              setSelectedFacture(facture);
                              setShowDetails(true);
                            }}
                            className="p-2 rounded-lg transition hover:bg-[#ebf2fa]"
                            style={{ color: "#6d74b5" }}
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Actions selon statut */}
                          {facture.status === "brouillon" && (
                            <>
                              <button
                                onClick={() => handleEnvoyer(facture.id)}
                                disabled={actionLoading === facture.id}
                                className="p-2 rounded-lg transition hover:bg-blue-50 disabled:opacity-50"
                                style={{ color: "#3b82f6" }}
                                title="Envoyer"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                              {user?.role === "ADMIN" && (
                                <button
                                  onClick={() => handleDelete(facture.id)}
                                  disabled={actionLoading === facture.id}
                                  className="p-2 rounded-lg transition hover:bg-red-50 disabled:opacity-50"
                                  style={{ color: "#ef4444" }}
                                  title="Supprimer"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}

                          {facture.status === "envoyee" && (
                            <button
                              onClick={() => handleMarquerPayee(facture.id)}
                              disabled={actionLoading === facture.id}
                              className="p-2 rounded-lg transition hover:bg-green-50 disabled:opacity-50"
                              style={{ color: "#22c55e" }}
                              title="Marquer payée"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {facture.pdfPath ? (
                            <button
                              onClick={() => handleTelechargerPDF(facture)}
                              disabled={actionLoading === facture.id}
                              className="p-2 rounded-lg transition hover:bg-[#ebf2fa] disabled:opacity-50"
                              style={{ color: "#1c2942" }}
                              title="Télécharger PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleGenererPDF(facture)}
                              disabled={actionLoading === facture.id}
                              className="p-2 rounded-lg transition hover:bg-[#ebf2fa] disabled:opacity-50"
                              style={{ color: "#6d74b5" }}
                              title="Générer PDF"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ borderTopWidth: "1px", borderColor: "#ebf2fa" }}
              >
                <p className="text-sm" style={{ color: "#6d74b5" }}>
                  Page {pagination.page} sur {pagination.totalPages} - {pagination.total} factures
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ebf2fa]"
                    style={{ borderColor: "#ebf2fa", color: "#1c2942" }}
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ebf2fa]"
                    style={{ borderColor: "#ebf2fa", color: "#1c2942" }}
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal détails */}
      {showDetails && selectedFacture && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowDetails(false)}
        >
          <div
            className="rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: "#ffffff" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="p-6"
              style={{ borderBottomWidth: "1px", borderColor: "#ebf2fa" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: "#1c2942" }}>
                    {selectedFacture.numero}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedFacture.status)}`}
                  >
                    {getStatusIcon(selectedFacture.status)}
                    {getStatusLabel(selectedFacture.status)}
                  </span>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 rounded-lg hover:bg-[#ebf2fa]"
                  style={{ color: "#6d74b5" }}
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations générales */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm" style={{ color: "#6d74b5" }}>Type</p>
                  <p className="font-medium capitalize" style={{ color: "#1c2942" }}>
                    {selectedFacture.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: "#6d74b5" }}>Mission</p>
                  <p className="font-medium" style={{ color: "#1c2942" }}>
                    {selectedFacture.mission?.title || "-"}
                  </p>
                </div>
              </div>

              {/* Montants */}
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: "#ebf2fa" }}
              >
                <h3 className="text-sm font-medium mb-3" style={{ color: "#1c2942" }}>
                  Montants
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span style={{ color: "#6d74b5" }}>Montant HT</span>
                    <span className="font-medium" style={{ color: "#1c2942" }}>
                      {formatMontant(selectedFacture.montantHT)}
                    </span>
                  </div>
                  {selectedFacture.tva > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: "#6d74b5" }}>TVA</span>
                      <span className="font-medium" style={{ color: "#1c2942" }}>
                        {formatMontant(selectedFacture.tva)}
                      </span>
                    </div>
                  )}
                  <div
                    className="flex justify-between pt-2"
                    style={{ borderTopWidth: "1px", borderColor: "#6d74b5" }}
                  >
                    <span className="font-medium" style={{ color: "#1c2942" }}>Montant TTC</span>
                    <span className="font-bold text-lg" style={{ color: "#1c2942" }}>
                      {formatMontant(selectedFacture.montantTTC)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm" style={{ color: "#6d74b5" }}>Date d'émission</p>
                  <p className="font-medium" style={{ color: "#1c2942" }}>
                    {selectedFacture.dateEmission
                      ? new Date(selectedFacture.dateEmission).toLocaleDateString("fr-FR")
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: "#6d74b5" }}>Date d'échéance</p>
                  <p className="font-medium" style={{ color: "#1c2942" }}>
                    {selectedFacture.dateEcheance
                      ? new Date(selectedFacture.dateEcheance).toLocaleDateString("fr-FR")
                      : "-"}
                  </p>
                </div>
                {selectedFacture.datePaiement && (
                  <>
                    <div>
                      <p className="text-sm" style={{ color: "#6d74b5" }}>Date de paiement</p>
                      <p className="font-medium" style={{ color: "#1c2942" }}>
                        {new Date(selectedFacture.datePaiement).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "#6d74b5" }}>Mode de paiement</p>
                      <p className="font-medium" style={{ color: "#1c2942" }}>
                        {selectedFacture.modePaiement || "-"}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Description */}
              {selectedFacture.description && (
                <div>
                  <p className="text-sm mb-1" style={{ color: "#6d74b5" }}>Description</p>
                  <p style={{ color: "#1c2942" }}>{selectedFacture.description}</p>
                </div>
              )}

              {/* Lignes de facture */}
              {selectedFacture.lignes && selectedFacture.lignes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3" style={{ color: "#1c2942" }}>
                    Détail des lignes
                  </h3>
                  <div
                    className="border rounded-lg overflow-hidden"
                    style={{ borderColor: "#ebf2fa" }}
                  >
                    <table className="w-full text-sm">
                      <thead style={{ backgroundColor: "#ebf2fa" }}>
                        <tr>
                          <th className="text-left px-4 py-2" style={{ color: "#1c2942" }}>Description</th>
                          <th className="text-right px-4 py-2" style={{ color: "#1c2942" }}>Qté</th>
                          <th className="text-right px-4 py-2" style={{ color: "#1c2942" }}>P.U.</th>
                          <th className="text-right px-4 py-2" style={{ color: "#1c2942" }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedFacture.lignes.map((ligne, idx) => (
                          <tr
                            key={idx}
                            style={{ borderTopWidth: "1px", borderColor: "#ebf2fa" }}
                          >
                            <td className="px-4 py-2" style={{ color: "#1c2942" }}>{ligne.description}</td>
                            <td className="px-4 py-2 text-right" style={{ color: "#1c2942" }}>{ligne.quantite}</td>
                            <td className="px-4 py-2 text-right" style={{ color: "#1c2942" }}>{formatMontant(ligne.prixUnitaire)}</td>
                            <td className="px-4 py-2 text-right font-medium" style={{ color: "#1c2942" }}>{formatMontant(ligne.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedFacture.notes && (
                <div>
                  <p className="text-sm mb-1" style={{ color: "#6d74b5" }}>Notes</p>
                  <p
                    className="text-sm p-3 rounded-lg"
                    style={{ backgroundColor: "#fef9c3", color: "#1c2942" }}
                  >
                    {selectedFacture.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              className="p-6 flex justify-end gap-3"
              style={{ borderTopWidth: "1px", borderColor: "#ebf2fa" }}
            >
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 border rounded-lg hover:bg-[#ebf2fa]"
                style={{ borderColor: "#ebf2fa", color: "#1c2942" }}
              >
                Fermer
              </button>
              {selectedFacture.pdfPath ? (
                <button
                  onClick={() => handleTelechargerPDF(selectedFacture)}
                  disabled={actionLoading === selectedFacture.id}
                  className="px-4 py-2 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: "#6d74b5" }}
                >
                  <Download className="w-4 h-4" />
                  Télécharger PDF
                </button>
              ) : (
                <button
                  onClick={() => handleGenererPDF(selectedFacture)}
                  disabled={actionLoading === selectedFacture.id}
                  className="px-4 py-2 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: "#6d74b5" }}
                >
                  <FileText className="w-4 h-4" />
                  Générer PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
