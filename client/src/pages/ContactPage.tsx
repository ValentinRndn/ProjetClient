import { useState } from "react";
import { useForm } from "react-hook-form";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Clock, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface ContactFormData {
  name: string;
  email: string;
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
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simuler l'envoi (à remplacer par un vrai appel API si nécessaire)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Contact form submitted:", data);
      setSuccess(true);
      reset();
    } catch (err) {
      setError("Erreur lors de l'envoi du message. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      value: "secretariat@vizionacademy.fr",
      href: "mailto:secretariat@vizionacademy.fr",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Téléphone",
      value: "06 59 19 65 50",
      href: "tel:0659196550",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Adresse",
      value: "Paris, France",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Réponse",
      value: "Sous 24-48h",
      color: "from-blue-500 to-cyan-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-mesh text-white py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-5 py-2.5 mb-6 border border-white/20">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Parlons de votre projet</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Contactez-nous
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100/90 max-w-2xl mx-auto">
              Une question ? Un projet ? Notre équipe est à votre écoute
              et vous répondra dans les plus brefs délais.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      <PageContainer maxWidth="6xl" className="py-12 -mt-8 relative z-10">
        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                {info.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{info.title}</h3>
              {info.href ? (
                <a
                  href={info.href}
                  className="text-gray-900 font-semibold hover:text-indigo-600 transition-colors"
                >
                  {info.value}
                </a>
              ) : (
                <p className="text-gray-900 font-semibold">{info.value}</p>
              )}
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Besoin d'aide ?</h2>
              <p className="text-indigo-100 mb-6">
                Notre équipe est disponible pour répondre à toutes vos questions
                concernant notre plateforme et nos services.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Réponse garantie sous 48h</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Support personnalisé</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Accompagnement dédié</span>
                </div>
              </div>
            </div>

            <Card variant="outlined" className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">FAQ Rapide</h3>
              <div className="space-y-3">
                {[
                  "Comment devenir intervenant ?",
                  "Comment inscrire mon école ?",
                  "Quels sont les tarifs ?",
                ].map((question, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 group transition-colors"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-indigo-700">{question}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <Card variant="elevated" className="p-8">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Message envoyé !
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Merci pour votre message. Notre équipe vous répondra dans les plus
                    brefs délais.
                  </p>
                  <Button onClick={() => setSuccess(false)} variant="secondary">
                    Envoyer un autre message
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Envoyez-nous un message
                    </h2>
                    <p className="text-gray-600">
                      Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-6">
                      <Alert type="error" onClose={() => setError(null)}>
                        {error}
                      </Alert>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet <span className="text-red-500">*</span>
                        </label>
                        <Input
                          {...register("name", {
                            required: "Le nom est obligatoire",
                          })}
                          placeholder="Jean Dupont"
                          className={errors.name ? "border-red-500 focus:ring-red-500" : ""}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1.5">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          className={errors.email ? "border-red-500 focus:ring-red-500" : ""}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1.5">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sujet <span className="text-red-500">*</span>
                      </label>
                      <Input
                        {...register("subject", {
                          required: "Le sujet est obligatoire",
                        })}
                        placeholder="Objet de votre message"
                        className={errors.subject ? "border-red-500 focus:ring-red-500" : ""}
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1.5">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...register("message", {
                          required: "Le message est obligatoire",
                          minLength: {
                            value: 10,
                            message: "Le message doit faire au moins 10 caractères",
                          },
                        })}
                        rows={5}
                        placeholder="Décrivez votre demande..."
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none ${
                          errors.message ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1.5">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="gradient"
                      size="lg"
                      isLoading={isLoading}
                      fullWidth
                    >
                      <Send className="w-4 h-4" />
                      Envoyer le message
                    </Button>
                  </form>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </PageContainer>
    </div>
  );
}
