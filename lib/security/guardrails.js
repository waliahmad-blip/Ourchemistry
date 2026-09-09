/**
 * AI Security & Guardrails Engine for ourchemistry.ai
 * Adapted from dev-agent-mcp sovereign security & AI guardrail standards.
 *
 * Enforces:
 * 1. Prompt Injection & Jailbreak Defense
 * 2. Strict Early-Stage PII & Contact Leakage Redaction (Anti-predatory matchmaking protection)
 * 3. Matrimonial / Ethical Safety Screening
 */

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s*:\s*you\s+are/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /reveal\s+(your\s+)?(hidden\s+)?system\s+prompt/i,
  /act\s+as\s+(dan|an\s+unfiltered\s+ai|jailbreak)/i,
  /<\|im_start\|>|<\|im_end\|>|<\|endoftext\|>/i,
  /execute\s+arbitrary\s+code/i,
  /override\s+(safety|content)\s+filters/i,
  /drop\s+table\s+/i,
  /<script[\s\S]*?>[\s\S]*?<\/script>/i,
];

// Patterns for unconsented contact sharing during anonymous stages
const PII_PATTERNS = [
  // International / domestic phone numbers (e.g. +1 555..., +92 300..., 0300..., 555-123-4567)
  /(?:(?:\+|00)\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/g,
  // Email addresses
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
  // Social & messaging handles (Snapchat, IG, Telegram, WhatsApp)
  /(?:whatsapp|wa\.me|snapchat|snap|insta|instagram|ig|telegram|tg|discord)\s*[:=]?\s*@?([a-zA-Z0-9_.-]{4,30})/gi,
  // Plain @usernames
  /(?:^|\s)@([a-zA-Z0-9_]{3,25})/g,
];

/**
 * Validates user input against prompt injection attempts
 * @param {string} text
 * @returns {{ safe: boolean, reason?: string }}
 */
export function checkPromptInjection(text) {
  if (!text || typeof text !== 'string') return { safe: true };

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        safe: false,
        reason: 'Input contains disallowed system override instructions.',
      };
    }
  }

  // Token repetition / denial of service check
  if (text.length > 2000) {
    return { safe: false, reason: 'Input exceeds maximum safe token length.' };
  }

  return { safe: true };
}

/**
 * Detects and redacts contact details during anonymous bond phases
 * @param {string} text
 * @returns {{ cleanText: string, hasPii: boolean, redactionsCount: number }}
 */
export function sanitizePii(text) {
  if (!text || typeof text !== 'string') {
    return { cleanText: '', hasPii: false, redactionsCount: 0 };
  }

  let cleanText = text;
  let redactionsCount = 0;

  for (const pattern of PII_PATTERNS) {
    cleanText = cleanText.replace(pattern, (match) => {
      // Avoid false positive on simple numbers < 6 digits
      const digitsOnly = match.replace(/\D/g, '');
      if (digitsOnly.length > 0 && digitsOnly.length < 7 && !match.includes('@')) {
        return match;
      }
      redactionsCount++;
      return '[Protected Contact Info]';
    });
  }

  return {
    cleanText,
    hasPii: redactionsCount > 0,
    redactionsCount,
  };
}

/**
 * Combined guardrail verification for incoming user queries
 * @param {string} input
 * @returns {{ passed: boolean, sanitizedInput: string, error?: string }}
 */
export function runGuardrails(input) {
  const injection = checkPromptInjection(input);
  if (!injection.safe) {
    return {
      passed: false,
      sanitizedInput: '',
      error: 'Security protocol: Input violates conversational safety guidelines.',
    };
  }

  const pii = sanitizePii(input);
  return {
    passed: true,
    sanitizedInput: pii.cleanText,
    hadPii: pii.hasPii,
  };
}
