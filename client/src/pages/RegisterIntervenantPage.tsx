import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { PageContainer } from "@/components/ui/PageContainer";
import type { RegisterData } from "@/services/auth";
import { FormField } from "@/components/shared/FormField";
import { FileUpload } from "@/components/ui/FileUpload";
import { uploadDocument } from "@/services/intervenants";
import { getCurrentUser } from "@/services/auth";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Shield,
  Award,
  CreditCard,
  Building,
  User,
  FileCheck,
  Camera,
  Check,
  AlertTriangle,
} from "lucide-react";

// Configuration des champs pour l'étape 1
const STEP_1_FIELDS = [
  {
    name: "intervenantData.firstName",
    label: "Prénom",
    type: "text",
    placeholder: "Votre prénom",
    required: true,
    validation: { required: "Le prénom est requis" },
  },
  {
    name: "intervenantData.lastName",
    label: "Nom",
    type: "text",
    placeholder: "Votre nom",
    required: true,
    validation: { required: "Le nom est requis" },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "votre@email.com",
    required: true,
    validation: {
      required: "L'email est requis",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Email invalide",
      },
    },
  },
  {
    name: "password",
    label: "Mot de passe",
    type: "password",
    placeholder: "Minimum 8 caractères",
    required: true,
    validation: {
      required: "Le mot de passe est requis",
      minLength: { value: 8, message: "Minimum 8 caractères" },
    },
  },
  {
    name: "confirmPassword",
    label: "Confirmer le mot de passe",
    type: "password",
    placeholder: "Confirmez votre mot de passe",
    required: true,
    validation: { required: "Veuillez confirmer le mot de passe" },
  },
];

// Documents requis pour l'étape 3
const REQUIRED_DOCUMENTS = [
  {
    type: "PROFILE_IMAGE",
    label: "Photo de profil",
    description: "Photo professionnelle récente",
    icon: Camera,
    required: true,
    accepts: ".jpg,.jpeg,.png",
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

// Conditions générales pour l'étape 2
const CONTRACT_TERMS = [
  {
    title: "Statut d'auto-entrepreneur ou société",
    description: "Vous devez disposer d'un statut juridique valide (auto-entrepreneur, EURL, SASU, etc.) pour exercer en tant qu'intervenant.",
  },
  {
    title: "Responsabilité civile professionnelle",
    description: "Une assurance RC Pro est obligatoire pour couvrir votre activité d'intervention en établissement.",
  },
  {
    title: "Disponibilité et engagement",
    description: "Vous vous engagez à honorer les missions acceptées et à prévenir en cas d'indisponibilité dans les meilleurs délais.",
  },
  {
    title: "Confidentialité",
    description: "Vous vous engagez à respecter la confidentialité des informations relatives aux établissements et aux étudiants.",
  },
  {
    title: "Facturation via la plateforme",
    description: "La facturation des missions s'effectue via Vizion Academy. Des frais de service de 10% sont appliqués sur chaque mission.",
  },
  {
    title: "Validation du profil",
    description: "Votre profil sera validé par notre équipe après vérification de vos documents. Ce processus peut prendre 24 à 48h ouvrées.",
  },
];

interface RegisterIntervenantFormData {
  email: string;
  password: string;
  confirmPassword: string;
  intervenantData: {
    firstName: string;
    lastName: string;
    bio?: string;
    siret?: string;
  };
}

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

  const methods = useForm<RegisterIntervenantFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      intervenantData: {
        firstName: "",
        lastName: "",
        bio: "",
        siret: "",
      },
    },
  });

  const { watch, trigger } = methods;
  const watchPassword = watch("password");

  // Rediriger si déjà connecté et pas en étape 3
  useEffect(() => {
    if (user && currentStep !== 3) {
      if (user.role === "INTERVENANT") {
        setCurrentStep(3);
        setCreatedUserId(user.intervenant?.id || null);
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, currentStep, navigate]);

  // Étape 1 -> 2 : Valider les champs et passer aux conditions
  const handleStep1Next = async () => {
    const isValid = await trigger([
      "intervenantData.firstName",
      "intervenantData.lastName",
      "email",
      "password",
      "confirmPassword",
    ]);

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

  // Étape 2 -> 3 : Créer le compte et passer à l'upload des documents
  const handleStep2Next = async () => {
    if (!acceptedTerms) {
      setLocalError("Vous devez accepter les conditions pour continuer");
      return;
    }

    setLocalError(null);

    const data = methods.getValues();
    const name = [data.intervenantData.firstName, data.intervenantData.lastName]
      .filter(Boolean)
      .join(" ");

    const registrationData: RegisterData = {
      email: data.email,
      password: data.password,
      role: "INTERVENANT",
      name,
      intervenantData: {
        name,
        bio: data.intervenantData.bio || undefined,
        siret: data.intervenantData.siret || undefined,
      },
    };

    try {
      await registerUser(registrationData);

      // Attendre un peu pour que l'utilisateur soit bien créé côté serveur
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
      setLocalError(`Erreur lors de l'upload de ${REQUIRED_DOCUMENTS.find((d) => d.type === type)?.label}`);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header avec étapes */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <PageContainer maxWidth="4xl" className="py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Vizion Academy" className="w-8 h-8" />
              <span className="font-bold text-gray-900">Vizion Academy</span>
            </Link>

            {/* Stepper */}
            <div className="hidden sm:flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep >= step
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-12 h-1 mx-1 rounded ${
                        currentStep > step ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-500">
              Étape {currentStep}/3
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer maxWidth="2xl" className="py-8">
        <AnimatePresence mode="wait">
          {/* ÉTAPE 1 : Informations personnelles */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Créer votre compte</h1>
                    <p className="text-indigo-100">
                      Commencez par vos informations personnelles
                    </p>
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
                      {STEP_1_FIELDS.slice(0, 2).map((field) => (
                        <FormField key={field.name} field={field} />
                      ))}
                    </div>
                    {STEP_1_FIELDS.slice(2).map((field) => (
                      <FormField
                        key={field.name}
                        field={{
                          ...field,
                          validation:
                            field.name === "confirmPassword"
                              ? {
                                  ...field.validation,
                                  validate: (value: string) =>
                                    value === watchPassword || "Les mots de passe ne correspondent pas",
                                }
                              : field.validation,
                        }}
                      />
                    ))}
                  </form>
                </FormProvider>

                <div className="mt-8 flex justify-between items-center">
                  <Link
                    to="/login"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Déjà un compte ? Se connecter
                  </Link>
                  <Button onClick={handleStep1Next} variant="primary" size="lg">
                    Continuer
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 2 : Conditions et contrat */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Conditions d'intervention</h1>
                    <p className="text-amber-100">
                      Prenez connaissance des conditions avant de continuer
                    </p>
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
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      Veuillez lire attentivement les conditions ci-dessous. En continuant,
                      vous acceptez ces conditions et vous engagez à les respecter.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {CONTRACT_TERMS.map((term, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                    >
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {index + 1}. {term.title}
                      </h3>
                      <p className="text-sm text-gray-600">{term.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-indigo-900">
                      J'ai lu et j'accepte les conditions d'intervention. Je comprends que
                      mon profil sera soumis à validation et que je devrai fournir les
                      documents requis.
                    </span>
                  </label>
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="ghost"
                    size="lg"
                  >
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
            </motion.div>
          )}

          {/* ÉTAPE 3 : Upload des documents */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                      <FileCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">Complétez votre dossier</h1>
                      <p className="text-emerald-100">
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
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        className="h-full bg-white rounded-full"
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

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>Compte créé avec succès !</strong> Vous pouvez maintenant
                      téléverser vos documents. Vous pourrez aussi le faire plus tard depuis
                      votre tableau de bord.
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
                              : "bg-white border-gray-200 hover:border-indigo-200"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  isUploaded
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {isUploaded ? (
                                  <CheckCircle className="w-5 h-5" />
                                ) : (
                                  <Icon className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-gray-900">
                                    {doc.label}
                                  </h3>
                                  {doc.required && (
                                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                                      Requis
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">{doc.description}</p>
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
                <p className="text-sm text-gray-500">
                  Vous pourrez compléter votre dossier plus tard
                </p>
                <Button onClick={handleFinish} variant="primary" size="lg">
                  Accéder à mon tableau de bord
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lien retour */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>
      </PageContainer>
    </div>
  );
}
