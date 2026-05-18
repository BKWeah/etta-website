// Decap CMS GitHub OAuth Callback Endpoint
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
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    res.status(500).json({ error: 'GitHub OAuth credentials not configured' });
    return;
  }

  const { code, state } = req.query;

  if (!code) {
    res.status(400).json({ error: 'Missing authorization code' });
    return;
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
        redirect_uri: `${req.headers.origin || 'https://www.ettatradingcorp.com'}/api/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      res.status(400).json({ error: tokenData.error_description || tokenData.error });
      return;
    }

    const accessToken = tokenData.access_token;

    // Create the authorization message for Decap CMS
    const content = JSON.stringify({ token: accessToken, provider: 'github' });
    const message = JSON.stringify(`authorization:github:success:${content}`);

    // Return HTML that communicates with parent window
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authenticating...</title>
</head>
<body>
  <script>
    (function() {
      function receiveMessage(e) {
        if (!e.data || typeof e.data !== 'string') return;

        // Send authorization result to parent window
        window.opener.postMessage(
          ${message},
          e.origin
        );
      }

      window.addEventListener("message", receiveMessage, false);

      // Start handshake with parent
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script>
  <p>Authentication successful. Closing window...</p>
</body>
</html>
    `);
  } catch (error) {
    console.error('OAuth callback error:', error);

    const errorContent = JSON.stringify({ error: error.message });
    const errorMessage = JSON.stringify(`authorization:github:error:${errorContent}`);

    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authentication Error</title>
</head>
<body>
  <script>
    (function() {
      function receiveMessage(e) {
        if (!e.data || typeof e.data !== 'string') return;

        window.opener.postMessage(
          ${errorMessage},
          e.origin
        );
      }

      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script>
  <p>Authentication failed. Please try again.</p>
</body>
</html>
    `);
  }
}
