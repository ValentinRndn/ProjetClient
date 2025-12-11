import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";

export default function CGUPage() {
  return (
    <PageContainer maxWidth="4xl" className="py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
        Conditions Générales d'Utilisation
        <br />
        <span className="text-xl font-normal text-gray-600">
          & Politique de Confidentialité
        </span>
      </h1>

      <Card className="p-8 space-y-8">
        {/* CGU */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Conditions Générales d'Utilisation
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                1. Objet
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Les présentes conditions générales d'utilisation (CGU) ont pour
                objet de définir les modalités d'accès et d'utilisation de la
                plateforme Vizion Academy, qui met en relation des intervenants
                professionnels avec des établissements d'enseignement.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                2. Accès à la plateforme
              </h3>
              <p className="text-gray-600 leading-relaxed">
                L'accès à la plateforme est ouvert à tout utilisateur disposant
                d'un accès à Internet. Certaines fonctionnalités nécessitent la
                création d'un compte utilisateur.
                <br />
                <br />
                L'utilisateur s'engage à fournir des informations exactes et à
                jour lors de son inscription.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                3. Services proposés
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Vizion Academy propose les services suivants :
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li>
                  Mise en relation entre intervenants et établissements
                  d'enseignement
                </li>
                <li>Gestion des profils intervenants</li>
                <li>Publication et gestion des missions</li>
                <li>Suivi des interventions</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                4. Responsabilités
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Vizion Academy agit en tant qu'intermédiaire et ne peut être
                tenu responsable des relations contractuelles entre les
                intervenants et les établissements.
                <br />
                <br />
                Les utilisateurs sont seuls responsables des contenus qu'ils
                publient sur la plateforme.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                5. Propriété intellectuelle
              </h3>
              <p className="text-gray-600 leading-relaxed">
                L'ensemble des éléments de la plateforme (textes, images, logos,
                etc.) sont la propriété exclusive de Vizion Academy et sont
                protégés par les lois relatives à la propriété intellectuelle.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* Politique de confidentialité */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Politique de Confidentialité
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                1. Collecte des données
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Nous collectons les données personnelles suivantes :
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li>Informations d'identification (nom, prénom, email)</li>
                <li>Informations professionnelles (CV, expériences, SIRET)</li>
                <li>Données de connexion et de navigation</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                2. Utilisation des données
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Vos données sont utilisées pour :
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li>Gérer votre compte utilisateur</li>
                <li>Faciliter la mise en relation entre utilisateurs</li>
                <li>Améliorer nos services</li>
                <li>Vous contacter si nécessaire</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                3. Conservation des données
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Vos données personnelles sont conservées pendant la durée de
                votre utilisation de la plateforme, puis archivées conformément
                aux obligations légales.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                4. Partage des données
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Vos données ne sont jamais vendues à des tiers. Elles peuvent
                être partagées avec :
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li>
                  Les autres utilisateurs de la plateforme dans le cadre des
                  mises en relation
                </li>
                <li>Nos prestataires techniques (hébergement, analytics)</li>
                <li>Les autorités compétentes si la loi l'exige</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                5. Vos droits
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement</li>
                <li>Droit à la portabilité</li>
                <li>Droit d'opposition</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Pour exercer ces droits, contactez-nous à :{" "}
                <a
                  href="mailto:secretariat@vizionacademy.fr"
                  className="text-indigo-600 hover:underline"
                >
                  secretariat@vizionacademy.fr
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                6. Sécurité
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Nous mettons en œuvre des mesures de sécurité appropriées pour
                protéger vos données contre tout accès non autorisé,
                modification, divulgation ou destruction.
              </p>
            </div>
          </div>
        </section>

        <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          Dernière mise à jour : Décembre 2025
        </div>
      </Card>
    </PageContainer>
  );
}
