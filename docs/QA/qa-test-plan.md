# QA Test Plan - Mounjaro Tracker
## Production Readiness Testing

**Version**: 1.0.0-rc.1
**Date**: 2025-11-06
**Branch**: `chore/brand-cleanup`
**Migration**: 010_onboarding_enhancements.sql (MUST be applied before testing)

---

## Test Environment Setup

### Prerequisites
- [ ] Supabase migration 010 applied and verified
- [ ] iOS Simulator (iPhone 14 Pro, iOS 17+) or physical device
- [ ] Android Emulator (Pixel 5, API 33+) or physical device
- [ ] Clerk test account credentials
- [ ] Supabase test database with clean slate

### Environment Variables
Verify these are set in `.env`:
```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
GOOGLE_GEMINI_API_KEY=AIza...
```

---

## Critical Path Scenarios

These MUST pass before RC approval.

### ✅ Scenario 1: Complete Onboarding Flow (22 Screens)
**Priority**: CRITICAL
**Estimated Time**: 15-20 minutes
**Platforms**: iOS + Android

#### Setup
1. Fresh app install (delete app, clear cache)
2. Launch app in simulator/emulator

#### Test Steps

**1.1 Welcome Carousel (Screen 1-4 slides)**
- [ ] Carousel shows 4 slides with images
- [ ] All text says "Mounjaro Tracker" (NOT "Shotsy")
- [ ] Swipe left/right works smoothly
- [ ] Pagination dots update correctly
- [ ] Dots change color with accent theme
- [ ] "Próximo" button on slides 1-3
- [ ] "Começar" button on slide 4
- [ ] Terms/Privacy links work
- [ ] Haptic feedback on swipe (iOS)

**Expected**: Zero "Shotsy" visible anywhere

**1.2 Widgets Intro (Screen 1/22)**
- [ ] Title: "Acompanhe com widgets personalizáveis"
- [ ] Image renders
- [ ] "Continuar" button enabled
- [ ] Progress bar shows 1/22

**1.3 Charts Intro (Screen 2/22)**
- [ ] Title: "Entenda seu progresso com gráficos bonitos"
- [ ] Image renders
- [ ] Back button works (returns to Widgets)
- [ ] Progress bar shows 2/22

**1.4 Customization Intro (Screen 3/22)**
- [ ] Title: "Personalize o app para combinar com seu estilo"
- [ ] Image renders
- [ ] Progress bar shows 3/22

**1.5 Already Using GLP-1 (Screen 4/22)**
- [ ] Radio buttons: "Sim" / "Não"
- [ ] Selection changes color to accent
- [ ] Haptic feedback on tap
- [ ] "Continuar" disabled until selection
- [ ] Selection persists if go back/forward

**1.6 Medication Selection (Screen 5/22)**
- [ ] Options: Mounjaro, Zepbound, Ozempic, Wegovy, etc.
- [ ] Single selection
- [ ] Selected card highlights with accent color
- [ ] Progress bar shows 5/22

**1.7 Initial Dose (Screen 6/22)**
- [ ] Dose options render (2.5mg, 5mg, 7.5mg, etc.)
- [ ] Selection works
- [ ] Matches selected medication

**1.8 Device Type (Screen 7/22)**
- [ ] Options: Pen, Syringe, Auto-injector
- [ ] Icons render
- [ ] Selection highlights

**1.9 Injection Frequency (Screen 8/22)**
- [ ] Options: Weekly, Bi-weekly, Monthly, Custom
- [ ] Selection works
- [ ] Custom option (if implemented) shows input

**1.10 Education Graph (Screen 9/22)**
- [ ] PK curve chart renders
- [ ] Explanation text clear
- [ ] "Continuar" always enabled (info screen)

**1.11 Health Disclaimer (Screen 10/22)**
- [ ] Disclaimer text displays
- [ ] Checkbox for consent
- [ ] "Continuar" disabled until checked
- [ ] Checkbox persists if navigate back

**1.12 Height Input (Screen 11/22) ⚠️ CRITICAL**
- [ ] Toggle: "centímetros" / "polegadas"
- [ ] CM mode: Picker shows 100-250 cm
- [ ] FT mode: Two pickers (ft + inches)
- [ ] Picker scrolls smoothly
- [ ] Gradient fade top/bottom visible
- [ ] Haptic feedback on scroll
- [ ] Selected value large and centered
- [ ] Default: 175cm or 5'9"

**Expected**: Native picker, smooth scrolling, correct unit conversion

**1.13 Current Weight (Screen 12/22) ⚠️ CRITICAL**
- [ ] Three pickers: whole number + decimal + unit
- [ ] KG range: 30-200 kg
- [ ] LB range: 66-440 lb
- [ ] Decimal: 0-9 (for .0 to .9)
- [ ] Unit toggle: kg ↔ lb
- [ ] When toggle unit, weight converts
- [ ] Tip card shows: "pese-se sempre no mesmo horário"
- [ ] Haptic feedback on picker scroll

**Expected**: Weight picker functional, unit conversion correct

**1.14 Starting Weight (Screen 13/22)**
- [ ] Similar to current weight picker
- [ ] Uses unit preference from Screen 12
- [ ] Date picker for treatment start date
- [ ] Date cannot be future
- [ ] Date picker native (iOS wheel, Android calendar)

**1.15 Target Weight (Screen 14/22) ⚠️ CRITICAL**
- [ ] Large weight display: "XX.X kg"
- [ ] Slider with min-max range
- [ ] Range: -30% to -5% of current weight
- [ ] Slider thumb matches accent color
- [ ] **BMI Display**:
   - [ ] Shows "IMC: XX.X"
   - [ ] BMI category pill (Baixo Peso, Normal, Sobrepeso, Obesidade)
   - [ ] Pill color matches category
- [ ] **BMI Bar**:
   - [ ] 4 segments: purple, green, orange, red
   - [ ] Indicator shows current BMI position
   - [ ] Indicator color matches accent
   - [ ] Labels: "Baixo <18.5", "Normal 18.5-25", "Alto 25-30", "Muito Alto 30+"
- [ ] Summary card shows weight to lose
- [ ] "Continuar" disabled if target >= current

**Expected**: Slider smooth, BMI calculation correct, color-coded bar

**1.16 Motivational Message (Screen 15/22)**
- [ ] Message displays
- [ ] Accent color used
- [ ] "Continuar" enabled

**1.17 Weight Loss Rate (Screen 16/22)**
- [ ] Options: Lento, Moderado, Rápido
- [ ] Radio selection works

**1.18 Daily Routine (Screen 17/22)**
- [ ] 5 activity levels
- [ ] Icons render
- [ ] Selection highlights

**1.19 Fluctuations Education (Screen 18/22)**
- [ ] Educational content about weight fluctuations
- [ ] Chart/visual renders
- [ ] "Continuar" always enabled

**1.20 Food Noise (Screen 19/22)**
- [ ] Days of week selection
- [ ] Single or multiple selection?
- [ ] Selection works

**1.21 Side Effects Concerns (Screen 20/22)**
- [ ] Multiple choice: nausea, fatigue, etc.
- [ ] Multiple selections allowed
- [ ] Selected items highlight

**1.22 Motivation (Screen 21/22)**
- [ ] Motivation options (health, appearance, energy, etc.)
- [ ] Selection works

**1.23 App Rating (Screen 22/22)**
- [ ] Title: "Está gostando do Mounjaro Tracker?"
- [ ] NOT "Shotsy"
- [ ] "Avaliar Agora" button
- [ ] "Mais Tarde" button
- [ ] App Store URL correct (iOS: apps.apple.com, Android: play.google.com)

**Final Step: Save & Redirect**
- [ ] After screen 22, shows loading indicator
- [ ] Data saves to Supabase `profiles` table
- [ ] `onboarding_completed` set to `true`
- [ ] Redirects to dashboard `/(tabs)`
- [ ] No error messages

**Verification SQL**:
```sql
SELECT
  clerk_user_id,
  onboarding_completed,
  treatment_start_date,
  device_type,
  frequency,
  created_at
FROM profiles
WHERE clerk_user_id = 'user_xxx'
LIMIT 1;
```

**Expected**: All fields populated, onboarding_completed = true

---

### ✅ Scenario 2: Dashboard Load
**Priority**: CRITICAL
**Estimated Time**: 3 minutes
**Platforms**: iOS + Android

#### Test Steps
1. [ ] Launch app (already logged in, onboarding complete)
2. [ ] Dashboard loads within 2 seconds
3. [ ] Welcome message: "Bem-vindo ao Mounjaro Tracker!"
4. [ ] Metric cards render:
   - [ ] Current weight
   - [ ] Target weight
   - [ ] Progress percentage
   - [ ] Days on treatment
5. [ ] "+" button visible (add weight)
6. [ ] Charts section visible (weight progress)
7. [ ] Bottom tabs visible: Dashboard, Resultados, +, Assistente, Configurações

**Dark Mode Test**:
1. [ ] Go to Settings → Theme → Dark
2. [ ] Dashboard updates instantly
3. [ ] All colors correct (no white text on white bg)
4. [ ] Charts render in dark mode
5. [ ] Back to Light mode works

**Performance**:
- [ ] No lag when scrolling
- [ ] No React warnings in console
- [ ] No Supabase errors in logs

---

### ✅ Scenario 3: Results & Charts
**Priority**: HIGH
**Estimated Time**: 5 minutes
**Platforms**: iOS + Android

#### Test Steps
1. [ ] Tap "Resultados" tab
2. [ ] **Weight Progress Chart**:
   - [ ] Chart renders using react-native-chart-kit
   - [ ] X-axis: dates
   - [ ] Y-axis: weight
   - [ ] Data points visible
   - [ ] Line color matches accent
   - [ ] Chart scrolls horizontally if > 7 days
3. [ ] **Estimated Medication Levels Chart (PK Curve)**:
   - [ ] Chart renders
   - [ ] Shows dose timing
   - [ ] Peak and trough levels visible
   - [ ] Legend explains curve
4. [ ] **Progress Metrics**:
   - [ ] Total weight lost
   - [ ] Average weekly loss
   - [ ] BMI change
   - [ ] All numbers calculate correctly

**Edge Cases**:
- [ ] New user (no data): Shows empty state or placeholder
- [ ] Single weight entry: Chart renders with 1 point
- [ ] 50+ entries: Chart scrollable, no performance issues

---

### ✅ Scenario 4: Add Weight Entry
**Priority**: CRITICAL
**Estimated Time**: 3 minutes
**Platforms**: iOS + Android

#### Test Steps
1. [ ] From Dashboard, tap "+" button (center tab)
2. [ ] Weight picker modal/screen opens
3. [ ] Picker shows current weight unit (kg or lb from settings)
4. [ ] Select new weight value
5. [ ] Date picker shows today's date
6. [ ] Can change date (max: today)
7. [ ] Tap "Salvar" button
8. [ ] Loading indicator shows
9. [ ] Entry saves to Supabase

**Verification SQL**:
```sql
SELECT *
FROM weight_entries
WHERE user_id = 'xxx'
ORDER BY recorded_at DESC
LIMIT 5;
```

10. [ ] Modal closes
11. [ ] Dashboard updates with new weight
12. [ ] Results chart updates with new data point
13. [ ] Progress percentage recalculates

**Edge Cases**:
- [ ] Same day multiple entries: Last one wins or shows error?
- [ ] Weight = 0: Validation prevents save
- [ ] Weight > 500kg/1100lb: Validation prevents save

---

### ✅ Scenario 5: AI Assistant Tab ⚠️ CRITICAL
**Priority**: CRITICAL (MUST NOT BREAK)
**Estimated Time**: 5 minutes
**Platforms**: iOS + Android

#### Test Steps
1. [ ] Tap "Assistente" tab
2. [ ] Screen loads without crash
3. [ ] Title: "Assistente de Nutrição" or similar (NOT "Shotsy Assistant")
4. [ ] **If user NOT premium**:
   - [ ] Premium gate shows
   - [ ] Message: "Recurso Premium"
   - [ ] "Assinar Premium" button
   - [ ] Cannot access chat
5. [ ] **If user IS premium**:
   - [ ] Chat input field visible
   - [ ] Send button visible
   - [ ] Can type message
   - [ ] Send message
   - [ ] Loading indicator shows
   - [ ] Response from Gemini AI appears
   - [ ] Message history persists
   - [ ] Scroll works
   - [ ] No "Shotsy" in any responses

**Code Verification**:
```bash
# Verify AI Assistant file unchanged (except imports)
git diff feature/parity-p0..chore/brand-cleanup app/(tabs)/add-nutrition.tsx
```
**Expected**: Only import statement changed (useShotsyColors → useThemeColors)

**Critical**: This tab must be 100% functional. Any crash or data loss is a BLOCKER.

---

### ✅ Scenario 6: Accessibility & UX
**Priority**: MEDIUM
**Estimated Time**: 10 minutes
**Platforms**: iOS + Android

#### Test Steps

**Back Navigation**:
- [ ] Onboarding: Back button returns to previous screen
- [ ] Swipe from left edge (iOS) goes back
- [ ] Android back button goes back
- [ ] Dashboard: Back button exits app or goes to system

**Keyboard Handling**:
- [ ] Weight input: Keyboard shows numeric pad
- [ ] Keyboard doesn't cover input field
- [ ] Tap outside keyboard: dismisses
- [ ] iOS: Done button on keyboard

**Safe Areas**:
- [ ] iPhone notch: Content doesn't overlap
- [ ] Android status bar: Visible and correct height
- [ ] Bottom tabs: Above home indicator (iOS)

**Haptic Feedback**:
- [ ] Picker scroll: Light haptic
- [ ] Button press: Medium haptic
- [ ] Selection: Selection haptic
- [ ] Error: Notification haptic

**Accessibility Labels** (iOS VoiceOver / Android TalkBack):
- [ ] Buttons have labels
- [ ] Pickers have labels
- [ ] Charts have descriptions
- [ ] Images have alt text

---

## Brand Verification

### Command Line Check
```bash
# From project root
rg "Shotsy" --type-not md --type-not txt

# Expected output: 1 result
# app/(auth)/welcome.tsx: const showCarousel = useFeatureFlag('FF_MARKETING_CAROUSEL_SHOTSY');
# ^ This is a feature flag (internal), acceptable
```

### Manual UI Check
Open each screen and verify NO "Shotsy" visible:
- [ ] Welcome carousel (4 slides)
- [ ] All 22 onboarding screens
- [ ] Dashboard
- [ ] Results charts
- [ ] Add weight modal
- [ ] AI Assistant tab
- [ ] Settings screens
- [ ] FAQ content
- [ ] App rating prompt
- [ ] Error messages
- [ ] Toast notifications

**Expected**: Zero "Shotsy" references in UI

---

## Platform-Specific Tests

### iOS Only
- [ ] Face ID / Touch ID (if auth implemented)
- [ ] App icon shows "Mounjaro Tracker"
- [ ] Splash screen correct
- [ ] Push notifications (if implemented)
- [ ] Share sheet works
- [ ] Universal links work

### Android Only
- [ ] App icon shows "Mounjaro Tracker"
- [ ] Splash screen correct
- [ ] Back button behavior correct
- [ ] Deep links work
- [ ] Share intent works

---

## Performance Tests

### Chart Rendering
- [ ] Weight chart renders < 1 second
- [ ] PK curve renders < 1 second
- [ ] Scroll/pan smooth (60 fps)
- [ ] No frame drops

### Data Loading
- [ ] Dashboard loads < 2 seconds
- [ ] Onboarding saves < 3 seconds
- [ ] Weight entry saves < 2 seconds

### Memory
- [ ] No memory leaks (use Xcode Instruments / Android Profiler)
- [ ] App runs smoothly for 10+ minutes
- [ ] Background/foreground transitions smooth

---

## Known Limitations (Non-Blockers)

From `docs/COMPLETION_SUMMARY.md`:
1. **Bottom sheets not implemented** - Using native pickers instead (@gorhom/bottom-sheet conflict)
2. **No TypeScript type checking** - Manual testing required
3. **Victory charts not migrated** - Still using react-native-chart-kit
4. **No automated tests** - All testing manual

These are acceptable for RC1.

---

## Test Execution Timeline

| Phase | Duration | Platform |
|-------|----------|----------|
| Setup environment | 10 min | Both |
| Scenario 1: Onboarding | 20 min | iOS |
| Scenario 1: Onboarding | 20 min | Android |
| Scenarios 2-4 | 10 min | iOS |
| Scenarios 2-4 | 10 min | Android |
| Scenario 5: AI Assistant | 5 min | iOS |
| Scenario 5: AI Assistant | 5 min | Android |
| Scenario 6: Accessibility | 10 min | iOS |
| Scenario 6: Accessibility | 10 min | Android |
| Brand verification | 10 min | Both |
| **TOTAL** | **110 min** | **~2 hours** |

---

## Pass Criteria

**RC1 Approval Requires**:
- ✅ All CRITICAL scenarios pass on iOS
- ✅ All CRITICAL scenarios pass on Android
- ✅ Zero "Shotsy" visible in UI
- ✅ AI Assistant fully functional
- ✅ Onboarding saves to Supabase
- ✅ Charts render correctly
- ✅ No crash scenarios

**Acceptable Issues**:
- Minor UI alignment issues (non-blocking)
- Performance issues with 100+ data points (edge case)
- Missing accessibility labels (can fix in patch)

**Blocking Issues**:
- App crashes on any critical path
- Data loss or corruption
- "Shotsy" visible anywhere
- AI Assistant broken
- Onboarding cannot complete
- Cannot save weight entries

---

## Next Steps After Testing

1. Fill out `qa-report.md` with results
2. Take screenshots of key flows
3. Log all issues in issue tracker
4. Fix blocking issues immediately
5. Re-test affected scenarios
6. Get sign-off from Product/Engineering leads
7. Proceed to RC builds

---

**Tester Signature**: _________________
**Date**: _________________
**Platform Tested**: iOS ☐  Android ☐
**Pass/Fail**: _______________
