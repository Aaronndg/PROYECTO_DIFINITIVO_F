#!/usr/bin/env node

/**
 * Servidor MCP (Model Context Protocol) para Break_IA
 * Proporciona acceso a la base de datos Supabase a través de MCP
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL y SUPABASE_SERVICE_KEY son requeridos');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Crear servidor MCP
const server = new Server(
  {
    name: 'break-ia-supabase-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Herramientas disponibles
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'query_verses',
        description: 'Buscar versículos bíblicos por emoción o texto',
        inputSchema: {
          type: 'object',
          properties: {
            emotion: {
              type: 'string',
              description: 'Emoción para filtrar versículos (opcional)',
            },
            query: {
              type: 'string',
              description: 'Texto para búsqueda semántica (opcional)',
            },
            limit: {
              type: 'number',
              description: 'Número máximo de resultados',
              default: 10,
            },
          },
        },
      },
      {
        name: 'get_user_progress',
        description: 'Obtener progreso emocional de un usuario',
        inputSchema: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'ID del usuario',
            },
          },
          required: ['userId'],
        },
      },
      {
        name: 'get_emotional_tests',
        description: 'Obtener tests emocionales de un usuario',
        inputSchema: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'ID del usuario',
            },
            limit: {
              type: 'number',
              description: 'Número de tests a obtener',
              default: 10,
            },
          },
          required: ['userId'],
        },
      },
      {
        name: 'analyze_emotional_trend',
        description: 'Analizar tendencia emocional de un usuario',
        inputSchema: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'ID del usuario',
            },
            days: {
              type: 'number',
              description: 'Número de días a analizar',
              default: 30,
            },
          },
          required: ['userId'],
        },
      },
      {
        name: 'search_chat_history',
        description: 'Buscar en el historial de chat de un usuario',
        inputSchema: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'ID del usuario',
            },
            query: {
              type: 'string',
              description: 'Texto a buscar',
            },
            limit: {
              type: 'number',
              description: 'Número de mensajes a retornar',
              default: 10,
            },
          },
          required: ['userId'],
        },
      },
    ],
  };
});

// Implementación de herramientas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'query_verses': {
        let query = supabase.from('biblical_verses').select('*');
        
        if (args.emotion) {
          query = query.contains('emotion_tags', [args.emotion]);
        }
        
        const { data, error } = await query.limit(args.limit || 10);
        
        if (error) throw error;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                data: data || [],
                count: data?.length || 0,
              }, null, 2),
            },
          ],
        };
      }

      case 'get_user_progress': {
        const { data: progress, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', args.userId)
          .single();

        const { data: recentTests, error: testsError } = await supabase
          .from('emotional_tests')
          .select('*')
          .eq('user_id', args.userId)
          .order('test_date', { ascending: false })
          .limit(7);

        if (progressError && progressError.code !== 'PGRST116') throw progressError;
        if (testsError) throw testsError;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                progress: progress || null,
                recentTests: recentTests || [],
              }, null, 2),
            },
          ],
        };
      }

      case 'get_emotional_tests': {
        const { data, error } = await supabase
          .from('emotional_tests')
          .select('*')
          .eq('user_id', args.userId)
          .order('test_date', { ascending: false })
          .limit(args.limit || 10);

        if (error) throw error;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                tests: data || [],
                count: data?.length || 0,
              }, null, 2),
            },
          ],
        };
      }

      case 'analyze_emotional_trend': {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - (args.days || 30));

        const { data, error } = await supabase
          .from('emotional_tests')
          .select('test_date, mood_score, anxiety_level, stress_level, energy_level')
          .eq('user_id', args.userId)
          .gte('test_date', fromDate.toISOString().split('T')[0])
          .order('test_date', { ascending: true });

        if (error) throw error;

        // Calcular estadísticas
        const tests = data || [];
        const stats = {
          totalTests: tests.length,
          averageMood: tests.reduce((sum, test) => sum + test.mood_score, 0) / tests.length || 0,
          averageAnxiety: tests.reduce((sum, test) => sum + (test.anxiety_level || 0), 0) / tests.length || 0,
          averageStress: tests.reduce((sum, test) => sum + (test.stress_level || 0), 0) / tests.length || 0,
          averageEnergy: tests.reduce((sum, test) => sum + (test.energy_level || 0), 0) / tests.length || 0,
          trend: tests.length >= 2 ? 
            (tests[tests.length - 1].mood_score > tests[0].mood_score ? 'improving' : 
             tests[tests.length - 1].mood_score < tests[0].mood_score ? 'declining' : 'stable') : 'insufficient_data'
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                period: `${args.days || 30} días`,
                statistics: stats,
                rawData: tests,
              }, null, 2),
            },
          ],
        };
      }

      case 'search_chat_history': {
        let query = supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', args.userId)
          .order('timestamp', { ascending: false });

        if (args.query) {
          query = query.or(`message.ilike.%${args.query}%,response.ilike.%${args.query}%`);
        }

        const { data, error } = await query.limit(args.limit || 10);

        if (error) throw error;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                messages: data || [],
                count: data?.length || 0,
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Herramienta desconocida: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
          }, null, 2),
        },
      ],
    };
  }
});

// Iniciar servidor
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Break_IA MCP Server iniciado y conectado a Supabase');
}

main().catch((error) => {
  console.error('Error iniciando MCP server:', error);
  process.exit(1);
});