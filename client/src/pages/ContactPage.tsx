import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  MessageSquare,
  Clock,
  ArrowRight,
  Handshake,
  HelpCircle,
  MoreHorizontal,
} from "lucide-react";
import { submitContactForm, type ContactType } from "@/services/contact";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  type: ContactType;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: {
      type: "contact",
    },
  });

  const selectedType = watch("type");

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      await submitContactForm(data);

      setSuccess(true);
      reset();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Erreur lors de l'envoi du message. Veuillez réessayer.";
      setError(
        errorMessage || "Erreur lors de l'envoi du message. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const requestTypes = [
    {
      value: "contact",
      label: "Question générale",
      icon: MessageSquare,
    },
    {
      value: "partenariat",
      label: "Demande de partenariat",
      icon: Handshake,
    },
    {
      value: "support",
      label: "Support technique",
      icon: HelpCircle,
    },
    {
      value: "autre",
      label: "Autre demande",
      icon: MoreHorizontal,
    },
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      value: "secretariat@vizionacademy.fr",
      href: "mailto:secretariat@vizionacademy.fr",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Téléphone",
      value: "06 59 19 65 50",
      href: "tel:0659196550",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Adresse",
      value: "Paris, France",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Réponse",
      value: "Sous 24-48h",
    },
  ];

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header compact */}
      <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#6d74b5" }}
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Contactez-nous</h1>
              <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                Notre équipe est à votre écoute
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="rounded-xl p-5 shadow-sm"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-white mb-3"
                style={{ backgroundColor: "#6d74b5" }}
              >
                {info.icon}
              </div>
              <h3
                className="text-sm font-medium mb-1"
                style={{ color: "#6d74b5" }}
              >
                {info.title}
              </h3>
              {info.href ? (
                <a
                  href={info.href}
                  className="font-semibold text-sm hover:opacity-80 transition-opacity break-all sm:break-normal"
                  style={{ color: "#1c2942" }}
                >
                  {info.value}
                </a>
              ) : (
                <p
                  className="font-semibold text-sm"
                  style={{ color: "#1c2942" }}
                >
                  {info.value}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Side - Info */}
          <div className="lg:col-span-2 space-y-5">
            <div
              className="rounded-xl p-6 text-white"
              style={{ backgroundColor: "#1c2942" }}
            >
              <h2 className="text-xl font-bold mb-3">Besoin d'aide ?</h2>
              <p className="text-sm mb-5" style={{ color: "#ebf2fa" }}>
                Notre équipe est disponible pour répondre à toutes vos questions
                concernant notre plateforme et nos services.
              </p>
              <div className="space-y-3">
                {[
                  "Réponse garantie sous 48h",
                  "Support personnalisé",
                  "Accompagnement dédié",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "#6d74b5" }}
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm" style={{ color: "#ebf2fa" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: "#ffffff" }}
            >
              <h3
                className="font-semibold mb-3"
                style={{ color: "#1c2942" }}
              >
                FAQ Rapide
              </h3>
              <div className="space-y-2">
                {[
                  "Comment devenir intervenant ?",
                  "Comment inscrire mon école ?",
                  "Quels sont les tarifs ?",
                ].map((question, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="flex items-center justify-between p-3 rounded-lg transition-colors"
                    style={{ backgroundColor: "#ebf2fa" }}
                  >
                    <span className="text-sm" style={{ color: "#1c2942" }}>
                      {question}
                    </span>
                    <ArrowRight
                      className="w-4 h-4"
                      style={{ color: "#6d74b5" }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-3">
            <div
              className="rounded-xl shadow-sm p-6"
              style={{ backgroundColor: "#ffffff" }}
            >
              {success ? (
                <div className="text-center py-10">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-5"
                    style={{ backgroundColor: "#6d74b5" }}
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2
                    className="text-2xl font-bold mb-3"
                    style={{ color: "#1c2942" }}
                  >
                    Message envoyé !
                  </h2>
                  <p className="mb-6 max-w-md mx-auto" style={{ color: "#6d74b5" }}>
                    Merci pour votre message. Notre équipe vous répondra dans
                    les plus brefs délais.
                  </p>
                  <Button
                    onClick={() => setSuccess(false)}
                    variant="secondary"
                    style={{ backgroundColor: "#ebf2fa", color: "#1c2942" }}
                  >
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2
                      className="text-xl font-bold mb-2"
                      style={{ color: "#1c2942" }}
                    >
                      Envoyez-nous un message
                    </h2>
                    <p className="text-sm" style={{ color: "#6d74b5" }}>
                      Remplissez le formulaire ci-dessous et nous vous
                      répondrons rapidement.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-5">
                      <Alert type="error" onClose={() => setError(null)}>
                        {error}
                      </Alert>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Type de demande */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-3"
                        style={{ color: "#1c2942" }}
                      >
                        Type de demande <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {requestTypes.map((type) => {
                          const Icon = type.icon;
                          const isSelected = selectedType === type.value;
                          return (
                            <label
                              key={type.value}
                              className="relative flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all"
                              style={{
                                borderColor: isSelected ? "#6d74b5" : "#ebf2fa",
                                backgroundColor: isSelected
                                  ? "#ebf2fa"
                                  : "#ffffff",
                              }}
                            >
                              <input
                                type="radio"
                                value={type.value}
                                {...register("type", { required: true })}
                                className="sr-only"
                              />
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-white mb-2"
                                style={{ backgroundColor: "#6d74b5" }}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <span
                                className="text-xs text-center font-medium"
                                style={{
                                  color: isSelected ? "#1c2942" : "#6d74b5",
                                }}
                              >
                                {type.label}
                              </span>
                              {isSelected && (
                                <div
                                  className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: "#6d74b5" }}
                                >
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: "#1c2942" }}
                        >
                          Nom complet <span className="text-red-500">*</span>
                        </label>
                        <Input
                          {...register("name", {
                            required: "Le nom est obligatoire",
                          })}
                          placeholder="Jean Dupont"
                          className="h-11 rounded-lg"
                          style={{
                            borderColor: errors.name ? "#ef4444" : "#ebf2fa",
                          }}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: "#1c2942" }}
                        >
                          Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="email"
                          {...register("email", {
                            required: "L'email est obligatoire",
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: "Email invalide",
                            },
                          })}
                          placeholder="jean@exemple.fr"
                          className="h-11 rounded-lg"
                          style={{
                            borderColor: errors.email ? "#ef4444" : "#ebf2fa",
                          }}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Champs optionnels pour partenariat */}
                    {(selectedType === "partenariat" ||
                      selectedType === "contact") && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "#1c2942" }}
                          >
                            Téléphone
                          </label>
                          <Input
                            {...register("phone")}
                            placeholder="06 12 34 56 78"
                            type="tel"
                            className="h-11 rounded-lg"
                            style={{ borderColor: "#ebf2fa" }}
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "#1c2942" }}
                          >
                            {selectedType === "partenariat"
                              ? "École / Entreprise"
                              : "Organisation"}
                          </label>
                          <Input
                            {...register("company")}
                            placeholder={
                              selectedType === "partenariat"
                                ? "Nom de votre école"
                                : "Nom de votre organisation"
                            }
                            className="h-11 rounded-lg"
                            style={{ borderColor: "#ebf2fa" }}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#1c2942" }}
                      >
                        Sujet <span className="text-red-500">*</span>
                      </label>
                      <Input
                        {...register("subject", {
                          required: "Le sujet est obligatoire",
                        })}
                        placeholder="Objet de votre message"
                        className="h-11 rounded-lg"
                        style={{
                          borderColor: errors.subject ? "#ef4444" : "#ebf2fa",
                        }}
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#1c2942" }}
                      >
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...register("message", {
                          required: "Le message est obligatoire",
                          minLength: {
                            value: 10,
                            message:
                              "Le message doit faire au moins 10 caractères",
                          },
                        })}
                        rows={4}
                        placeholder="Décrivez votre demande..."
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition resize-none"
                        style={{
                          borderWidth: "1px",
                          borderColor: errors.message ? "#ef4444" : "#ebf2fa",
                          color: "#1c2942",
                        }}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isLoading}
                      fullWidth
                      className="h-12 rounded-lg"
                      style={{ backgroundColor: "#6d74b5", color: "#ffffff" }}
                    >
                      <Send className="w-4 h-4" />
                      Envoyer le message
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
