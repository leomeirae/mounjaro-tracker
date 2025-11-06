# Release Candidate 1 - Mounjaro Tracker
## Build & Deployment Guide

**Version**: 1.0.0-rc.1
**Date**: 2025-11-06
**Branch**: `chore/brand-cleanup`
**Commit**: [Will be set after final commit]

---

## Executive Summary

This document provides complete build and deployment instructions for Release Candidate 1 (RC1) of Mounjaro Tracker after the comprehensive Shotsy → Mounjaro Tracker rebrand.

**What's in RC1**:
- ✅ Complete rebrand (zero "Shotsy" references)
- ✅ 22-screen onboarding flow
- ✅ Supabase migration 010 (onboarding enhancements)
- ✅ AI Assistant (Gemini) fully intact
- ✅ Weight tracking with charts
- ✅ Dark mode support
- ✅ Comprehensive documentation

**Requirements Before Building**:
1. QA testing completed (`docs/QA/qa-report.md` signed off)
2. Supabase migration 010 applied and verified
3. Environment variables configured
4. All blocking issues fixed

---

## Prerequisites

### Development Environment
- Node.js: 18.x or 20.x
- npm: 9.x or higher
- Expo CLI: Compatible with SDK 54
- iOS: Xcode 15+ (for iOS builds)
- Android: Android Studio (for Android builds)

### Required Accounts & Access
- [ ] Expo account with EAS Build access
- [ ] Apple Developer account (for iOS)
- [ ] Google Play Console account (for Android)
- [ ] Supabase project access
- [ ] Clerk authentication project access

### Environment Variables

Create `.env` file in project root:

```bash
# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx

# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx

# Google Gemini (AI Assistant)
GOOGLE_GEMINI_API_KEY=AIzaSyxxx

# Feature Flags (Optional)
FF_MARKETING_CAROUSEL_SHOTSY=true
FF_ONBOARDING_23=true
```

**Security Note**: Never commit `.env` to git. Use `.env.example` template.

---

## Pre-Build Checklist

Before building RC1, ensure:

### Code Quality
- [ ] All commits on `chore/brand-cleanup` branch
- [ ] Git status clean (no uncommitted changes)
- [ ] No console errors in dev mode
- [ ] No React warnings in logs

### QA Verification
- [ ] `docs/QA/qa-report.md` completed
- [ ] Critical scenarios pass on iOS
- [ ] Critical scenarios pass on Android
- [ ] Zero "Shotsy" references confirmed
- [ ] AI Assistant verified functional

### Database
- [ ] Migration 010 applied to Supabase
- [ ] Verification queries run successfully
- [ ] Test data seeded (optional)
- [ ] RLS policies verified

### Dependencies
- [ ] `package.json` present in root
- [ ] All dependencies installed (`npm install`)
- [ ] No npm audit critical vulnerabilities
- [ ] Babel config correct (reanimated plugin)

---

## Version Bump

### Update `app.json`

Before building, increment version and build numbers:

**Current**:
```json
{
  "expo": {
    "name": "mounjaro-tracker",
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    },
    "android": {
      "versionCode": 1
    }
  }
}
```

**For RC1** (recommended):
```json
{
  "expo": {
    "name": "Mounjaro Tracker",
    "slug": "mounjaro-tracker",
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1",
      "bundleIdentifier": "com.mounjarotracker.app"
    },
    "android": {
      "versionCode": 1,
      "package": "com.mounjarotracker.app"
    }
  }
}
```

**Version Convention**:
- Major.Minor.Patch: `1.0.0`
- iOS buildNumber: Incremental integer
- Android versionCode: Incremental integer

### Update `package.json`

```json
{
  "name": "mounjaro-tracker",
  "version": "1.0.0",
  ...
}
```

### Create Git Tag

```bash
git add app.json package.json
git commit -m "chore: bump version to 1.0.0-rc.1"
git tag v1.0.0-rc.1
git push origin chore/brand-cleanup --tags
```

---

## Build Methods

Choose one of the following build methods:

### Option A: EAS Build (Recommended)

**Advantages**:
- Cloud-based builds
- No local Xcode/Android Studio required
- Automatic code signing
- Build URLs for easy distribution
- Build logs stored

#### Setup EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Initialize EAS (if not done)
eas build:configure
```

#### Configure `eas.json`

Create or update `eas.json`:

```json
{
  "build": {
    "production": {
      "ios": {
        "buildConfiguration": "Release",
        "credentialsSource": "auto",
        "distribution": "store"
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      },
      "env": {
        "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY": "@clerk_publishable_key",
        "EXPO_PUBLIC_SUPABASE_URL": "@supabase_url",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
        "GOOGLE_GEMINI_API_KEY": "@gemini_api_key"
      }
    },
    "preview": {
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk"
      },
      "distribution": "internal"
    },
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

#### Set Environment Secrets

```bash
# Store secrets in EAS
eas secret:create --name CLERK_PUBLISHABLE_KEY --value "pk_test_xxx" --scope project
eas secret:create --name SUPABASE_URL --value "https://xxx.supabase.co" --scope project
eas secret:create --name SUPABASE_ANON_KEY --value "eyJhbGciOi..." --scope project
eas secret:create --name GEMINI_API_KEY --value "AIza..." --scope project
```

#### Build iOS (EAS)

```bash
# Production build for App Store
eas build --platform ios --profile production

# Preview build (simulator)
eas build --platform ios --profile preview
```

**Output**: EAS will provide a build URL (e.g., `https://expo.dev/accounts/xxx/projects/xxx/builds/xxx`)

**Download**: Build artifact will be `.ipa` file (iOS) or `.apk`/`.aab` (Android)

#### Build Android (EAS)

```bash
# Production build (AAB for Play Store)
eas build --platform android --profile production

# Preview build (APK for testing)
eas build --platform android --profile preview
```

#### Monitor Build

```bash
# View build logs
eas build:list

# View specific build
eas build:view [build-id]
```

**Expected Time**: 10-15 minutes per platform

---

### Option B: Local Builds

**Advantages**:
- Full control over build process
- Faster iteration (no cloud upload)
- No EAS subscription required

**Disadvantages**:
- Requires local Xcode (macOS only for iOS)
- Requires Android Studio
- Manual code signing
- More complex setup

#### Prerequisites

**For iOS**:
- macOS with Xcode 15+
- CocoaPods installed
- Apple Developer certificate & provisioning profile

**For Android**:
- Android Studio
- Android SDK 33+
- Keystore for signing

#### Build iOS Locally

```bash
# 1. Install CocoaPods dependencies
cd ios
pod install
cd ..

# 2. Generate native code
npx expo prebuild --platform ios --clean

# 3. Open in Xcode
open ios/MounjaroTracker.xcworkspace

# 4. In Xcode:
#    - Select target "MounjaroTracker"
#    - Select "Any iOS Device" or your device
#    - Product → Archive
#    - Distribute App → App Store Connect
```

**Alternative (CLI)**:
```bash
# Build IPA
xcodebuild -workspace ios/MounjaroTracker.xcworkspace \
  -scheme MounjaroTracker \
  -configuration Release \
  -archivePath ./build/MounjaroTracker.xcarchive \
  archive

# Export IPA
xcodebuild -exportArchive \
  -archivePath ./build/MounjaroTracker.xcarchive \
  -exportPath ./build \
  -exportOptionsPlist ios/ExportOptions.plist
```

**Output**: `build/MounjaroTracker.ipa`

#### Build Android Locally

```bash
# 1. Generate native code
npx expo prebuild --platform android --clean

# 2. Build APK (debug)
cd android
./gradlew assembleRelease
cd ..

# Output: android/app/build/outputs/apk/release/app-release.apk

# 3. Build AAB (for Play Store)
cd android
./gradlew bundleRelease
cd ..

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

**Sign APK/AAB**:
```bash
# If not auto-signed, sign manually
jarsigner -verbose \
  -sigalg SHA256withRSA \
  -digestalg SHA-256 \
  -keystore my-release-key.keystore \
  android/app/build/outputs/apk/release/app-release.apk \
  alias_name
```

---

## Build Outputs

After successful builds, you'll have:

### iOS
- **File**: `MounjaroTracker.ipa`
- **Size**: ~50-80 MB (varies)
- **Platform**: iOS 13.0+
- **Architecture**: ARM64 (Apple Silicon)
- **Distribution**: App Store or Ad Hoc

### Android
- **File**: `app-release.apk` (testing) or `app-release.aab` (Play Store)
- **Size**: APK ~40-60 MB, AAB ~30-50 MB
- **Platform**: Android 8.0+ (API 26+)
- **Architecture**: Universal (ARM, x86)
- **Distribution**: Play Store or Direct Install

---

## Distribution

### Internal Testing (RC1)

#### TestFlight (iOS)
```bash
# Upload to App Store Connect
eas submit --platform ios --latest

# Or via Xcode
# Upload manually via Xcode Organizer
```

1. Go to App Store Connect
2. Select "TestFlight" tab
3. Add internal testers
4. Distribute build

#### Firebase App Distribution (Android)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Upload APK
firebase appdistribution:distribute \
  android/app/build/outputs/apk/release/app-release.apk \
  --app 1:xxx:android:xxx \
  --groups testers
```

### Production Release (After RC Approval)

#### App Store (iOS)
1. Upload IPA via EAS or Xcode
2. Complete App Store Connect listing:
   - App name: "Mounjaro Tracker"
   - Subtitle: "GLP-1 Companion"
   - Description: [Updated with new branding]
   - Screenshots: Use `FIGMA-SCREENSHOTS/` assets
   - Keywords: "mounjaro, GLP-1, weight tracker, tirzepatide"
3. Submit for review

#### Google Play (Android)
1. Upload AAB to Play Console
2. Complete Store Listing:
   - App name: "Mounjaro Tracker"
   - Short description: [Updated]
   - Full description: [Updated]
   - Screenshots: Use `FIGMA-SCREENSHOTS/` assets
3. Create production release

---

## Build Verification Checklist

After building, verify:

### Functional
- [ ] App launches without crash
- [ ] Splash screen shows correct branding
- [ ] Onboarding flow completes
- [ ] Dashboard loads data
- [ ] Charts render
- [ ] Weight entry saves
- [ ] AI Assistant works
- [ ] Dark mode toggles

### Branding
- [ ] App icon shows "Mounjaro Tracker"
- [ ] App name in settings correct
- [ ] No "Shotsy" visible anywhere
- [ ] URLs point to mounjarotracker.app

### Performance
- [ ] App launch time < 3s
- [ ] Dashboard load < 2s
- [ ] Charts render < 1s
- [ ] No frame drops during navigation

### Security
- [ ] API keys not exposed in bundle
- [ ] Debug logs disabled
- [ ] Certificate pinning (if implemented)
- [ ] ProGuard/R8 enabled (Android)

---

## Rollback Plan

If RC1 has critical issues:

### Option 1: Rollback to Previous Build
```bash
# Revert to previous commit
git revert HEAD~1

# Rebuild and redistribute
eas build --platform all --profile production
```

### Option 2: Hot Fix
```bash
# Create hotfix branch
git checkout -b hotfix/critical-issue

# Fix issue
# ...

# Commit and build
git commit -m "fix: critical issue in RC1"
git tag v1.0.0-rc.2
eas build --platform all --profile production
```

### Option 3: Disable Features
Use feature flags to disable problematic features:
```typescript
// In app code
if (useFeatureFlag('FF_DISABLE_ONBOARDING_CHARTS')) {
  // Skip chart rendering
}
```

---

## Signing & Certificates

### iOS Code Signing

**Requirements**:
- Apple Developer account ($99/year)
- Distribution certificate
- Provisioning profile

**EAS Auto-Signing** (Recommended):
```bash
eas build --platform ios --profile production
# EAS will prompt to create certificates automatically
```

**Manual Signing**:
1. Create certificate in Apple Developer Console
2. Download provisioning profile
3. Add to Xcode project
4. Configure `ios/MounjaroTracker.xcodeproj` signing

### Android Signing

**Generate Keystore** (first time):
```bash
keytool -genkeypair \
  -v \
  -storetype PKCS12 \
  -keystore mounjaro-tracker.keystore \
  -alias mounjaro-tracker \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Configure Gradle**:
```gradle
// android/app/build.gradle
android {
  signingConfigs {
    release {
      storeFile file('mounjaro-tracker.keystore')
      storePassword 'xxx'
      keyAlias 'mounjaro-tracker'
      keyPassword 'xxx'
    }
  }
  buildTypes {
    release {
      signingConfig signingConfigs.release
    }
  }
}
```

**IMPORTANT**: Store keystore securely. Loss = permanent inability to update app.

---

## Troubleshooting

### Build Fails

**Error**: "Cannot find module 'expo'"
```bash
# Solution: Install dependencies
rm -rf node_modules package-lock.json
npm install
```

**Error**: "CocoaPods could not find compatible versions"
```bash
# Solution: Update pods
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

**Error**: "Gradle build failed"
```bash
# Solution: Clean gradle cache
cd android
./gradlew clean
./gradlew assembleRelease
cd ..
```

### App Crashes on Launch

**Check**:
1. Environment variables set correctly
2. Supabase URL reachable
3. Clerk configuration valid
4. Gemini API key valid

**Debug**:
```bash
# iOS: View device logs
xcrun simctl spawn booted log stream --predicate 'process == "MounjaroTracker"'

# Android: View logcat
adb logcat | grep MounjaroTracker
```

### Missing Dependencies

**Check package.json**:
```bash
npm list react-native-svg
npm list @react-native-picker/picker
npm list expo-router
```

**Reinstall if missing**:
```bash
npm install react-native-svg@^15.12.1
npm install @react-native-picker/picker@2.11.1
```

---

## Post-Build Actions

After successful RC1 build:

1. **Archive Build Artifacts**
   - Save `.ipa` and `.apk`/`.aab` files
   - Store in secure location (S3, Dropbox, etc.)
   - Document build number and commit hash

2. **Update Documentation**
   - Add build URLs to this document
   - Update `docs/QA/qa-report.md` with build info
   - Create changelog in `docs/CHANGELOG.md`

3. **Distribute to Testers**
   - Upload to TestFlight (iOS)
   - Upload to Firebase App Distribution (Android)
   - Send notification to QA team

4. **Monitor Crash Reports**
   - Check Sentry/Firebase Crashlytics
   - Monitor first 24 hours
   - Address critical crashes immediately

5. **Prepare for Production**
   - If RC1 stable for 3-7 days → remove "rc.1" tag
   - Upload final build to stores
   - Submit for review

---

## Build Metadata

**RC1 Details** (to be filled after build):

```
Version: 1.0.0-rc.1
Build Date: 2025-11-06
Git Commit: [SHA]
Git Tag: v1.0.0-rc.1

iOS Build:
- Build Number: 1
- Bundle ID: com.mounjarotracker.app
- Architecture: ARM64
- Min iOS: 13.0
- IPA Size: XX MB
- Build URL: [EAS URL or file path]

Android Build:
- Version Code: 1
- Package: com.mounjarotracker.app
- Architecture: Universal
- Min SDK: 26 (Android 8.0)
- APK Size: XX MB
- AAB Size: XX MB
- Build URL: [EAS URL or file path]

Environment:
- Expo SDK: 54.0.22
- React Native: 0.81.5
- Node: 20.x
- npm: 9.x
```

---

## Sign-Off

**Build Engineer**: ___________
**Date**: ___________
**Build Status**: ☐ Success  ☐ Failed
**Signature**: ___________

---

**Next Steps**:
1. Complete `docs/QA/qa-report.md` with RC1 testing results
2. Distribute to internal testers
3. Monitor crash reports for 3-7 days
4. If stable → proceed to production release
5. If issues → create hotfix RC2

---

**Last Updated**: 2025-11-06
**Document Version**: 1.0
