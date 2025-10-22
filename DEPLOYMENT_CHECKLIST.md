# ✅ Deployment Checklist

## Before You Start

- [ ] XAMPP MySQL is running locally
- [ ] Backend runs successfully on `localhost:8081`
- [ ] Frontend runs successfully on `localhost:5173`
- [ ] You have a GitHub account
- [ ] You have a Groq API key (get from https://console.groq.com)

---

## Part 1: GitHub (5 min)

- [ ] Created `.gitignore` file
- [ ] Verified secrets are NOT in git (run `git status`)
- [ ] Initialized git repository (`git init`)
- [ ] Added all files (`git add .`)
- [ ] Created first commit
- [ ] Created GitHub repository (private recommended)
- [ ] Connected to GitHub (`git remote add origin ...`)
- [ ] Pushed to GitHub (`git push -u origin main`)
- [ ] Verified code is on GitHub

**✅ GitHub URL:** `https://github.com/YOUR_USERNAME/iare-campusconnect`

---

## Part 2: Railway - Backend + Database (7 min)

### Setup
- [ ] Signed up at https://railway.app with GitHub
- [ ] Created new project from GitHub repo
- [ ] Added MySQL database to project
- [ ] Configured backend root directory to `backend`

### Environment Variables
- [ ] Set `SPRING_DATASOURCE_URL`
- [ ] Set `SPRING_DATASOURCE_USERNAME`
- [ ] Set `SPRING_DATASOURCE_PASSWORD`
- [ ] Set `JWT_SECRET` (256-bit random string)
- [ ] Set `GROQ_API_KEY`
- [ ] Set `SERVER_PORT=8080`

### Deployment
- [ ] Backend deployed successfully
- [ ] Generated public domain
- [ ] Tested backend URL (visit `/api/auth/test`)
- [ ] Checked deployment logs (no errors)

**✅ Backend URL:** `https://__________.railway.app`

---

## Part 3: Vercel - Frontend (5 min)

### Setup
- [ ] Signed up at https://vercel.com with GitHub
- [ ] Imported GitHub repository
- [ ] Set framework preset to **Vite**
- [ ] Set root directory to `frontend`
- [ ] Set build command to `npm run build`
- [ ] Set output directory to `dist`

### Environment Variables
- [ ] Set `VITE_API_URL` to Railway backend URL + `/api`

### Deployment
- [ ] Frontend deployed successfully
- [ ] Visited Vercel URL
- [ ] Can see login/signup page
- [ ] No console errors

**✅ Frontend URL:** `https://__________.vercel.app`

---

## Part 4: Final Configuration (2 min)

### Update CORS
- [ ] Updated `SecurityConfig.java` with Vercel URL
- [ ] Committed changes
- [ ] Pushed to GitHub (`git push`)
- [ ] Railway auto-redeployed backend

### Test Everything
- [ ] Can sign up on live site
- [ ] Can log in on live site
- [ ] Can send messages to chatbot
- [ ] Chatbot responds correctly
- [ ] Can view chat history
- [ ] Can export chat as PDF
- [ ] Dark mode works
- [ ] Mobile responsive

---

## Optional: Import Data

- [ ] Exported local MySQL database
- [ ] Connected to Railway MySQL
- [ ] Imported data to Railway
- [ ] Verified data in production

---

## Post-Deployment

### Share Your App
- [ ] Tested all features on live site
- [ ] Shared URL with friends/classmates
- [ ] Added README with live URL
- [ ] Created demo video (optional)

### Monitor
- [ ] Checked Railway logs
- [ ] Checked Vercel analytics
- [ ] Monitored database usage
- [ ] Set up error alerts (optional)

### Documentation
- [ ] Updated README with live URLs
- [ ] Documented any issues encountered
- [ ] Created user guide (optional)

---

## 🎉 Deployment Complete!

**Your Live URLs:**

- Frontend: `https://__________.vercel.app`
- Backend: `https://__________.railway.app`
- GitHub: `https://github.com/YOUR_USERNAME/iare-campusconnect`

---

## 📊 Resource Usage

Check your usage:
- **Railway:** https://railway.app/account/usage
- **Vercel:** https://vercel.com/dashboard/usage

---

## 🔄 Making Updates

After deployment, to update your app:

```powershell
# 1. Make changes locally
# 2. Test locally
# 3. Commit and push
git add .
git commit -m "Description of changes"
git push

# Railway and Vercel will auto-deploy! ✨
```

---

## 🆘 If Something Goes Wrong

### Backend Issues
1. Check Railway logs
2. Verify environment variables
3. Check database connection
4. Review build logs

### Frontend Issues
1. Check Vercel deployment logs
2. Verify VITE_API_URL
3. Check browser console
4. Test API connection

### Database Issues
1. Check Railway MySQL status
2. Verify connection string
3. Check credentials
4. Review database logs

---

**Need Help?** Check `DEPLOY_NOW.md` for detailed troubleshooting!
