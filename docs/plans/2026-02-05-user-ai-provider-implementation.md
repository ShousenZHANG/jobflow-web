# User AI Provider Config Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow users to optionally store their own AI provider + API key + model, while defaulting to platform Gemini (gemini-2.5-flash), with secure encryption and UI management.

**Architecture:** Add `UserAiProviderConfig` model with encrypted key. Expose CRUD API, add UI card for provider/key, and route AI calls to the selected provider (user key preferred, else platform default). Encryption uses AES-256-GCM with `APP_ENC_KEY`.

**Tech Stack:** Next.js App Router, Prisma, Vitest, Node crypto, Tailwind/shadcn.

---

### Task 1: Prisma model + migration

**Files:**
- Modify: `prisma/schema.prisma`

**Step 1: Write failing test (schema validation)**
- Skip direct test; Prisma migration validates.

**Step 2: Update schema**
- Add model:
  - `UserAiProviderConfig { id, userId @unique, provider, model?, apiKeyCiphertext, apiKeyIv, apiKeyTag, createdAt, updatedAt }`
  - Relation to `User`.

**Step 3: Run migration**
- Run: `npx prisma migrate dev -n add_user_ai_provider_config`
- Run: `npx prisma generate`

**Step 4: Commit**
```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add user ai provider config model"
```

---

### Task 2: Encryption utilities

**Files:**
- Create: `lib/server/crypto/encryption.ts`
- Test: `test/server/encryption.test.ts`

**Step 1: Write failing test**
```ts
import { encryptSecret, decryptSecret } from "@/lib/server/crypto/encryption";

test("encrypt/decrypt round trip", () => {
  process.env.APP_ENC_KEY = "0123456789abcdef0123456789abcdef"; // 32 bytes
  const payload = encryptSecret("hello");
  const decoded = decryptSecret(payload);
  expect(decoded).toBe("hello");
});
```

**Step 2: Run test (expect fail)**
Run: `npm test -- test/server/encryption.test.ts`
Expected: FAIL (module missing)

**Step 3: Implement**
- AES-256-GCM with random 12-byte IV.
- Base64 encode ciphertext, iv, tag.
- Throw error if `APP_ENC_KEY` missing/invalid length.

**Step 4: Run test (expect pass)**
Run: `npm test -- test/server/encryption.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add lib/server/crypto/encryption.ts test/server/encryption.test.ts
git commit -m "feat: add encryption helpers for user ai key"
```

---

### Task 3: Data access helper

**Files:**
- Create: `lib/server/userAiProvider.ts`
- Test: `test/server/userAiProvider.test.ts`

**Step 1: Write failing test**
```ts
import { upsertUserAiProvider, getUserAiProvider } from "@/lib/server/userAiProvider";

test("upserts and fetches config", async () => {
  const userId = "user-1";
  await upsertUserAiProvider(userId, {
    provider: "gemini",
    model: "gemini-2.5-flash",
    apiKeyCiphertext: "c",
    apiKeyIv: "i",
    apiKeyTag: "t",
  });
  const config = await getUserAiProvider(userId);
  expect(config?.provider).toBe("gemini");
});
```

**Step 2: Run test (expect fail)**
Run: `npm test -- test/server/userAiProvider.test.ts`
Expected: FAIL

**Step 3: Implement helper**
- `getUserAiProvider(userId)`
- `upsertUserAiProvider(userId, data)`
- `deleteUserAiProvider(userId)`

**Step 4: Run test (expect pass)**
Run: `npm test -- test/server/userAiProvider.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add lib/server/userAiProvider.ts test/server/userAiProvider.test.ts
git commit -m "feat: add user ai provider data access"
```

---

### Task 4: API routes for user AI key

**Files:**
- Create: `app/api/user-ai-key/route.ts`
- Test: `test/api/userAiKey.test.ts`

**Step 1: Write failing test**
- GET returns `{ provider, model, hasKey }` or null
- POST upserts config
- DELETE clears config

**Step 2: Run test (expect fail)**
Run: `npm test -- test/api/userAiKey.test.ts`
Expected: FAIL

**Step 3: Implement**
- Zod schema: provider enum, model optional, apiKey min length
- Encrypt apiKey with helper; upsert in DB
- GET: return provider/model/hasKey
- DELETE: delete config

**Step 4: Run test (expect pass)**
Run: `npm test -- test/api/userAiKey.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add app/api/user-ai-key/route.ts test/api/userAiKey.test.ts
git commit -m "feat: add user ai key api"
```

---

### Task 5: Provider routing + AI client

**Files:**
- Create: `lib/server/ai/providers.ts`
- Modify: `lib/server/ai/tailorApplication.ts`
- Test: `test/server/aiProviders.test.ts` and update `test/server/tailorApplication.test.ts`

**Step 1: Write failing test**
- Mocks provider selection and ensures user provider is used
- Fallback to platform default when no config

**Step 2: Run test (expect fail)**
Run: `npm test -- test/server/aiProviders.test.ts`
Expected: FAIL

**Step 3: Implement providers**
- `callOpenAI`, `callGemini`, `callClaude` with common output JSON requirement
- Default models per provider: openai `gpt-4o-mini`, gemini `gemini-2.5-flash`, claude `claude-3-5-sonnet`
- Use user model if provided

**Step 4: Update tailorApplicationContent**
- Fetch user config; decrypt key; use provider call
- If no user config: use platform gemini key + default model

**Step 5: Run tests**
Run: `npm test -- test/server/aiProviders.test.ts`
Expected: PASS

**Step 6: Commit**
```bash
git add lib/server/ai/providers.ts lib/server/ai/tailorApplication.ts test/server/aiProviders.test.ts test/server/tailorApplication.test.ts
git commit -m "feat: route AI calls by provider and user config"
```

---

### Task 6: UI for provider config

**Files:**
- Create: `components/resume/AiProviderForm.tsx`
- Modify: `app/(app)/resume/ai-rules/page.tsx` (include provider card above rules)
- Test: `app/(app)/resume/AiProviderForm.test.tsx`

**Step 1: Write failing test**
- Renders provider select, model input, api key input
- Save + Remove

**Step 2: Run test (expect fail)**
Run: `npm test -- app/(app)/resume/AiProviderForm.test.tsx`
Expected: FAIL

**Step 3: Implement UI**
- GET `/api/user-ai-key` to prefill provider/model + hasKey
- POST to save; DELETE to remove

**Step 4: Run test (expect pass)**
Run: `npm test -- app/(app)/resume/AiProviderForm.test.tsx`
Expected: PASS

**Step 5: Commit**
```bash
git add components/resume/AiProviderForm.tsx app/(app)/resume/ai-rules/page.tsx app/(app)/resume/AiProviderForm.test.tsx
git commit -m "feat: add ai provider config UI"
```

---

### Task 7: Final checks

**Commands:**
- `npm run lint`
- `npm test`
- `npm run build`

---

Plan complete and saved to `docs/plans/2026-02-05-user-ai-provider-implementation.md`.

Two execution options:

1. Subagent-Driven (this session)
2. Parallel Session (separate)

Which approach?
