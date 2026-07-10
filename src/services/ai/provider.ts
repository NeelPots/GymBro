import "server-only";
import type { AIProvider } from "./types";
import { AnthropicProvider } from "./providers/anthropic";

function currentProviderName(): string {
  return process.env.AI_PROVIDER ?? "anthropic";
}

/**
 * Whether the configured provider has the credentials it needs. Checked
 * before ever instantiating a provider client, so a missing key fails with
 * a clear message instead of an SDK error deep in a request.
 */
export function isAIConfigured(): boolean {
  switch (currentProviderName()) {
    case "anthropic":
      return Boolean(process.env.ANTHROPIC_API_KEY);
    default:
      return false;
  }
}

export function getAIProvider(): AIProvider {
  switch (currentProviderName()) {
    case "anthropic":
      return new AnthropicProvider();
    default:
      throw new Error(`Unknown AI_PROVIDER: ${currentProviderName()}`);
  }
}
