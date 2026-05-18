export default async function handler(req, res) {
  const { code } = req.query;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    res.status(400).send("Missing GitHub OAuth code.");
    return;
  }

  if (!clientId || !clientSecret) {
    res.status(500).send("Missing GitHub OAuth environment variables.");
    return;
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    });

    const data = await tokenRes.json();

    if (!data.access_token) {
      res.status(500).send("GitHub OAuth failed: " + JSON.stringify(data));
      return;
    }

    const token = data.access_token;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`<!doctype html>
<html>
<body>
<script>
(function() {
  function receiveMessage(message) {
    window.opener.postMessage(
      'authorization:github:success:' + JSON.stringify({ token: '${token}', provider: 'github' }),
      message.origin
    );
    window.removeEventListener('message', receiveMessage, false);
    window.close();
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
<p>Authentication complete. You may close this window.</p>
</body>
</html>`);
  } catch (error) {
    res.status(500).send("OAuth callback error: " + error.message);
  }
}
