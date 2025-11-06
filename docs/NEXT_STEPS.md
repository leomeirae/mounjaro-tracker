# 🚀 Next Steps: Complete V0 Integration

**Current Status**: 75-80% Complete
**Estimated Time to 100%**: 8-12 hours
**Priority**: Branding cleanup → Testing → Ship

---

## 🎯 Phase 4: Branding Cleanup (CRITICAL - 2-3 hours)

### Step 1: Rename Core Files

```bash
cd /Users/user/Desktop/mounjaro-tracker

# Rename the main theme hook
mv hooks/useShotsyColors.ts hooks/useThemeColors.ts

# Rename UI components (if they exist)
cd components/ui
[ -f shotsy-button.tsx ] && mv shotsy-button.tsx button.tsx
[ -f shotsy-card.tsx ] && mv shotsy-card.tsx card.tsx
[ -f shotsy-skeleton.tsx ] && mv skeleton.tsx
cd ../..
```

### Step 2: Global Find & Replace

```bash
# Replace useShotsyColors → useThemeColors in all TypeScript files
find . -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/docs/*" \
  -exec sed -i '' 's/useShotsyColors/useThemeColors/g' {} +

# Replace ShotsyButton → Button
find . -type f -name "*.tsx" \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -exec sed -i '' 's/ShotsyButton/Button/g' {} +

# Replace ShotsyCard → Card
find . -type f -name "*.tsx" \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -exec sed -i '' 's/ShotsyCard/Card/g' {} +

# Verify changes
echo "Checking for remaining 'Shotsy' references..."
grep -r "Shotsy" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" | wc -l
```

### Step 3: Manual Updates

Edit these files manually:

1. **app/(tabs)/faq.tsx** (line ~40)
   - Replace: "Como posso aproveitar ao máximo o uso do Shotsy?"
   - With: "Como posso aproveitar ao máximo o uso do Mounjaro Tracker?"
   - Replace: "Para aproveitar ao máximo o Shotsy, recomendamos..."
   - With: "Para aproveitar ao máximo o Mounjaro Tracker, recomendamos..."

2. **Remove "Shotsy" comments** in:
   - `app/(tabs)/results.tsx` (lines with "// Mudança: ... (Shotsy ...)")
   - `app/(tabs)/dashboard.tsx` (lines with "// Mudança: ... (Shotsy ...)")
   - `app/(tabs)/calendar.tsx` (lines with "// Mudança: ... (Shotsy ...)")
   - `app/(auth)/onboarding-flow.tsx` (line 2: "// Onboarding completo com 23 telas conforme Shotsy")
   - `app/(auth)/welcome.tsx` (comments mentioning "Shotsy")

### Step 4: Update Component Exports

If you renamed component files, update their exports:

**components/ui/index.ts** (if it exists):
```typescript
// Before:
export { ShotsyButton } from './shotsy-button';
export { ShotsyCard } from './shotsy-card';

// After:
export { Button } from './button';
export { Card } from './card';
```

### Step 5: Verification

```bash
# Final check - should return 0 or only markdown files
grep -r "Shotsy" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" | wc -l

# If any files remain, list them:
grep -r "Shotsy" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md"
```

---

## 🧩 Optional: Bottom Sheets (3-4 hours)

### Step 1: Install Dependencies

```bash
npm install @gorhom/bottom-sheet

# iOS only:
npx pod-install
```

### Step 2: Create Bottom Sheet Components

**File**: `components/application/MedicationBottomSheet.tsx`
```typescript
import React, { useMemo, forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useThemeColors } from '@/hooks/useThemeColors';

interface MedicationBottomSheetProps {
  onSelect: (medication: string) => void;
}

const MEDICATIONS = [
  { id: 'mounjaro', name: 'Mounjaro (Tirzepatide)' },
  { id: 'ozempic', name: 'Ozempic (Semaglutide)' },
  { id: 'wegovy', name: 'Wegovy (Semaglutide)' },
  { id: 'saxenda', name: 'Saxenda (Liraglutide)' },
];

export const MedicationBottomSheet = forwardRef<BottomSheet, MedicationBottomSheetProps>(
  ({ onSelect }, ref) => {
    const colors = useThemeColors();
    const snapPoints = useMemo(() => ['50%', '75%'], []);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={BottomSheetBackdrop}
        backgroundStyle={{ backgroundColor: colors.card }}
      >
        <View style={[styles.content, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>Selecione o medicamento</Text>
          {MEDICATIONS.map((med) => (
            <TouchableOpacity
              key={med.id}
              style={[styles.option, { borderBottomColor: colors.border }]}
              onPress={() => onSelect(med.id)}
            >
              <Text style={[styles.optionText, { color: colors.text }]}>{med.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
  },
  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
});
```

### Step 3: Integrate into Add Application Screen

**File**: `app/(tabs)/add-application.tsx`
```typescript
// Add at top:
import { useRef } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { MedicationBottomSheet } from '@/components/application/MedicationBottomSheet';

// Inside component:
const medicationSheetRef = useRef<BottomSheet>(null);

// Add handler:
const handleMedicationPress = () => {
  medicationSheetRef.current?.expand();
};

const handleMedicationSelect = (medication: string) => {
  setSelectedMedication(medication);
  medicationSheetRef.current?.close();
};

// In JSX, add at bottom:
<MedicationBottomSheet
  ref={medicationSheetRef}
  onSelect={handleMedicationSelect}
/>
```

---

## 🗄️ Phase 3: Deploy Supabase Migration (30 min)

### Option A: Using Supabase CLI

```bash
# If you have supabase CLI installed:
supabase db push

# Or apply specific migration:
supabase db push --include-all
```

### Option B: Using Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Copy contents of `/supabase/migrations/010_onboarding_enhancements.sql`
5. Paste and run

### Verification Queries

```sql
-- Check if new columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('onboarding_completed', 'treatment_start_date', 'device_type', 'frequency');

-- Check settings table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'settings'
  AND column_name IN ('weight_unit', 'height_unit');
```

---

## ✅ Phase 5: QA Testing (2-3 hours)

### Test Plan

#### 1. **Onboarding Flow** (iOS + Android)
```bash
# Start fresh
npm run ios  # or npm run android

# Test steps:
□ Navigate through all 22 onboarding steps
□ Verify pickers work (height in cm/ft+in, weight in kg/lb)
□ Verify slider + IMC bar displays correctly
□ Complete onboarding
□ Verify data saved to Supabase (check profiles table)
□ Verify onboarding_completed = true
```

#### 2. **Dashboard**
```bash
□ View dashboard after onboarding
□ Check chart renders
□ Check next shot widget displays
□ Check metrics cards show correct data
```

#### 3. **Add Weight**
```bash
□ Tap "+ Peso" button
□ Enter weight using picker
□ Save
□ Verify data in Supabase weights table
□ Verify chart updates in Results tab
```

#### 4. **Add Application/Shot**
```bash
□ Tap "+ Injeção" button
□ Select medication
□ Select dose
□ Select injection site
□ Select date
□ Save
□ Verify data in Supabase applications table
□ Verify appears in calendar
```

#### 5. **AI Assistant** ✨
```bash
□ Navigate to "IA" tab
□ Send a message to Gemini chat
□ Verify response received
□ Test nutrition analysis
□ Verify no conflicts with other screens
```

#### 6. **Dark Mode**
```bash
□ Toggle dark mode in settings
□ Navigate through all screens
□ Verify colors are readable
□ Verify no hardcoded colors visible
```

#### 7. **Auth Guard**
```bash
□ Log out
□ Verify redirects to welcome screen
□ Log in
□ Verify redirects to onboarding (if not completed)
□ Complete onboarding
□ Verify redirects to dashboard
□ Log out and log in again
□ Verify redirects directly to dashboard (onboarding completed)
```

---

## 📦 Final Checklist Before Ship

- [ ] All "Shotsy" references removed
- [ ] Supabase migration deployed
- [ ] Onboarding flow tested (iOS + Android)
- [ ] Add weight tested
- [ ] Add application tested
- [ ] AI Assistant working
- [ ] Dark mode working
- [ ] No console errors
- [ ] Build succeeds: `npm run ios` and `npm run android`

---

## 🚀 Ship It!

Once all checklist items are complete:

1. **Create git commit**:
```bash
git add .
git commit -m "feat: complete V0 integration - Mounjaro Tracker rebranding

- Rename useShotsyColors → useThemeColors
- Rename UI components
- Add Supabase onboarding_completed migration
- Verify all screens working
- AI Assistant preserved

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

2. **Optional: Create PR**:
```bash
gh pr create --title "V0 Integration Complete - Mounjaro Tracker" --body "$(cat <<'EOF'
## Summary
- ✅ Integrated 40 V0 screens into React Native
- ✅ Onboarding with native pickers and slider
- ✅ Dashboard, Results, Calendar, Settings, AI Assistant
- ✅ Removed Shotsy branding
- ✅ Supabase migration for onboarding fields

## Test Plan
- [x] Onboarding flow (iOS + Android)
- [x] Add weight
- [x] Add application
- [x] Charts rendering
- [x] Dark mode
- [x] AI Assistant

🤖 Generated with Claude Code
EOF
)"
```

3. **Deploy to TestFlight/Play Store Internal Testing** (optional)

---

## 📝 Notes

- **Victory Charts**: Currently using `react-native-chart-kit` which works well. Victory migration can be done as a future enhancement.
- **Bottom Sheets**: Optional for v1, can be added as polish in v1.1.
- **iOS Pods**: If you add new dependencies, run `npx pod-install`.

---

**Good luck! 🎉**
