# 🚀 GitHub Pages Deployment Guide

## ✅ Setup Complete!

Your Angular app is now configured for GitHub Pages deployment with automatic CI/CD.

---

## 📋 What Was Configured

### 1. **GitHub Actions Workflow**
- ✅ `.github/workflows/deploy.yml` - Auto-deploys on push to `master`
- ✅ Builds production-ready Angular app
- ✅ Deploys to GitHub Pages automatically

### 2. **Package Scripts**
```json
{
  "build:prod": "ng build --configuration production --base-href /FunSMS.Angular/",
  "deploy": "ng deploy --base-href=/FunSMS.Angular/"
}
```

### 3. **SPA Routing Support**
- ✅ `public/404.html` - Handles direct URL access
- ✅ `src/index.html` - Routing script added

### 4. **Dependencies**
- ✅ `angular-cli-ghpages` - Deployment tool

---

## 🎯 Deployment Steps

### **Option 1: Automatic Deployment (Recommended)**

Simply push your code to the `master` branch and GitHub Actions will automatically build and deploy:

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin master
```

Then:
1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Wait 2-3 minutes for the workflow to complete
5. Your site will be live at: **https://tengizmikhelidze.github.io/FunSMS.Angular/**

### **Option 2: Manual Deployment**

Deploy manually using the CLI:

```bash
# Build production
pnpm run build:prod

# Deploy to GitHub Pages
pnpm run deploy
```

---

## 🔧 GitHub Repository Settings

### Enable GitHub Pages:

1. Go to your repository: `https://github.com/tengizmikhelidze/FunSMS.Angular`
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**, select:
   - **Source**: `GitHub Actions` (recommended)
   - OR **Branch**: `gh-pages` (if using manual deploy)
5. Click **Save**

### Set Permissions for GitHub Actions:

1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

---

## 🌐 Your Live URLs

After deployment, your app will be available at:

- **Production**: `https://tengizmikhelidze.github.io/FunSMS.Angular/`
- **API**: Make sure your backend API allows CORS from this domain

---

## 📝 Important Notes

### Base Href
The app is configured with base href `/FunSMS.Angular/` to match your repository name. If you rename the repo, update:
- `package.json` → `build:prod` script
- `package.json` → `deploy` script

### Environment Variables
For production API endpoint, update your environment files:

```typescript
// src/environments/environment.prod.ts (if you create one)
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-api.com'
};
```

### API Proxy
The `proxy.conf.json` only works in development. For production:
1. Use absolute API URLs
2. Configure CORS on your backend to allow GitHub Pages domain

---

## 🔍 Monitoring Deployments

### Check Workflow Status:
1. Go to **Actions** tab in your GitHub repo
2. See all deployment runs
3. Click on a run to see logs

### Troubleshooting Failed Deployments:
- Check the workflow logs in **Actions** tab
- Ensure all tests pass
- Verify build succeeds locally with `pnpm run build:prod`

---

## 🎨 Custom Domain (Optional)

To use a custom domain like `funsms.com`:

1. Add a `CNAME` file to `/public`:
   ```
   funsms.com
   ```

2. Configure DNS records with your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: tengizmikhelidze.github.io
   ```

3. In GitHub Settings → Pages → Custom domain:
   - Enter your domain
   - Enable **Enforce HTTPS**

---

## 📦 Files Added/Modified

### New Files:
- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `public/404.html` - SPA routing support

### Modified Files:
- `package.json` - Added deployment scripts
- `angular.json` - Added deploy builder
- `src/index.html` - Added SPA routing script

---

## ✅ Next Steps

1. **Push your code**:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin master
   ```

2. **Enable GitHub Pages** in repository settings

3. **Wait for deployment** (2-3 minutes)

4. **Visit your site**: `https://tengizmikhelidze.github.io/FunSMS.Angular/`

---

## 🎉 Success!

Your Angular app is now configured for automatic deployment to GitHub Pages!

Every push to `master` will automatically build and deploy your app.

**Live URL**: https://tengizmikhelidze.github.io/FunSMS.Angular/

---

## 🆘 Common Issues

### Issue: 404 on refresh
**Solution**: The `404.html` and routing script should handle this. If not, ensure both files are deployed.

### Issue: Blank page
**Solution**: 
- Check browser console for errors
- Verify `base href` is correct in production build
- Check if assets are loading from correct path

### Issue: API calls fail
**Solution**:
- Update API URLs to absolute paths
- Configure CORS on backend
- Check browser console for CORS errors

### Issue: GitHub Actions workflow fails
**Solution**:
- Check workflow logs in Actions tab
- Ensure repository has proper permissions
- Verify pnpm and Node versions in workflow

---

## 📞 Support

For deployment issues:
1. Check GitHub Actions logs
2. Review this guide
3. Check Angular CLI documentation
4. Verify GitHub Pages settings

**Happy Deploying! 🚀**

