/**
 * ============================================
 * Vizion Academy - Service PDF
 * Génération de PDF pour factures
 * ============================================
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Répertoire de stockage des PDFs
const PDF_DIR = path.join(__dirname, '../../uploads/factures');

// S'assurer que le répertoire existe
if (!fs.existsSync(PDF_DIR)) {
    fs.mkdirSync(PDF_DIR, { recursive: true });
}

/**
 * Formate un montant en centimes vers euros
 */
function formatMontant(centimes) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(centimes / 100);
}

/**
 * Formate une date en format français
 */
function formatDate(date) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Génère un PDF de facture
 * @param {Object} facture - Données de la facture
 * @param {Object} emetteur - Informations de l'émetteur
 * @param {Object} destinataire - Informations du destinataire
 * @returns {Promise<string>} - Chemin du fichier PDF généré
 */
export async function generateFacturePDF(facture, emetteur, destinataire) {
    return new Promise((resolve, reject) => {
        try {
            const fileName = `${facture.numero.replace(/\//g, '-')}.pdf`;
            const filePath = path.join(PDF_DIR, fileName);

            const doc = new PDFDocument({
                size: 'A4',
                margin: 50,
                info: {
                    Title: `Facture ${facture.numero}`,
                    Author: 'Vizion Academy',
                    Subject: 'Facture',
                },
            });

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // ====== EN-TÊTE ======
            // Logo/Titre
            doc.fontSize(24)
                .fillColor('#4F46E5')
                .font('Helvetica-Bold')
                .text('VIZION ACADEMY', 50, 50);

            doc.fontSize(10)
                .fillColor('#6B7280')
                .font('Helvetica')
                .text('Plateforme de mise en relation écoles-intervenants', 50, 80);

            // Numéro de facture (à droite)
            doc.fontSize(20)
                .fillColor('#111827')
                .font('Helvetica-Bold')
                .text('FACTURE', 350, 50, { align: 'right' });

            doc.fontSize(12)
                .fillColor('#4F46E5')
                .font('Helvetica-Bold')
                .text(facture.numero, 350, 75, { align: 'right' });

            // Ligne de séparation
            doc.moveTo(50, 110)
                .lineTo(545, 110)
                .strokeColor('#E5E7EB')
                .lineWidth(1)
                .stroke();

            // ====== INFORMATIONS ÉMETTEUR / DESTINATAIRE ======
            let yPos = 130;

            // Émetteur (gauche)
            doc.fontSize(10)
                .fillColor('#6B7280')
                .font('Helvetica')
                .text('DE:', 50, yPos);

            doc.fontSize(11)
                .fillColor('#111827')
                .font('Helvetica-Bold')
                .text(emetteur?.name || 'Vizion Academy', 50, yPos + 15);

            if (emetteur?.address) {
                doc.fontSize(10)
                    .font('Helvetica')
                    .text(emetteur.address, 50, yPos + 30);
            }
            if (emetteur?.email) {
                doc.text(emetteur.email, 50, yPos + 45);
            }
            if (emetteur?.siret) {
                doc.text(`SIRET: ${emetteur.siret}`, 50, yPos + 60);
            }

            // Destinataire (droite)
            doc.fontSize(10)
                .fillColor('#6B7280')
                .text('FACTURÉ À:', 350, yPos, { align: 'right' });

            doc.fontSize(11)
                .fillColor('#111827')
                .font('Helvetica-Bold')
                .text(destinataire?.name || 'Client', 350, yPos + 15, { align: 'right' });

            if (destinataire?.address) {
                doc.fontSize(10)
                    .font('Helvetica')
                    .text(destinataire.address, 350, yPos + 30, { align: 'right' });
            }
            if (destinataire?.email) {
                doc.text(destinataire.email, 350, yPos + 45, { align: 'right' });
            }

            // ====== DATES ======
            yPos = 230;

            doc.fontSize(10)
                .fillColor('#6B7280')
                .font('Helvetica')
                .text('Date d\'émission:', 50, yPos);
            doc.fillColor('#111827')
                .text(formatDate(facture.dateEmission || facture.createdAt), 150, yPos);

            if (facture.dateEcheance) {
                doc.fillColor('#6B7280')
                    .text('Date d\'échéance:', 300, yPos);
                doc.fillColor('#111827')
                    .text(formatDate(facture.dateEcheance), 400, yPos);
            }

            // Statut
            yPos += 20;
            const statusColors = {
                brouillon: '#6B7280',
                envoyee: '#3B82F6',
                payee: '#10B981',
                annulee: '#EF4444',
                en_retard: '#F59E0B',
            };
            const statusLabels = {
                brouillon: 'BROUILLON',
                envoyee: 'ENVOYÉE',
                payee: 'PAYÉE',
                annulee: 'ANNULÉE',
                en_retard: 'EN RETARD',
            };

            doc.fillColor('#6B7280')
                .text('Statut:', 50, yPos);
            doc.fillColor(statusColors[facture.status] || '#6B7280')
                .font('Helvetica-Bold')
                .text(statusLabels[facture.status] || facture.status.toUpperCase(), 150, yPos);

            // ====== TABLEAU DES LIGNES ======
            yPos = 290;

            // En-tête du tableau
            doc.fillColor('#F3F4F6')
                .rect(50, yPos, 495, 25)
                .fill();

            doc.fontSize(9)
                .fillColor('#374151')
                .font('Helvetica-Bold')
                .text('Description', 60, yPos + 8)
                .text('Qté', 320, yPos + 8, { width: 50, align: 'center' })
                .text('Prix unit.', 370, yPos + 8, { width: 70, align: 'right' })
                .text('Total', 450, yPos + 8, { width: 85, align: 'right' });

            yPos += 30;

            // Lignes de facture
            doc.font('Helvetica');
            const lignes = facture.lignes || [];

            if (lignes.length > 0) {
                lignes.forEach((ligne, index) => {
                    if (index % 2 === 0) {
                        doc.fillColor('#F9FAFB')
                            .rect(50, yPos - 5, 495, 25)
                            .fill();
                    }

                    doc.fillColor('#111827')
                        .fontSize(9)
                        .text(ligne.description, 60, yPos, { width: 250 })
                        .text(String(ligne.quantite), 320, yPos, { width: 50, align: 'center' })
                        .text(formatMontant(ligne.prixUnitaire), 370, yPos, { width: 70, align: 'right' })
                        .text(formatMontant(ligne.total), 450, yPos, { width: 85, align: 'right' });

                    yPos += 25;
                });
            } else {
                // Si pas de lignes détaillées, afficher la description générale
                doc.fillColor('#111827')
                    .fontSize(9)
                    .text(facture.description || 'Prestation de service', 60, yPos, { width: 250 })
                    .text('1', 320, yPos, { width: 50, align: 'center' })
                    .text(formatMontant(facture.montantHT), 370, yPos, { width: 70, align: 'right' })
                    .text(formatMontant(facture.montantHT), 450, yPos, { width: 85, align: 'right' });

                yPos += 25;
            }

            // Ligne de séparation
            yPos += 10;
            doc.moveTo(300, yPos)
                .lineTo(545, yPos)
                .strokeColor('#E5E7EB')
                .stroke();

            // ====== TOTAUX ======
            yPos += 15;

            // Sous-total HT
            doc.fontSize(10)
                .fillColor('#6B7280')
                .text('Sous-total HT:', 350, yPos)
                .fillColor('#111827')
                .text(formatMontant(facture.montantHT), 450, yPos, { width: 85, align: 'right' });

            // TVA
            yPos += 20;
            if (facture.tva > 0) {
                doc.fillColor('#6B7280')
                    .text('TVA (20%):', 350, yPos)
                    .fillColor('#111827')
                    .text(formatMontant(facture.tva), 450, yPos, { width: 85, align: 'right' });
            } else {
                doc.fillColor('#6B7280')
                    .text('TVA:', 350, yPos)
                    .fillColor('#111827')
                    .text('Non applicable', 450, yPos, { width: 85, align: 'right' });
            }

            // Frais de service
            if (facture.fraisService > 0) {
                yPos += 20;
                doc.fillColor('#6B7280')
                    .text('Frais de service:', 350, yPos)
                    .fillColor('#111827')
                    .text(formatMontant(facture.fraisService), 450, yPos, { width: 85, align: 'right' });
            }

            // Total TTC
            yPos += 25;
            doc.fillColor('#4F46E5')
                .rect(340, yPos - 5, 205, 30)
                .fill();

            doc.fontSize(12)
                .fillColor('#FFFFFF')
                .font('Helvetica-Bold')
                .text('TOTAL TTC:', 350, yPos + 3)
                .text(formatMontant(facture.montantTTC), 450, yPos + 3, { width: 85, align: 'right' });

            // ====== INFORMATIONS DE PAIEMENT ======
            if (facture.status === 'payee' && facture.datePaiement) {
                yPos += 50;
                doc.fontSize(10)
                    .fillColor('#10B981')
                    .font('Helvetica-Bold')
                    .text('PAYÉE LE ' + formatDate(facture.datePaiement), 50, yPos);

                if (facture.modePaiement) {
                    doc.fillColor('#6B7280')
                        .font('Helvetica')
                        .text(`Mode de paiement: ${facture.modePaiement}`, 50, yPos + 15);
                }
                if (facture.reference) {
                    doc.text(`Référence: ${facture.reference}`, 50, yPos + 30);
                }
            }

            // ====== NOTES ======
            if (facture.notes) {
                yPos = Math.max(yPos + 60, 550);
                doc.fontSize(10)
                    .fillColor('#6B7280')
                    .font('Helvetica-Bold')
                    .text('Notes:', 50, yPos);

                doc.font('Helvetica')
                    .text(facture.notes, 50, yPos + 15, { width: 495 });
            }

            // ====== MISSION LIÉE ======
            if (facture.mission) {
                yPos = Math.max(yPos + 50, 600);
                doc.fontSize(10)
                    .fillColor('#6B7280')
                    .font('Helvetica-Bold')
                    .text('Mission associée:', 50, yPos);

                doc.font('Helvetica')
                    .fillColor('#111827')
                    .text(facture.mission.title, 50, yPos + 15);
            }

            // ====== PIED DE PAGE ======
            const footerY = 780;

            doc.moveTo(50, footerY)
                .lineTo(545, footerY)
                .strokeColor('#E5E7EB')
                .stroke();

            doc.fontSize(8)
                .fillColor('#9CA3AF')
                .font('Helvetica')
                .text('Vizion Academy - Plateforme de mise en relation écoles-intervenants', 50, footerY + 10, { align: 'center', width: 495 })
                .text('Document généré automatiquement', 50, footerY + 22, { align: 'center', width: 495 });

            // Finaliser le document
            doc.end();

            stream.on('finish', () => {
                resolve(filePath);
            });

            stream.on('error', (err) => {
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Récupère le chemin d'un PDF de facture
 */
export function getFacturePDFPath(numero) {
    const fileName = `${numero.replace(/\//g, '-')}.pdf`;
    return path.join(PDF_DIR, fileName);
}

/**
 * Vérifie si un PDF existe
 */
export function factureHasPDF(numero) {
    const filePath = getFacturePDFPath(numero);
    return fs.existsSync(filePath);
}

/**
 * Supprime un PDF de facture
 */
export function deleteFacturePDF(numero) {
    const filePath = getFacturePDFPath(numero);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
    }
    return false;
}
