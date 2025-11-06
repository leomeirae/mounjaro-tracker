# QA Test Report - Mounjaro Tracker RC1

**Version**: 1.0.0-rc.1
**Date**: ___________
**Tester**: ___________
**Branch**: `chore/brand-cleanup`
**Commit**: ___________

---

## Executive Summary

**Overall Status**: ☐ PASS  ☐ PASS WITH ISSUES  ☐ FAIL

**Testing Scope**:
- ☐ iOS (Simulator/Device: _________)
- ☐ Android (Emulator/Device: _________)
- ☐ Migration 010 applied and verified

**Key Metrics**:
- Total Scenarios: 6
- Scenarios Passed: _____ / 6
- Blocking Issues: _____
- Non-Blocking Issues: _____
- Test Duration: _____ hours

**Recommendation**: ☐ Approve RC  ☐ Fix & Re-test  ☐ Reject RC

---

## Test Environment

### Setup Details
- **iOS Version**: ___________
- **Android API Level**: ___________
- **Expo SDK**: 54.0.22
- **Node Version**: ___________
- **Supabase Migration**: ☐ Applied  ☐ Not Applied
- **Test Account**: ___________
- **Environment**: ☐ Staging  ☐ Production

### Pre-Test Checklist
- [ ] Fresh app install
- [ ] Cache cleared
- [ ] Migration 010 verified in Supabase
- [ ] Environment variables configured
- [ ] Test user created in Clerk

---

## Pass/Fail Matrix

| Scenario | iOS Status | Android Status | Notes |
|----------|-----------|----------------|-------|
| 1. Onboarding (22 screens) | ☐ PASS ☐ FAIL | ☐ PASS ☐ FAIL | |
| 2. Dashboard Load | ☐ PASS ☐ FAIL | ☐ PASS ☐ FAIL | |
| 3. Results & Charts | ☐ PASS ☐ FAIL | ☐ PASS ☐ FAIL | |
| 4. Add Weight Entry | ☐ PASS ☐ FAIL | ☐ PASS ☐ FAIL | |
| 5. AI Assistant | ☐ PASS ☐ FAIL | ☐ PASS ☐ FAIL | |
| 6. Accessibility & UX | ☐ PASS ☐ FAIL | ☐ PASS ☐ FAIL | |

---

## Detailed Test Results

### Scenario 1: Onboarding Flow (22 Screens)

**iOS**: ☐ PASS  ☐ FAIL  ☐ PARTIAL
**Android**: ☐ PASS  ☐ FAIL  ☐ PARTIAL

#### Sub-Tests

| Step | iOS | Android | Notes |
|------|-----|---------|-------|
| Welcome Carousel (4 slides) | ☐ ☐ | ☐ ☐ | |
| Widgets Intro | ☐ ☐ | ☐ ☐ | |
| Charts Intro | ☐ ☐ | ☐ ☐ | |
| Customization Intro | ☐ ☐ | ☐ ☐ | |
| Already Using GLP-1 | ☐ ☐ | ☐ ☐ | |
| Medication Selection | ☐ ☐ | ☐ ☐ | |
| Initial Dose | ☐ ☐ | ☐ ☐ | |
| Device Type | ☐ ☐ | ☐ ☐ | |
| Injection Frequency | ☐ ☐ | ☐ ☐ | |
| Education Graph | ☐ ☐ | ☐ ☐ | |
| Health Disclaimer | ☐ ☐ | ☐ ☐ | |
| **Height Input** | ☐ ☐ | ☐ ☐ | ⚠️ CRITICAL |
| **Current Weight** | ☐ ☐ | ☐ ☐ | ⚠️ CRITICAL |
| Starting Weight | ☐ ☐ | ☐ ☐ | |
| **Target Weight (BMI Bar)** | ☐ ☐ | ☐ ☐ | ⚠️ CRITICAL |
| Motivational Message | ☐ ☐ | ☐ ☐ | |
| Weight Loss Rate | ☐ ☐ | ☐ ☐ | |
| Daily Routine | ☐ ☐ | ☐ ☐ | |
| Fluctuations Education | ☐ ☐ | ☐ ☐ | |
| Food Noise | ☐ ☐ | ☐ ☐ | |
| Side Effects Concerns | ☐ ☐ | ☐ ☐ | |
| Motivation | ☐ ☐ | ☐ ☐ | |
| App Rating | ☐ ☐ | ☐ ☐ | |
| **Save & Redirect** | ☐ ☐ | ☐ ☐ | ⚠️ CRITICAL |

**Issues Found**:
```
[List any issues here]
```

**Screenshot References**:
- [ ] `screenshots/onboarding-height-picker-ios.png`
- [ ] `screenshots/onboarding-weight-picker-ios.png`
- [ ] `screenshots/onboarding-target-weight-bmi-ios.png`
- [ ] `screenshots/onboarding-height-picker-android.png`
- [ ] `screenshots/onboarding-weight-picker-android.png`
- [ ] `screenshots/onboarding-target-weight-bmi-android.png`

---

### Scenario 2: Dashboard Load

**iOS**: ☐ PASS  ☐ FAIL
**Android**: ☐ PASS  ☐ FAIL

#### Checks

| Check | iOS | Android | Notes |
|-------|-----|---------|-------|
| Dashboard loads < 2s | ☐ ☐ | ☐ ☐ | Actual: ___s |
| Welcome message correct | ☐ ☐ | ☐ ☐ | |
| Metric cards render | ☐ ☐ | ☐ ☐ | |
| Charts visible | ☐ ☐ | ☐ ☐ | |
| Bottom tabs visible | ☐ ☐ | ☐ ☐ | |
| Dark mode toggle | ☐ ☐ | ☐ ☐ | |
| Light mode toggle | ☐ ☐ | ☐ ☐ | |
| No layout regressions | ☐ ☐ | ☐ ☐ | |

**Issues Found**:
```
[List any issues here]
```

**Screenshot References**:
- [ ] `screenshots/dashboard-light-ios.png`
- [ ] `screenshots/dashboard-dark-ios.png`
- [ ] `screenshots/dashboard-light-android.png`
- [ ] `screenshots/dashboard-dark-android.png`

---

### Scenario 3: Results & Charts

**iOS**: ☐ PASS  ☐ FAIL
**Android**: ☐ PASS  ☐ FAIL

#### Checks

| Check | iOS | Android | Notes |
|-------|-----|---------|-------|
| Weight progress chart renders | ☐ ☐ | ☐ ☐ | |
| PK curve chart renders | ☐ ☐ | ☐ ☐ | |
| Data points visible | ☐ ☐ | ☐ ☐ | |
| Chart colors match theme | ☐ ☐ | ☐ ☐ | |
| Progress metrics calculate | ☐ ☐ | ☐ ☐ | |
| Empty state (new user) | ☐ ☐ | ☐ ☐ | |
| Chart scrolls horizontally | ☐ ☐ | ☐ ☐ | |
| No performance issues | ☐ ☐ | ☐ ☐ | |

**Chart Rendering Performance**:
- Weight chart: ___s (target: <1s)
- PK curve: ___s (target: <1s)

**Issues Found**:
```
[List any issues here]
```

**Screenshot References**:
- [ ] `screenshots/results-chart-ios.png`
- [ ] `screenshots/results-pk-curve-ios.png`
- [ ] `screenshots/results-chart-android.png`
- [ ] `screenshots/results-pk-curve-android.png`

---

### Scenario 4: Add Weight Entry

**iOS**: ☐ PASS  ☐ FAIL
**Android**: ☐ PASS  ☐ FAIL

#### Checks

| Check | iOS | Android | Notes |
|-------|-----|---------|-------|
| Modal/screen opens | ☐ ☐ | ☐ ☐ | |
| Weight picker functional | ☐ ☐ | ☐ ☐ | |
| Unit toggle works (kg↔lb) | ☐ ☐ | ☐ ☐ | |
| Date picker functional | ☐ ☐ | ☐ ☐ | |
| Save button works | ☐ ☐ | ☐ ☐ | |
| Supabase persistence | ☐ ☐ | ☐ ☐ | |
| Dashboard updates | ☐ ☐ | ☐ ☐ | |
| Chart updates | ☐ ☐ | ☐ ☐ | |
| Progress recalculates | ☐ ☐ | ☐ ☐ | |

**Supabase Verification**:
```sql
SELECT * FROM weight_entries WHERE user_id = '___' ORDER BY recorded_at DESC LIMIT 5;
```
**Result**: ☐ Entry saved  ☐ Entry missing

**Issues Found**:
```
[List any issues here]
```

**Screenshot References**:
- [ ] `screenshots/add-weight-ios.png`
- [ ] `screenshots/add-weight-android.png`

---

### Scenario 5: AI Assistant ⚠️ CRITICAL

**iOS**: ☐ PASS  ☐ FAIL
**Android**: ☐ PASS  ☐ FAIL

#### Checks

| Check | iOS | Android | Notes |
|-------|-----|---------|-------|
| Tab loads without crash | ☐ ☐ | ☐ ☐ | ⚠️ BLOCKER IF FAIL |
| Title correct (not "Shotsy") | ☐ ☐ | ☐ ☐ | |
| Premium gate shows (if applicable) | ☐ ☐ | ☐ ☐ | |
| Chat input visible (if premium) | ☐ ☐ | ☐ ☐ | |
| Send message works | ☐ ☐ | ☐ ☐ | |
| Gemini response received | ☐ ☐ | ☐ ☐ | |
| Message history persists | ☐ ☐ | ☐ ☐ | |
| Scroll works | ☐ ☐ | ☐ ☐ | |
| No "Shotsy" in responses | ☐ ☐ | ☐ ☐ | |

**Code Verification**:
```bash
git diff feature/parity-p0..chore/brand-cleanup app/(tabs)/add-nutrition.tsx
```
**Result**: ☐ Only imports changed  ☐ Other changes detected

**Issues Found**:
```
[List any issues here - ANY ISSUE IS BLOCKING]
```

**Screenshot References**:
- [ ] `screenshots/ai-assistant-ios.png`
- [ ] `screenshots/ai-assistant-chat-ios.png`
- [ ] `screenshots/ai-assistant-android.png`
- [ ] `screenshots/ai-assistant-chat-android.png`

---

### Scenario 6: Accessibility & UX

**iOS**: ☐ PASS  ☐ FAIL
**Android**: ☐ PASS  ☐ FAIL

#### Checks

| Check | iOS | Android | Notes |
|-------|-----|---------|-------|
| Back navigation works | ☐ ☐ | ☐ ☐ | |
| Swipe back (iOS) | ☐ ☐ | N/A | |
| Android back button | N/A | ☐ ☐ | |
| Keyboard shows correctly | ☐ ☐ | ☐ ☐ | |
| Keyboard doesn't cover input | ☐ ☐ | ☐ ☐ | |
| Safe areas respected | ☐ ☐ | ☐ ☐ | |
| Haptic feedback works | ☐ ☐ | ☐ ☐ | |
| VoiceOver/TalkBack tested | ☐ ☐ | ☐ ☐ | Optional |

**Issues Found**:
```
[List any issues here]
```

---

## Brand Verification

### Command Line Check
```bash
rg "Shotsy" --type-not md --type-not txt
```

**Result**:
```
[Paste command output here]
```

**Expected**: 1 result (feature flag `FF_MARKETING_CAROUSEL_SHOTSY`)
**Actual**: _____ results

### Manual UI Check

Screens checked for "Shotsy" references:

| Screen | iOS | Android | Notes |
|--------|-----|---------|-------|
| Welcome carousel | ☐ Clean | ☐ Clean | |
| All 22 onboarding screens | ☐ Clean | ☐ Clean | |
| Dashboard | ☐ Clean | ☐ Clean | |
| Results | ☐ Clean | ☐ Clean | |
| Add weight | ☐ Clean | ☐ Clean | |
| AI Assistant | ☐ Clean | ☐ Clean | |
| Settings | ☐ Clean | ☐ Clean | |
| FAQ | ☐ Clean | ☐ Clean | |
| App rating | ☐ Clean | ☐ Clean | |
| Error messages | ☐ Clean | ☐ Clean | |

**Total "Shotsy" References Found**: _____
**User-Facing References**: _____ (MUST BE 0)

---

## Issues Log

### Blocking Issues

| ID | Severity | Platform | Scenario | Description | Repro Steps | Status |
|----|----------|----------|----------|-------------|-------------|--------|
| B001 | BLOCKER | iOS/Android | X | [Description] | [Steps] | ☐ Open ☐ Fixed |

### Non-Blocking Issues

| ID | Severity | Platform | Scenario | Description | Repro Steps | Status |
|----|----------|----------|----------|-------------|-------------|--------|
| N001 | MINOR | iOS/Android | X | [Description] | [Steps] | ☐ Open ☐ Fixed |

---

## Performance Metrics

| Metric | iOS | Android | Target | Pass/Fail |
|--------|-----|---------|--------|-----------|
| Dashboard load time | ___s | ___s | <2s | ☐ ☐ |
| Onboarding save time | ___s | ___s | <3s | ☐ ☐ |
| Weight entry save time | ___s | ___s | <2s | ☐ ☐ |
| Chart render time | ___s | ___s | <1s | ☐ ☐ |
| App launch time (cold) | ___s | ___s | <3s | ☐ ☐ |

---

## Fixes Applied

_Document any fixes made during QA and re-testing results._

### Fix 1: [Issue ID]
**Problem**: [Description]
**Fix**: [What was changed]
**Commit**: [Commit hash]
**Re-test Result**: ☐ PASS  ☐ FAIL

---

## Screenshots

All screenshots stored in `docs/QA/screenshots/`

### iOS
- [ ] `onboarding-height-picker-ios.png`
- [ ] `onboarding-weight-picker-ios.png`
- [ ] `onboarding-target-weight-bmi-ios.png`
- [ ] `dashboard-light-ios.png`
- [ ] `dashboard-dark-ios.png`
- [ ] `results-chart-ios.png`
- [ ] `add-weight-ios.png`
- [ ] `ai-assistant-ios.png`

### Android
- [ ] `onboarding-height-picker-android.png`
- [ ] `onboarding-weight-picker-android.png`
- [ ] `onboarding-target-weight-bmi-android.png`
- [ ] `dashboard-light-android.png`
- [ ] `dashboard-dark-android.png`
- [ ] `results-chart-android.png`
- [ ] `add-weight-android.png`
- [ ] `ai-assistant-android.png`

---

## Sign-Off

### QA Engineer
- **Name**: ___________
- **Date**: ___________
- **Recommendation**: ☐ Approve RC  ☐ Fix & Re-test  ☐ Reject RC
- **Signature**: ___________

### Engineering Lead
- **Name**: ___________
- **Date**: ___________
- **Approval**: ☐ Approved  ☐ Rejected
- **Signature**: ___________

### Product Manager
- **Name**: ___________
- **Date**: ___________
- **Approval**: ☐ Approved  ☐ Rejected
- **Signature**: ___________

---

## Next Steps

Based on test results:
- [ ] All tests pass → Proceed to RC builds (Phase 4)
- [ ] Minor issues → Fix non-blockers in patch release
- [ ] Blocking issues → Fix immediately and re-test affected scenarios
- [ ] Major failures → Full re-test after fixes

---

**Report Generated**: ___________
**Report Version**: 1.0
