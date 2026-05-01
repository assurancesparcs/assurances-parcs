export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: `Tu es l'assistant virtuel d'AssurAudio, le cabinet de courtage spécialisé pour les audioprothésistes en France.
Tu aides les audioprothésistes à comprendre leurs besoins en assurance : mutuelle santé professionnelle, prévoyance (arrêt maladie, invalidité, décès), assurance multirisque et RC Pro pour leur centre, et assurance emprunteur pour leurs projets.
Réponds en français, de façon concise et professionnelle. Oriente toujours vers un devis gratuit ou un bilan découverte de 30 minutes avec un conseiller.
Ne donne jamais de tarifs précis — propose plutôt de les rappeler pour une étude personnalisée.`,
        messages: messages.slice(-10)
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return res.status(500).json({ error: 'API error' });
    }

    const data = await response.json();
    return res.status(200).json({ reply: data.content[0].text });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
