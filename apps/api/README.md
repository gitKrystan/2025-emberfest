# Todo API

A JSONAPI-compliant REST API for managing Todo items, built with TypeScript and Express.

## Features

- ✅ Full CRUD operations for Todo resources
- ✅ JSONAPI v1.1 specification compliance
- ✅ Singular dasherized resource types (`todo`)
- ✅ Proper HTTP status codes and error handling
- ✅ CORS support
- ✅ TypeScript for type safety

## Todo Model

```typescript
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

## API Endpoints

### Base URL

`http://localhost:3001`

### Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `GET /todos` - List all todos
- `GET /todos/:id` - Get a specific todo
- `POST /todos` - Create a new todo
- `PATCH /todos/:id` - Update an existing todo
- `DELETE /todos/:id` - Delete a todo

### Content Type

All requests and responses use the JSONAPI media type:

```
Content-Type: application/vnd.api+json
```

## Development

### Install dependencies

```bash
cd apps/api
pnpm install
```

### Run

```bash
pnpm dev
```

## JSONAPI Examples

### Get all todos

```bash
curl -H "Accept: application/vnd.api+json" http://localhost:3001/todos
```

### Create a new todo

```bash
curl -X POST http://localhost:3001/todos \
  -H "Content-Type: application/vnd.api+json" \
  -H "Accept: application/vnd.api+json" \
  -d '{
    "data": {
      "type": "todo",
      "attributes": {
        "title": "Learn JSONAPI",
        "completed": false
      }
    }
  }'
```

### Update a todo

```bash
curl -X PATCH http://localhost:3001/todos/123 \
  -H "Content-Type: application/vnd.api+json" \
  -H "Accept: application/vnd.api+json" \
  -d '{
    "data": {
      "type": "todo",
      "id": "123",
      "attributes": {
        "completed": true
      }
    }
  }'
```

### Delete a todo

```bash
curl -X DELETE http://localhost:3001/todos/123 \
  -H "Accept: application/vnd.api+json"
```

## JSONAPI Compliance

This API follows the [JSONAPI v1.1 specification](https://jsonapi.org/format/):

- Uses singular, dasherized resource types (`todo`)
- Proper resource object structure with `type`, `id`, `attributes`
- Includes `self` links on resources
- Standard error object format
- Proper HTTP status codes
- Content-Type validation for write operations

## Error Handling

The API returns JSONAPI-compliant error responses:

```json
{
  "errors": [
    {
      "status": "404",
      "title": "Not Found",
      "detail": "Todo with id 'abc123' not found"
    }
  ],
  "jsonapi": {
    "version": "1.1"
  }
}
```
