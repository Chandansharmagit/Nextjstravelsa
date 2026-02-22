# Netlify Deployment Guide for Next.js 16

## 🚀 Quick Setup

### 1. Install Required Dependencies

```bash
cd frontend
npm install @netlify/plugin-nextjs --save-dev
```

### 2. Files Created
- ✅ `netlify.toml` - Netlify configuration
- ✅ `next.config.ts` - Next.js configuration (updated)

---

## 📋 Pre-Deployment Checklist

### Before Deploying to Netlify:

- [ ] Install `@netlify/plugin-nextjs` as dev dependency
- [ ] Commit `netlify.toml` to your repository
- [ ] Set environment variables in Netlify dashboard
  - `NEXT_PUBLIC_API_URL` = Your production backend URL
- [ ] Test build locally: `npm run build && npm start`
- [ ] Verify all dynamic routes work locally
- [ ] Push all changes to GitHub

### In Netlify Dashboard:

1. **Build Settings** (automatically configured via netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**:
   - Add `NEXT_PUBLIC_API_URL` with your production backend URL
   - Example: `https://backendtsa.travelsansar.com/api`

3. **Deploy Settings**:
   - Enable automatic deployments from your main branch
   - Custom domain: Add and verify your domain

---

## 🔧 Configuration Breakdown

### netlify.toml Explained

```toml
[build]
  command = "npm run build"
  # WHY: Builds your Next.js app for production
  
  publish = ".next"
  # WHY: Next.js outputs SSR build to .next directory
  # The plugin reads from here to create Netlify Functions

[[plugins]]
  package = "@netlify/plugin-nextjs"
  # WHY: Critical! Converts Next.js pages to Netlify Functions
  # Enables SSR, handles dynamic routes, ISR, and API routes

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  # WHY: Ensures client-side navigation works after page refresh
  # Prevents 404 on direct URL access
```

### Why SSR (Not Static Export)?

Your app uses:
- ✅ Dynamic routes: `/tours/[id]`, `/destinations/[id]`, `/blog/[id]`
- ✅ `useSearchParams()` for URL filtering
- ✅ Server-side data fetching
- ✅ Suspense boundaries

❌ Static export (`output: "export"`) would:
- Break dynamic routes
- Lose server-side rendering benefits
- Require all pages pre-generated at build time

---

## 🐛 Troubleshooting 404 Errors

### If 404 errors occur:

1. **Check Plugin Installation**
   ```bash
   npm list @netlify/plugin-nextjs
   # Should show: @netlify/plugin-nextjs@5.x.x
   ```

2. **Verify netlify.toml**
   - File must be in root of frontend directory
   - Must be committed to git

3. **Check Netlify Build Logs**
   - Look for: "Next.js plugin detected"
   - Ensure build completes successfully

4. **Environment Variables**
   - Verify all `NEXT_PUBLIC_*` variables are set
   - Restart deployment after adding variables

5. **Custom Domain DNS**
   - Ensure DNS is pointing to Netlify
   - Wait for SSL certificate provisioning

---

## ✅ Verification Steps

### After Deployment:

1. **Test Netlify Subdomain**:
   - Visit: `https://your-site.netlify.app`
   - Test all routes
   - Refresh pages (should not 404)
   - Test dynamic routes

2. **Test Custom Domain**:
   - Visit: `https://your-custom-domain.com`
   - Repeat all tests from step 1
   - Should behave identically to subdomain

3. **Test Client-Side Navigation**:
   - Navigate between pages using links
   - Use browser back/forward buttons
   - Refresh browser on any page
   - All should work without errors

---

## 🎯 Expected Behavior

✅ **Correct Setup**:
- Netlify subdomain and custom domain behave identically
- All routes accessible directly via URL
- Client-side navigation works smoothly
- Page refresh does not cause 404
- Dynamic routes load data correctly

❌ **Incorrect Setup** (what we prevented):
- 404 on custom domain but works on subdomain
- Direct URL access fails
- Page refresh causes 404
- Dynamic routes return 404

---

## 📝 Common Mistakes to Avoid

1. ❌ Using `output: "export"` with dynamic routes
2. ❌ Wrong publish directory (e.g., `out` instead of `.next`)
3. ❌ Forgetting to install `@netlify/plugin-nextjs`
4. ❌ Not committing `netlify.toml` to repository
5. ❌ Missing environment variables in Netlify

---

## 🔄 Updating Production

When you push changes:
1. Netlify automatically detects push
2. Runs `npm run build`
3. Deploys new version
4. Both subdomain and custom domain update

No manual intervention needed! ✨
