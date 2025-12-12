import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getIntervenantById, updateIntervenant, uploadDocument, deleteDocument, getDocumentDownloadUrl, type Document, type UpdateIntervenantData } from "@/services/intervenants";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { motion } from "motion/react";
import {
  User,
  Mail,
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
  Upload,
  Trash2,
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
  const { user } = useAuth();
  const [intervenant, setIntervenant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expertises, setExpertises] = useState<string[]>([]);
  const [newExpertise, setNewExpertise] = useState("");
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileFormData>();

  useEffect(() => {
    fetchIntervenant();
  }, [user]);

  const fetchIntervenant = async () => {
    if (!user?.intervenant?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getIntervenantById(user.intervenant.id);
      setIntervenant(data);
      setExpertises(data.expertises || []);

      // Reset form with fetched data
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
      await fetchIntervenant();
    } catch (err) {
      setError("Erreur lors de l'upload de la photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file || !user?.intervenant?.id) return;

    try {
      setIsUploadingDoc(true);
      setError(null);
      await uploadDocument(user.intervenant.id, file, type);
      setSuccess(`Document ${type} uploadé avec succès !`);
      await fetchIntervenant();
    } catch (err) {
      setError("Erreur lors de l'upload du document");
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!user?.intervenant?.id || !confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) return;

    try {
      await deleteDocument(user.intervenant.id, docId);
      setSuccess("Document supprimé !");
      await fetchIntervenant();
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const getProfileImageUrl = () => {
    if (!intervenant) return null;
    if (intervenant.documents) {
      const documents = intervenant.documents as unknown as Document[];
      const profileDoc = documents.find((doc) => doc.type === "PROFILE_IMAGE");
      if (profileDoc) {
        return getDocumentDownloadUrl(intervenant.id, profileDoc.id);
      }
    }
    if (intervenant.profileImage?.startsWith("http")) {
      return intervenant.profileImage;
    }
    return null;
  };

  const documents = (intervenant?.documents as unknown as Document[]) || [];
  const profileImageUrl = getProfileImageUrl();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <PageContainer maxWidth="4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white rounded-2xl p-8 space-y-6">
              <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  if (!intervenant) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <PageContainer maxWidth="4xl">
          <Alert type="error">Profil intervenant non trouvé</Alert>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-mesh">
        <PageContainer maxWidth="4xl" className="py-8">
          <Link
            to="/dashboard/intervenant"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-bold text-white">Mon Profil Public</h1>
          <p className="text-white/80 mt-2">
            Complétez votre profil pour augmenter votre visibilité auprès des écoles
          </p>
        </PageContainer>
      </div>

      <PageContainer maxWidth="4xl" className="py-8 -mt-8">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Alert type="error" onClose={() => setError(null)}>{error}</Alert>
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Alert type="success" onClose={() => setSuccess(null)}>{success}</Alert>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Photo de profil */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-600" />
              Photo de profil
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Photo de profil"
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="w-16 h-16 text-indigo-400" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors">
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
                <p className="text-gray-600">
                  Uploadez une photo professionnelle pour personnaliser votre profil.
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Formats acceptés : JPG, PNG. Taille max : 5 Mo
                </p>
              </div>
            </div>
          </motion.div>

          {/* Informations personnelles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Informations personnelles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  {...register("firstName")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Jean"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  {...register("lastName")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Ville
                </label>
                <input
                  type="text"
                  {...register("city")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Paris"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Biographie
                </label>
                <textarea
                  {...register("bio")}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  placeholder="Présentez-vous en quelques lignes : votre parcours, vos compétences, ce qui vous passionne..."
                />
                <p className="text-sm text-gray-400 mt-1">
                  Une bonne biographie augmente vos chances d'être contacté
                </p>
              </div>
            </div>
          </motion.div>

          {/* Informations professionnelles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Informations professionnelles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro SIRET
                </label>
                <input
                  type="text"
                  {...register("siret")}
                  maxLength={14}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono"
                  placeholder="12345678901234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Années d'expérience
                </label>
                <input
                  type="number"
                  {...register("yearsExperience")}
                  min={0}
                  max={60}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="5"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Award className="w-4 h-4 inline mr-1" />
                  Domaines d'expertise
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {expertises.map((exp, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                    >
                      {exp}
                      <button
                        type="button"
                        onClick={() => removeExpertise(idx)}
                        className="w-4 h-4 rounded-full hover:bg-indigo-200 flex items-center justify-center"
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
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Ajouter une expertise (ex: Marketing Digital)"
                  />
                  <Button type="button" onClick={addExpertise} variant="secondary">
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Liens et médias */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-indigo-600" />
              Liens et médias
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Play className="w-4 h-4 inline mr-1" />
                  Vidéo de présentation (YouTube/Vimeo)
                </label>
                <input
                  type="url"
                  {...register("videoUrl")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-sm text-gray-400 mt-1">
                  Une vidéo de présentation peut augmenter considérablement votre attractivité
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Linkedin className="w-4 h-4 inline mr-1" />
                    Profil LinkedIn
                  </label>
                  <input
                    type="url"
                    {...register("linkedinUrl")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Site web personnel
                  </label>
                  <input
                    type="url"
                    {...register("website")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="https://www.monsite.com"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Documents
            </h2>

            {/* Liste des documents existants */}
            {documents.filter(d => d.type !== "PROFILE_IMAGE").length > 0 && (
              <div className="space-y-3 mb-6">
                {documents.filter(d => d.type !== "PROFILE_IMAGE").map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        doc.type === "CV" ? "bg-indigo-100 text-indigo-600" :
                        doc.type === "DIPLOME" ? "bg-amber-100 text-amber-600" :
                        "bg-gray-200 text-gray-600"
                      }`}>
                        {doc.type === "DIPLOME" ? <Award className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.fileName}</p>
                        <p className="text-sm text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={getDocumentDownloadUrl(intervenant.id, doc.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Boutons d'upload */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all">
                <Upload className="w-8 h-8 text-indigo-600 mb-2" />
                <span className="font-medium text-gray-700">Ajouter CV</span>
                <span className="text-sm text-gray-400">PDF, DOC</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleDocumentUpload(e, "CV")}
                  disabled={isUploadingDoc}
                />
              </label>

              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all">
                <Award className="w-8 h-8 text-amber-600 mb-2" />
                <span className="font-medium text-gray-700">Ajouter Diplôme</span>
                <span className="text-sm text-gray-400">PDF, JPG, PNG</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => handleDocumentUpload(e, "DIPLOME")}
                  disabled={isUploadingDoc}
                />
              </label>

              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all">
                <FileText className="w-8 h-8 text-emerald-600 mb-2" />
                <span className="font-medium text-gray-700">Autre document</span>
                <span className="text-sm text-gray-400">PDF, DOC, JPG</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => handleDocumentUpload(e, "AUTRE")}
                  disabled={isUploadingDoc}
                />
              </label>
            </div>
          </motion.div>

          {/* Bouton de sauvegarde */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
          >
            <div className="text-center sm:text-left">
              <p className="text-gray-600">
                {isDirty || expertises.length !== (intervenant?.expertises?.length || 0)
                  ? "Vous avez des modifications non sauvegardées"
                  : "Toutes vos modifications sont sauvegardées"}
              </p>
            </div>
            <div className="flex gap-3">
              {intervenant?.status === "approved" && (
                <Link to={`/intervenants/${intervenant.id}`}>
                  <Button type="button" variant="secondary">
                    <Eye className="w-4 h-4" />
                    Voir mon profil public
                  </Button>
                </Link>
              )}
              <Button type="submit" disabled={isSaving}>
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
          </motion.div>
        </form>
      </PageContainer>
    </div>
  );
}
