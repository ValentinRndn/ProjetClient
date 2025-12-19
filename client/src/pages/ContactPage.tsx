import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { SEO } from "@/components/shared/SEO";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { submitContactForm } from "@/services/contact";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
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
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      await submitContactForm({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        type: "contact",
        subject: "Message depuis le formulaire de contact",
        message: data.message,
      });

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

  const teamMembers = [
    {
      initials: "MN",
      name: "Mickael NOGUEIRA",
      role: "Gestion des intervenants",
      phone: "06 84 88 96 94",
      color: "bg-[#1c2942]",
    },
    {
      initials: "GR",
      name: "Guillaume ROURE",
      role: "Gestion des écoles et planification des challenges",
      phone: "06 59 19 65 50",
      color: "bg-[#6d74b5]",
    },
    {
      initials: "NM",
      name: "Narjesse MALKI",
      role: "Facturation et gestion administrative",
      phone: "06 50 71 77 42",
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#ebf2fa]">
      <SEO
        title="Contact"
        description="Contactez Vizion Academy pour vos besoins en intervenants ou challenges. Notre équipe vous répond sous 24h."
        keywords="contact vizion academy, demande intervenant, devis challenge"
        canonical="https://www.vizionacademy.fr/contact"
      />

      {/* Header */}
      <div className="bg-[#1c2942] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#6d74b5] rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Contactez-nous</h1>
              <p className="text-white/70">Notre équipe est à votre écoute</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Formulaire */}
          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#6d74b5] rounded-xl flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#1c2942] mb-3">
                  Message envoyé !
                </h2>
                <p className="text-[#1c2942]/70 mb-6 max-w-md mx-auto">
                  Merci pour votre message. Notre équipe vous répondra dans les
                  plus brefs délais.
                </p>
                <Button
                  onClick={() => setSuccess(false)}
                  variant="secondary"
                  className="bg-[#ebf2fa] text-[#1c2942]"
                >
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-[#1c2942] mb-6">
                  Envoyez-nous un message
                </h2>

                {error && (
                  <div className="mb-5">
                    <Alert type="error" onClose={() => setError(null)}>
                      {error}
                    </Alert>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1c2942] mb-2">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <Input
                        {...register("firstName", {
                          required: "Le prénom est obligatoire",
                        })}
                        placeholder="Jean"
                        className="h-11 rounded-lg"
                        style={{
                          borderColor: errors.firstName ? "#ef4444" : "#ebf2fa",
                        }}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1c2942] mb-2">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <Input
                        {...register("lastName", {
                          required: "Le nom est obligatoire",
                        })}
                        placeholder="Dupont"
                        className="h-11 rounded-lg"
                        style={{
                          borderColor: errors.lastName ? "#ef4444" : "#ebf2fa",
                        }}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1c2942] mb-2">
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
                    <div>
                      <label className="block text-sm font-medium text-[#1c2942] mb-2">
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1c2942] mb-2">
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
                      rows={5}
                      placeholder="Décrivez votre demande..."
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#6d74b5] transition resize-none"
                      style={{
                        borderColor: errors.message ? "#ef4444" : "#ebf2fa",
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
                    className="h-12 rounded-lg bg-[#6d74b5] hover:bg-[#5a61a0]"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer le message
                  </Button>
                </form>
              </>
            )}
          </div>

          {/* Informations de contact */}
          <div className="space-y-6">
            {/* Coordonnées */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-[#1c2942] mb-6">
                Nos coordonnées
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[#6d74b5] rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1c2942] mb-1">
                      Adresse
                    </h3>
                    <p className="text-[#1c2942]/70">
                      H7, 70 quai Perrache,
                      <br />
                      69002 Lyon, France
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[#6d74b5] rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1c2942] mb-1">Email</h3>
                    <a
                      href="mailto:secretariat@vizionacademy.fr"
                      className="text-[#6d74b5] hover:underline"
                    >
                      secretariat@vizionacademy.fr
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[#6d74b5] rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1c2942] mb-1">
                      Téléphone
                    </h3>
                    <a
                      href="tel:+33659196550"
                      className="text-[#6d74b5] hover:underline"
                    >
                      +33 6 59 19 65 50
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Équipe */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-[#1c2942] mb-6">
                Notre équipe à votre service
              </h2>

              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-[#ebf2fa] rounded-xl"
                  >
                    <div
                      className={`w-12 h-12 ${member.color} rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0`}
                    >
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1c2942]">{member.name}</h3>
                      <p className="text-sm text-[#1c2942]/60">{member.role}</p>
                    </div>
                    <a
                      href={`tel:${member.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-2 text-[#6d74b5] hover:text-[#1c2942] font-medium transition-colors shrink-0"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="hidden sm:inline">{member.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
