// Decap CMS GitHub OAuth Authentication Endpoint
// Vercel Serverless Function

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const client_id = process.env.GITHUB_CLIENT_ID;

  if (!client_id) {
    res.status(500).json({ error: 'GITHUB_CLIENT_ID not configured' });
    return;
  }

  // Generate random state for CSRF protection
  const state = Buffer.from(Math.random().toString()).toString('base64');

  // GitHub OAuth authorization URL
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', client_id);
  githubAuthUrl.searchParams.set('redirect_uri', `${req.headers.origin || 'https://www.ettatradingcorp.com'}/api/callback`);
  githubAuthUrl.searchParams.set('scope', 'repo,user');
  githubAuthUrl.searchParams.set('state', state);

  // Redirect to GitHub OAuth
  res.redirect(302, githubAuthUrl.toString());
}
