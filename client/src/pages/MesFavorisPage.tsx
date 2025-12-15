import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
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
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header compact */}
      <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to="/dashboard/ecole"
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(235, 242, 250, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#6d74b5" }}
              >
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mes favoris</h1>
                <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  {favorites.length} intervenant{favorites.length > 1 ? "s" : ""} dans vos favoris
                </p>
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Rechercher un intervenant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                className="rounded-2xl p-6 animate-pulse"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full" style={{ backgroundColor: "#ebf2fa" }} />
                  <div className="flex-1">
                    <div className="h-5 rounded w-3/4 mb-2" style={{ backgroundColor: "#ebf2fa" }} />
                    <div className="h-4 rounded w-1/2" style={{ backgroundColor: "#ebf2fa" }} />
                  </div>
                </div>
                <div className="h-20 rounded mb-4" style={{ backgroundColor: "#ebf2fa" }} />
                <div className="h-10 rounded" style={{ backgroundColor: "#ebf2fa" }} />
              </div>
            ))}
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div
            className="rounded-2xl p-16 text-center"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#ebf2fa" }}
            >
              <Heart className="w-10 h-10" style={{ color: "#6d74b5" }} />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "#1c2942" }}>
              {searchTerm ? "Aucun résultat" : "Aucun favori"}
            </h3>
            <p className="max-w-md mx-auto mb-8" style={{ color: "#6d74b5" }}>
              {searchTerm
                ? "Aucun intervenant ne correspond à votre recherche."
                : "Vous n'avez pas encore ajouté d'intervenants à vos favoris. Parcourez les profils pour en ajouter !"}
            </p>
            <Link to="/intervenants">
              <Button
                variant="primary"
                size="lg"
                className="px-8"
                style={{ backgroundColor: "#6d74b5" }}
              >
                <Users className="w-5 h-5" />
                Parcourir les intervenants
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((favorite) => {
              const profileImageUrl = getProfileImageUrl(favorite);
              const fullName = getFullName(favorite);
              const isEditing = editingNoteId === favorite.id;

              return (
                <div
                  key={favorite.id}
                  className="rounded-2xl p-6 hover:shadow-lg transition-shadow relative group"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  {/* Bouton supprimer */}
                  <button
                    onClick={() => handleRemoveFavorite(favorite.intervenantId)}
                    className="absolute top-4 right-4 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: "#ebf2fa", color: "#6d74b5" }}
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
                        className="w-16 h-16 rounded-full object-cover border-2"
                        style={{ borderColor: "#ebf2fa" }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-16 h-16 rounded-full items-center justify-center ${
                        profileImageUrl ? "hidden" : "flex"
                      }`}
                      style={{ backgroundColor: "#ebf2fa" }}
                    >
                      <User className="w-8 h-8" style={{ color: "#6d74b5" }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate" style={{ color: "#1c2942" }}>
                        {fullName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm" style={{ color: "#6d74b5" }}>
                        <Heart className="w-4 h-4 fill-current" />
                        <span>
                          Ajouté le{" "}
                          {new Date(favorite.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {favorite.intervenant.bio && (
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: "#1c2942" }}>
                      {favorite.intervenant.bio}
                    </p>
                  )}

                  {/* Expertises */}
                  {favorite.intervenant.expertises && favorite.intervenant.expertises.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {favorite.intervenant.expertises.slice(0, 3).map((exp, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: "#ebf2fa", color: "#6d74b5" }}
                        >
                          {exp}
                        </span>
                      ))}
                      {favorite.intervenant.expertises.length > 3 && (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{ backgroundColor: "#ebf2fa", color: "#1c2942" }}
                        >
                          +{favorite.intervenant.expertises.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Infos */}
                  <div className="space-y-1.5 mb-4">
                    {favorite.intervenant.city && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: "#6d74b5" }}>
                        <MapPin className="w-4 h-4" />
                        <span>{favorite.intervenant.city}</span>
                      </div>
                    )}
                    {favorite.intervenant.yearsExperience && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: "#6d74b5" }}>
                        <Award className="w-4 h-4" />
                        <span>{favorite.intervenant.yearsExperience} ans d'expérience</span>
                      </div>
                    )}
                    {favorite.intervenant.user?.email && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: "#6d74b5" }}>
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{favorite.intervenant.user.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Note personnelle */}
                  <div
                    className="pt-4 mb-4"
                    style={{ borderTopWidth: "1px", borderColor: "#ebf2fa" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium uppercase" style={{ color: "#6d74b5" }}>
                        Note personnelle
                      </span>
                      {!isEditing && (
                        <button
                          onClick={() => handleStartEditNote(favorite)}
                          className="p-1 rounded hover:bg-[#ebf2fa]"
                          style={{ color: "#6d74b5" }}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingNoteValue}
                          onChange={(e) => setEditingNoteValue(e.target.value)}
                          className="w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 resize-none"
                          style={{
                            borderColor: "#ebf2fa",
                            color: "#1c2942",
                          }}
                          rows={2}
                          placeholder="Ajouter une note..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveNote(favorite.intervenantId)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-white text-sm rounded-lg"
                            style={{ backgroundColor: "#6d74b5" }}
                          >
                            <Save className="w-3.5 h-3.5" />
                            Enregistrer
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm rounded-lg"
                            style={{ backgroundColor: "#ebf2fa", color: "#1c2942" }}
                          >
                            <X className="w-3.5 h-3.5" />
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm italic" style={{ color: "#1c2942" }}>
                        {favorite.note || "Aucune note"}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <Link to={`/intervenants/${favorite.intervenantId}`}>
                    <Button
                      variant="primary"
                      className="w-full flex items-center justify-center gap-2"
                      style={{ backgroundColor: "#6d74b5" }}
                    >
                      <Eye className="w-4 h-4" />
                      Voir le profil
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
