import { useEffect, useState } from "react";
import { Link } from "react-router";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import {
  getMyFavorites,
  removeFavorite,
  updateFavoriteNote,
  type Favorite,
} from "@/services/favorites";
import { getDocumentDownloadUrl } from "@/services/intervenants";
import {
  Heart,
  User,
  MapPin,
  Award,
  Mail,
  Eye,
  Trash2,
  Edit3,
  Save,
  X,
  Search,
  Users,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function MesFavorisPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteValue, setEditingNoteValue] = useState("");

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMyFavorites(1, 100);
      setFavorites(response.data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des favoris";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (intervenantId: string) => {
    try {
      await removeFavorite(intervenantId);
      setFavorites((prev) =>
        prev.filter((f) => f.intervenantId !== intervenantId)
      );
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  };

  const handleStartEditNote = (favorite: Favorite) => {
    setEditingNoteId(favorite.id);
    setEditingNoteValue(favorite.note || "");
  };

  const handleSaveNote = async (intervenantId: string) => {
    try {
      await updateFavoriteNote(intervenantId, editingNoteValue);
      setFavorites((prev) =>
        prev.map((f) =>
          f.intervenantId === intervenantId
            ? { ...f, note: editingNoteValue }
            : f
        )
      );
      setEditingNoteId(null);
      setEditingNoteValue("");
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingNoteValue("");
  };

  const getProfileImageUrl = (favorite: Favorite) => {
    const intervenant = favorite.intervenant;
    if (intervenant.documents && intervenant.id) {
      const profileDoc = intervenant.documents.find(
        (doc) => doc.type === "PROFILE_IMAGE"
      );
      if (profileDoc) {
        return getDocumentDownloadUrl(intervenant.id, profileDoc.id);
      }
    }
    if (intervenant.profileImage?.startsWith("http")) {
      return intervenant.profileImage;
    }
    return null;
  };

  const getFullName = (favorite: Favorite) => {
    const intervenant = favorite.intervenant;
    return (
      [intervenant.firstName, intervenant.lastName].filter(Boolean).join(" ") ||
      intervenant.user?.name ||
      intervenant.user?.email?.split("@")[0] ||
      "Intervenant"
    );
  };

  const filteredFavorites = favorites.filter((favorite) => {
    const name = getFullName(favorite).toLowerCase();
    const expertises = favorite.intervenant.expertises?.join(" ").toLowerCase() || "";
    const city = favorite.intervenant.city?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return name.includes(search) || expertises.includes(search) || city.includes(search);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-mesh">
        <PageContainer maxWidth="7xl" className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/dashboard/ecole"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au tableau de bord
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                  <Heart className="w-4 h-4 text-rose-300" />
                  <span className="text-sm font-medium">Mes favoris</span>
                </div>

                <h1 className="text-4xl font-extrabold mb-2">
                  Intervenants favoris
                </h1>
                <p className="text-lg text-indigo-100/80">
                  {favorites.length} intervenant{favorites.length > 1 ? "s" : ""} dans vos favoris
                </p>
              </div>

              {/* Barre de recherche */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un intervenant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </motion.div>
        </PageContainer>
      </div>

      <PageContainer maxWidth="7xl" className="py-8 -mt-8">
        {error && (
          <Alert type="error" className="mb-6" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-20 bg-gray-200 rounded mb-4" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : filteredFavorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-gray-100 p-16 text-center"
          >
            <div className="w-20 h-20 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchTerm ? "Aucun résultat" : "Aucun favori"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              {searchTerm
                ? "Aucun intervenant ne correspond à votre recherche."
                : "Vous n'avez pas encore ajouté d'intervenants à vos favoris. Parcourez les profils pour en ajouter !"}
            </p>
            <Link to="/intervenants">
              <Button variant="primary" size="lg" className="px-8">
                <Users className="w-5 h-5" />
                Parcourir les intervenants
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredFavorites.map((favorite, index) => {
                const profileImageUrl = getProfileImageUrl(favorite);
                const fullName = getFullName(favorite);
                const isEditing = editingNoteId === favorite.id;

                return (
                  <motion.div
                    key={favorite.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow relative group">
                      {/* Bouton supprimer */}
                      <button
                        onClick={() =>
                          handleRemoveFavorite(favorite.intervenantId)
                        }
                        className="absolute top-4 right-4 p-2 bg-rose-100 hover:bg-rose-200 rounded-full text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Retirer des favoris"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Header avec photo */}
                      <div className="flex items-center gap-4 mb-4">
                        {profileImageUrl ? (
                          <img
                            src={profileImageUrl}
                            alt={fullName}
                            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget
                                .nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-16 h-16 rounded-full bg-indigo-100 items-center justify-center ${
                            profileImageUrl ? "hidden" : "flex"
                          }`}
                        >
                          <User className="w-8 h-8 text-indigo-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900 truncate">
                            {fullName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                            <span>
                              Ajouté le{" "}
                              {new Date(favorite.createdAt).toLocaleDateString(
                                "fr-FR"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      {favorite.intervenant.bio && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {favorite.intervenant.bio}
                        </p>
                      )}

                      {/* Expertises */}
                      {favorite.intervenant.expertises &&
                        favorite.intervenant.expertises.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {favorite.intervenant.expertises
                              .slice(0, 3)
                              .map((exp, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                                >
                                  {exp}
                                </span>
                              ))}
                            {favorite.intervenant.expertises.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                                +{favorite.intervenant.expertises.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                      {/* Infos */}
                      <div className="space-y-1.5 mb-4">
                        {favorite.intervenant.city && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{favorite.intervenant.city}</span>
                          </div>
                        )}
                        {favorite.intervenant.yearsExperience && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Award className="w-4 h-4" />
                            <span>
                              {favorite.intervenant.yearsExperience} ans
                              d'expérience
                            </span>
                          </div>
                        )}
                        {favorite.intervenant.user?.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">
                              {favorite.intervenant.user.email}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Note personnelle */}
                      <div className="border-t border-gray-100 pt-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500 uppercase">
                            Note personnelle
                          </span>
                          {!isEditing && (
                            <button
                              onClick={() => handleStartEditNote(favorite)}
                              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="space-y-2">
                            <textarea
                              value={editingNoteValue}
                              onChange={(e) =>
                                setEditingNoteValue(e.target.value)
                              }
                              className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                              rows={2}
                              placeholder="Ajouter une note..."
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleSaveNote(favorite.intervenantId)
                                }
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600"
                              >
                                <Save className="w-3.5 h-3.5" />
                                Enregistrer
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200"
                              >
                                <X className="w-3.5 h-3.5" />
                                Annuler
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 italic">
                            {favorite.note || "Aucune note"}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <Link to={`/intervenants/${favorite.intervenantId}`}>
                        <Button
                          variant="primary"
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Voir le profil
                        </Button>
                      </Link>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
