#!/bin/bash

# =============================================================================
# MOUNJARO TRACKER - BUILD READINESS VERIFICATION
# =============================================================================
# This script verifies that all prerequisites are met for building RC1.
# Run this before attempting any builds to catch configuration issues early.
#
# Usage: ./scripts/verify-build-ready.sh
# =============================================================================

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
ERRORS=0
WARNINGS=0
CHECKS_PASSED=0

# Helper functions
print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
    ((CHECKS_PASSED++))
}

print_error() {
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Start verification
print_header "Mounjaro Tracker RC1 - Build Readiness Check"

# =============================================================================
# 1. FILE STRUCTURE VERIFICATION
# =============================================================================
print_info "Checking required files..."
echo ""

# Core configuration files
if [ -f "app.json" ]; then
    print_success "app.json found"
else
    print_error "app.json missing"
fi

if [ -f "eas.json" ]; then
    print_success "eas.json found"
else
    print_error "eas.json missing"
fi

if [ -f "package.json" ]; then
    print_success "package.json found"
else
    print_error "package.json missing"
fi

# Environment configuration
if [ -f ".env.local" ]; then
    print_success ".env.local found"
elif [ -f ".env" ]; then
    print_success ".env found"
else
    print_error "Environment file missing (.env.local or .env)"
    print_info "  Run: cp .env.example .env.local"
fi

# Asset files
if [ -f "assets/icon.png" ]; then
    print_success "App icon found"
else
    print_error "assets/icon.png missing"
fi

if [ -f "assets/splash.png" ]; then
    print_success "Splash screen found"
else
    print_error "assets/splash.png missing"
fi

if [ -f "assets/adaptive-icon.png" ]; then
    print_success "Adaptive icon found"
else
    print_error "assets/adaptive-icon.png missing"
fi

echo ""

# =============================================================================
# 2. ENVIRONMENT VARIABLES VERIFICATION
# =============================================================================
print_info "Checking environment variables..."
echo ""

# Load environment file
if [ -f ".env.local" ]; then
    source .env.local
elif [ -f ".env" ]; then
    source .env
fi

# Required variables
if [ -n "$EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY" ] && [ "$EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY" != "pk_test_your-clerk-publishable-key-here" ]; then
    print_success "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY configured"
else
    print_error "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY not configured or still using placeholder"
fi

if [ -n "$EXPO_PUBLIC_SUPABASE_URL" ] && [ "$EXPO_PUBLIC_SUPABASE_URL" != "https://your-project.supabase.co" ]; then
    print_success "EXPO_PUBLIC_SUPABASE_URL configured"
else
    print_error "EXPO_PUBLIC_SUPABASE_URL not configured or still using placeholder"
fi

if [ -n "$EXPO_PUBLIC_SUPABASE_ANON_KEY" ] && [ "$EXPO_PUBLIC_SUPABASE_ANON_KEY" != "your-anon-key-here" ]; then
    print_success "EXPO_PUBLIC_SUPABASE_ANON_KEY configured"
else
    print_error "EXPO_PUBLIC_SUPABASE_ANON_KEY not configured or still using placeholder"
fi

# Optional but recommended
if [ -n "$EXPO_PUBLIC_GEMINI_API_KEY" ] && [ "$EXPO_PUBLIC_GEMINI_API_KEY" != "your-gemini-api-key-here" ]; then
    print_success "EXPO_PUBLIC_GEMINI_API_KEY configured (AI features enabled)"
else
    print_warning "EXPO_PUBLIC_GEMINI_API_KEY not configured (AI features will be disabled)"
fi

# For migrations
if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ] && [ "$SUPABASE_SERVICE_ROLE_KEY" != "your-service-role-key-here" ]; then
    print_success "SUPABASE_SERVICE_ROLE_KEY configured (for migrations)"
else
    print_warning "SUPABASE_SERVICE_ROLE_KEY not configured (needed for migrations)"
fi

echo ""

# =============================================================================
# 3. GIT STATUS VERIFICATION
# =============================================================================
print_info "Checking git status..."
echo ""

if [ -d ".git" ]; then
    print_success "Git repository initialized"

    # Check for uncommitted changes
    if [ -z "$(git status --porcelain)" ]; then
        print_success "Working directory clean"
    else
        print_warning "Uncommitted changes detected"
        print_info "  Consider committing changes before building"
    fi

    # Check current branch
    CURRENT_BRANCH=$(git branch --show-current)
    print_info "  Current branch: $CURRENT_BRANCH"
else
    print_error "Not a git repository"
fi

echo ""

# =============================================================================
# 4. DEPENDENCIES VERIFICATION
# =============================================================================
print_info "Checking dependencies..."
echo ""

if [ -d "node_modules" ]; then
    print_success "node_modules directory exists"
else
    print_error "node_modules missing"
    print_info "  Run: npm install"
fi

# Check for key dependencies
if [ -d "node_modules/expo" ]; then
    print_success "Expo installed"
else
    print_error "Expo not installed"
fi

if [ -d "node_modules/@clerk/clerk-expo" ]; then
    print_success "Clerk authentication installed"
else
    print_error "Clerk not installed"
fi

if [ -d "node_modules/@supabase/supabase-js" ]; then
    print_success "Supabase client installed"
else
    print_error "Supabase not installed"
fi

echo ""

# =============================================================================
# 5. MIGRATIONS VERIFICATION
# =============================================================================
print_info "Checking database migrations..."
echo ""

if [ -d "supabase/migrations" ]; then
    MIGRATION_COUNT=$(ls -1 supabase/migrations/*.sql 2>/dev/null | wc -l)
    if [ "$MIGRATION_COUNT" -gt 0 ]; then
        print_success "Found $MIGRATION_COUNT migration file(s)"

        # Check for RLS migration
        if ls supabase/migrations/*fix_settings_rls*.sql 1> /dev/null 2>&1; then
            print_success "RLS security migration found"
        else
            print_warning "RLS security migration not found"
        fi
    else
        print_warning "No migration files found"
    fi
else
    print_error "supabase/migrations directory missing"
fi

echo ""

# =============================================================================
# 6. DOCUMENTATION VERIFICATION
# =============================================================================
print_info "Checking documentation..."
echo ""

if [ -f "docs/QUICK_START.md" ]; then
    print_success "Quick Start guide found"
else
    print_warning "docs/QUICK_START.md missing"
fi

if [ -f "docs/PRODUCT-REQUIREMENTS-DOCUMENT.md" ]; then
    print_success "PRD documentation found"
else
    print_warning "PRD documentation missing"
fi

if [ -f "README.md" ]; then
    print_success "README.md found"
else
    print_warning "README.md missing"
fi

echo ""

# =============================================================================
# 7. APP CONFIGURATION VERIFICATION
# =============================================================================
print_info "Checking app.json configuration..."
echo ""

# Verify app.json has correct values
if grep -q '"name": "Mounjaro Tracker"' app.json; then
    print_success "App name correctly set"
else
    print_error "App name incorrect in app.json"
fi

if grep -q '"version": "1.0.0"' app.json; then
    print_success "Version set to 1.0.0"
else
    print_error "Version incorrect in app.json"
fi

if grep -q '"bundleIdentifier": "com.mounjarotracker.app"' app.json; then
    print_success "iOS bundle identifier configured"
else
    print_error "iOS bundle identifier missing"
fi

if grep -q '"package": "com.mounjarotracker.app"' app.json; then
    print_success "Android package name configured"
else
    print_error "Android package name missing"
fi

echo ""

# =============================================================================
# FINAL SUMMARY
# =============================================================================
print_header "Verification Summary"

echo -e "Checks passed:  ${GREEN}$CHECKS_PASSED${NC}"
echo -e "Warnings:       ${YELLOW}$WARNINGS${NC}"
echo -e "Errors:         ${RED}$ERRORS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Build readiness check PASSED!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "  1. Run migrations: node scripts/apply-migrations.js"
    echo "  2. Test locally: npm run start"
    echo "  3. Build preview: eas build --profile preview"
    echo "  4. Build production: eas build --profile production"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Build readiness check FAILED!${NC}"
    echo ""
    echo -e "${YELLOW}Please fix the errors above before proceeding with build.${NC}"
    echo ""
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}Warnings can be addressed but won't block the build.${NC}"
        echo ""
    fi
    exit 1
fi
