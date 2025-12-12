/**
 * ============================================
 * Vizion Academy - Page Factures
 * Gestion des factures avec filtres
 * ============================================
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
      // Si pas de PDF, proposer de le générer
      if (confirm("Le PDF n'existe pas encore. Voulez-vous le générer ?")) {
        await handleGenererPDF(facture);
        // Réessayer le téléchargement
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Factures</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos factures et suivez les paiements
          </p>
        </div>
        {user?.role === "ADMIN" && (
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            <Plus className="w-5 h-5" />
            Nouvelle facture
          </button>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-700">
                {stats.brouillons}
              </p>
              <p className="text-xs text-gray-500">Brouillons</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {stats.envoyees}
              </p>
              <p className="text-xs text-gray-500">Envoyées</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats.payees}
              </p>
              <p className="text-xs text-gray-500">Payées</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {stats.enRetard}
              </p>
              <p className="text-xs text-gray-500">En retard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Totaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Euro className="w-6 h-6" />
            <span className="text-indigo-100">Total HT</span>
          </div>
          <p className="text-3xl font-bold">{formatMontant(totaux.montantHT)}</p>
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Euro className="w-6 h-6" />
            <span className="text-emerald-100">Total TTC</span>
          </div>
          <p className="text-3xl font-bold">
            {formatMontant(totaux.montantTTC)}
          </p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par numéro, mission..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Bouton filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
              showFilters
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-5 h-5" />
            Filtres
          </button>

          {/* Rafraîchir */}
          <button
            onClick={loadFactures}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Panneau de filtres */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 mt-4 border-t border-gray-100">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Tous</option>
                    <option value="ecole">École</option>
                    <option value="intervenant">Intervenant</option>
                  </select>
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    value={filters.status || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value, page: 1 })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date début
                  </label>
                  <input
                    type="date"
                    value={filters.startDate || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, startDate: e.target.value, page: 1 })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Date fin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date fin
                  </label>
                  <input
                    type="date"
                    value={filters.endDate || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, endDate: e.target.value, page: 1 })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Liste des factures */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700">{error}</p>
          <button
            onClick={loadFactures}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <RefreshCw className="w-12 h-12 text-indigo-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Chargement des factures...</p>
        </div>
      ) : filteredFactures.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucune facture trouvée</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facture
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mission
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFactures.map((facture) => (
                  <motion.tr
                    key={facture.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            facture.type === "ecole"
                              ? "bg-blue-100"
                              : "bg-purple-100"
                          }`}
                        >
                          {facture.type === "ecole" ? (
                            <Building className="w-5 h-5 text-blue-600" />
                          ) : (
                            <User className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {facture.numero}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {facture.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {facture.mission ? (
                        <p className="text-sm text-gray-900 truncate max-w-[200px]">
                          {facture.mission.title}
                        </p>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatMontant(facture.montantTTC)}
                        </p>
                        {facture.tva > 0 && (
                          <p className="text-xs text-gray-500">
                            HT: {formatMontant(facture.montantHT)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          facture.status
                        )}`}
                      >
                        {getStatusIcon(facture.status)}
                        {getStatusLabel(facture.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {facture.dateEmission
                          ? new Date(facture.dateEmission).toLocaleDateString(
                              "fr-FR"
                            )
                          : new Date(facture.createdAt).toLocaleDateString(
                              "fr-FR"
                            )}
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
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
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
                              className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                              title="Envoyer"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            {user?.role === "ADMIN" && (
                              <button
                                onClick={() => handleDelete(facture.id)}
                                disabled={actionLoading === facture.id}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
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
                            className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                            title="Marquer payée"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {facture.pdfPath ? (
                          <button
                            onClick={() => handleTelechargerPDF(facture)}
                            disabled={actionLoading === facture.id}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                            title="Télécharger PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleGenererPDF(facture)}
                            disabled={actionLoading === facture.id}
                            className="p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition disabled:opacity-50"
                            title="Générer PDF"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page {pagination.page} sur {pagination.totalPages} -{" "}
                {pagination.total} factures
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setFilters({ ...filters, page: pagination.page - 1 })
                  }
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() =>
                    setFilters({ ...filters, page: pagination.page + 1 })
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal détails */}
      <AnimatePresence>
        {showDetails && selectedFacture && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedFacture.numero}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                        selectedFacture.status
                      )}`}
                    >
                      {getStatusIcon(selectedFacture.status)}
                      {getStatusLabel(selectedFacture.status)}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Informations générales */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium capitalize">
                      {selectedFacture.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mission</p>
                    <p className="font-medium">
                      {selectedFacture.mission?.title || "-"}
                    </p>
                  </div>
                </div>

                {/* Montants */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Montants
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant HT</span>
                      <span className="font-medium">
                        {formatMontant(selectedFacture.montantHT)}
                      </span>
                    </div>
                    {selectedFacture.tva > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">TVA</span>
                        <span className="font-medium">
                          {formatMontant(selectedFacture.tva)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-900 font-medium">
                        Montant TTC
                      </span>
                      <span className="font-bold text-lg">
                        {formatMontant(selectedFacture.montantTTC)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date d'émission</p>
                    <p className="font-medium">
                      {selectedFacture.dateEmission
                        ? new Date(
                            selectedFacture.dateEmission
                          ).toLocaleDateString("fr-FR")
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date d'échéance</p>
                    <p className="font-medium">
                      {selectedFacture.dateEcheance
                        ? new Date(
                            selectedFacture.dateEcheance
                          ).toLocaleDateString("fr-FR")
                        : "-"}
                    </p>
                  </div>
                  {selectedFacture.datePaiement && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Date de paiement</p>
                        <p className="font-medium">
                          {new Date(
                            selectedFacture.datePaiement
                          ).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Mode de paiement</p>
                        <p className="font-medium">
                          {selectedFacture.modePaiement || "-"}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Description */}
                {selectedFacture.description && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <p className="text-gray-700">{selectedFacture.description}</p>
                  </div>
                )}

                {/* Lignes de facture */}
                {selectedFacture.lignes && selectedFacture.lignes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Détail des lignes
                    </h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-4 py-2 text-gray-600">
                              Description
                            </th>
                            <th className="text-right px-4 py-2 text-gray-600">
                              Qté
                            </th>
                            <th className="text-right px-4 py-2 text-gray-600">
                              P.U.
                            </th>
                            <th className="text-right px-4 py-2 text-gray-600">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedFacture.lignes.map((ligne, idx) => (
                            <tr key={idx} className="border-t border-gray-100">
                              <td className="px-4 py-2">{ligne.description}</td>
                              <td className="px-4 py-2 text-right">
                                {ligne.quantite}
                              </td>
                              <td className="px-4 py-2 text-right">
                                {formatMontant(ligne.prixUnitaire)}
                              </td>
                              <td className="px-4 py-2 text-right font-medium">
                                {formatMontant(ligne.total)}
                              </td>
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
                    <p className="text-sm text-gray-500 mb-1">Notes</p>
                    <p className="text-gray-700 text-sm bg-yellow-50 p-3 rounded-lg">
                      {selectedFacture.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Fermer
                </button>
                {selectedFacture.pdfPath ? (
                  <button
                    onClick={() => handleTelechargerPDF(selectedFacture)}
                    disabled={actionLoading === selectedFacture.id}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger PDF
                  </button>
                ) : (
                  <button
                    onClick={() => handleGenererPDF(selectedFacture)}
                    disabled={actionLoading === selectedFacture.id}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4" />
                    Générer PDF
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
