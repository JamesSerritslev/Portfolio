const INJECTION = [
  /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions|rules|prompts|directions)/i,
  /disregard\s+(your|the|all)\s+(instructions|rules|system|prompt)/i,
  /forget\s+(everything|all|your)\s+(instructions|rules|previous)/i,
  /(reveal|show|print|repeat|output|dump)\s+(your|the)\s+(system\s+prompt|hidden\s+prompt|instructions|rules)/i,
  /what\s+(is|are)\s+your\s+(system\s+prompt|hidden\s+prompt|instructions)/i,
  /you\s+are\s+now\s+(a\s+|an\s+)?(different|new|unrestricted|evil|uncensored|dan)\b/i,
  /\b(jailbreak|do\s+anything\s+now)\b/i,
  /(^|\n)\s*(system|developer)\s*:\s*/i,
  /new\s+(system\s+)?instructions\s*:/i,
  /override\s+(your|the)\s+(rules|instructions|prompt)/i,
  /act\s+as\s+(a\s+|an\s+)?(different|unrestricted|evil|uncensored)/i,
  /<\s*\/?\s*(system|instructions)\s*>/i,
];

const ABOUT_JAMES =
  /\b(james|serritslev|resume|experience|project|bandscope|analogue|standing sun|portfolio|hire|hiring|job|role|position|developer|engineer|seo|website|skill|background|built|internship|recruit|candidate|qualif)/i;

const OFF_TOPIC = [
  /\b(joke|poem|haiku|limerick|song lyrics|recipe)\b/i,
  /\b(weather|forecast)\b/i,
  /\b(write|generate|debug)\s+(me\s+)?(some\s+)?(code|python|javascript|a function)\b/i,
  /\b(capital of|who (is|was) the president|super bowl|world series)\b/i,
  /\b(homework|solve this equation|translate (this|the following))\b/i,
  /\b(stock price|bitcoin price)\b/i,
];

/** True when the latest visitor message tries to override the assistant or leave James's work. */
export function visitorIsOutOfScope(text: string): boolean {
  const value = text.trim();
  if (!value) return false;
  if (INJECTION.some((pattern) => pattern.test(value))) return true;
  if (ABOUT_JAMES.test(value)) return false;
  return OFF_TOPIC.some((pattern) => pattern.test(value));
}
