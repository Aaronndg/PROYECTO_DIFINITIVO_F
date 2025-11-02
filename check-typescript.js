#!/usr/bin/env node

/**
 * Script para verificar problemas de TypeScript antes del deploy
 * Ejecutar: node check-typescript.js
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Verificando problemas de TypeScript...\n');

// Verificar archivos que usan supabaseAdmin
const filesToCheck = [
  'src/app/api/chat/route.ts',
  'src/app/api/telegram/route.ts', 
  'src/app/api/verses/route.ts',
  'src/app/api/tests/route.ts',
  'src/lib/embeddings.ts',
  'scripts/generate-embeddings.ts'
];

let hasErrors = false;

filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Buscar usos de supabaseAdmin sin verificación
    const supabaseAdminUses = content.match(/await supabaseAdmin\./g);
    const nullChecks = content.match(/if\s*\(\s*!?supabaseAdmin\s*\)/g);
    
    if (supabaseAdminUses && supabaseAdminUses.length > 0) {
      console.log(`📄 ${file}:`);
      console.log(`   🔍 Usos de supabaseAdmin: ${supabaseAdminUses.length}`);
      console.log(`   ✅ Verificaciones null: ${nullChecks ? nullChecks.length : 0}`);
      
      if (!nullChecks || nullChecks.length === 0) {
        console.log(`   ❌ PROBLEMA: No hay verificaciones null!`);
        hasErrors = true;
      } else {
        console.log(`   ✅ OK: Verificaciones presentes`);
      }
    }
  } else {
    console.log(`⚠️  Archivo no encontrado: ${file}`);
  }
});

console.log(`\n📊 RESULTADO:`);
if (hasErrors) {
  console.log('❌ HAY PROBLEMAS DE TYPESCRIPT');
  process.exit(1);
} else {
  console.log('✅ TODO PARECE CORRECTO');
  process.exit(0);
}