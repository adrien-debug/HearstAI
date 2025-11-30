import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HearstAI Next.js API',
      version: '1.0.0',
      description: 'HearstAI Next.js API Documentation - Mining Intelligence Platform',
      contact: {
        name: 'HearstAI',
      },
    },
    servers: [
      {
        url: 'http://localhost:6001',
        description: 'Local Development Server',
      },
      {
        url: 'http://localhost:6001/api',
        description: 'Local API',
      },
    ],
    tags: [
      { name: 'customers', description: 'Customer management endpoints' },
      { name: 'collateral', description: 'Collateral and DeBank integration endpoints' },
      { name: 'debank', description: 'DeBank API health and status endpoints' },
      { name: 'fireblocks', description: 'Fireblocks integration endpoints' },
      { name: 'cockpit', description: 'Cockpit dashboard endpoints' },
      { name: 'health', description: 'Health check endpoints' },
    ],
    components: {
      schemas: {
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            erc20Address: { type: 'string' },
            tag: { type: 'string' },
            chains: { type: 'array', items: { type: 'string' } },
            protocols: { type: 'array', items: { type: 'string' } },
            totalValue: { type: 'number' },
            totalDebt: { type: 'number' },
            healthFactor: { type: 'number' },
            status: { type: 'string', enum: ['active', 'warning', 'critical', 'unknown'] },
            lastUpdate: { type: 'string', format: 'date-time' },
          },
        },
        CollateralClient: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            tag: { type: 'string' },
            wallets: { type: 'array', items: { type: 'string' } },
            positions: { type: 'array' },
            totalValue: { type: 'number' },
            totalDebt: { type: 'number' },
            healthFactor: { type: 'number' },
            lastUpdate: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'string' },
          },
        },
      },
    },
  },
  apis: [
    './app/api/**/route.ts', // Path to the API routes
    './app/api/**/*.ts', // Also check other TypeScript files
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
