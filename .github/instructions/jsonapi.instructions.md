# JSON:API Guidelines

🚨 **MANDATORY: These instructions MUST be followed for ALL JSON:API related tasks** 🚨

⚠️ CRITICAL: Before providing ANY JSON:API suggestions, guidance, or code examples, you MUST:

1. Fetch the latest JSON:API specification using the `fetch_webpage` tool with the URL: `https://jsonapi.org/`
2. Reference this specification to ensure your suggestions align with current JSON:API standards
3. Always follow these explicit instructions over patterns found in existing code

🚨 **MANDATORY REQUIREMENTS**:

- ALWAYS use spec-compliant JSON:API format for all API examples
- Follow proper JSON:API document structure with `data`, `included`, `meta`, etc.
- Use correct JSON:API resource object format with `type`, `id`, and `attributes`
- Implement proper JSON:API relationship handling with `relationships` and `links`
- Use appropriate JSON:API error format when showing error examples
- Follow JSON:API naming conventions (kebab-case for member names)

## JSON:API Document Structure

### Resource Objects

```json
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API paints my bikeshed!",
      "body": "The shortest article. Ever."
    },
    "relationships": {
      "author": {
        "data": { "type": "people", "id": "9" }
      }
    }
  }
}
```

### Collection Resources

```json
{
  "data": [
    {
      "type": "articles",
      "id": "1",
      "attributes": {
        "title": "JSON:API paints my bikeshed!"
      }
    }
  ],
  "meta": {
    "total-count": 13
  }
}
```

### Error Objects

```json
{
  "errors": [
    {
      "status": "422",
      "source": { "pointer": "/data/attributes/title" },
      "title": "Invalid Attribute",
      "detail": "Title must contain at least three characters."
    }
  ]
}
```

## WarpDrive + JSON:API Integration

When showing WarpDrive examples with JSON:API:

- Use `@warp-drive/json-api` package for JSON:API cache implementation
- Demonstrate proper schema definitions that align with JSON:API resource objects
- Show request builders that produce spec-compliant JSON:API requests
- Use appropriate JSON:API content types: `application/vnd.api+json`

## Common JSON:API Patterns to Follow

### Sparse Fieldsets

```
GET /articles?fields[articles]=title,body&fields[people]=name
```

### Inclusion of Related Resources

```
GET /articles/1?include=author,comments.author
```

### Sorting

```
GET /articles?sort=-created,title
```

### Pagination

```
GET /articles?page[number]=3&page[size]=10
```

### Filtering

```
GET /articles?filter[author]=John&filter[category]=tech
```

## Resources

🚨 **MANDATORY BEFORE ANY JSON:API WORK**: Use the `fetch_webpage` tool with the URL `https://jsonapi.org/` to access the latest JSON:API specification. This MUST be done before providing any JSON:API suggestions, code examples, or guidance.

**NEVER suggest JSON:API solutions without first fetching the official specification.**

## Additional Resources

- **Official Specification**: https://jsonapi.org/
- **Format**: https://jsonapi.org/format/
- **Recommendations**: https://jsonapi.org/recommendations/
- **Examples**: https://jsonapi.org/examples/
