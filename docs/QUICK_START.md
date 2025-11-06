# Mounjaro Tracker - Quick Start Guide

**Get from zero to running in 5 minutes.**

This guide gets you up and running with Mounjaro Tracker RC1 for local development or building production releases.

---

## Prerequisites

- **Node.js** 18+ installed ([download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- **Expo CLI** (will be installed with dependencies)
- **EAS CLI** for production builds: `npm install -g eas-cli`

---

## 1. Clone and Install (1 minute)

```bash
# Clone the repository
git clone <repository-url>
cd mounjaro-tracker

# Install dependencies
npm install

# Verify installation
npm run start --version
```

---

## 2. Configure Environment Variables (2 minutes)

### Create your environment file

```bash
cp .env.example .env.local
```

### Get your API keys

#### Clerk Authentication (Required)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application or select existing
3. Navigate to **API Keys**
4. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
5. Paste into `.env.local`:

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

#### Supabase Database (Required)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings → API**
4. Copy **Project URL** and **anon public** key
5. Paste into `.env.local`:

```
EXPO_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

6. **For migrations**, also copy **service_role** key:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

⚠️ **IMPORTANT**: Never commit `.env.local` to git. It's already in `.gitignore`.

#### Google Gemini AI (Optional)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Paste into `.env.local`:

```
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
```

If not configured, AI features will be gracefully disabled.

---

## 3. Setup Database (1 minute)

### Run migrations

```bash
node scripts/apply-migrations.js
```

This will:
- Create all required tables
- Set up Row Level Security (RLS) policies
- Configure Clerk authentication integration
- Initialize default settings

**Expected output:**
```
Migration completed successfully!
Tables created with proper RLS policies
```

### Verify database setup

```bash
node scripts/inspect-supabase-tables.js
```

You should see tables like:
- `users`
- `doses`
- `symptoms`
- `meals`
- `settings`
- `voice_notes`

---

## 4. Run Locally (1 minute)

### Start development server

```bash
npm run start
```

This opens the Expo development menu. Choose:
- Press `i` for iOS simulator (requires Xcode on Mac)
- Press `a` for Android emulator (requires Android Studio)
- Scan QR code with Expo Go app on your phone

### Test authentication flow

1. App should launch to onboarding screen
2. Tap **"Get Started"**
3. Sign up with email or Google
4. Complete onboarding steps
5. Reach home screen

---

## 5. Verify Build Readiness (Optional but Recommended)

Before building for production, run the verification script:

```bash
./scripts/verify-build-ready.sh
```

This checks:
- All required files exist
- Environment variables are configured
- Dependencies are installed
- Migrations are present
- Git status is clean

**Expected output:**
```
✓ Build readiness check PASSED!
```

---

## Building for Production

### First-time EAS setup

```bash
# Login to Expo
eas login

# Configure project
eas build:configure
```

This will update `app.json` with your project ID.

### Build commands

#### Preview build (internal testing)

```bash
# iOS
eas build --platform ios --profile preview

# Android
eas build --platform android --profile preview
```

#### Production build (App Store / Play Store)

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

**Build times:**
- First build: 15-20 minutes
- Subsequent builds: 5-10 minutes

### Submit to stores

```bash
# iOS (requires Apple Developer account)
eas submit --platform ios

# Android (requires Play Console account)
eas submit --platform android
```

---

## Common Issues & Solutions

### Issue: "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY not found"

**Solution:** Ensure you've created `.env.local` and added your Clerk key:

```bash
cp .env.example .env.local
# Edit .env.local and add your actual keys
```

### Issue: Migration fails with "permission denied"

**Solution:** Ensure you're using the **service_role** key, not the anon key:

```bash
# In .env.local, set:
SUPABASE_SERVICE_ROLE_KEY=eyJ... (starts with eyJ)
```

### Issue: "Module not found" errors

**Solution:** Clear cache and reinstall:

```bash
rm -rf node_modules
npm install
npm run start -- --clear
```

### Issue: iOS build fails with "Bundle identifier already in use"

**Solution:** Update bundle identifier in `app.json`:

```json
"ios": {
  "bundleIdentifier": "com.yourcompany.mounjarotracker"
}
```

### Issue: Android build fails with permissions error

**Solution:** Ensure all permissions are listed in `app.json`:

```json
"android": {
  "permissions": [
    "android.permission.RECORD_AUDIO",
    "android.permission.CAMERA",
    "android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.WRITE_EXTERNAL_STORAGE"
  ]
}
```

---

## Environment Configuration Matrix

| Variable | Required | Used For | Get From |
|----------|----------|----------|----------|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Authentication | [Clerk Dashboard](https://dashboard.clerk.com) |
| `EXPO_PUBLIC_SUPABASE_URL` | Yes | Database access | [Supabase Settings](https://supabase.com/dashboard) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client queries | Supabase API Settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (migrations) | Database admin | Supabase API Settings |
| `EXPO_PUBLIC_GEMINI_API_KEY` | Optional | AI features | [Google AI Studio](https://makersuite.google.com) |
| `TESTSPRITE_API_KEY` | No | Testing only | [TestSprite](https://testsprite.com) |

---

## Project Structure Quick Reference

```
mounjaro-tracker/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Main app tabs
│   ├── (auth)/            # Authentication screens
│   └── onboarding/        # Onboarding flow
├── components/            # Reusable UI components
├── lib/                   # Core libraries
│   ├── clerk.ts          # Auth configuration
│   ├── supabase.ts       # Database client
│   └── gemini.ts         # AI integration
├── supabase/
│   └── migrations/       # Database migrations
├── assets/               # Images and icons
├── docs/                 # Documentation
├── scripts/              # Utility scripts
├── app.json              # Expo configuration
├── eas.json              # Build configuration
└── .env.local            # Your secrets (not in git)
```

---

## Development Workflow

### Typical session

```bash
# 1. Start fresh
npm run start -- --clear

# 2. Make changes to code
# Files auto-reload in Expo Go

# 3. Test on device
# Scan QR code with phone

# 4. Run verification before committing
./scripts/verify-build-ready.sh

# 5. Commit changes
git add .
git commit -m "feat: your feature description"
git push
```

### Before each build

```bash
# 1. Verify environment
./scripts/verify-build-ready.sh

# 2. Check migrations are applied
node scripts/apply-migrations.js

# 3. Clean install (if needed)
rm -rf node_modules
npm install

# 4. Build
eas build --profile preview
```

---

## Feature Flags

Control features via environment variables in `.env.local`:

```bash
# AI-powered insights
EXPO_PUBLIC_FEATURE_AI_INSIGHTS=true

# Voice notes recording
EXPO_PUBLIC_FEATURE_VOICE_NOTES=true

# Push notifications
EXPO_PUBLIC_FEATURE_PUSH_NOTIFICATIONS=true

# Analytics tracking
EXPO_PUBLIC_FEATURE_ANALYTICS=false
```

---

## Security Best Practices

### DO:
- Keep `.env.local` out of version control (already in `.gitignore`)
- Use **anon key** for client-side code
- Use **service_role key** only in secure server/script contexts
- Rotate keys if accidentally exposed
- Use environment-specific keys (test vs production)

### DON'T:
- Commit API keys to git
- Share `.env.local` file
- Use production keys in development
- Hardcode secrets in source code
- Use service_role key in client code

---

## Getting Help

### Documentation
- **Full PRD**: `docs/PRODUCT-REQUIREMENTS-DOCUMENT.md`
- **This guide**: `docs/QUICK_START.md`
- **Expo docs**: https://docs.expo.dev
- **Clerk docs**: https://clerk.com/docs
- **Supabase docs**: https://supabase.com/docs

### Verify your setup
```bash
./scripts/verify-build-ready.sh
```

### Check logs
```bash
# Expo dev server logs
npm run start

# EAS build logs
eas build:list
eas build:view <build-id>
```

---

## Next Steps

Once you have the app running locally:

1. **Explore the app**: Complete the onboarding flow
2. **Add test data**: Log doses, symptoms, meals
3. **Review code**: Start in `app/(tabs)/index.tsx`
4. **Read the PRD**: Understand the full feature set
5. **Build preview**: Test on actual device
6. **Deploy**: Submit to App Store / Play Store

---

## Success Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned and dependencies installed
- [ ] `.env.local` created with all required keys
- [ ] Database migrations applied successfully
- [ ] App runs locally without errors
- [ ] Authentication flow works
- [ ] Verification script passes
- [ ] Preview build completes (if deploying)

---

**You're ready to build! Questions? Check the PRD or run the verification script.**

---

**Last Updated**: 2025-11-06
**Version**: RC1 (1.0.0)
**Expo SDK**: 54
