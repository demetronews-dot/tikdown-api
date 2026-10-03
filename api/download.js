// api/download.js
// Proxy seguro para a API TikTok no RapidAPI
// A chave fica na variável de ambiente RAPIDAPI_KEY (nunca no código)

export default async function handler(req, res) {
  // ===== CORS =====
  // Permite que o Blogger chame esta função
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responde ao preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Aceita apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST.' });
  }

  try {
    const { url } = req.body;

    // Validação básica
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL do TikTok é obrigatória.' });
    }

    // ===== CHAVE (SEGURA) =====
    // Lida da variável de ambiente do Vercel - NUNCA no código
    const apiKey = process.env.RAPIDAPI_KEY;

    if (!apiKey) {
      console.error('RAPIDAPI_KEY não configurada nas variáveis de ambiente');
      return res.status(500).json({ error: 'Erro de configuração do servidor.' });
    }

    // ===== CHAMADA À API TIKTOK =====
    const rapidApiHost = 'tiktok-video-downloader25.p.rapidapi.com';
    const encodedUrl = encodeURIComponent(url);
    const apiEndpoint = `https://${rapidApiHost}/api/v1?url=${encodedUrl}`;

    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': rapidApiHost
      }
    });

    // Verifica se a resposta foi OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro RapidAPI:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Erro ao processar o vídeo. Verifique se o link é válido.'
      });
    }

    const data = await response.json();

    // ===== DEVOLVE OS DADOS PARA O BLOGGER =====
    return res.status(200).json({ success: true, data: data });

  } catch (error) {
    console.error('Erro na função serverless:', error);
    return res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
}
