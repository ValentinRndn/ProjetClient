import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function Step8Summary({ formData }) {
  const SummarySection = ({ title, children }) => (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-0">
      <h3 className="text-xl font-bold text-indigo-violet mb-4">{title}</h3>
      {children}
    </div>
  );

  const SummaryItem = ({ label, value }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2">
      <div className="font-semibold text-gray-700">{label}</div>
      <div className="md:col-span-2 text-bleu-nuit">
        {value || <span className="text-gray-400 italic">Non renseigné</span>}
      </div>
    </div>
  );

  const SummaryList = ({ label, items }) => (
    <div className="py-2">
      <div className="font-semibold text-gray-700 mb-2">{label}</div>
      {items && items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-indigo-violet/10 text-indigo-violet rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-gray-400 italic">Aucun élément</span>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-bleu-nuit mb-2">
          Récapitulatif de votre profil
        </h2>
        <p className="text-gray-600">
          Vérifiez attentivement toutes les informations avant de valider votre profil.
        </p>
      </div>

      <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="flex-shrink-0 text-blue-600 mt-0.5" size={24} />
        <div className="text-sm text-bleu-nuit">
          <p className="font-bold mb-1">Assurez-vous que toutes les informations sont correctes</p>
          <p>
            Vous pourrez les modifier depuis votre dashboard après la validation, mais une
            vérification est nécessaire pour chaque changement important.
          </p>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-8">
        {/* Type de contractualisation */}
        <SummarySection title="1. Type de contractualisation">
          <SummaryItem
            label="Statut"
            value={
              formData.contractType === 'personne_physique'
                ? 'Personne Physique (Micro-entreprise)'
                : 'Entreprise (SAS, SARL, etc.)'
            }
          />
        </SummarySection>

        {/* Informations entreprise */}
        <SummarySection title="2. Informations entreprise">
          <SummaryItem label="Nom de la société" value={formData.companyName} />
          <SummaryItem label="Forme sociale" value={formData.legalForm} />
          <SummaryItem label="Capital social" value={formData.capital ? `${formData.capital} €` : null} />
          <SummaryItem label="SIRET" value={formData.siret} />
          <SummaryItem label="SIREN RCS" value={formData.siren} />
          <SummaryItem label="Ville RCS" value={formData.rcsCity} />
          <SummaryItem label="Adresse" value={formData.address} />
          <SummaryItem label="Exercice comptable" value={formData.fiscalYearStart} />
          <SummaryItem label="Email" value={formData.email} />
          <SummaryItem label="Téléphone" value={formData.phone} />
          <SummaryItem
            label="Contact"
            value={
              formData.contactFirstName && formData.contactLastName
                ? `${formData.contactFirstName} ${formData.contactLastName}`
                : null
            }
          />
        </SummarySection>

        {/* Zone géographique */}
        <SummarySection title="3. Zone géographique">
          <SummaryItem label="Ville principale" value={formData.mainCity} />
          <SummaryList label="Zones d'intervention" items={formData.interventionZones} />
          <SummaryList
            label="Modes d'intervention"
            items={formData.interventionModes?.map(mode =>
              mode === 'presentiel' ? 'Présentiel' : 'Distanciel'
            )}
          />
        </SummarySection>

        {/* Présentation */}
        <SummarySection title="4. Présentation">
          <div className="py-2">
            <div className="font-semibold text-gray-700 mb-2">Texte de présentation</div>
            <p className="text-bleu-nuit bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
              {formData.presentation || <span className="text-gray-400 italic">Non renseigné</span>}
            </p>
          </div>

          {formData.profilePhotoPreview && (
            <div className="py-2">
              <div className="font-semibold text-gray-700 mb-2">Photo de profil</div>
              <img
                src={formData.profilePhotoPreview}
                alt="Photo de profil"
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
              />
            </div>
          )}

          <SummaryItem label="Vidéo de présentation" value={formData.presentationVideo} />
        </SummarySection>

        {/* Compétences */}
        <SummarySection title="5. Compétences">
          <SummaryList label="Compétences principales" items={formData.skills} />
          <SummaryList label="Diplômes" items={formData.diplomas} />
          <SummaryList label="Expériences" items={formData.experiences} />
          <SummaryList label="Langues" items={formData.languages} />
          <SummaryList label="Logiciels" items={formData.software} />
        </SummarySection>

        {/* Modules et tarifs */}
        <SummarySection title="6. Modules et tarifs">
          <div className="py-2">
            <div className="font-semibold text-gray-700 mb-2">Disponibilités</div>
            <p className="text-bleu-nuit">
              {formData.availability || <span className="text-gray-400 italic">Non renseigné</span>}
            </p>
          </div>

          <SummaryList label="Écoles partenaires" items={formData.previousSchools} />
          <SummaryList
            label="Intérêts"
            items={formData.interests?.map(int => {
              const labels = {
                jurys: 'Jurys',
                modules_reguliers: 'Modules réguliers',
                conferences: 'Conférences',
                ateliers: 'Ateliers',
                challenges: 'Challenges',
                mentorat: 'Mentorat',
                bootcamps: 'Bootcamps',
                projets: 'Projets'
              };
              return labels[int] || int;
            })}
          />

          {formData.modules && formData.modules.length > 0 && (
            <div className="py-2">
              <div className="font-semibold text-gray-700 mb-3">Modules proposés</div>
              <div className="space-y-3">
                {formData.modules.map((module, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="font-semibold text-bleu-nuit">{module.title}</div>
                    <p className="text-sm text-gray-600 mt-1">{module.summary}</p>
                    <p className="text-sm text-indigo-violet mt-2">
                      Évaluation : {module.evaluationType === 'individual' ? 'Individuelle' : 'Collective'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <SummaryItem label="LinkedIn" value={formData.linkedinUrl} />
          <SummaryItem
            label="CV"
            value={formData.cvFile ? formData.cvFile.name || 'Fichier uploadé' : null}
          />
        </SummarySection>

        {/* TVA et Facturation */}
        <SummarySection title="7. TVA et Facturation">
          <SummaryItem
            label="Assujetti à la TVA"
            value={
              formData.vatSubject === 'oui'
                ? 'Oui'
                : formData.vatSubject === 'non'
                ? 'Non'
                : formData.vatSubject === 'franchise'
                ? 'Franchise en base'
                : null
            }
          />
          <SummaryItem
            label="Délai de paiement"
            value={formData.paymentDelay ? `${formData.paymentDelay} jours` : null}
          />
          <SummaryItem
            label="Taux de pénalité"
            value={formData.penaltyRate ? `${formData.penaltyRate}%` : null}
          />
        </SummarySection>
      </div>

      {/* Call to action */}
      <div className="bg-gradient-to-r from-indigo-violet to-bleu-nuit rounded-xl p-8 text-center text-white">
        <CheckCircle className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-3">Félicitations ! Votre profil est complet</h3>
        <p className="text-lg opacity-90 mb-6">
          Cliquez sur "Valider et créer mon profil" pour finaliser votre inscription.
        </p>
        <p className="text-sm opacity-75">
          Une fois validé, votre profil sera examiné par notre équipe sous 48h.
        </p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
        <p className="text-sm text-bleu-nuit">
          <strong>🔒 Confidentialité :</strong> Vos données sont sécurisées et ne seront
          accessibles qu'aux établissements partenaires vérifiés de Vizion Academy.
        </p>
      </div>
    </div>
  );
}
