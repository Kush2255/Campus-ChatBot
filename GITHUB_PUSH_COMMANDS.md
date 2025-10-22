# 📤 Quick GitHub Push Commands

## First Time Setup (Do Once)

### Step 1: Initialize Git
```powershell
cd d:\CHATBOT
git init
```

### Step 2: Add All Files
```powershell
git add .
```

### Step 3: Create First Commit
```powershell
git commit -m "Initial commit: IARE CampusConnect Chatbot"
```

### Step 4: Create GitHub Repository
1. Go to https://github.com
2. Click "New Repository" (green button)
3. Repository name: `iare-campusconnect` or `campusconnect-chatbot`
4. Description: "AI-Powered Chatbot for IARE College Enquiries"
5. Choose **Private** (recommended to protect API keys)
6. **DO NOT** check "Initialize with README"
7. Click "Create Repository"

### Step 5: Connect to GitHub
```powershell
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/iare-campusconnect.git

# Verify remote was added
git remote -v
```

### Step 6: Push to GitHub
```powershell
git branch -M main
git push -u origin main
```

**Enter your GitHub credentials when prompted**

---

## Making Updates (After Initial Setup)

### Every time you make changes:

```powershell
# 1. Check what changed
git status

# 2. Add all changes
git add .

# 3. Commit with a message
git commit -m "Your descriptive message here"

# 4. Push to GitHub
git push
```

### Example workflow:
```powershell
# After adding PDF export feature
git add .
git commit -m "Add PDF export feature for chat conversations"
git push

# After fixing a bug
git add .
git commit -m "Fix: Resolve 500 error in export endpoint"
git push

# After updating IARE information
git add .
git commit -m "Update: Add latest IARE placement statistics"
git push
```

---

## ⚠️ IMPORTANT: Before First Push

### 1. Verify `.gitignore` exists
```powershell
# Check if .gitignore file exists
ls .gitignore
```

### 2. Check what will be committed
```powershell
git status
```

**Make sure these are NOT listed:**
- ❌ `application.properties` (contains secrets)
- ❌ `.env` files (contains API keys)
- ❌ `node_modules/` folder
- ❌ `target/` folder

**These SHOULD be listed:**
- ✅ `.gitignore`
- ✅ `application.properties.example`
- ✅ `.env.example`
- ✅ Source code files (.java, .jsx, etc.)
- ✅ `pom.xml`, `package.json`
- ✅ README.md

### 3. If secrets are accidentally staged:
```powershell
# Remove from staging (but keep the file)
git reset backend/src/main/resources/application.properties
git reset frontend/.env

# Make sure .gitignore includes them
# Then commit again
git add .
git commit -m "Initial commit: IARE CampusConnect Chatbot"
```

---

## 🔐 Security Checklist

Before pushing, verify:

- [ ] `.gitignore` file exists and is configured
- [ ] `application.properties` is in `.gitignore`
- [ ] `.env` files are in `.gitignore`
- [ ] Created `application.properties.example` (template without secrets)
- [ ] Created `.env.example` (template without secrets)
- [ ] No API keys visible in code
- [ ] No database passwords in committed files
- [ ] No JWT secrets in committed files

---

## 📊 View Your Repository

After pushing, visit:
```
https://github.com/YOUR_USERNAME/iare-campusconnect
```

You should see:
- ✅ All your code files
- ✅ README.md displayed
- ✅ `.gitignore` file
- ✅ Template files (.example)
- ❌ NO `application.properties` (should be hidden)
- ❌ NO `.env` files (should be hidden)

---

## 🆘 Troubleshooting

### "fatal: not a git repository"
```powershell
git init
```

### "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/repo-name.git
```

### "failed to push some refs"
```powershell
# Pull first, then push
git pull origin main --rebase
git push
```

### Accidentally committed secrets
```powershell
# Remove from last commit (if not pushed yet)
git reset --soft HEAD~1
# Add to .gitignore
# Commit again without secrets
```

### Need to change commit message
```powershell
# Change last commit message
git commit --amend -m "New message"
git push --force
```

---

## 🎉 Success!

Once pushed successfully:
1. Your code is backed up on GitHub ✅
2. You can access it from anywhere 🌍
3. You can collaborate with others 👥
4. You're ready to deploy! 🚀

**Next Step:** Check out `DEPLOYMENT_GUIDE.md` for deploying to production!
