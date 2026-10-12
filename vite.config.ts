import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function geminiServerPlugin(envApiKey?: string): Plugin {
  return {
    name: 'gemini-server-endpoint',
    configureServer(server) {
      server.middlewares.use('/api/gemini-chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const payload = JSON.parse(body || '{}');
            const { prompt, language = 'en', farmSummary = '' } = payload;

            const apiKey = process.env.GEMINI_API_KEY || envApiKey || '';

            if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                isConfigured: false,
                isOnlineGemini: false,
                error: 'GEMINI_API_KEY_NOT_CONFIGURED',
                message: 'No active GEMINI_API_KEY found in server environment. Use rule-based assistant fallback.'
              }));
              return;
            }

            // Lazy import @google/genai on server
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey });

            const isTa = language === 'ta';
            const systemPrompt = `You are Farm2Pay AI Assistant, an agricultural finance and marketplace expert for Indian farmers.
Language Requirement: You MUST respond in ${isTa ? 'Tamil (தமிழ்)' : 'English'}.

CRITICAL DATA GROUNDING RULES:
1. Ground your answers strictly in the farmer's live recorded farm metrics provided below.
2. DO NOT hallucinate or invent fake transactions, loans, crop prices, or budgets.
3. Keep all EMI, profit margin, expense percentages, and net proceed numbers consistent with the provided summary.
4. Provide practical, empathetic, and actionable guidance for smallholder farmers.
5. If responding in Tamil, use polite, clear, natural spoken/written Tamil (Vanakkam, etc.).

LIVE FARM DATA CONTEXT:
${farmSummary || 'No financial records loaded yet.'}
`;

            const promptToSend = `${systemPrompt}\n\nFARMER QUESTION:\n${prompt}`;

            // Try gemini-2.5-flash, fallback to gemini-2.0-flash or gemini-1.5-flash
            let text = '';
            let modelUsed = 'gemini-2.5-flash';

            try {
              const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: promptToSend,
              });
              text = result.text || '';
            } catch (err: any) {
              // Fallback model if 2.5-flash is unavailable or rate limited
              try {
                modelUsed = 'gemini-2.0-flash';
                const result = await ai.models.generateContent({
                  model: 'gemini-2.0-flash',
                  contents: promptToSend,
                });
                text = result.text || '';
              } catch (fallbackErr: any) {
                modelUsed = 'gemini-1.5-flash';
                const result = await ai.models.generateContent({
                  model: 'gemini-1.5-flash',
                  contents: promptToSend,
                });
                text = result.text || '';
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              isConfigured: true,
              isOnlineGemini: true,
              model: modelUsed,
              answer: text.trim()
            }));
          } catch (err: any) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              isConfigured: true,
              isOnlineGemini: false,
              error: err.message || 'Error communicating with Google Gemini API',
              message: 'Gemini request encountered an error. Seamlessly fallback to offline rule-based response.'
            }));
          }
        });
      });
    },
    configurePreviewServer(server) {
      // Also enable in vite preview
      server.middlewares.use('/api/gemini-chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const payload = JSON.parse(body || '{}');
            const { prompt, language = 'en', farmSummary = '' } = payload;
            const apiKey = process.env.GEMINI_API_KEY || envApiKey || '';

            if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                isConfigured: false,
                isOnlineGemini: false,
                error: 'GEMINI_API_KEY_NOT_CONFIGURED',
              }));
              return;
            }

            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey });
            const isTa = language === 'ta';
            const systemPrompt = `You are Farm2Pay AI Assistant for Indian farmers. Respond in ${isTa ? 'Tamil' : 'English'}.\nContext:\n${farmSummary}`;
            const result = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `${systemPrompt}\n\nQuestion: ${prompt}`,
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              isConfigured: true,
              isOnlineGemini: true,
              model: 'gemini-2.5-flash',
              answer: (result.text || '').trim()
            }));
          } catch (err: any) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              isConfigured: true,
              isOnlineGemini: false,
              error: err.message,
            }));
          }
        });
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  return {
    plugins: [
      react(),
      geminiServerPlugin(apiKey)
    ],
  };
});
