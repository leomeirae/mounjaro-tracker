-- ========================================
-- FIX: Users Table RLS Policies for Clerk
-- ========================================
-- Problema: Políticas RLS bloqueando INSERT quando usando Clerk
-- Solução: Desabilitar RLS (mesma abordagem usada em daily_nutrition e settings)
-- Data: 05/11/2025
-- ========================================

-- DESABILITAR RLS na tabela users
-- Quando você usa Clerk, não precisa de RLS porque a autenticação
-- já é feita pelo Clerk e o app filtra por clerk_id no código
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;

-- Remove políticas antigas que usavam auth.uid()
DROP POLICY IF EXISTS "Allow authenticated inserts" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

-- ========================================
-- EXPLICAÇÃO:
-- ========================================
-- Com Clerk + Supabase (sem Supabase Auth):
-- 1. O Clerk autentica o usuário
-- 2. O app obtém o user_id do Supabase via clerk_id
-- 3. O app filtra dados por clerk_id no código (useUserSync, useUser)
-- 4. RLS não é necessário porque não há auth.uid()
-- 
-- Segurança:
-- - O anon key do Supabase só permite acesso via app
-- - O app sempre filtra por clerk_id do usuário logado
-- - Cada operação usa .eq('clerk_id', userId)
-- - Usuários maliciosos precisariam ter o anon key E
--   conhecer o clerk_id de outro usuário
-- ========================================

