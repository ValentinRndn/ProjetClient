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

// Conditions du contrat (étape 2)
const CONTRACT_TERMS = [
  {
    title: "Statut d'auto-entrepreneur ou société",
    description:
      "Vous devez disposer d'un statut juridique valide (auto-entrepreneur, EURL, SASU, etc.) pour exercer en tant qu'intervenant.",
  },
  {
    title: "Responsabilité civile professionnelle",
    description:
      "Une assurance RC Pro ou une attestation de couverture est obligatoire pour couvrir votre activité d'intervention en établissement.",
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
    title: "Validation du profil",
    description:
      "Votre profil sera validé par notre équipe après vérification de vos documents. Ce processus peut prendre 24 à 48h ouvrées.",
  },
];

// CGV - Contrat de prestation de service complet (étape 3)
const CGV_CONTRACT = `CONTRAT DE PRESTATION DE SERVICE

ENTRE

La société VIZION, société par actions simplifiée au capital de 1.000 euros, dont le siège social est 1 Impasse des Garennes à RILLIEUX LA PAPE (69140) immatriculée au Registre du Commerce et des Sociétés de Lyon sous le numéro 984 832 311, représentée par son Président, Monsieur Guillaume ROURE,

Ci-après la Société ;

ET

Le Prestataire de formation, dont les informations sont renseignées lors de l'inscription sur la plateforme,

Ci-après le « Prestataire de formation » ou le « Prestataire »

Ci-après désignées ensemble les « Parties » et individuellement une « Partie ».

PREAMBULE

Le Prestataire de formation a pour activité l'enseignement et la formation dans un domaine de compétences particulier, auprès d'organismes de formation, d'entreprises ou d'entités publiques ou privées.

La Société souhaite faire appel aux services du Prestataire pour assurer, pour son compte, des prestations d'enseignement et/ou de formation qui lui ont été confiées par un client (ci-après le Client) au titre d'un contrat principal.

Le Prestataire souhaite bénéficier de l'assistance de la Société pour sa gestion administrative.

Dans ces conditions, les Parties se sont rapprochées et ont conclu le présent contrat de prestations de service (ci-après dénommé le « Contrat »).

OBJET

Le présent Contrat définit les conditions dans lesquelles :
- le Prestataire de formation exécute, pour le compte de la Société et au bénéfice du Client, des prestations d'enseignement et de formation telles que définies au sein du présent Contrat (ci-après les Prestations).
- La Société assiste le Prestataire pour sa gestion administrative.
- Le Prestataire confie à la Société un Mandat de facturation dans le cadre des Prestations.

DOCUMENTS CONTRACTUELS

Les documents contractuels sont, par ordre de priorité décroissante :
- Le Bon de commande
- Le présent Contrat
- Les Annexes

Ensemble « le Contrat ».

Le présent Contrat prévaut sur toutes conditions d'achat ou autres documents échangés entre les Parties, sauf dérogation expresse. Les documents échangés en phase précontractuelle (courriels, publicités ou télécopies, ...) ne sont pas opposables aux Parties.

En cas de contradiction entre un ou plusieurs des documents susvisés, le document de rang supérieur et la version la plus récente prévaudront.

DUREE

Sauf mention expresse contraire, les présentes entrent en vigueur à compter de leur signature par les Parties pour une durée initiale de douze (12) mois.

Au terme de sa durée initiale, le contrat fera automatiquement l'objet d'une tacite reconduction pour une durée indéterminée sauf résiliation par l'une des Parties par lettre recommandée avec avis de réception adressée à l'autre Partie au plus tard trois (3) mois avant son terme.

Chaque Prestation spécifique de formation fera l'objet d'un bon de commande mentionnant la durée et les dates de l'intervention.

PERIMETRE D'EXECUTION DES PRESTATIONS

Le périmètre des Prestations, les modalités pratiques et pédagogiques dont celles liées aux supports sont définies par le Client. Ces informations notamment le thème de la formation, le nombre d'apprenant et leur profil, les heures, dates et lieux des différentes sessions seront détaillées par le Prestataire au sein du Bon de commande.

Toutes les informations sont transmises au Prestataire en amont de son intervention de façon à lui permettre de préparer les Prestations. Elles sont mises à sa disposition au sein de l'interface dédiée sur la Plateforme (le Dashboard) conformément aux CGU annexées aux présentes.

CONDITIONS DE REPORT ET D'ANNULATION

D'un commun accord entre les Parties, les Prestations pourront être reportées à une date ultérieure. Lorsque le Prestataire n'est pas en mesure de respecter une date de Prestations, elle s'engage à prévenir la Société dix (10) jours ouvrés avant la date initialement prévue. Dans ce cas, les Parties conviennent d'une autre date.

Dans le cas où le Prestataire se trouve dans l'obligation d'annuler une Prestation pour des raisons extérieures à la Société et en dehors des cas prévus à l'article Force Majeure ou au report d'une formation, la Société se réserve le droit de réattribuer les Prestations à un autre prestataire/formateur.

En cas de plus de deux (2) reports successifs effectués à la demande du Prestataire, la Société pourra annuler la ou les Prestation(s) à venir pour la formation concernée. De même, en cas d'absence injustifiée et/ou répétée du Prestataire à une session de formation et qui n'aura pas été notifiée à la Société dans le délai indiqué ci-dessus, la Société pourra annuler la ou les Prestation(s) de formation à venir pour la formation concernée.

En cas d'annulation injustifiée, par le Prestataire moins de deux (2) jours avant la date des Prestations, la Société se réserve la possibilité d'appliquer, de plein droit des pénalités de retard à hauteur de 30% de la rémunération convenue pour les Prestations concernées.

Le versement des pénalités n'exonère pas le Prestataire de l'exécution de ses obligations contractuelles. L'application des pénalités est indépendante des autres mesures auxquelles peut donner lieu l'application du Contrat, notamment sa résiliation. Sans préjudice de toute autre méthode de recouvrement, la Société pourra déduire le montant des pénalités de retard de toutes les sommes dues ou à devoir au Prestataire.

ASSISTANCE A LA GESTION ADMINISTRATIVE

Le Prestataire confie à la Société, qui l'accepte, de réaliser à son bénéfice une mission d'assistance en matière administrative portant sur l'accomplissement de toutes les formalités administratives liées aux Prestations à savoir :
- la transmission de pièces administratives et de documents justificatifs au(x) Client(s)

Dans ce cadre, le Prestataire donne pouvoir à la Société de le représenter pour accomplir tous les actes d'administration et conservatoires relevant de l'exécution des missions confiées, et ainsi d'effectuer en son nom les actes de toutes natures relatifs à leur exécution. Les pouvoirs conférés à la Société sont strictement ceux définis expressément au présent Contrat, excluant ainsi les actes de disposition.

A cette fin le Prestataire confie à la Société une délégation de gestion aux termes duquel elle est chargée des démarches nécessaires.

La délégation de gestion comprend les opérations suivantes :
- ouverture des comptes au nom du Prestataire
- gestion des mots de passe
- Téléchargement des pièces nécessaires telles que transmises par le Prestataire

La Société met à disposition du Prestataire une interface de gestion (le Dashboard) lui permettant de télécharger ces documents et de déposer les pièces justificatives nécessaires à l'exécution du Contrat.

Il est rappelé que la Société agit ici dans un cadre d'assistance technique et administrative uniquement et n'exerce aucun contrôle ou n'effectue aucune vérification quant à la teneur ou la validité des pièces transmises.

OBLIGATIONS DES PARTIES

Obligations communes des Parties

Les Parties s'engagent à exécuter leurs obligations contractuelles en toute bonne foi avec toutes les diligences requises.

Compte tenu de leur intérêt réciproque dans l'exécution du Contrat, les Parties conviennent qu'une collaboration étroite, sincère et permanente doit s'instaurer pendant toute la durée du Contrat. Elles s'engagent en particulier, à se transmettre mutuellement toutes les informations utiles permettant d'assurer la bonne exécution des Prestations.

Les Parties définiront ensemble le planning des Prestations au regard des besoins exprimés par le Client.

Obligations du Prestataire de formation

Le Prestataire exécutera les Prestations en toute indépendance. Il n'agit ni en qualité de préposé, de mandataire ou encore de représentant de la Société.

Il s'engage à délivrer des Prestations de qualité, conformes aux règles de l'art et dans les standards attendus en matière de formation. Il définit, sous sa responsabilité, les ressources, outils, méthodes et moyens d'exécution nécessaires à la réalisation des Prestations.

Sans préjudice de son indépendance, le Prestataire s'engage à réaliser les Prestations dans le respect du référentiel, programme, cahier des charges ou tout autre document préalablement communiqué par la Société et/ou le Client.

Dans le cadre des Prestations, il s'engage à :
- Fournir, à première demande, les documents et pièces justificatives de son activité ;
- Justifier et maintenir ses certifications professionnelles, lorsque celles-ci sont une condition inhérente à la délivrance des Prestations ;
- Informer la Société de l'exécution des Prestations et la tenir informée de toute difficulté de nature à impacter celle-ci.

Le Prestataire respecte et fait respecter les obligations et règles de sécurité communiquées par le Client dès lors que les Prestations sont exécutées en tout ou partie dans ses locaux.

Il est rappelé que le Prestataire est tenu de se conformer à toute disposition légale ou réglementaire qui lui est applicable.

Le Prestataire s'engage à s'interdire tout comportement susceptible de nuire aux intérêts de la Société.

Il est tenu au respect et à la correction vis-à-vis des apprenants, outre le respect des bonnes mœurs et de la liberté d'expression. Une tenue correcte est attendue tant au plan vestimentaire que comportemental ou du langage. La Société se réserve le droit de résilier le présent Contrat en cas de non-respect de ces obligations dans la mesure où le comportement du Prestataire porte atteinte à son image ou compromettent la bonne exécution des Prestations.

Obligations de la Société

La Société s'engage à fournir au Prestataire de formation toutes les informations nécessaires à l'exécution des Prestations transmises par son Client dans les délais utiles. Elle s'engage à communiquer dans la mesure du possible au Prestataire qui lui en ferait la demande écrite, tous les documents, procédures internes, méthodes de travail, renseignements et informations qu'elle pourrait détenir, pour permettre au Prestataire d'adapter éventuellement les Prestations attendues de lui, et à ce titre, lever dès qu'il en aura connaissance toutes ambigüités, imprécisions ou difficultés.

Dans ce cadre, elle met à disposition du Prestataire une interface de gestion lui permettant de télécharger ces documents et de déposer les pièces justificatives nécessaires à l'exécution du Contrat.

Il est rappelé que la Société est chargée de la gestion administrative et de la facturation des Prestations dans les conditions des mandats consentis au présent Contrat.

INDEPENDANCE DES PARTIES

Les Parties déclarent et reconnaissent expressément qu'elles sont et demeureront, pendant toute la durée du Contrat, des partenaires commerciaux et professionnels indépendants, le présent Contrat ne créant aucun lien de subordination entre elles. Cette condition est essentielle, sans laquelle les Parties n'auraient pas conclu le Contrat.

Le Prestataire agit en tant qu'entreprise indépendante, en son nom et sous sa seule responsabilité dans ses rapports avec les apprenants, les Organismes dans le cadre des Prestations qu'il pourrait réaliser avec ces derniers.

PRIX ET PAIEMENT DU PRIX

Prix

En contrepartie de l'exécution du Contrat, la Société percevra une commission hors taxe de vingt pour cent (20%) du montant hors taxes facturé à le Client.

Ce prix couvre la rémunération de la mise en relation et les diligences mises en œuvre par la Société au titre du mandat de gestion administrative et du mandat de facturation.

Il est rappelé que la commission est due pendant toute la durée du présent Contrat dès le paiement effectif des sommes par le Client.

Il est précisé qu'en cas de Prestations à exécution successive, la commission susvisée est applicable sur chaque paiement de le Client.

Le prix sera soumis à la TVA au taux en vigueur au jour de la facturation.

Modalités de facturation

La facturation sera assurée par la Société dans le cadre du mandat de facturation consenti par le Prestataire.

Seules les Prestations dûment effectuées seront facturées. En cas d'annulation injustifiée d'une Prestation de formation moins de deux (2) jours ouvrés avant la date prévue, la Société se réserve le droit d'appliquer, de plein droit des pénalités de retard à hauteur de 30% de la rémunération convenue pour les Prestations concernées.

Modalités de paiement

La commission susvisée sera automatiquement déduite par la Société des sommes dues au Prestataire au titre des Prestations réalisées par celui-ci.

Le Prestataire reconnait ainsi qu'il ne pourra percevoir aucun paiement directement du Client et autorise en tant que de besoin expressément la Société à prélever la commission susvisée.

CONFORMITE FISCALE

Chaque Partie déclare respecter l'ensemble de ses obligations fiscales et sociales, notamment celles relatives à la déclaration et au paiement des impôts, taxes et cotisations dont elle est redevable.

La Société n'étant pas opérateur de plateforme au sens de l'article 242 bis et des articles 1649 ter A et suivants du Code général des impôts, aucune transmission systématique de données à l'administration fiscale au titre de ces dispositions n'est requise.

Chacune des Parties s'engage toutefois à fournir à l'autre, sur simple demande, les pièces justificatives attestant de l'accomplissement de ses propres obligations déclaratives.

RESPONSABILITE

Le Prestataire agit de manière indépendante et est seul responsable de la bonne exécution des Prestations. A ce titre il déclare posséder les compétences nécessaires à l'exécution du présent Contrat.

Il assume les risques liés aux Prestations et déclare avoir contracté une assurance permettant de couvrir sa responsabilité et les éventuels dommages subis par la Société et/ou par le Client.

Tout litige entre un Prestataire et un Client du fait des Prestations devra être réglé entre ces parties. La responsabilité de la Société ne saurait être engagée à ce titre.

Le Prestataire s'interdit tout comportement susceptible de porter atteinte de quelque manière que ce soit, directement ou indirectement, à la réputation, à l'honneur ou à l'image de marque de la Société, à sa dénomination sociale, son nom commercial ou son logo ou sa marque ou ses associés.

Les Parties sont responsables, dans les conditions de droit commun, des manquements contractuels qui pourraient leur être reprochés. Sous réserve des dispositions impératives applicables, la responsabilité de la Société est limitée aux dommages directs matériels et prévisibles subis par le Prestataire de formation à l'exclusion de tout préjudice indirect que celui-ci soit matériel ou immatériel.

Par ailleurs et en tout état de cause, en cas de faute prouvée de la Société ayant entrainé un préjudice pour le Prestataire de formation, la Société ne pourra voir sa responsabilité engagée qu'à hauteur des sommes effectivement perçues annuellement par celui-ci au titre de la dernière année d'exécution du Contrat.

NON CONCURRENCE

A titre de condition essentielle et déterminante de la conclusion du Contrat le Prestataire de formation s'engage expressément, pendant toute la durée du contrat, en ce compris ses éventuels renouvellements, et pendant une durée de dix-huit (18) mois après son terme, pour quelque raison que ce soit, à ne pas contracter directement et/ou indirectement avec l'un des Organismes pour lesquels il aura réalisé des Prestations dans le cadre de l'exécution du présent Contrat.

A défaut de respect de la présente clause, le Prestataire de formation s'engage expressément à verser à la Société la somme de vingt mille euros (20.000 €uros), à titre de clause pénale, ledit paiement n'étant pas extinctif du droit pour la Société d'agir en justice aux fins d'obtenir l'indemnisation de l'ensemble de ses préjudices, directs et/ou indirects.

Au cas où une interprétation de la clause s'avèrerait nécessaire, notamment pour apprécier sa finalité, celle-ci devrait être établie par référence à l'objet du contrat tel que convenu par les parties.

En outre, en cas de violation de la présente clause, la Société sera en droit de résilier le Contrat aux torts du Prestataire de formation, dans les conditions prévues à l'article Résiliation des présentes.

DEPENDANCE ECONOMIQUE

Il est rappelé à toute fins utiles que la Société demeure parfaitement libre de contracter en toute matière avec d'autres Prestataires.

Le Prestataire est un professionnel indépendant, il s'engage à diversifier ses parts de marché auprès d'autres clients afin que la proportion du chiffre d'affaires qu'il réalise avec la Société ne représente qu'une part raisonnable de son chiffre d'affaires total.

Il est tenu d'informer immédiatement la Société de tout risque de dépendance économique, considéré comme important si l'ensemble du chiffre d'affaires provenant de la Société en une année venait à représenter plus de trente pour cent (30%) du chiffre d'affaires du Prestataire. Dans cette hypothèse, les Parties se rencontreront pour étudier ensemble d'éventuelles mesures d'aménagement. Dans tous les cas, et notamment en cas d'absence de déclaration du Prestataire ou de fin anticipée ou non des relations commerciales entre les Parties, la responsabilité de la Société ne pourra être engagée, à quelque titre que ce soit, sur le fondement de la dépendance économique.

SUSPENSION RESILIATION

Suspension

Aux termes de l'article 1219 du Code civil, chaque Partie peut suspendre l'exécution de ses obligations lorsqu'il est manifeste que l'autre Partie n'exécutera pas ses propres obligations dans les délais prévus au Contrat et que les conséquences de cette inexécution portent un préjudice suffisamment grave à la Partie lésée.

Toute suspension doit faire l'objet d'un préavis raisonnable et être notifiée dans les meilleurs délais, par lettre recommandée avec accusé de réception.

Résiliation pour manquement à une obligation essentielle

En cas de manquement à l'une quelconque de ses obligations essentielles par le Prestataire au titre des présentes, la Société pourra après notification d'une mise en demeure envoyée sur l'adresse e-mail communiquée par le Prestataire et restée sans effet pendant une durée de trente (30) jours ouvrés, résilier le contrat et suspendre définitivement l'accès aux Services, sans que le Prestataire ne puisse prétendre à une quelconque indemnité.

Au sens des présentes, sont considérées comme des obligations essentielles :
- Le non-respect de ses obligations de non-concurrence par le Prestataire
- Tout manquement, par le Prestataire, à ses obligations en qualité de formateur

Conséquences de la résiliation

Chacune des Parties restituera à l'autre l'ensemble des éléments lui appartenant encore en sa possession que cette dernière aura pu lui fournir pour l'exécution du Contrat et qui seront devenues sans objet du fait de la résiliation.

Les dispositions des articles « Propriété Intellectuelle », « Non-Concurrence », « Responsabilité » et « Confidentialité » des présentes poursuivront leurs effets malgré la cessation des relations contractuelles pour quelque cause que ce soit et pour la durée indiquée dans leur contenu.

La résolution des présentes emporte la résiliation du mandat de gestion administrative et de facturation confié par le Prestataire à la Société.

PROPRIETE INTELLECTUELLE

Chacune des Parties conserve la propriété des éléments préexistants confiés à l'autre Partie dans le cadre de l'exécution des présentes. A ce titre, chaque Partie s'engage à ne pas porter atteinte aux droits de l'autre Partie et à faire prendre le même engagement par ses salariés et sous-traitants.

Le Prestataire s'engage à ne pas porter atteinte aux droits de propriété attachés à des éléments du Client qui lui seraient remis pour le besoin de l'exécution des Prestations.

Pour les besoins de l'exécution des Prestations et la mise en œuvre des Services le Prestataire concède à la Société, à titre non-exclusif et gratuit, un droit d'utilisation et de reproduction de ses signes distinctifs qui pourront être reproduits et représentés sur la Plateforme et/ou les documents commerciaux produits dans le cadre du mandat de gestion administrative.

En contrepartie des sommes versées par la Société, le Prestataire cède à la Société, à titre exclusif, au fur et à mesure de leur réalisation :
- la propriété pleine et entière des réalisations exécutées dans le cadre des Prestations, telles que les évolutions et mises à jour des supports de formation, les logiciels, les rapports, les analyses (ci-après dénommées les Travaux), y compris notamment les inventions protégeables ou non, les plans, les notes techniques, les dessins, les maquettes et tout élément nécessaire à l'obtention des résultats commandés.
- l'ensemble des droits d'auteur sur les Travaux pour toute exploitation et sur tout support présent et à venir, notamment papier, magnétique, optique ou vidéographique, disques, disquettes, bandes, listings, transparents, vidéogrammes, internet, intranet. Ces droits sont constitués des droits de reproduction, d'utilisation, de représentation, de publication, d'édition, d'adaptation, de modification, de correction, de développement, d'intégration, de transcription, de traduction, de numérisation et de commercialisation de quelque façon et sous quelque forme que ce soit.

Cette cession est effective tant pour la France que pour l'étranger et pour toute la durée légale de protection des Travaux par les droits d'auteur.

La Société rétrocède ces droits au Client dans les mêmes termes et conditions ce que le Prestataire accepte et reconnaît.

Le Prestataire s'engage à obtenir tous les droits et autorisations nécessaires à l'exécution des Prestations et à l'exploitation par le Client des Travaux. Il garantit que les Travaux ne constituent pas une violation de droits de propriété intellectuelle ou de tous autres droits appartenant à un tiers. Il garantit le Client contre tout recours de tiers à propos de l'exploitation de ces droits.

Les Parties conviennent que les Travaux n'incluent pas les apports de méthodologie et outils standards acquis ou développés par le Prestataire préalablement à l'entrée en vigueur du Contrat, qui constituent le savoir-faire de cette dernière et sur lesquels la Société conservera la titularité des droits d'auteur. Toutefois, le Prestataire accorde à le Client un droit d'usage des apports et outils incorporés dans les Travaux cédés, pour les besoins et la durée de la réalisation et de l'exploitation desdits Travaux.

La présente clause reste applicable à l'issue des relations contractuelles entre les Parties.

Droit à l'image du Prestataire

Pour le besoin de la mise en œuvre des Services et plus particulièrement l'animation de son profil, le Prestataire de formation concède expressément un droit d'utilisation de son nom et sur son image au bénéfice de la Société aux fins de permettre à celle-ci de réaliser les prestations de communication et de mise en avant du profil sur la Plateforme. Ce droit est concédé à titre gracieux, pour toute la durée d'exécution des présentes et pour le monde entier. L'utilisation susvisée s'entend de l'utilisation des éléments cités sur la Plateforme aux fins de consultation par les Organismes.

CONFIDENTIALITE

Chacune des parties s'engage à garder strictement confidentielles les informations écrites ou orales divulguées, directement ou indirectement par l'autre partie dans le cadre de l'exécution des Services notamment les éléments économiques, techniques, commerciaux ou marketing.

En conséquence, chaque partie s'engage à faire respecter à son personnel, fournisseurs ou tout tiers intervenant, la plus stricte confidentialité. Ne seront toutefois pas considérées comme confidentielles les informations qui étaient connues du public antérieurement à leur divulgation sans qu'il y ait eu manquement au présent contrat.

Les dispositions du présent article demeureront en vigueur pendant une durée de cinq (5) ans après la fin de la relation contractuelle entre les parties.

FORCE MAJEURE

Les Parties ne pourront être tenues pour responsables si la non-exécution ou le retard dans l'exécution de l'une quelconque de leurs obligations, telles que décrites dans les présentes découle d'un cas de force majeure, au sens de l'article 1218 du Code civil.

Sont expressément considérés comme cas fortuit ou de force majeure, les évènements échappant au contrôle du débiteur d'une obligation, qui ne pouvaient être raisonnablement prévus lors de la conclusion du contrat et dont les effets ne peuvent être évités par des mesures appropriées, et notamment, outre ceux habituellement retenus par la jurisprudence des cours et tribunaux français, les grèves totales ou partielles, internes ou externes à l'entreprise, lock-out, intempéries, blocage des moyens de transport ou d'approvisionnement pour quelque raison que ce soit, tremblement de terre, incendie, tempête, restrictions gouvernementales ou légales, modifications légales ou réglementaires des formes de commercialisation, blocage des télécommunications, y compris le réseau téléphonique filaire, mobile et tout autre cas indépendant de la volonté expresse des parties empêchant l'exécution de son obligation par le débiteur.

La partie constatant l'événement informera sans délai l'autre partie de son impossibilité à exécuter sa prestation. Dans un premier temps, les cas de force majeure suspendront l'exécution du contrat. En cas de durée supérieure à deux (2) mois, le contrat sera résolu automatiquement, sauf accord contraire des parties.

SOUS-TRAITANCE

L'exécution des Prestations ne peut en aucun cas faire l'objet d'une sous-traitance totale ou partielle par le Prestataire sans l'accord préalable et écrit de la Société.

REGLEMENTATION

Le Prestataire de formation remet à la Société, préalablement à la signature du Contrat, les attestations requises par la loi (C. trav., art. D. 8222-5 notamment) en matières sociale et fiscale, à savoir :
- une attestation de fourniture des déclarations sociales et de paiement des cotisations et contributions de Sécurité sociale prévue à l'article L. 243-15 du Code de la Sécurité sociale, émanant de le Client de protection sociale chargé du recouvrement des cotisations et des contributions datant de moins de six (6) mois ;
- un extrait de l'inscription au Registre du commerce et des sociétés (extrait K ou Kbis) de moins de trois (3) mois, ou une carte d'identification justifiant de l'inscription au répertoire des métiers ou, lorsque le Prestataire est en cours d'inscription un récépissé du dépôt de déclaration auprès d'un centre de formalités des entreprises.

Ces attestations seront également remises par le Prestataire tous les six (6) mois.

DONNEES A CARACTERE PERSONNEL

Pour le besoin de l'exécution du Contrat, la Société est amenée à traiter des données à caractère personnel en qualité de Responsable du traitement.

Les données collectées sont nécessaires à l'exécution du Contrat notamment du mandat de gestion administrative et du mandat de facturation. Elles sont traités conformément aux dispositions légales et réglementaires applicables et à la politique de gestion annexée au présent Contrat.

ASSURANCES

Chacune des Parties s'assure contre les conséquences pécuniaires des dommages qu'elle pourrait subir et de la responsabilité civile au titre du Contrat.

Elles attestent avoir souscrit une police d'assurance auprès d'une compagnie d'assurance notoirement solvable et établie en France pour toutes les conséquences pécuniaires de leur responsabilité civile professionnelle, délictuelle et/ou contractuelle, du fait de dommages corporels, matériels et immatériels causés à l'autre partie et à tout tiers dans le cadre de l'exécution des Prestations.

DISPOSITIONS DIVERSES

Cession : La Société se réserve le droit de transférer tout ou partie des droits et obligations prévus par le présent Contrat à un tiers, notamment en cas de cession ou de transfert de tout ou partie son activité.

Nullité : La nullité, la caducité, l'absence de force obligatoire ou l'inopposabilité de l'une quelconque des stipulations des présentes n'emporte pas nullité, la caducité, l'absence de force obligatoire ou l'inopposabilité des autres stipulations qui conserveront tous leurs effets.

Non-renonciation : L'inapplication temporaire ou permanente d'une ou plusieurs clauses des présentes ne saurait valoir renonciation aux autres clauses qui continuent à produire leurs effets.

Interprétation : En cas de difficultés d'interprétation entre l'un quelconque des titres figurant en-tête des clauses et l'une quelconque des clauses, les titres seront déclarés inexistants.

Preuve : Les enregistrements informatiques de la Société liés à la connexion aux à la Plateforme et à la fourniture des Services constituent la preuve des échanges entre les parties et prévaudront sur ceux issus des systèmes d'information de le Client.

DROIT APPLICABLE LITIGES

Le présent Contrat et les Prestations qui en découlent sont régies par le droit français.

Il est rédigé en langue française. Dans le cas où il serait traduit en une ou plusieurs langues, seul le texte français fera foi en cas de litige.

Les Parties conviennent de faire leur possible pour résoudre à l'amiable les désaccords susceptibles de résulter de l'interprétation, l'exécution ou la cessation des relations commerciales entre elles.

La procédure de règlement amiable constitue un préalable obligatoire à l'introduction d'une action en justice. Toute action introduite en justice en violation de la présente clause serait déclarée irrecevable.

EN CAS D'ECHEC DE LA PROCEDURE AMIABLE TOUT LITIGE AUQUEL LES RELATIONS ENTRE LES PARTIES POURRAIENT DONNER LIEU SERONT SOUMIS AUX JURIDICTIONS COMPETENTES DE LYON (FRANCE) Y COMPRIS EN MATIERE DE REFERE, EN CAS D'APPEL DE GARANTIE OU DE PLURALITE DE DEFENDEURS.

---

ANNEXE 1 - MANDAT DE FACTURATION

Au titre des présentes le Prestataire confie à la Société, qui l'accepte, un mandat ferme et irrévocable de facturation pour les Prestations réalisées. Ce mandat perdure pour toute la durée d'exécution du Contrat.

Au titre de ce mandat, la Société émettra au nom et pour le compte du Prestataire de formation les factures des Prestations réalisées pour le compte de la Société. Ces factures comporteront une mention faisant référence au présent mandat.

Le Prestataire s'engage à transmettre à la Société toutes les informations lui permettant d'émettre des factures en son nom dans le cadre du mandat de facturation qui lui est confié au titre des présentes, à savoir :
- Son nom ou sa dénomination sociale et son adresse postale complète ;
- Son numéro de TVA intracommunautaire (le cas échéant) ;
- Son numéro SIREN ;
- Les conditions de paiement résultant de ses propres conditions générales ;
- La date de la ou des interventions facturées ;
- La description de la ou les interventions facturées et la quantité si applicable ;
- Le prix hors taxes pour chaque intervention facturée ;
- Les rabais ou ristournes consentis ;
- Le taux de TVA applicable.

La Société dégage toute responsabilité en cas de non transmission de ces informations notamment en cas de retard de facturation faute de disposer des éléments nécessaires.

Le Prestataire de formation est informé qu'en application des dispositions de l'article 289, I du CGI, il demeure entièrement responsable de la facture émise et du régime de TVA qui aura été appliqué.

Dans le cadre de ce mandat la Société s'engage à émettre des factures conformes à la législation économique et à la législation fiscale.

Toutes les factures émises par la Société seront soumises au Prestataire de formation qui disposera d'un délai de deux (2) jours ouvrés pour les valider. Après validation, ou sans réponse à l'issue de ce délai, les factures seront considérées comme validées par le Prestataire de formation.

Le Prestataire est informé qu'il demeure intégralement responsable du reversement de la TVA mentionnée sur les factures au Trésor Public, dans les conditions et délais prévus par la législation fiscale en vigueur au jour du fait générateur de la TVA.

La commission appliquée par la Société sur les prestations facturées par le Prestataire de formation et visée aux présentes rémunère notamment le service de facturation au titre du présent mandat.

---

ANNEXE 2 - CONDITIONS D'UTILISATION DE LA PLATEFORME VIZION ACADEMY

1. Définitions

Plateforme : ensemble des outils et de fonctionnalités mis à disposition du Prestataire via un espace dédié accessible par internet.

Services : services dédiés comprenant notamment la Plateforme, les services déployés via la Plateforme, les services complémentaires associés, l'hébergement des données, le maintien en conditions opérationnelles et le support technique.

2. Objet

Les présentes ont pour objet de décrire les Services mis à disposition des Prestataires par l'intermédiaire de la Plateforme.

3. Description de Services

La Société met à disposition des Prestataires les Services suivants :
- L'accès à la Plateforme et à ses fonctionnalités permettant notamment le téléchargement et la transmission de documents administratifs, et affichant le profil du Prestataire (ci-après le Dashboard)
- Un support technique dédié leur permettant d'obtenir une aide en cas de problème technique accessible à l'adresse support@vizionacademy.fr.

La Société se réserve le droit de modifier à tout moment les caractéristiques des Services en conservant les mêmes performances que celles fournies au moment de la souscription de ceux-ci par le Prestataire.

4. Disponibilité - Accessibilité

La Société s'engage à faire ses meilleurs efforts pour permettre au Prestataire d'accéder à la Plateforme et plus largement aux Services à tout moment. Cependant, et compte tenu des difficultés techniques inhérentes à la nature de l'outil et aux contraintes propres de l'internet, elle ne saurait garantir un accès continu à celle-ci.

La Société se réserve le droit de suspendre les Services sans délai de prévenance en cas de difficulté nécessitant une intervention urgente ou nécessaire notamment en cas d'attaque des serveurs affectant la sécurité ou l'intégrité de la Plateforme.

L'accès pourra également être suspendu pour des raisons de maintenance.

La Société ne sera redevable d'aucune compensation financière et n'encourra aucune responsabilité envers le Prestataire au titre des interruptions et/ou suspensions décrites ci-dessus.

5. Sécurité

La Société procède aux opérations et mises à jour nécessaires au maintien de la conformité et à l'évolution de la Plateforme de façon régulière et assure son maintien en conditions opérationnelles.

Le Prestataire s'engage à ne pas accéder frauduleusement à des Parties de la Plateforme dont l'accès serait réservé, à ne pas s'y maintenir, à ne pas modifier frauduleusement et altérer les données y figurant, et s'engagent également à ne pas interférer ou interrompre le fonctionnement normal de la Plateforme ou des Services.

En cas de manquement aux obligations susvisées, la Société se réserve le droit d'interrompre de manière temporaire ou définitive l'accès aux Services, en suspendant ou en résiliant ceux-ci dans les conditions des présentes.

6. Support technique

Un service support est mis à la disposition du Prestataire pour traiter les demandes liées aux problèmes techniques tels que des erreurs de chargement de pages ou des problèmes de navigation. Les demandes sont prises en compte dans l'ordre où elles sont reçues et traitées dans les meilleurs délais.

7. Confidentialité des Services

Chacune des Parties s'engage à garder strictement confidentielles les informations écrites ou orales divulguées, directement ou indirectement par l'autre Partie dans le cadre de l'exécution des Services notamment les éléments économiques, techniques, commerciaux ou marketing.

Les dispositions du présent article demeureront en vigueur pendant une durée de cinq (5) ans après la fin de la relation contractuelle entre les Parties.

8. Responsabilité

La Société décline toute responsabilité du fait d'une utilisation non conforme notamment anormale ou frauduleuse des Services et/ou de la Plateforme et ne saurait être tenue responsable d'un quelconque dommage à ce titre.

9. Propriété intellectuelle

La structure générale, ainsi tous textes, images, vidéos, sons, photographies, marques, programmes informatiques, documents téléchargeables, et tous autres éléments composants la Plateforme et les Services sont la propriété intellectuelle de la Société ou peuvent être librement utilisés par cette dernière soit parce qu'ils sont libres de droits, soit parce qu'une licence d'utilisation lui en a été concédée.

Toute reproduction totale ou partielle desdits éléments est strictement interdite et est susceptible de constituer un délit de contrefaçon.

10. Suspension - Résiliation des accès

L'accès aux Services pourra être restreint et/ou suspendu sans préavis en cas d'inexécution suffisamment grave de l'une quelconque de ses obligations notamment en cas de suspicion d'infraction pénale, d'infraction aux droits de propriété intellectuelle ou de manquement du Prestataire à ses obligations.

L'accès aux Services sera résilié concomitamment à la résiliation du Contrat pour quelque raison que ce soit.

---

ANNEXE 3 - GESTION DES DONNEES A CARACTERE PERSONNEL

Données à caractère personnel ou Données : toute information se rapportant à une personne physique permettant de l'identifier directement ou indirectement, notamment par référence à un identifiant, tel qu'un nom, un numéro d'identification.`;

export default function RegisterIntervenantPage() {
  const { register: registerUser, error, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [localError, setLocalError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedCGV, setAcceptedCGV] = useState(false);
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
    if (user && currentStep < 4) {
      if (user.role === "INTERVENANT" && user.intervenant?.id) {
        setCreatedUserId(user.intervenant.id);
        setCurrentStep(4);
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

  // Étape 2 -> 3 : Accepter les conditions et passer aux CGV
  const handleStep2Next = async () => {
    if (!acceptedTerms) {
      setLocalError("Vous devez accepter les conditions pour continuer");
      return;
    }

    setLocalError(null);
    setCurrentStep(3);
  };

  // Étape 3 -> 4 : Accepter les CGV et créer le compte
  const handleStep3Next = async () => {
    if (!acceptedCGV) {
      setLocalError("Vous devez accepter les CGV pour continuer");
      return;
    }

    setLocalError(null);

    const data = methods.getValues();

    const registrationData: RegisterData = {
      email: data.email,
      password: data.password,
      role: "INTERVENANT",
      intervenantData: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
    };

    try {
      await registerUser(registrationData);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const currentUser = await getCurrentUser();
      if (currentUser.intervenant?.id) {
        setCreatedUserId(currentUser.intervenant.id);
        setCurrentStep(4);
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
            <div className="hidden sm:flex items-center gap-1">
              {[
                { num: 1, label: "Infos" },
                { num: 2, label: "Contrat" },
                { num: 3, label: "CGV" },
                { num: 4, label: "Documents" },
              ].map((step) => (
                <div key={step.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                        currentStep >= step.num
                          ? "bg-[#1c2942] text-white"
                          : "bg-[#ebf2fa] text-[#1c2942]/50"
                      }`}
                    >
                      {currentStep > step.num ? <Check className="w-3 h-3" /> : step.num}
                    </div>
                    <span className="text-[10px] text-[#1c2942]/60 mt-1">{step.label}</span>
                  </div>
                  {step.num < 4 && (
                    <div
                      className={`w-8 h-0.5 mx-1 rounded ${
                        currentStep > step.num ? "bg-[#1c2942]" : "bg-[#ebf2fa]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-sm text-[#1c2942]/60">Étape {currentStep}/4</div>
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
                  >
                    Continuer
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : CGV - Conditions Générales de Vente */}
        {currentStep === 3 && (
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-[#1c2942]/10 overflow-hidden">
              <div className="bg-[#1c2942] p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#6d74b5]/30 rounded-xl flex items-center justify-center">
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Conditions Générales de Vente</h1>
                    <p className="text-white/70">Contrat de prestation de service</p>
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
                      <strong>Important :</strong> Veuillez lire attentivement le contrat de prestation de service ci-dessous dans son intégralité.
                      En continuant, vous acceptez l'ensemble des termes et conditions.
                    </p>
                  </div>
                </div>

                {/* Contrat CGV complet */}
                <div className="border border-[#1c2942]/20 rounded-xl overflow-hidden">
                  <div className="bg-[#ebf2fa] px-4 py-2 border-b border-[#1c2942]/10">
                    <span className="text-sm font-medium text-[#1c2942]">Contrat de prestation de service complet</span>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto p-4 bg-white">
                    <pre className="whitespace-pre-wrap text-sm text-[#1c2942]/80 font-sans leading-relaxed">
                      {CGV_CONTRACT}
                    </pre>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#6d74b5]/10 rounded-xl border border-[#6d74b5]/30">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedCGV}
                      onChange={(e) => setAcceptedCGV(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-[#1c2942]/30 text-[#6d74b5] focus:ring-[#6d74b5]"
                    />
                    <span className="text-sm text-[#1c2942]">
                      <strong>J'ai lu et j'accepte les Conditions Générales de Vente (CGV) et le contrat de prestation de service dans son intégralité.</strong> Je m'engage à respecter
                      l'ensemble des clauses mentionnées dans ce contrat.
                    </span>
                  </label>
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <Button onClick={() => setCurrentStep(2)} variant="ghost" size="lg">
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </Button>
                  <Button
                    onClick={handleStep3Next}
                    variant="primary"
                    size="lg"
                    disabled={!acceptedCGV}
                    isLoading={isLoading}
                  >
                    Accepter et créer mon compte
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : Upload des documents */}
        {currentStep === 4 && (
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
