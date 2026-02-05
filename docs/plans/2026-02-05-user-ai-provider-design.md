# User AI Provider Config (Bring-Your-Own-Key) Design

> Default platform provider: **Gemini** with model **gemini-2.5-flash**.
> Users can optionally supply their own API key and choose provider + model.
> Priority: **user key** > **platform default**.

## Goals
- Let users optionally configure their own AI provider + API key + model.
- Keep platform default behavior unchanged (Gemini 2.5 Flash) when no user key.
- Store keys securely (server-side only) using application-layer encryption.
- Provide UI for managing provider + model + key.

## Architecture Overview
- **DB**: `UserAiProviderConfig` (1 per user) with encrypted key, provider, model.
- **API**: `/api/user-ai-key` GET/POST/DELETE.
- **AI routing**: decide provider per request and call correct endpoint.
- **UI**: resume settings card to manage provider/key.

## Data Model
`UserAiProviderConfig`
- `id`
- `userId` (unique)
- `provider` enum: `openai | gemini | claude`
- `model` (nullable, user override)
- `apiKeyCiphertext` (string)
- `apiKeyIv` (string)
- `apiKeyTag` (string)
- `createdAt` / `updatedAt`

## Encryption
- AES-256-GCM, key from `APP_ENC_KEY` (32 bytes).
- Store ciphertext + iv + auth tag.
- Only decrypt on server when needed.

## API
`GET /api/user-ai-key`
- Auth required.
- Returns `{ provider, model, hasKey }`.

`POST /api/user-ai-key`
- Auth required.
- Body: `{ provider, model?, apiKey }`.
- Validates provider/model, encrypts key, upserts record.

`DELETE /api/user-ai-key`
- Auth required.
- Deletes record for user (fallback to platform default).

## AI Routing
- If user config exists: use provider + key + model.
- Else: use platform default provider/model.

Providers
- OpenAI: `https://api.openai.com/v1/chat/completions`
- Gemini: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- Claude: `https://api.anthropic.com/v1/messages`

## Error Handling
- `AI_AUTH_FAILED`
- `AI_MODEL_INVALID`
- `AI_RATE_LIMIT`
- Consistent JSON error shape.

## UI
- New card: **AI Provider**
- Fields: Provider select, Model input, API Key password input
- Actions: Save / Remove
- Status: ¡°Using your key¡± / ¡°Using platform default¡±

## Tests
- Encryption round-trip
- API GET/POST/DELETE
- Provider selection precedence

