import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getIntervenantById, updateIntervenant, uploadDocument, fetchDocumentAsBlob, type Document, type UpdateIntervenantData } from "@/services/intervenants";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Save,
  Camera,
  Link as LinkIcon,
  Linkedin,
  Globe,
  Play,
  Award,
  Plus,
  X,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  bio: string;
  phone: string;
  city: string;
  siret: string;
  yearsExperience: number | null;
  videoUrl: string;
  linkedinUrl: string;
  website: string;
}

export default function MonProfilIntervenantPage() {
  const { user, refreshUser } = useAuth();
  const [intervenant, setIntervenant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expertises, setExpertises] = useState<string[]>([]);
  const [newExpertise, setNewExpertise] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [hasTriedRefresh, setHasTriedRefresh] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<ProfileFormData>();

  useEffect(() => {
    fetchIntervenant();
  }, [user]);

  const fetchIntervenant = async () => {
    if (!user?.intervenant?.id) {
      if (!hasTriedRefresh && user?.role === "INTERVENANT") {
        setHasTriedRefresh(true);
        try {
          await refreshUser();
        } catch {
          setIsLoading(false);
        }
        return;
      }
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getIntervenantById(user.intervenant.id);
      setIntervenant(data);
      setExpertises(data.expertises || []);
      await loadProfileImage(data);

      reset({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        bio: data.bio || "",
        phone: data.phone || "",
        city: data.city || "",
        siret: data.siret || "",
        yearsExperience: data.yearsExperience || null,
        videoUrl: data.videoUrl || "",
        linkedinUrl: data.linkedinUrl || "",
        website: data.website || "",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.intervenant?.id) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const updateData: UpdateIntervenantData = {
        ...data,
        yearsExperience: data.yearsExperience ? Number(data.yearsExperience) : null,
        expertises,
      };

      await updateIntervenant(user.intervenant.id, updateData);
      setSuccess("Profil mis à jour avec succès !");
      await fetchIntervenant();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la sauvegarde";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !expertises.includes(newExpertise.trim())) {
      setExpertises([...expertises, newExpertise.trim()]);
      setNewExpertise("");
    }
  };

  const removeExpertise = (index: number) => {
    setExpertises(expertises.filter((_, i) => i !== index));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.intervenant?.id) return;

    try {
      setIsUploadingPhoto(true);
      setError(null);
      await uploadDocument(user.intervenant.id, file, "PROFILE_IMAGE");
      setSuccess("Photo de profil mise à jour !");
      const data = await getIntervenantById(user.intervenant.id);
      setIntervenant(data);
      await loadProfileImage(data);
    } catch (err) {
      setError("Erreur lors de l'upload de la photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const loadProfileImage = async (intervenantData: any) => {
    if (!intervenantData) {
      setProfileImageUrl(null);
      return;
    }
    if (intervenantData.documents) {
      const documents = intervenantData.documents as unknown as Document[];
      const profileDoc = documents.find((doc) => doc.type === "PROFILE_IMAGE");
      if (profileDoc) {
        const blobUrl = await fetchDocumentAsBlob(intervenantData.id, profileDoc.id);
        setProfileImageUrl(blobUrl);
        return;
      }
    }
    if (intervenantData.profileImage?.startsWith("http")) {
      setProfileImageUrl(intervenantData.profileImage);
      return;
    }
    setProfileImageUrl(null);
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
        <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
            <div className="h-4 w-32 rounded mb-3" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: "#6d74b5" }}></div>
              <div>
                <div className="h-6 w-40 rounded mb-2" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}></div>
                <div className="h-4 w-64 rounded" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-6">
            <div className="rounded-xl p-8 space-y-6" style={{ backgroundColor: "#ffffff" }}>
              <div className="h-32 w-32 rounded-full mx-auto" style={{ backgroundColor: "#ebf2fa" }}></div>
              <div className="h-10 rounded" style={{ backgroundColor: "#ebf2fa" }}></div>
              <div className="h-10 rounded" style={{ backgroundColor: "#ebf2fa" }}></div>
              <div className="h-32 rounded" style={{ backgroundColor: "#ebf2fa" }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!intervenant) {
    return (
      <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
        <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
            <Link
              to="/dashboard/intervenant"
              className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
              style={{ color: "rgba(235, 242, 250, 0.7)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au tableau de bord
            </Link>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#6d74b5" }}
              >
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mon Profil Public</h1>
                <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  Profil intervenant non trouvé
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Alert type="error">Profil intervenant non trouvé</Alert>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header avec bannière */}
      <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to="/dashboard/intervenant"
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(235, 242, 250, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#6d74b5" }}
              >
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mon Profil Public</h1>
                <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  Complétez votre profil pour augmenter votre visibilité
                </p>
              </div>
            </div>

            {intervenant?.status === "approved" && (
              <Link to={`/intervenants/${intervenant.id}`}>
                <Button
                  variant="secondary"
                  size="sm"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderColor: "rgba(255, 255, 255, 0.2)", color: "#ffffff" }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir mon profil public
                </Button>
              </Link>
            )}
          </div>

          {/* Stats inline */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20">
            {[
              { value: expertises.length, label: "Expertises" },
              { value: intervenant?.yearsExperience || 0, label: "Années d'exp." },
              { value: intervenant?.status === "approved" ? "Approuvé" : "En attente", label: "Statut", isStatus: true },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-lg"
                style={{
                  backgroundColor: stat.isStatus && intervenant?.status === "approved"
                    ? "rgba(16, 185, 129, 0.2)"
                    : "rgba(255, 255, 255, 0.1)"
                }}
              >
                <span
                  className="font-bold"
                  style={{
                    color: stat.isStatus && intervenant?.status === "approved"
                      ? "#10b981"
                      : "#ffffff"
                  }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-sm ml-2"
                  style={{
                    color: stat.isStatus && intervenant?.status === "approved"
                      ? "#10b981"
                      : "rgba(235, 242, 250, 0.7)"
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setError(null)}>{error}</Alert>
          </div>
        )}

        {success && (
          <div className="mb-6">
            <Alert type="success" onClose={() => setSuccess(null)}>{success}</Alert>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Photo de profil */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff" }}>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: "#1c2942" }}>
              <Camera className="w-5 h-5" style={{ color: "#6d74b5" }} />
              Photo de profil
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Photo de profil"
                    className="w-32 h-32 rounded-full object-cover border-4"
                    style={{ borderColor: "#ebf2fa" }}
                  />
                ) : (
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#ebf2fa" }}
                  >
                    <User className="w-16 h-16" style={{ color: "#6d74b5" }} />
                  </div>
                )}
                <label
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                  style={{ backgroundColor: "#6d74b5" }}
                >
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={isUploadingPhoto}
                  />
                </label>
              </div>
              <div className="text-center md:text-left">
                <p style={{ color: "#1c2942" }}>
                  Uploadez une photo professionnelle pour personnaliser votre profil.
                </p>
                <p className="text-sm mt-1" style={{ color: "#6d74b5" }}>
                  Formats acceptés : JPG, PNG. Taille max : 5 Mo
                </p>
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff" }}>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: "#1c2942" }}>
              <User className="w-5 h-5" style={{ color: "#6d74b5" }} />
              Informations personnelles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>Prénom</label>
                <input
                  type="text"
                  {...register("firstName")}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all"
                  style={{ borderColor: "#ebf2fa" }}
                  placeholder="Jean"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>Nom</label>
                <input
                  type="text"
                  {...register("lastName")}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all"
                  style={{ borderColor: "#ebf2fa" }}
                  placeholder="Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                  <Phone className="w-4 h-4 inline mr-1" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all"
                  style={{ borderColor: "#ebf2fa" }}
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Ville
                </label>
                <input
                  type="text"
                  {...register("city")}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all"
                  style={{ borderColor: "#ebf2fa" }}
                  placeholder="Paris"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                  <FileText className="w-4 h-4 inline mr-1" />
                  Biographie
                </label>
                <textarea
                  {...register("bio")}
                  rows={5}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all resize-none"
                  style={{ borderColor: "#ebf2fa" }}
                  placeholder="Présentez-vous en quelques lignes : votre parcours, vos compétences, ce qui vous passionne..."
                />
                <p className="text-sm mt-1" style={{ color: "#6d74b5" }}>
                  Une bonne biographie augmente vos chances d'être contacté
                </p>
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff" }}>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: "#1c2942" }}>
              <Briefcase className="w-5 h-5" style={{ color: "#6d74b5" }} />
              Informations professionnelles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>Numéro SIRET</label>
                <input
                  type="text"
                  {...register("siret")}
                  maxLength={14}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all font-mono"
                  style={{ borderColor: "#ebf2fa" }}
                  placeholder="12345678901234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>Années d'expérience</label>
                <input
                  type="number"
                  {...register("yearsExperience")}
                  min={0}
                  max={60}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all"
                  style={{ borderColor: "#ebf2fa" }}
                  placeholder="5"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                  <Award className="w-4 h-4 inline mr-1" />
                  Domaines d'expertise
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {expertises.map((exp, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ backgroundColor: "#ebf2fa", color: "#6d74b5" }}
                    >
                      {exp}
                      <button
                        type="button"
                        onClick={() => removeExpertise(idx)}
                        className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExpertise())}
                    className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all"
                    style={{ borderColor: "#ebf2fa" }}
                    placeholder="Ajouter une expertise (ex: Marketing Digital)"
                  />
                  <Button type="button" onClick={addExpertise} variant="secondary" style={{ borderColor: "#ebf2fa" }}>
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Liens et médias */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff" }}>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: "#1c2942" }}>
              <LinkIcon className="w-5 h-5" style={{ color: "#6d74b5" }} />
              Liens et médias
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                  <Play className="w-4 h-4 inline mr-1" />
                  Vidéo de présentation (YouTube/Vimeo)
                </label>
                <input
                  type="url"
                  {...register("videoUrl")}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all"
                  style={{ borderColor: "#ebf2fa" }}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-sm mt-1" style={{ color: "#6d74b5" }}>
                  Une vidéo de présentation peut augmenter considérablement votre attractivité
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                    <Linkedin className="w-4 h-4 inline mr-1" />
                    Profil LinkedIn
                  </label>
                  <input
                    type="url"
                    {...register("linkedinUrl")}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all"
                    style={{ borderColor: "#ebf2fa" }}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                    <Globe className="w-4 h-4 inline mr-1" />
                    Site web personnel
                  </label>
                  <input
                    type="url"
                    {...register("website")}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all"
                    style={{ borderColor: "#ebf2fa" }}
                    placeholder="https://www.monsite.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bouton de sauvegarde */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-between items-center rounded-xl p-6"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="text-center sm:text-left">
              <p style={{ color: "#6d74b5" }}>
                {isDirty || expertises.length !== (intervenant?.expertises?.length || 0)
                  ? "Vous avez des modifications non sauvegardées"
                  : "Toutes vos modifications sont sauvegardées"}
              </p>
            </div>
            <Button type="submit" disabled={isSaving} className="bg-[#6d74b5] hover:bg-[#5a61a0]">
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sauvegarde...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
