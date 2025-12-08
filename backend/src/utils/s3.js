import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Config } from "./s3.config.js";
import crypto from "crypto";
import logger from "./logger.js";

const s3 = new S3Client({
  region: s3Config.region,
  credentials: {
    accessKeyId: s3Config.accessKey,
    secretAccessKey: s3Config.secretKey
  }
});

// Génère un nom unique (ex: docs/intervenants/uuid.pdf)
export function generateS3Key(folder = "uploads", originalName = "") {
  const ext = originalName.split(".").pop();
  const random = crypto.randomUUID();
  return `${folder}/${random}.${ext}`;
}

/**
 * Upload S3
 * fileBuffer: Buffer
 * key: string (chemin dans le bucket)
 * mimeType: "application/pdf" | "image/png" etc.
 */
export async function uploadToS3(fileBuffer, key, mimeType) {
  try {
    const command = new PutObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType
    });

    await s3.send(command);
    logger.info("File uploaded to S3", { key });

    return `s3://${s3Config.bucketName}/${key}`;
  } catch (err) {
    logger.error("S3 upload failed", { error: err.message });
    throw err;
  }
}

/**
 * Get file (buffer) from S3
 */
export async function getFromS3(key) {
  try {
    const command = new GetObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key
    });

    return await s3.send(command);
  } catch (err) {
    logger.error("S3 get failed", { key, error: err.message });
    throw err;
  }
}

/**
 * Delete file from S3
 */
export async function deleteFromS3(key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key
    });

    await s3.send(command);
    logger.info("S3 file deleted", { key });
  } catch (err) {
    logger.error("S3 delete failed", { key, error: err.message });
    throw err;
  }
}

/**
 * Create a signed URL (GET)
 */
export async function getSignedUrlFromS3(key, expiresIn = 60 * 10) {
  try {
    const command = new GetObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn });
    return signedUrl;
  } catch (err) {
    logger.error("Signed URL generation failed", { key, error: err.message });
    throw err;
  }
}