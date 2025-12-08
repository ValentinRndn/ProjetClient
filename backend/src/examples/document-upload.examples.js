// Exemple d'utilisation complète du système d'upload de documents

/**
 * 1. Configuration dans .env
 * AWS_S3_BUCKET_NAME=vizion-documents
 * AWS_S3_REGION=eu-west-3
 * AWS_ACCESS_KEY_ID=your_access_key
 * AWS_SECRET_ACCESS_KEY=your_secret_key
 */

/**
 * 2. Installation des dépendances
 * npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner multer
 */

/**
 * 3. Usage côté client (Frontend)
 * 
 * // Upload d'un document avec fichier
 * const formData = new FormData();
 * formData.append('file', selectedFile);
 * formData.append('type', 'cv'); // ou 'certificate', 'diploma', etc.
 * 
 * const response = await fetch('/api/v1/intervenants/123e4567-e89b-12d3-a456-426614174000/documents', {
 *   method: 'POST',
 *   headers: {
 *     'Authorization': `Bearer ${token}`
 *   },
 *   body: formData
 * });
 * 
 * const result = await response.json();
 * console.log('Document uploadé:', result.data);
 * 
 * // Téléchargement d'un document
 * const downloadResponse = await fetch('/api/v1/intervenants/123e4567-e89b-12d3-a456-426614174000/documents/456e7890-e89b-12d3-a456-426614174000/download', {
 *   headers: {
 *     'Authorization': `Bearer ${token}`
 *   }
 * });
 * 
 * const downloadResult = await downloadResponse.json();
 * window.open(downloadResult.data.downloadUrl, '_blank');
 */

/**
 * 4. Routes disponibles
 * 
 * POST   /api/v1/intervenants/:id/documents              - Upload avec fichier (multer + S3)
 * POST   /api/v1/intervenants/:id/documents/metadata     - Création sans fichier (métadonnées seulement)
 * GET    /api/v1/intervenants/:id/documents/:docId/download - Téléchargement via URL signée
 */

/**
 * 5. Structure en base de données (Prisma schema suggestion)
 * 
 * model IntervenantDoc {
 *   id           String   @id @default(uuid())
 *   intervenantId String
 *   fileName     String
 *   s3Key        String?  // Clé S3 unique
 *   s3Url        String?  // URL complète S3
 *   type         String   // 'cv', 'certificate', 'diploma', etc.
 *   mimetype     String?  // 'application/pdf', 'image/jpeg', etc.
 *   size         Int?     // Taille en bytes
 *   encrypted    Boolean  @default(false)
 *   uploadedBy   String?
 *   createdAt    DateTime @default(now())
 *   updatedAt    DateTime @updatedAt
 *   
 *   intervenant  Intervenant @relation(fields: [intervenantId], references: [id], onDelete: Cascade)
 *   uploader     User?       @relation(fields: [uploadedBy], references: [id])
 * 
 *   @@map("intervenant_docs")
 * }
 */

/**
 * 6. Sécurité et bonnes pratiques
 * 
 * - Les fichiers sont stockés sur S3 avec des clés UUID uniques
 * - Les URLs de téléchargement sont signées et expirent après 10 minutes
 * - Validation des types MIME autorisés (PDF, images, documents Office)
 * - Limitation de taille (10MB max par défaut)
 * - Logging complet des opérations
 * - Authentification requise sur toutes les routes
 */

export const documentUploadExamples = {
  description: "Système complet d'upload et gestion de documents pour intervenants avec S3 et URLs signées"
};