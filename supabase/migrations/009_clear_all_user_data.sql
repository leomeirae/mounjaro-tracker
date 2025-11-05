-- ========================================
-- CLEAR ALL USER DATA
-- ========================================
-- Limpa todos os dados de todos os usuários do Supabase
-- Ordem: deletar tabelas filhas primeiro, depois tabelas pais
-- Data: 05/11/2025
-- ========================================

-- Desabilitar temporariamente as foreign keys para limpeza mais rápida
-- (PostgreSQL não permite isso diretamente, então deletamos na ordem correta)

-- 1. Deletar tabelas filhas que dependem de outras tabelas filhas
DELETE FROM medication_applications;
DELETE FROM side_effects;

-- 2. Deletar medications (depende de users, mas outras tabelas dependem dele)
DELETE FROM medications;

-- 3. Deletar todas as outras tabelas filhas que dependem apenas de users
DELETE FROM achievements;
DELETE FROM daily_nutrition;
DELETE FROM daily_streaks;
DELETE FROM scheduled_notifications;
DELETE FROM subscriptions;
DELETE FROM weight_logs;
DELETE FROM settings;

-- 4. Deletar tabelas que podem não existir (com verificação)
-- (Se a tabela não existir, o comando será ignorado)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'applications') THEN
        DELETE FROM applications;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'weights') THEN
        DELETE FROM weights;
    END IF;
END $$;

-- 5. Por último, deletar todos os usuários
DELETE FROM users;

-- ========================================
-- RESULTADO ESPERADO:
-- ========================================
-- Todas as tabelas relacionadas a usuários devem estar vazias
-- O banco está pronto para começar do zero
-- ========================================

