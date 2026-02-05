"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type ProviderOption = "gemini" | "openai" | "claude";

type ConfigResponse = {
  config: {
    provider: ProviderOption;
    model: string | null;
    hasKey: boolean;
  } | null;
};

const PROVIDERS: Array<{ value: ProviderOption; label: string; defaultModel: string }> = [
  { value: "gemini", label: "Gemini", defaultModel: "gemini-2.5-flash" },
  { value: "openai", label: "OpenAI", defaultModel: "gpt-4o-mini" },
  { value: "claude", label: "Claude", defaultModel: "claude-3-5-sonnet" },
];

export function AiProviderForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [provider, setProvider] = useState<ProviderOption>("gemini");
  const [model, setModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/user-ai-key");
        if (!res.ok) return;
        const json = (await res.json()) as ConfigResponse;
        if (!active) return;
        if (json.config) {
          setProvider(json.config.provider);
          setModel(json.config.model ?? "");
          setHasKey(json.config.hasKey);
        } else {
          setProvider("gemini");
          setModel("");
          setHasKey(false);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const defaultModel = useMemo(() => {
    return PROVIDERS.find((item) => item.value === provider)?.defaultModel ?? "";
  }, [provider]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API key required",
        description: "Enter an API key to save your provider configuration.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/user-ai-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          model: model.trim() || undefined,
          apiKey: apiKey.trim(),
        }),
      });

      if (!res.ok) {
        toast({
          title: "Save failed",
          description: "Please check your key and try again.",
          variant: "destructive",
        });
        return;
      }

      setApiKey("");
      setHasKey(true);
      toast({ title: "Provider configuration saved." });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user-ai-key", { method: "DELETE" });
      if (!res.ok) {
        toast({
          title: "Remove failed",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }
      setHasKey(false);
      setApiKey("");
      setProvider("gemini");
      setModel("");
      toast({ title: "Using platform default AI." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-slate-900/10 bg-white/70 p-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">AI provider</h2>
        <p className="text-xs text-muted-foreground">
          Optional. Use your own API key or keep the platform default (Gemini 2.5 Flash).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Provider</Label>
          <Select value={provider} onValueChange={(value) => setProvider(value as ProviderOption)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {PROVIDERS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ai-provider-model">Model (optional)</Label>
          <Input
            id="ai-provider-model"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            placeholder={defaultModel}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ai-provider-key">API key</Label>
        <Input
          id="ai-provider-key"
          type="password"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          placeholder={hasKey ? "Saved — enter a new key to replace" : "Enter your API key"}
        />
        <p className="text-xs text-muted-foreground">
          {hasKey
            ? "Your key is stored securely. Enter a new key to update it."
            : "No key saved. The app will use the platform default."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={handleSave} disabled={loading || saving}>
          {saving ? "Saving..." : "Save provider"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleRemove}
          disabled={loading || saving || !hasKey}
        >
          Remove key
        </Button>
      </div>
    </div>
  );
}
