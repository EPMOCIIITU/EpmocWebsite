const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EPMOC Backend API',
      version: '1.0.0',
      description: 'API documentation for EPMOC — Event Planning, Management & Organising Council, IIIT Una.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5001}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'HttpOnly cookie set after login',
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication & session management' },
      { name: 'Events', description: 'Event CRUD operations' },
      { name: 'Teams', description: 'Team creation & invite code system' },
      { name: 'Registrations', description: 'Event registrations & Google Sheet sync' },
    ],
    paths: {
      // ==================== AUTH ====================
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'user@epmoc.in' },
                    password: { type: 'string', example: 'password123' },
                    role: { type: 'string', enum: ['core', 'head', 'member', 'participant'], default: 'participant' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User created successfully' },
            400: { description: 'User already exists' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and receive HttpOnly cookies (accessToken + refreshToken)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'admin@epmoc.in' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful. Sets HttpOnly cookies.' },
            401: { description: 'Invalid credentials' },
            429: { description: 'Rate limited (max 5 attempts per 15 min)' },
          },
        },
      },
      '/api/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh access token using refresh token cookie',
          security: [{ cookieAuth: [] }],
          responses: {
            200: { description: 'New access token issued' },
            401: { description: 'Invalid or expired refresh token' },
          },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout and clear auth cookies',
          responses: {
            200: { description: 'Logged out successfully' },
          },
        },
      },

      // ==================== EVENTS ====================
      '/api/events': {
        get: {
          tags: ['Events'],
          summary: 'Get all events (public)',
          responses: {
            200: { description: 'Array of events sorted by date' },
          },
        },
        post: {
          tags: ['Events'],
          summary: 'Create a new event (Core/Head only)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'date'],
                  properties: {
                    title: { type: 'string', example: 'MRIDANG 2026' },
                    date: { type: 'string', format: 'date', example: '2026-10-15' },
                    requiresTeam: { type: 'boolean', default: false },
                    minTeamSize: { type: 'number', default: 1 },
                    maxTeamSize: { type: 'number', default: 1 },
                    coverImage: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Event created with Google Workspace' },
            400: { description: 'Validation error or duplicate title' },
            403: { description: 'Insufficient role' },
          },
        },
      },

      // ==================== TEAMS ====================
      '/api/teams': {
        post: {
          tags: ['Teams'],
          summary: 'Create a new team for an event (generates invite code)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['eventId', 'name'],
                  properties: {
                    eventId: { type: 'string', example: '6a25aa7be3561a69e736b1d4' },
                    name: { type: 'string', example: 'Tension Free Party' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Team created with invite code' },
            400: { description: 'Already registered or event does not allow teams' },
          },
        },
      },
      '/api/teams/join': {
        post: {
          tags: ['Teams'],
          summary: 'Join an existing team using invite code',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['inviteCode'],
                  properties: {
                    inviteCode: { type: 'string', example: 'A3F2B1' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Joined team successfully' },
            400: { description: 'Team full or already registered' },
            404: { description: 'Invalid invite code' },
          },
        },
      },

      // ==================== REGISTRATIONS ====================
      '/api/registrations/{eventId}': {
        get: {
          tags: ['Registrations'],
          summary: 'Get all registrations for an event (Core/Head only)',
          security: [{ cookieAuth: [] }],
          parameters: [
            { name: 'eventId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Array of populated registrations' },
          },
        },
      },
      '/api/registrations': {
        post: {
          tags: ['Registrations'],
          summary: 'Register for an individual event (with optional file upload)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['eventId'],
                  properties: {
                    eventId: { type: 'string' },
                    customData: { type: 'string', description: 'JSON string of form responses' },
                    file: { type: 'string', format: 'binary', description: 'Image upload (max 5MB)' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Registration successful (auto-syncs to Google Sheet)' },
            400: { description: 'Already registered or team event' },
          },
        },
      },
      '/api/registrations/{eventId}/sync': {
        post: {
          tags: ['Registrations'],
          summary: 'Manually force-sync event data to Google Sheet (Core/Head only)',
          security: [{ cookieAuth: [] }],
          parameters: [
            { name: 'eventId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Data synced to sheet' },
            400: { description: 'No registrations to sync' },
          },
        },
      },

      // ==================== HEALTH ====================
      '/api/health': {
        get: {
          tags: ['Health'],
          summary: 'API health check',
          responses: {
            200: { description: 'API is running' },
          },
        },
      },
    },
  },
  apis: [], // We defined everything inline above
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
