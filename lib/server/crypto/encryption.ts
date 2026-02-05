import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

type EncryptedPayload = {
  ciphertext: string;
  iv: string;
  tag: string;
};

const IV_LENGTH = 12;

function getKey(): Buffer {
  const raw = process.env.APP_ENC_KEY;
  if (!raw) {
    throw new Error("APP_ENC_KEY is required");
  }
  const utf8Key = Buffer.from(raw, "utf8");
  if (utf8Key.length === 32) {
    return utf8Key;
  }

  const base64Key = Buffer.from(raw, "base64");
  if (base64Key.length === 32) {
    return base64Key;
  }

  if (/^[0-9a-fA-F]+$/.test(raw)) {
    const hexKey = Buffer.from(raw, "hex");
    if (hexKey.length === 32) {
      return hexKey;
    }
  }

  throw new Error("APP_ENC_KEY must be 32 bytes (raw) or 32-byte base64/hex");
}

export function encryptSecret(value: string): EncryptedPayload {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
}

export function decryptSecret(payload: EncryptedPayload): string {
  const key = getKey();
  const iv = Buffer.from(payload.iv, "base64");
  const tag = Buffer.from(payload.tag, "base64");
  const ciphertext = Buffer.from(payload.ciphertext, "base64");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decoded = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decoded.toString("utf8");
}

export type { EncryptedPayload };
