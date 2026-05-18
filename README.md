# ETTA Trading Corporation Website

Premium static corporate website with Decap CMS integration for content management.

## Architecture

- **Frontend**: Static HTML/CSS/JS (no frameworks)
- **CMS**: Decap CMS (formerly Netlify CMS)
- **Backend**: GitHub
- **Hosting**: Vercel
- **Data**: JSON-driven content from `content/site.json`

## Project Structure

```
├── index.html          # Main website
├── admin/
│   ├── index.html      # Decap CMS interface
│   └── config.yml      # CMS configuration
├── content/
│   └── site.json       # All website content
├── css/
│   └── main.css        # Stylesheet
├── js/
│   └── main.js         # JavaScript functionality
├── api/
│   ├── auth.js         # GitHub OAuth auth endpoint
│   └── callback.js     # GitHub OAuth callback endpoint
├── images/             # Static images
├── vercel.json         # Vercel configuration
└── README.md           # This file
```

## Deployment

### Prerequisites

1. GitHub repository created
2. Vercel account connected to GitHub
3. GitHub OAuth App created
4. Environment variables configured in Vercel

### Environment Variables

| Variable | Description | Source |
|----------|-------------|--------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | GitHub Developer Settings |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret | GitHub Developer Settings |

### Setup Steps

1. **Create GitHub OAuth App**:
   - Go to GitHub Settings > Developer Settings > OAuth Apps > New OAuth App
   - Application name: ETTA Website CMS
   - Homepage URL: `https://www.ettatradingcorp.com`
   - Authorization callback URL: `https://www.ettatradingcorp.com/api/callback`
   - Save Client ID and Client Secret

2. **Configure Vercel**:
   - Import your GitHub repository
   - Add environment variables in Project Settings
   - Deploy

3. **Configure Decap CMS**:
   - Update `admin/config.yml` with your repo details
   - Access CMS at `https://www.ettatradingcorp.com/admin`

## CMS Usage

### Accessing the CMS

Navigate to `https://www.ettatradingcorp.com/admin`

### Authentication

1. Click "Login with GitHub"
2. Authorize the OAuth app
3. You'll be redirected back to the CMS

### Editing Content

The CMS allows editing of:
- Site settings (title, description, logo)
- Navigation links
- Hero section content
- About section
- Products
- Operations
- Sustainability initiatives
- Leadership profiles
- Gallery images
- Contact information
- Footer content

### Publishing Changes

1. Make edits in the CMS
2. Click "Publish" (creates a commit)
3. Vercel automatically redeploys
4. Changes go live within minutes

## Development

### Local Testing

Serve the site locally using any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

### Local CMS Testing

For local CMS development, update `admin/config.yml`:

```yaml
backend:
  name: github
  repo: your-username/your-repo
  branch: main
  base_url: http://localhost:8000
```

## Contact

For technical support, contact the development team.
