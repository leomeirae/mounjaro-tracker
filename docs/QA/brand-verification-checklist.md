# Brand Verification Checklist
## Mounjaro Tracker - Zero "Shotsy" References

**Purpose**: Ensure complete rebrand from "Shotsy" to "Mounjaro Tracker"
**Target**: Zero user-facing "Shotsy" references
**Acceptable**: Internal implementation details (feature flags, type definitions)

---

## Automated Verification

### Command Line Checks

**1. Full Codebase Search (Excluding Docs)**
```bash
cd /Users/user/Desktop/mounjaro-tracker
rg "Shotsy" --type-not md --type-not txt
```

**Expected Output**:
```
app/(auth)/welcome.tsx:61:  const showCarousel = useFeatureFlag('FF_MARKETING_CAROUSEL_SHOTSY');
```

**Result**: ☐ PASS (1 result)  ☐ FAIL (>1 results)

---

**2. Case-Insensitive Search**
```bash
rg -i "shotsy" app/ components/ --type ts --type tsx --type js --type jsx
```

**Expected**: 1-2 results (feature flag only)
**Result**: _____ results

---

**3. Asset Filenames**
```bash
find . -name "*shotsy*" -o -name "*Shotsy*" | grep -v node_modules | grep -v .git
```

**Expected**: 0 files
**Result**: _____ files

---

**4. Package.json & Config**
```bash
cat package.json | grep -i shotsy
cat app.json | grep -i shotsy
cat babel.config.js | grep -i shotsy
```

**Expected**: No matches
**Result**: ☐ PASS  ☐ FAIL

---

**5. Environment Variables**
```bash
cat .env | grep -i shotsy
cat .env.local | grep -i shotsy
```

**Expected**: No matches
**Result**: ☐ PASS  ☐ FAIL

---

## Manual UI Verification

Test each screen manually on actual device/simulator.

### Welcome & Auth Screens

| Screen | iOS | Android | Notes |
|--------|-----|---------|-------|
| Splash screen | ☐ Clean | ☐ Clean | App name correct |
| Welcome carousel slide 1 | ☐ Clean | ☐ Clean | Title, subtitle, image |
| Welcome carousel slide 2 | ☐ Clean | ☐ Clean | |
| Welcome carousel slide 3 | ☐ Clean | ☐ Clean | |
| Welcome carousel slide 4 | ☐ Clean | ☐ Clean | "Começar" button |
| Terms & Privacy links | ☐ Clean | ☐ Clean | Footer text |
| Sign up screen (Clerk) | ☐ Clean | ☐ Clean | |
| Login screen (Clerk) | ☐ Clean | ☐ Clean | |

**Specific Checks**:
- [ ] Title: "Aproveite ao máximo seu medicamento GLP-1"
- [ ] Subtitle: "Mounjaro Tracker foi projetado para..."
- [ ] Footer: "Ao continuar, você concorda com os..."

---

### Onboarding Screens (22 Total)

| Screen # | Screen Name | iOS | Android | Text to Verify |
|----------|-------------|-----|---------|----------------|
| 1 | Widgets Intro | ☐ Clean | ☐ Clean | "widgets personalizáveis" |
| 2 | Charts Intro | ☐ Clean | ☐ Clean | "gráficos bonitos" |
| 3 | Customization | ☐ Clean | ☐ Clean | "combinar com seu estilo" |
| 4 | Already Using GLP-1 | ☐ Clean | ☐ Clean | "já está usando" |
| 5 | Medication Selection | ☐ Clean | ☐ Clean | Drug names |
| 6 | Initial Dose | ☐ Clean | ☐ Clean | Dose amounts |
| 7 | Device Type | ☐ Clean | ☐ Clean | "caneta, seringa" |
| 8 | Frequency | ☐ Clean | ☐ Clean | "semanal, quinzenal" |
| 9 | Education Graph | ☐ Clean | ☐ Clean | Chart title |
| 10 | Health Disclaimer | ☐ Clean | ☐ Clean | Disclaimer text |
| 11 | Height Input | ☐ Clean | ☐ Clean | "Sua altura" |
| 12 | Current Weight | ☐ Clean | ☐ Clean | "Qual é o seu peso atual?" |
| 13 | Starting Weight | ☐ Clean | ☐ Clean | "Peso inicial" |
| 14 | Target Weight | ☐ Clean | ☐ Clean | "Qual é o seu peso meta?" |
| 15 | Motivational Message | ☐ Clean | ☐ Clean | Message text |
| 16 | Weight Loss Rate | ☐ Clean | ☐ Clean | "lento, moderado, rápido" |
| 17 | Daily Routine | ☐ Clean | ☐ Clean | Activity levels |
| 18 | Fluctuations | ☐ Clean | ☐ Clean | Educational text |
| 19 | Food Noise | ☐ Clean | ☐ Clean | Days of week |
| 20 | Side Effects | ☐ Clean | ☐ Clean | Side effect list |
| 21 | Motivation | ☐ Clean | ☐ Clean | Motivation options |
| 22 | **App Rating** | ☐ Clean | ☐ Clean | **"Está gostando do Mounjaro Tracker?"** |

**Critical Check on Screen 22**:
- [ ] Question: "Está gostando do **Mounjaro Tracker**?" (NOT Shotsy)
- [ ] Text: "Mais pessoas descobrem o **Mounjaro Tracker**" (NOT Shotsy)

---

### Main App Screens

| Screen | iOS | Android | Specific Elements to Check |
|--------|-----|---------|---------------------------|
| Dashboard | ☐ Clean | ☐ Clean | Welcome message, card titles, button labels |
| Results | ☐ Clean | ☐ Clean | Chart titles, axis labels, legend |
| Add Weight | ☐ Clean | ☐ Clean | Modal title, button text |
| AI Assistant | ☐ Clean | ☐ Clean | Tab label, header, input placeholder |
| Settings | ☐ Clean | ☐ Clean | Section titles, option labels |

**Dashboard Specific**:
- [ ] Welcome: "Bem-vindo ao **Mounjaro Tracker**!" (NOT Shotsy)
- [ ] Metric card titles correct
- [ ] Bottom tab labels correct

---

### Settings & Info Screens

| Screen | iOS | Android | Elements to Check |
|--------|-----|---------|-------------------|
| Profile | ☐ Clean | ☐ Clean | Labels, placeholders |
| Preferences | ☐ Clean | ☐ Clean | Option names |
| Theme selection | ☐ Clean | ☐ Clean | Theme names |
| **FAQ** | ☐ Clean | ☐ Clean | **Questions & Answers** |
| About | ☐ Clean | ☐ Clean | App name, description |
| Privacy Policy link | ☐ Clean | ☐ Clean | URL |
| Terms of Service link | ☐ Clean | ☐ Clean | URL |

**FAQ Critical Checks**:
- [ ] Q: "Como posso aproveitar ao máximo o uso do **Mounjaro Tracker**?" (NOT Shotsy)
- [ ] A: "Para aproveitar ao máximo o **Mounjaro Tracker**, recomendamos..." (NOT Shotsy)
- [ ] All questions and answers mention "Mounjaro Tracker" only

---

### System & Error States

| State | iOS | Android | Text to Verify |
|-------|-----|---------|----------------|
| Loading indicators | ☐ Clean | ☐ Clean | Text (if any) |
| Error messages | ☐ Clean | ☐ Clean | Generic error text |
| Empty states | ☐ Clean | ☐ Clean | Placeholder text |
| Toast notifications | ☐ Clean | ☐ Clean | Success/error messages |
| Confirmation dialogs | ☐ Clean | ☐ Clean | Dialog titles |

---

### Platform-Specific Elements

#### iOS Only

| Element | Status | Location |
|---------|--------|----------|
| App icon name | ☐ Clean | Home screen |
| Spotlight search result | ☐ Clean | iOS Search |
| App Switcher | ☐ Clean | Double-tap home |
| Notification text (if any) | ☐ Clean | Notification center |
| Share sheet text | ☐ Clean | Share action |
| Siri suggestions | ☐ Clean | iOS Spotlight |

#### Android Only

| Element | Status | Location |
|---------|--------|----------|
| App icon name | ☐ Clean | Launcher |
| Recent apps | ☐ Clean | Recent apps screen |
| Notification text (if any) | ☐ Clean | Notification drawer |
| Share intent text | ☐ Clean | Share action |
| App info screen | ☐ Clean | Settings → Apps |

---

## Deep Links & URLs

Test all deep links and URLs:

| Link Type | iOS | Android | URL Format |
|-----------|-----|---------|------------|
| App Store URL | ☐ Clean | N/A | apps.apple.com/app/mounjaro-tracker... |
| Play Store URL | N/A | ☐ Clean | play.google.com/store/apps/details?id=com.mounjarotracker.app |
| Privacy Policy | ☐ Clean | ☐ Clean | mounjarotracker.app/privacy |
| Terms of Service | ☐ Clean | ☐ Clean | mounjarotracker.app/terms |
| Support email | ☐ Clean | ☐ Clean | support@mounjarotracker.app |

---

## AI Assistant Specific Checks

**CRITICAL**: AI Assistant must not reference "Shotsy"

### Chat Interface
- [ ] Tab label: "Assistente" or "AI Assistant" (NOT "Shotsy Assistant")
- [ ] Header title correct
- [ ] Input placeholder text correct
- [ ] No "Shotsy" in system messages

### AI Responses
Test multiple conversations and verify:
- [ ] AI never says "Shotsy" in responses
- [ ] AI refers to app as "Mounjaro Tracker" or "this app"
- [ ] No old branding in conversation history

**Sample prompts to test**:
1. "What app is this?"
2. "Tell me about the app"
3. "Who made this app?"
4. "What's the name of this app?"

**Expected**: AI responds with "Mounjaro Tracker" or generic terms, never "Shotsy"

---

## Code Verification (Dev Only)

For developers to verify internal code:

### Type Definitions (Acceptable)
```bash
grep "ShotsyTheme" constants/AppThemes.ts
```
**Expected**: 15 results (type definitions only)
**Status**: ☐ Acceptable

### Feature Flags (Acceptable)
```bash
grep "FF_MARKETING_CAROUSEL_SHOTSY" app/(auth)/welcome.tsx
```
**Expected**: 1 result
**Status**: ☐ Acceptable

### Import Statements (Should be renamed)
```bash
grep "useShotsyColors" app/ components/ -r
```
**Expected**: 0 results (should be `useThemeColors`)
**Status**: ☐ PASS  ☐ FAIL

### Component Names (Should be renamed)
```bash
grep -E "ShotsyButton|ShotsyCard|ShotsySkeleton" app/ components/ -r
```
**Expected**: 0 results (should be `Button`, `Card`, `Skeleton`)
**Status**: ☐ PASS  ☐ FAIL

---

## Final Verification Summary

**Total Screens Checked**: _____
**User-Facing "Shotsy" References Found**: _____ (MUST BE 0)
**Internal "Shotsy" References**: _____ (Acceptable if < 20 and internal only)

**Pass Criteria**:
- ✅ 0 user-facing "Shotsy" references
- ✅ All UI text says "Mounjaro Tracker"
- ✅ All URLs updated
- ✅ App icons correct
- ✅ AI Assistant clean

**Result**: ☐ PASS  ☐ FAIL

---

## Issues Found

| Location | Platform | Text Found | Severity | Status |
|----------|----------|------------|----------|--------|
| | | | ☐ BLOCKER ☐ HIGH ☐ LOW | ☐ Open ☐ Fixed |

---

## Tester Sign-Off

**Tester Name**: ___________
**Date**: ___________
**Result**: ☐ APPROVED (Zero user-facing "Shotsy")  ☐ REJECTED (Issues found)
**Signature**: ___________

---

## Quick Reference Commands

Run these to verify the rebrand:

```bash
# 1. Find all "Shotsy" in code (expect ~1 result: feature flag)
rg "Shotsy" --type-not md

# 2. Find "Shotsy" in user-facing strings (expect 0)
rg "Shotsy" app/\(auth\)/welcome.tsx app/\(tabs\)/faq.tsx components/onboarding/AppRatingScreen.tsx

# 3. Check imports are updated (expect 0)
rg "useShotsyColors|ShotsyButton|ShotsyCard" app/ components/

# 4. Verify no asset files (expect 0)
find . -iname "*shotsy*" | grep -v node_modules | grep -v .git | grep -v docs
```

**All checks should return 0-1 results (feature flag only).**

---

**Last Updated**: 2025-11-06
**Version**: 1.0
