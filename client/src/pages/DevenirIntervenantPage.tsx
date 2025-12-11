import { Link } from "react-router";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  UserCheck,
  Building2,
  Calendar,
  Euro,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Briefcase,
} from "lucide-react";

export default function DevenirIntervenantPage() {
  const advantages = [
    {
      icon: Building2,
      title: "Accès aux écoles",
      description:
        "Connectez-vous avec des établissements d'enseignement à la recherche d'experts.",
    },
    {
      icon: Calendar,
      title: "Flexibilité",
      description:
        "Choisissez vos missions et gérez votre emploi du temps comme vous le souhaitez.",
    },
    {
      icon: Euro,
      title: "Rémunération attractive",
      description:
        "Des tarifs compétitifs pour valoriser votre expertise et votre expérience.",
    },
    {
      icon: Users,
      title: "Communauté",
      description:
        "Rejoignez une communauté d'experts passionnés par la transmission du savoir.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Créez votre profil",
      description: "Inscrivez-vous et complétez votre profil avec vos compétences et expériences.",
    },
    {
      number: "2",
      title: "Validation",
      description: "Notre équipe valide votre profil pour garantir la qualité de nos intervenants.",
    },
    {
      number: "3",
      title: "Recevez des missions",
      description: "Les écoles vous contactent directement pour des opportunités d'intervention.",
    },
    {
      number: "4",
      title: "Intervenez",
      description: "Réalisez vos missions et partagez votre expertise avec les étudiants.",
    },
  ];

  return (
    <PageContainer maxWidth="6xl" className="py-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#272757] to-[#505081] rounded-3xl p-12 mb-12 text-white text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserCheck className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Devenez Intervenant</h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
          Partagez votre expertise avec les écoles et participez à la formation
          de la prochaine génération de professionnels.
        </p>
        <Link to="/register/intervenant">
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-[#272757] hover:bg-gray-100"
          >
            Créer mon compte intervenant
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Avantages */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Pourquoi rejoindre Vizion Academy ?
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
          En tant qu'intervenant, vous bénéficiez de nombreux avantages pour
          développer votre activité.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((advantage, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <advantage.icon className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {advantage.title}
              </h3>
              <p className="text-gray-600 text-sm">{advantage.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Comment ça marche */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Comment ça marche ?
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
          Un processus simple en 4 étapes pour commencer à intervenir.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="p-6 h-full">
                <div className="w-10 h-10 bg-[#272757] text-white rounded-full flex items-center justify-center font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Témoignages */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          Ce que disent nos intervenants
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Marie D.",
              role: "Experte Data Science",
              quote:
                "Vizion Academy m'a permis de diversifier mon activité tout en transmettant ma passion.",
            },
            {
              name: "Thomas L.",
              role: "Consultant IA",
              quote:
                "Une plateforme simple et efficace pour trouver des missions dans l'enseignement supérieur.",
            },
            {
              name: "Sophie M.",
              role: "Formatrice Digital",
              quote:
                "J'apprécie la flexibilité et la qualité des écoles partenaires de Vizion Academy.",
            },
          ].map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <Card className="p-12 text-center bg-gradient-to-r from-indigo-50 to-purple-50">
        <Briefcase className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Prêt à partager votre expertise ?
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Rejoignez notre communauté d'intervenants et commencez à recevoir des
          propositions de missions dès aujourd'hui.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register/intervenant">
            <Button variant="primary" size="lg">
              <CheckCircle className="w-5 h-5" />
              Créer mon compte
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg">
              Une question ? Contactez-nous
            </Button>
          </Link>
        </div>
      </Card>
    </PageContainer>
  );
}
