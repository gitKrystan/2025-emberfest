import express from 'express';
import cors from 'cors';
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  validateJsonApiContentType,
  JSONAPI_CONTENT_TYPE,
  getFlags,
  updateFlag,
} from './controllers';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: true, // Allow all origins for development
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
  }),
);

app.use(express.json({ type: JSONAPI_CONTENT_TYPE }));

// Debug middleware to log request details
app.use((req, res, next) => {
  console.log('Request Details:');
  console.log(`  Method: ${req.method}`);
  console.log(`  URL: ${req.url}`);
  console.log(`  Content-Type: ${req.get('Content-Type') || 'undefined'}`);
  console.log(`  Content-Length: ${req.get('Content-Length') || 'undefined'}`);
  console.log(`  Body:`, req.body);
  console.log(`  Body type:`, typeof req.body);
  console.log(`  Raw body keys:`, Object.keys(req.body || {}));
  console.log(`  Headers:`, req.headers);
  console.log('---');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Todo API',
  });
});

// API Info endpoint
app.get('/', (req, res) => {
  res.setHeader('Content-Type', JSONAPI_CONTENT_TYPE);
  res.json({
    jsonapi: {
      version: '1.1',
    },
    links: {
      self: `${req.protocol}://${req.get('host')}/`,
      todos: `${req.protocol}://${req.get('host')}/api/todo`,
    },
    meta: {
      description: 'JSONAPI-compliant Todo API',
      version: '1.0.0',
    },
  });
});

// Validate JSONAPI content type for write operations
app.use('/api/todo', validateJsonApiContentType);

// Todo routes
app.get('/api/todo', getTodos);
app.get('/api/todo/:id', getTodo);
app.post('/api/todo', createTodo);
app.patch('/api/todo/:id', updateTodo);
app.delete('/api/todo/:id', deleteTodo);

// Flag routes
app.get('/api/flag', getFlags);
app.put('/api/flag/:id', updateFlag);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    errors: [
      {
        status: '404',
        title: 'Not Found',
        detail: `The requested path '${req.originalUrl}' was not found on this server.`,
      },
    ],
    jsonapi: {
      version: '1.1',
    },
  });
});

// Error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      errors: [
        {
          status: '500',
          title: 'Internal Server Error',
          detail: 'An unexpected error occurred.',
        },
      ],
      jsonapi: {
        version: '1.1',
      },
    });
  },
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Todo API server running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/`);
  console.log(`🎯 Todos endpoint: http://localhost:${PORT}/api/todo`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

export default app;
