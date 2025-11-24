import 'dotenv/config';
import readline from 'node:readline';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// --------- TYPES DE MESSAGES ---------

type Role = 'system' | 'user' | 'assistant';

interface ChatMessage {
  role: Role;
  content: string;
}

const SYSTEM_PROMPT = `
Tu es "ADR-CORE", l’agent personnel d’Adrien.

RÈGLES :
- Une seule tâche à la fois.
- Focus maximal.
- Code premium.
- Toujours répondre avec deux blocs :

[PLAN]
- 3 à 5 étapes actionnables

[CONSEIL]
- Un conseil focus

[REPONSE_POUR_ADRIEN]
<<<
Réponse claire, premium, concise
>>>

[PROMPT_POUR_CLAUDE]
<<<
Prompt complet, autonome, destiné à Claude
>>>
`;

const conversation: ChatMessage[] = [
  { role: 'system', content: SYSTEM_PROMPT.trim() }
];

// --------- COMMANDES ---------

async function handleCommand(input: string): Promise<null | string> {
  const trimmed = input.trim();

  // Quitter
  if (trimmed === ':exit' || trimmed === ':quit') {
    console.log('👋 Fin de session. Reste focus, Adrien.');
    rl.close();
    process.exit(0);
  }

  // Reset mémoire
  if (trimmed === ':reset') {
    conversation.splice(1);
    console.log('🧹 Mémoire réinitialisée.\n');
    return null;
  }

  // Mode focus
  if (trimmed === ':focus') {
    return `
MODE FOCUS EXTRÊME ACTIVÉ.
Réponses ultra concises. Une seule priorité.
`.trim();
  }

  // Nouvelle tâche
  if (trimmed.startsWith(':task ')) {
    const goal = trimmed.replace(':task ', '');
    return `
🎯 NOUVEL OBJECTIF : ${goal}
ADR-CORE va te guider étape par étape.
`.trim();
  }

  // Envoi direct à Claude
  if (trimmed.startsWith(':claude ')) {
    const prompt = trimmed.replace(':claude ', '').trim();

    try {
      console.log('\n🧠 Envoi à Claude…');

      const msg = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const text = msg.content
        .filter(block => block.type === 'text')
        .map(block => (block as any).text)
        .join('\n');

      console.log('\n✉️ Réponse de Claude :\n');
      console.log(text + '\n');

      return null;
    } catch (err) {
      console.error('⚠️ Erreur Claude :', (err as any)?.message ?? err);
      return null;
    }
  }

  return '__NO_COMMAND__';
}

// --------- OPENAI ---------

async function callOpenAI(messages: ChatMessage[]): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4.1',
    messages: messages.map(m => ({
      role: m.role,
      content: m.content
    })),
    temperature: 0.3
  });

  const content = response.choices[0]?.message?.content;
  return content ?? '(vide)';
}

// --------- PARSING ---------

function splitAnswer(full: string): { forAdrien: string; forClaude: string } {
  const marker = '[PROMPT_POUR_CLAUDE]';
  const rawIndex = full.indexOf(marker);

  if (rawIndex === -1) {
    return {
      forAdrien: full.trim(),
      forClaude: '⚠️ AUCUN PROMPT POUR CLAUDE TROUVÉ.'
    };
  }

  const forAdrien = full.slice(0, rawIndex).trim();

  const blockStart = full.indexOf('<<<', rawIndex);
  const blockEnd = full.indexOf('>>>', blockStart);

  if (blockStart === -1 || blockEnd === -1) {
    return {
      forAdrien,
      forClaude: '⚠️ Bloc Claude mal formaté.'
    };
  }

  const inside = full.slice(blockStart + 3, blockEnd).trim();

  return {
    forAdrien,
    forClaude: inside
  };
}

// --------- REPL TERMINAL ---------

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 ADR-CORE lancé.');
console.log('Commandes : :focus / :task / :claude / :reset / :exit\n');

function loop() {
  rl.question('👤 Adrien > ', async (input: string) => {
    const trimmed = input.trim();

    // 1. Commander ?
    const command = await handleCommand(trimmed);

    if (command === null) {
      loop();
      return;
    }

    if (command !== '__NO_COMMAND__') {
      console.log('\n🤖 ADR-CORE (commande) >\n');
      console.log(command + '\n');
      loop();
      return;
    }

    // 2. Message normal → OpenAI
    conversation.push({ role: 'user', content: trimmed });

    try {
      const answer = await callOpenAI(conversation);
      conversation.push({ role: 'assistant', content: answer });

      const parsed = splitAnswer(answer);

      console.log('\n🤖 ADR-CORE >\n');
      console.log(parsed.forAdrien + '\n');

      console.log('🧠 PROMPT POUR CLAUDE :');
      console.log('----------------------------------');
      console.log(parsed.forClaude);
      console.log('----------------------------------\n');

    } catch (error: any) {
      console.error('Erreur API :', error?.message ?? error);
    }

    loop();
  });
}



