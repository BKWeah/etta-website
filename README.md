# ETTA Trading Corporation Website

Premium static multi-page website with Decap CMS, GitHub backend, and Vercel-compatible OAuth.

## Structure

- `index.html`
- `about.html`
- `products.html`
- `operations.html`
- `sustainability.html`
- `leadership.html`
- `gallery.html`
- `contact.html`
- `admin/config.yml`
- `content/site.json`
- `images/`
- `api/auth.js`
- `api/callback.js`

## Deployment

1. Push all files to GitHub.
2. Import GitHub repo into Vercel.
3. Add Vercel environment variables:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
4. GitHub OAuth App callback URL:
   - `https://www.ettatradingcorp.com/api/callback`
5. Visit:
   - `https://www.ettatradingcorp.com/admin`

## Important

The Decap config currently uses:

```yml
repo: BKWeah/etta-website
```

If your GitHub repo owner/name is different, edit `admin/config.yml`.
