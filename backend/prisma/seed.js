import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding...");

  // Nettoyer la base de données (optionnel - décommenter si nécessaire)
  // console.log('🧹 Nettoyage de la base de données...');
  // await prisma.document.deleteMany();
  // await prisma.mission.deleteMany();
  // await prisma.refreshToken.deleteMany();
  // await prisma.intervenant.deleteMany();
  // await prisma.ecole.deleteMany();
  // await prisma.user.deleteMany();

  // Hasher un mot de passe par défaut
  const defaultPassword = await bcrypt.hash("password123", 12);

  // Créer un admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@vizionacademy.fr" },
    update: {},
    create: {
      email: "admin@vizionacademy.fr",
      password: defaultPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin créé:", admin.email);

  // Créer des écoles
  const ecole1 = await prisma.user.upsert({
    where: { email: "ecole1@test.fr" },
    update: {},
    create: {
      email: "ecole1@test.fr",
      password: defaultPassword,
      role: "ECOLE",
      ecole: {
        create: {
          name: "ESSEC Business School",
          contactEmail: "contact@essec.fr",
          address: "1 Avenue Bernard Hirsch, 95000 Cergy",
          phone: "01 34 43 30 00",
        },
      },
    },
    include: { ecole: true },
  });
  console.log("✅ École créée:", ecole1.ecole?.name);

  const ecole2 = await prisma.user.upsert({
    where: { email: "ecole2@test.fr" },
    update: {},
    create: {
      email: "ecole2@test.fr",
      password: defaultPassword,
      role: "ECOLE",
      ecole: {
        create: {
          name: "HEC Paris",
          contactEmail: "contact@hec.fr",
          address: "1 Rue de la Liberation, 78350 Jouy-en-Josas",
          phone: "01 39 67 70 00",
        },
      },
    },
    include: { ecole: true },
  });
  console.log("✅ École créée:", ecole2.ecole?.name);

  const ecole3 = await prisma.user.upsert({
    where: { email: "ecole3@test.fr" },
    update: {},
    create: {
      email: "ecole3@test.fr",
      password: defaultPassword,
      role: "ECOLE",
      ecole: {
        create: {
          name: "EM Lyon Business School",
          contactEmail: "contact@em-lyon.fr",
          address: "23 Avenue Guy de Collongue, 69130 Écully",
          phone: "04 78 33 78 00",
        },
      },
    },
    include: { ecole: true },
  });
  console.log("✅ École créée:", ecole3.ecole?.name);

  // Créer des intervenants
  const intervenant1 = await prisma.user.upsert({
    where: { email: "intervenant1@test.fr" },
    update: {},
    create: {
      email: "intervenant1@test.fr",
      password: defaultPassword,
      role: "INTERVENANT",
      intervenant: {
        create: {
          bio: "Expert en Intelligence Artificielle et Machine Learning avec plus de 10 ans d'expérience dans la recherche et l'industrie.",
          siret: "12345678901234",
          disponibility: {
            days: ["lundi", "mardi", "mercredi"],
            hours: { start: "09:00", end: "18:00" },
          },
          status: "approved",
        },
      },
    },
    include: { intervenant: true },
  });
  console.log("✅ Intervenant créé:", intervenant1.email);

  const intervenant2 = await prisma.user.upsert({
    where: { email: "intervenant2@test.fr" },
    update: {},
    create: {
      email: "intervenant2@test.fr",
      password: defaultPassword,
      role: "INTERVENANT",
      intervenant: {
        create: {
          bio: "Consultant en Marketing Digital spécialisé en stratégie de contenu et réseaux sociaux.",
          siret: "23456789012345",
          disponibility: {
            days: ["jeudi", "vendredi"],
            hours: { start: "10:00", end: "17:00" },
          },
          status: "approved",
        },
      },
    },
    include: { intervenant: true },
  });
  console.log("✅ Intervenant créé:", intervenant2.email);

  const intervenant3 = await prisma.user.upsert({
    where: { email: "intervenant3@test.fr" },
    update: {},
    create: {
      email: "intervenant3@test.fr",
      password: defaultPassword,
      role: "INTERVENANT",
      intervenant: {
        create: {
          bio: "Expert en Finance d'entreprise et gestion de portefeuille.",
          siret: "34567890123456",
          disponibility: {
            days: ["lundi", "mercredi", "vendredi"],
            hours: { start: "14:00", end: "20:00" },
          },
          status: "pending",
        },
      },
    },
    include: { intervenant: true },
  });
  console.log("✅ Intervenant créé:", intervenant3.email);

  // Créer des missions
  const ecole1Data = await prisma.user.findUnique({
    where: { email: "ecole1@test.fr" },
    include: { ecole: true },
  });

  const ecole2Data = await prisma.user.findUnique({
    where: { email: "ecole2@test.fr" },
    include: { ecole: true },
  });

  const ecole3Data = await prisma.user.findUnique({
    where: { email: "ecole3@test.fr" },
    include: { ecole: true },
  });

  const intervenant1Data = await prisma.user.findUnique({
    where: { email: "intervenant1@test.fr" },
    include: { intervenant: true },
  });

  if (ecole1Data?.ecole) {
    const mission1 = await prisma.mission.create({
      data: {
        title: "Introduction à l'Intelligence Artificielle",
        description:
          "Cours d'introduction à l'IA et au Machine Learning pour étudiants de Master 1. Couvre les concepts fondamentaux, les algorithmes de base et des études de cas pratiques.",
        status: "ACTIVE",
        startDate: new Date("2025-02-01"),
        endDate: new Date("2025-05-31"),
        priceCents: 50000, // 500€
        ecoleId: ecole1Data.ecole.id,
        intervenantId: intervenant1Data?.intervenant?.id,
      },
    });
    console.log("✅ Mission créée:", mission1.title);

    const mission2 = await prisma.mission.create({
      data: {
        title: "Deep Learning et Réseaux de Neurones",
        description:
          "Module avancé sur le deep learning, architectures de réseaux de neurones, et applications pratiques avec TensorFlow et PyTorch.",
        status: "ACTIVE",
        startDate: new Date("2025-03-15"),
        endDate: new Date("2025-06-30"),
        priceCents: 75000, // 750€
        ecoleId: ecole1Data.ecole.id,
      },
    });
    console.log("✅ Mission créée:", mission2.title);
  }

  if (ecole2Data?.ecole) {
    const mission3 = await prisma.mission.create({
      data: {
        title: "Stratégie Marketing Digital",
        description:
          "Formation complète sur les stratégies de marketing digital : SEO, SEM, réseaux sociaux, email marketing et analytics.",
        status: "ACTIVE",
        startDate: new Date("2025-01-15"),
        endDate: new Date("2025-04-30"),
        priceCents: 40000, // 400€
        ecoleId: ecole2Data.ecole.id,
      },
    });
    console.log("✅ Mission créée:", mission3.title);

    const mission4 = await prisma.mission.create({
      data: {
        title: "Analyse de Données et Big Data",
        description:
          "Cours sur l'analyse de données massives, outils (Hadoop, Spark), et techniques d'exploration de données.",
        status: "DRAFT",
        startDate: new Date("2025-09-01"),
        endDate: new Date("2025-12-31"),
        priceCents: 60000, // 600€
        ecoleId: ecole2Data.ecole.id,
      },
    });
    console.log("✅ Mission créée:", mission4.title);
  }

  if (ecole3Data?.ecole) {
    const mission5 = await prisma.mission.create({
      data: {
        title: "Finance d'Entreprise Avancée",
        description:
          "Module approfondi sur la finance d'entreprise : évaluation d'actifs, gestion des risques, financement de projets.",
        status: "ACTIVE",
        startDate: new Date("2025-02-10"),
        endDate: new Date("2025-05-20"),
        priceCents: 55000, // 550€
        ecoleId: ecole3Data.ecole.id,
      },
    });
    console.log("✅ Mission créée:", mission5.title);
  }

  // Créer des documents pour un intervenant
  if (intervenant1Data?.intervenant) {
    const doc1 = await prisma.document.create({
      data: {
        fileName: "cv_marie_dubois.pdf",
        filePath: "s3://vizion-academy/documents/cv_marie_dubois.pdf",
        type: "CV",
        intervenantId: intervenant1Data.intervenant.id,
      },
    });
    console.log("✅ Document créé:", doc1.fileName);

    const doc2 = await prisma.document.create({
      data: {
        fileName: "diplome_master.pdf",
        filePath: "s3://vizion-academy/documents/diplome_master.pdf",
        type: "DIPLOME",
        intervenantId: intervenant1Data.intervenant.id,
      },
    });
    console.log("✅ Document créé:", doc2.fileName);
  }

  console.log("✅ Seeding terminé avec succès!");
  console.log("\n📋 Comptes créés:");
  console.log("   Admin: admin@vizionacademy.fr / password123");
  console.log("   École 1: ecole1@test.fr / password123");
  console.log("   École 2: ecole2@test.fr / password123");
  console.log("   École 3: ecole3@test.fr / password123");
  console.log("   Intervenant 1: intervenant1@test.fr / password123");
  console.log("   Intervenant 2: intervenant2@test.fr / password123");
  console.log("   Intervenant 3: intervenant3@test.fr / password123");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
