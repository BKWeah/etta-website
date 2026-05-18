# ETTA Trading Corporation - Deployment Guide

## Complete Deployment Instructions

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `etta-website` (or your preferred name)
3. Make it public or private
4. Initialize with README (optional)
5. Create repository

### Step 2: Create GitHub OAuth Application

1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" > "New OAuth App"
3. Fill in the form:
   - **Application name**: ETTA Website CMS
   - **Homepage URL**: `https://www.ettatradingcorp.com`
   - **Application description**: Decap CMS authentication for ETTA Trading Corporation website
   - **Authorization callback URL**: `https://www.ettatradingcorp.com/api/callback`
4. Click "Register application"
5. On the next page, note down:
   - **Client ID**
   - **Client Secret** (click "Generate a new client secret")

### Step 3: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial ETTA website with Decap CMS"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/ettatradingcorp/etta-website.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 4: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Other (static)
   - **Root Directory**: `./` (default)
4. Click "Deploy"
5. Wait for deployment to complete

### Step 5: Configure Environment Variables

1. In Vercel Dashboard, go to your project
2. Navigate to **Settings** > **Environment Variables**
3. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `GITHUB_CLIENT_ID` | Your GitHub OAuth Client ID | Production, Preview, Development |
| `GITHUB_CLIENT_SECRET` | Your GitHub OAuth Client Secret | Production, Preview, Development |

4. Click "Save"
5. **Redeploy** the project (required for env vars to take effect)

### Step 6: Configure Custom Domain

1. In Vercel Dashboard, go to **Settings** > **Domains**
2. Add your domain: `www.ettatradingcorp.com`
3. Follow Vercel's DNS configuration instructions
4. Update DNS records at your domain registrar
5. Wait for DNS propagation (can take up to 48 hours)

### Step 7: Configure CMS

1. Update `admin/config.yml` in your repo:
   - Change `repo` to your actual GitHub repo path
   - Change `base_url` to your production domain

```yaml
backend:
  name: github
  repo: ettatradingcorp/etta-website  # YOUR REPO
  branch: main
  base_url: https://www.ettatradingcorp.com  # YOUR DOMAIN
  auth_endpoint: api/auth
```

2. Commit and push the changes
3. Vercel will auto-redeploy

### Step 8: Test CMS

1. Navigate to `https://www.ettatradingcorp.com/admin`
2. Click "Login with GitHub"
3. Authorize the application
4. You should see the Decap CMS interface
5. Try editing some content and publishing

## Troubleshooting

### CMS Login Not Working

1. Check that `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct
2. Verify the Authorization callback URL in GitHub OAuth App matches your domain
3. Ensure environment variables are set in Vercel and project was redeployed
4. Check browser console for errors

### Changes Not Reflecting

1. Verify `content/site.json` was committed by the CMS
2. Check Vercel deployment logs
3. Clear browser cache and hard refresh

### Images Not Loading

1. Check image paths in `content/site.json`
2. Ensure images are in the `images/` directory
3. Verify image file names match exactly (case-sensitive)

## Auto-Redeployment

Vercel automatically redeploys when:
- New commits are pushed to the main branch
- CMS publishes changes (creates commits)
- Environment variables are updated

## Support

For issues with:
- **Website**: Check browser console and Vercel logs
- **CMS**: Verify OAuth configuration and GitHub permissions
- **Deployment**: Review Vercel build logs
