import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type { RegisterData } from "@/services/auth";
import { Input } from "@/components/ui/Input";
import { FileUpload } from "@/components/ui/FileUpload";
import { uploadDocument } from "@/services/intervenants";
import { getCurrentUser } from "@/services/auth";
import {
  UserPlus,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Mail,
  Lock,
  User,
  FileText,
  Shield,
  Award,
  CreditCard,
  Building,
  Camera,
  AlertTriangle,
  Check,
} from "lucide-react";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

// Documents requis selon le cahier des charges
const REQUIRED_DOCUMENTS = [
  {
    type: "PROFILE_IMAGE",
    label: "Photo de profil",
    description: "Photo professionnelle récente",
    icon: Camera,
    required: true,
    accepts: "image/*",
  },
  {
    type: "CV",
    label: "Curriculum Vitae",
    description: "CV à jour présentant votre parcours",
    icon: FileText,
    required: true,
    accepts: ".pdf,.doc,.docx",
  },
  {
    type: "DIPLOME",
    label: "Diplômes / Certifications",
    description: "Vos diplômes et certifications",
    icon: Award,
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
  },
  {
    type: "PIECE_IDENTITE",
    label: "Pièce d'identité",
    description: "CNI ou Passeport (recto-verso)",
    icon: User,
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
  },
  {
    type: "KBIS",
    label: "Extrait KBIS / INSEE",
    description: "Extrait KBIS ou avis INSEE (< 3 mois)",
    icon: Building,
    required: true,
    accepts: ".pdf",
  },
  {
    type: "RIB",
    label: "RIB",
    description: "Relevé d'identité bancaire",
    icon: CreditCard,
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
  },
  {
    type: "ASSURANCE",
    label: "Assurance RC Pro",
    description: "Attestation d'assurance RC professionnelle",
    icon: Shield,
    required: true,
    accepts: ".pdf",
  },
];

// Conditions du contrat
const CONTRACT_TERMS = [
  {
    title: "Statut d'auto-entrepreneur ou société",
    description:
      "Vous devez disposer d'un statut juridique valide (auto-entrepreneur, EURL, SASU, etc.) pour exercer en tant qu'intervenant.",
  },
  {
    title: "Responsabilité civile professionnelle",
    description:
      "Une assurance RC Pro est obligatoire pour couvrir votre activité d'intervention en établissement.",
  },
  {
    title: "Disponibilité et engagement",
    description:
      "Vous vous engagez à honorer les missions acceptées et à prévenir en cas d'indisponibilité dans les meilleurs délais.",
  },
  {
    title: "Confidentialité",
    description:
      "Vous vous engagez à respecter la confidentialité des informations relatives aux établissements et aux étudiants.",
  },
  {
    title: "Facturation via la plateforme",
    description:
      "La facturation des missions s'effectue via Vizion Academy. Des frais de service de 10% sont appliqués sur chaque mission.",
  },
  {
    title: "Validation du profil",
    description:
      "Votre profil sera validé par notre équipe après vérification de vos documents. Ce processus peut prendre 24 à 48h ouvrées.",
  },
];

export default function RegisterIntervenantPage() {
  const { register: registerUser, error, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [localError, setLocalError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File | null>>({});
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string[]>([]);

  const methods = useForm<RegisterFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = methods;

  const watchPassword = watch("password");

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user && currentStep < 3) {
      if (user.role === "INTERVENANT" && user.intervenant?.id) {
        setCreatedUserId(user.intervenant.id);
        setCurrentStep(3);
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, currentStep, navigate]);

  // Étape 1 -> 2 : Valider les champs
  const handleStep1Next = async () => {
    const isValid = await trigger(["firstName", "lastName", "email", "password", "confirmPassword"]);
    if (!isValid) return;

    const password = methods.getValues("password");
    const confirmPassword = methods.getValues("confirmPassword");

    if (password !== confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas");
      return;
    }

    setLocalError(null);
    setCurrentStep(2);
  };

  // Étape 2 -> 3 : Créer le compte
  const handleStep2Next = async () => {
    if (!acceptedTerms) {
      setLocalError("Vous devez accepter les conditions pour continuer");
      return;
    }

    setLocalError(null);

    const data = methods.getValues();
    const name = `${data.firstName} ${data.lastName}`.trim();

    const registrationData: RegisterData = {
      email: data.email,
      password: data.password,
      role: "INTERVENANT",
      intervenantData: {
        name,
      },
    };

    try {
      await registerUser(registrationData);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const currentUser = await getCurrentUser();
      if (currentUser.intervenant?.id) {
        setCreatedUserId(currentUser.intervenant.id);
        setCurrentStep(3);
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setLocalError(errorObj?.message || "Erreur lors de la création du compte");
    }
  };

  // Upload d'un document
  const handleDocumentUpload = async (type: string, file: File | null) => {
    if (!file || !createdUserId) return;

    setUploadingDoc(type);
    setLocalError(null);

    try {
      await uploadDocument(createdUserId, file, type);
      setUploadedDocs((prev) => ({ ...prev, [type]: file }));
      setUploadSuccess((prev) => [...prev, type]);
    } catch (err) {
      const doc = REQUIRED_DOCUMENTS.find((d) => d.type === type);
      setLocalError(`Erreur lors de l'upload de ${doc?.label || type}`);
    } finally {
      setUploadingDoc(null);
    }
  };

  // Terminer l'inscription
  const handleFinish = () => {
    navigate("/dashboard/intervenant");
  };

  const displayError = localError || error;

  // Calcul de la progression des documents
  const requiredDocsCount = REQUIRED_DOCUMENTS.filter((d) => d.required).length;
  const uploadedRequiredCount = REQUIRED_DOCUMENTS.filter(
    (d) => d.required && uploadSuccess.includes(d.type)
  ).length;
  const progressPercentage = Math.round((uploadedRequiredCount / requiredDocsCount) * 100);

  return (
    <div className="min-h-screen bg-[#ebf2fa]">
      {/* Header avec étapes */}
      <div className="bg-white border-b border-[#1c2942]/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Vizion Academy" className="h-8 w-auto" />
            </Link>

            {/* Stepper */}
            <div className="hidden sm:flex items-center gap-2">
              {[
                { num: 1, label: "Infos" },
                { num: 2, label: "Contrat" },
                { num: 3, label: "Documents" },
              ].map((step) => (
                <div key={step.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        currentStep >= step.num
                          ? "bg-[#1c2942] text-white"
                          : "bg-[#ebf2fa] text-[#1c2942]/50"
                      }`}
                    >
                      {currentStep > step.num ? <Check className="w-4 h-4" /> : step.num}
                    </div>
                    <span className="text-xs text-[#1c2942]/60 mt-1">{step.label}</span>
                  </div>
                  {step.num < 3 && (
                    <div
                      className={`w-12 h-1 mx-2 rounded ${
                        currentStep > step.num ? "bg-[#1c2942]" : "bg-[#ebf2fa]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-sm text-[#1c2942]/60">Étape {currentStep}/3</div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ÉTAPE 1 : Informations personnelles */}
        {currentStep === 1 && (
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-[#1c2942]/10 overflow-hidden">
              <div className="bg-[#1c2942] p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#6d74b5]/30 rounded-xl flex items-center justify-center">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Créer votre compte</h1>
                    <p className="text-white/70">Commencez par vos informations personnelles</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {displayError && (
                  <Alert type="error" onClose={() => setLocalError(null)} className="mb-6">
                    {displayError}
                  </Alert>
                )}

                <FormProvider {...methods}>
                  <form className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Prénom"
                        placeholder="Votre prénom"
                        required
                        error={errors.firstName?.message}
                        leftIcon={<User className="w-4 h-4" />}
                        {...register("firstName", { required: "Le prénom est requis" })}
                      />
                      <Input
                        label="Nom"
                        placeholder="Votre nom"
                        required
                        error={errors.lastName?.message}
                        leftIcon={<User className="w-4 h-4" />}
                        {...register("lastName", { required: "Le nom est requis" })}
                      />
                    </div>

                    <Input
                      label="Email"
                      type="email"
                      placeholder="votre@email.com"
                      required
                      error={errors.email?.message}
                      leftIcon={<Mail className="w-4 h-4" />}
                      {...register("email", {
                        required: "L'email est requis",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email invalide",
                        },
                      })}
                    />

                    <Input
                      label="Mot de passe"
                      type="password"
                      placeholder="Minimum 8 caractères"
                      required
                      error={errors.password?.message}
                      leftIcon={<Lock className="w-4 h-4" />}
                      {...register("password", {
                        required: "Le mot de passe est requis",
                        minLength: { value: 8, message: "Minimum 8 caractères" },
                      })}
                    />

                    <Input
                      label="Confirmer le mot de passe"
                      type="password"
                      placeholder="Confirmez votre mot de passe"
                      required
                      error={errors.confirmPassword?.message}
                      leftIcon={<Lock className="w-4 h-4" />}
                      {...register("confirmPassword", {
                        required: "Veuillez confirmer le mot de passe",
                        validate: (value) =>
                          value === watchPassword || "Les mots de passe ne correspondent pas",
                      })}
                    />
                  </form>
                </FormProvider>

                <div className="mt-8 flex justify-between items-center">
                  <Link
                    to="/login"
                    className="text-sm text-[#1c2942]/60 hover:text-[#6d74b5] transition-colors"
                  >
                    Déjà un compte ? Se connecter
                  </Link>
                  <Button onClick={handleStep1Next} variant="primary" size="lg">
                    Continuer
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Conditions et contrat */}
        {currentStep === 2 && (
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-[#1c2942]/10 overflow-hidden">
              <div className="bg-[#1c2942] p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#6d74b5]/30 rounded-xl flex items-center justify-center">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Conditions d'intervention</h1>
                    <p className="text-white/70">Prenez connaissance des conditions avant de continuer</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {displayError && (
                  <Alert type="error" onClose={() => setLocalError(null)} className="mb-6">
                    {displayError}
                  </Alert>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-800">
                      Veuillez lire attentivement les conditions ci-dessous. En continuant, vous
                      acceptez ces conditions et vous engagez à les respecter.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {CONTRACT_TERMS.map((term, index) => (
                    <div key={index} className="bg-[#ebf2fa] rounded-xl p-4 border border-[#1c2942]/10">
                      <h3 className="font-semibold text-[#1c2942] mb-1">
                        {index + 1}. {term.title}
                      </h3>
                      <p className="text-sm text-[#1c2942]/70">{term.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-[#ebf2fa] rounded-xl border border-[#6d74b5]/20">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-[#1c2942]/30 text-[#6d74b5] focus:ring-[#6d74b5]"
                    />
                    <span className="text-sm text-[#1c2942]">
                      J'ai lu et j'accepte les conditions d'intervention. Je comprends que mon
                      profil sera soumis à validation et que je devrai fournir les documents requis.
                    </span>
                  </label>
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <Button onClick={() => setCurrentStep(1)} variant="ghost" size="lg">
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </Button>
                  <Button
                    onClick={handleStep2Next}
                    variant="primary"
                    size="lg"
                    disabled={!acceptedTerms}
                    isLoading={isLoading}
                  >
                    Créer mon compte
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Upload des documents */}
        {currentStep === 3 && (
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-[#1c2942]/10 overflow-hidden mb-6">
              <div className="bg-[#1c2942] p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#6d74b5]/30 rounded-xl flex items-center justify-center">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Complétez votre dossier</h1>
                    <p className="text-white/70">
                      Téléversez les documents requis pour valider votre profil
                    </p>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Progression</span>
                    <span className="font-medium">
                      {uploadedRequiredCount}/{requiredDocsCount} documents
                    </span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${progressPercentage}%` }}
                      className="h-full bg-white rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6">
                {displayError && (
                  <Alert type="error" onClose={() => setLocalError(null)} className="mb-6">
                    {displayError}
                  </Alert>
                )}

                <div className="bg-[#ebf2fa] border border-[#6d74b5]/20 rounded-xl p-4 mb-6">
                  <p className="text-sm text-[#1c2942]">
                    <strong>Compte créé avec succès !</strong> Vous pouvez maintenant téléverser
                    vos documents. Vous pourrez aussi le faire plus tard depuis votre tableau de
                    bord.
                  </p>
                </div>

                <div className="space-y-4">
                  {REQUIRED_DOCUMENTS.map((doc) => {
                    const Icon = doc.icon;
                    const isUploaded = uploadSuccess.includes(doc.type);
                    const isUploading = uploadingDoc === doc.type;

                    return (
                      <div
                        key={doc.type}
                        className={`p-4 rounded-xl border-2 transition-colors ${
                          isUploaded
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-white border-[#1c2942]/10 hover:border-[#6d74b5]/30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isUploaded
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-[#ebf2fa] text-[#6d74b5]"
                              }`}
                            >
                              {isUploaded ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-[#1c2942]">{doc.label}</h3>
                                {doc.required && (
                                  <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                                    Requis
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-[#1c2942]/60">{doc.description}</p>
                            </div>
                          </div>

                          <FileUpload
                            accept={doc.accepts}
                            maxSizeMB={10}
                            value={uploadedDocs[doc.type] || null}
                            onChange={(file) => handleDocumentUpload(doc.type, file)}
                            compact
                            disabled={isUploading}
                            isLoading={isUploading}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-[#1c2942]/50">Vous pourrez compléter votre dossier plus tard</p>
              <Button onClick={handleFinish} variant="primary" size="lg">
                Accéder à mon tableau de bord
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Lien retour */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#1c2942]/50 hover:text-[#1c2942] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
