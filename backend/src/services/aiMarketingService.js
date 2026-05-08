import { openai } from '../config/openai.js';
import { buildPrompt } from '../utils/buildPrompt.js';

export async function generateMarketingPlan(input) {
  console.log(`🤖 Generating plan for: "${input.eventName}"...`);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 4096,
    temperature: 0.7,
    messages: [
      { role: 'system', content: 'You are an expert Sri Lankan event marketing strategist. Always respond with valid JSON only.' },
      { role: 'user', content: buildPrompt(input) },
    ],
    response_format: { type: 'json_object' },
  });

  try {
    const plan = JSON.parse(completion.choices[0].message.content);
    console.log(`✅ Plan generated for: "${input.eventName}"`);
    return plan;
  } catch {
    const err = new Error('AI returned unexpected format.');
    err.code = 'AI_PARSE_ERROR';
    throw err;
  }
}
