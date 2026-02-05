export type AiProviderName = "openai" | "gemini" | "claude";

export type ProviderRequest = {
  apiKey: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  signal?: AbortSignal;
};

export const DEFAULT_MODELS: Record<AiProviderName, string> = {
  openai: "gpt-4o-mini",
  gemini: "gemini-2.5-flash",
  claude: "claude-3-5-sonnet",
};

export function getDefaultModel(provider: AiProviderName) {
  return DEFAULT_MODELS[provider];
}

function normalizeOpenAiModel(rawModel: string) {
  const normalized = rawModel.trim().toLowerCase().replace(/[\s_]+/g, "-");
  if (!normalized) return getDefaultModel("openai");
  if (normalized.includes("gpt-5") && normalized.includes("mini")) {
    return "gpt-5-mini";
  }
  return normalized;
}

function normalizeGeminiModel(rawModel: string) {
  const normalized = rawModel.trim();
  return normalized || getDefaultModel("gemini");
}

function normalizeClaudeModel(rawModel: string) {
  const normalized = rawModel.trim();
  return normalized || getDefaultModel("claude");
}

export function normalizeProviderModel(provider: AiProviderName, model: string) {
  if (provider === "openai") {
    return normalizeOpenAiModel(model);
  }
  if (provider === "claude") {
    return normalizeClaudeModel(model);
  }
  return normalizeGeminiModel(model);
}

export async function callOpenAI(request: ProviderRequest) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${request.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: request.model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: request.systemPrompt },
        { role: "user", content: request.userPrompt },
      ],
    }),
    signal: request.signal,
  });

  if (!response.ok) {
    throw new Error(`OPENAI_${response.status}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return json.choices?.[0]?.message?.content ?? "";
}

export async function callGemini(request: ProviderRequest) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${request.model}:generateContent?key=${request.apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: request.systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: request.userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 900,
        responseMimeType: "application/json",
      },
    }),
    signal: request.signal,
  });

  if (!response.ok) {
    throw new Error(`GEMINI_${response.status}`);
  }

  const json = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function callClaude(request: ProviderRequest) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": request.apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: request.model,
      max_tokens: 900,
      temperature: 0.2,
      system: request.systemPrompt,
      messages: [{ role: "user", content: request.userPrompt }],
    }),
    signal: request.signal,
  });

  if (!response.ok) {
    throw new Error(`CLAUDE_${response.status}`);
  }

  const json = (await response.json()) as {
    content?: Array<{ text?: string }>;
  };
  return json.content?.[0]?.text ?? "";
}

export async function callProvider(
  provider: AiProviderName,
  request: ProviderRequest,
) {
  if (provider === "openai") {
    return callOpenAI(request);
  }
  if (provider === "claude") {
    return callClaude(request);
  }
  return callGemini(request);
}
