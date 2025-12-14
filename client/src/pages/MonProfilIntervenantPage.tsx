import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getIntervenantById, updateIntervenant, uploadDocument, fetchDocumentAsBlob, type Document, type UpdateIntervenantData } from "@/services/intervenants";
import { PageContainer } from "@/components/ui/PageContainer";
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
    // Si pas d'intervenant.id et qu'on n'a pas encore essayé de rafraîchir, on rafraîchit
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
      // Recharger les données de l'intervenant
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
      <div className="min-h-screen bg-[#ebf2fa]">
        <PageContainer maxWidth="4xl" className="py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white rounded w-1/3"></div>
            <div className="bg-white rounded-2xl p-8 space-y-6">
              <div className="h-32 w-32 bg-[#ebf2fa] rounded-full mx-auto"></div>
              <div className="h-10 bg-[#ebf2fa] rounded"></div>
              <div className="h-10 bg-[#ebf2fa] rounded"></div>
              <div className="h-32 bg-[#ebf2fa] rounded"></div>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  if (!intervenant) {
    return (
      <div className="min-h-screen bg-[#ebf2fa]">
        <PageContainer maxWidth="4xl" className="py-8">
          <Alert type="error">Profil intervenant non trouvé</Alert>
          <Link to="/dashboard" className="mt-4 inline-block">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4" />
              Retour au dashboard
            </Button>
          </Link>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebf2fa]">
      <PageContainer maxWidth="4xl" className="py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 mb-6">
          <Link
            to="/dashboard/intervenant"
            className="inline-flex items-center gap-2 text-[#1c2942]/60 hover:text-[#1c2942] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1c2942] rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1c2942]">Mon Profil Public</h1>
              <p className="text-sm text-[#1c2942]/60">
                Complétez votre profil pour augmenter votre visibilité auprès des écoles
              </p>
            </div>
          </div>
        </div>

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
          <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6">
            <h2 className="text-lg font-bold text-[#1c2942] mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#6d74b5]" />
              Photo de profil
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Photo de profil"
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#ebf2fa]"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#ebf2fa] flex items-center justify-center">
                    <User className="w-16 h-16 text-[#6d74b5]" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#6d74b5] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#5a61a0] transition-colors">
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
                <p className="text-[#1c2942]/70">
                  Uploadez une photo professionnelle pour personnaliser votre profil.
                </p>
                <p className="text-sm text-[#1c2942]/50 mt-1">
                  Formats acceptés : JPG, PNG. Taille max : 5 Mo
                </p>
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6">
            <h2 className="text-lg font-bold text-[#1c2942] mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#6d74b5]" />
              Informations personnelles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">Prénom</label>
                <input
                  type="text"
                  {...register("firstName")}
                  className="w-full px-4 py-3 border border-[#1c2942]/10 rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent transition-all"
                  placeholder="Jean"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">Nom</label>
                <input
                  type="text"
                  {...register("lastName")}
                  className="w-full px-4 py-3 border border-[#1c2942]/10 rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent transition-all"
                  placeholder="Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-3 border border-[#1c2942]/10 rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent transition-all"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Ville
                </label>
                <input
                  type="text"
                  {...register("city")}
                  className="w-full px-4 py-3 border border-[#1c2942]/10 rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent transition-all"
                  placeholder="Paris"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1c2942] mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Biographie
                </label>
                <textarea
                  {...register("bio")}
                  rows={5}
                  className="w-full px-4 py-3 border border-[#1c2942]/10 rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent transition-all resize-none"
                  placeholder="Présentez-vous en quelques lignes : votre parcours, vos compétences, ce qui vous passionne..."
                />
                <p className="text-sm text-[#1c2942]/50 mt-1">
                  Une bonne biographie augmente vos chances d'être contacté
                </p>
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6">
            <h2 className="text-lg font-bold text-[#1c2942] mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#6d74b5]" />
              Informations professionnelles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">Numéro SIRET</label>
                <input
                  type="text"
                  {...register("siret")}
                  maxLength={14}
                  className="w-full px-4 py-3 border border-[#1c2942]/10 rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent transition-all font-mono"
                  placeholder="12345678901234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">Années d'expérience</label>
                <input
                  type="number"
                  {...register("yearsExperience")}
                  min={0}
                  max={60}
                  className="w-full px-4 py-3 border border-[#1c2942]/10 rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent transition-all"
                  placeholder="5"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1c2942] mb-2">
                  <Award className="w-4 h-4 inline mr-1" />
                  Domaines d'expertise
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {expertises.map((exp, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#ebf2fa] text-[#6d74b5] rounded-full text-sm font-medium"
                    >
                      {exp}
                      <button
                        type="button"
                        onClick={() => removeExpertise(idx)}
                        className="w-4 h-4 rounded-full hover:bg-[#6d74b5]/20 flex items-center justify-center"
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
                    className="flex-1 px-4 py-3 border border-[#1c2942]/10 rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent transition-all"
                    placeholder="Ajouter une expertise (ex: Marketing Digital)"
                  />
                  <Button type="button" onClick={addExpertise} variant="outline">
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Liens et médias */}
          <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6">
            <h2 className="text-lg font-bold text-[#1c2942] mb-6 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-[#6d74b5]" />
              Liens et médias
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1c2942] mb-2">
                  <Play className="w-4 h-4 inline mr-1" />
                  Vidéo de présentation (YouTube/Vimeo)
                </label>
                <input
                  type="url"
                  {...register("videoUrl")}
                  className="w-full px-4 py-3 border border-[#1c2942]/10 rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent transition-all"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-sm text-[#1c2942]/50 mt-1">
                  Une vidéo de présentation peut augmenter considérablement votre attractivité
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#1c2942] mb-2">
                    <Linkedin className="w-4 h-4 inline mr-1" />
                    Profil LinkedIn
                  </label>
                  <input
                    type="url"
                    {...register("linkedinUrl")}
                    className="w-full px-4 py-3 border border-[#1c2942]/10 rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent transition-all"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1c2942] mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Site web personnel
                  </label>
                  <input
                    type="url"
                    {...register("website")}
                    className="w-full px-4 py-3 border border-[#1c2942]/10 rounded-xl focus:ring-2 focus:ring-[#6d74b5] focus:border-transparent transition-all"
                    placeholder="https://www.monsite.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bouton de sauvegarde */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white rounded-2xl border border-[#1c2942]/10 p-6">
            <div className="text-center sm:text-left">
              <p className="text-[#1c2942]/60">
                {isDirty || expertises.length !== (intervenant?.expertises?.length || 0)
                  ? "Vous avez des modifications non sauvegardées"
                  : "Toutes vos modifications sont sauvegardées"}
              </p>
            </div>
            <div className="flex gap-3">
              {intervenant?.status === "approved" && (
                <Link to={`/intervenants/${intervenant.id}`}>
                  <Button type="button" variant="outline">
                    <Eye className="w-4 h-4" />
                    Voir mon profil public
                  </Button>
                </Link>
              )}
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
          </div>
        </form>
      </PageContainer>
    </div>
  );
}
