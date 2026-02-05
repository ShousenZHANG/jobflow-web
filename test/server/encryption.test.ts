import { describe, expect, it } from "vitest";
import { decryptSecret, encryptSecret } from "@/lib/server/crypto/encryption";

describe("encryption helpers", () => {
  it("encrypts and decrypts payloads", () => {
    process.env.APP_ENC_KEY = "0123456789abcdef0123456789abcdef";
    const payload = encryptSecret("hello");
    const decoded = decryptSecret(payload);
    expect(decoded).toBe("hello");
  });
});
