import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { SEO } from "@/components/shared/SEO";

export default function MentionsLegalesPage() {
  return (
    <PageContainer maxWidth="4xl" className="py-12">
      <SEO
        title="Mentions Légales"
        description="Mentions légales de Vizion Academy. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation du site."
        canonical="https://www.vizionacademy.fr/mentions-legales"
      />
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
        Mentions Légales
      </h1>

      <Card className="p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Éditeur du site
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Le site Vizion Academy est édité par :<br />
            <br />
            <strong>Vizion Academy</strong>
            <br />
            Siège social : Paris, France
            <br />
            Email : secretariat@vizionacademy.fr
            <br />
            Téléphone : 06 59 19 65 50
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Directeur de la publication
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Le directeur de la publication est le représentant légal de Vizion
            Academy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Hébergement
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Le site est hébergé par :<br />
            <br />
            <strong>OVH SAS</strong>
            <br />
            2 rue Kellermann - 59100 Roubaix - France
            <br />
            RCS Lille Métropole 424 761 419 00045
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Propriété intellectuelle
          </h2>
          <p className="text-gray-600 leading-relaxed">
            L'ensemble des contenus présents sur le site Vizion Academy
            (textes, images, vidéos, logos, etc.) sont protégés par le droit de
            la propriété intellectuelle. Toute reproduction, représentation,
            modification, publication, transmission, ou dénaturation, totale ou
            partielle du site ou de son contenu, par quelque procédé que ce
            soit, et sur quelque support que ce soit est interdite sans
            autorisation préalable écrite de Vizion Academy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. Données personnelles
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Conformément au Règlement Général sur la Protection des Données
            (RGPD) et à la loi Informatique et Libertés, vous disposez d'un
            droit d'accès, de rectification, de suppression et d'opposition aux
            données personnelles vous concernant.
            <br />
            <br />
            Pour exercer ces droits, vous pouvez nous contacter à l'adresse
            suivante : secretariat@vizionacademy.fr
            <br />
            <br />
            Pour plus d'informations sur le traitement de vos données
            personnelles, consultez notre{" "}
            <a href="/cgu" className="text-indigo-600 hover:underline">
              Politique de confidentialité
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Cookies
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Le site Vizion Academy utilise des cookies pour améliorer
            l'expérience utilisateur et analyser le trafic. Vous pouvez
            configurer votre navigateur pour refuser les cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Limitation de responsabilité
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Vizion Academy s'efforce de fournir des informations exactes et à
            jour. Toutefois, nous ne pouvons garantir l'exactitude, la
            complétude ou l'actualité des informations diffusées sur ce site.
            <br />
            <br />
            En conséquence, l'utilisateur reconnaît utiliser ces informations
            sous sa responsabilité exclusive.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Droit applicable
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Les présentes mentions légales sont régies par le droit français.
            En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </section>

        <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          Dernière mise à jour : Décembre 2025
        </div>
      </Card>
    </PageContainer>
  );
}
