# Environment Variables

## Backend

- `PORT`: API server port, default `5000`
- `JWT_SECRET`: secret used to sign JWTs
- `JWT_EXPIRES_IN`: token lifetime, default `7d`
- `CLIENT_URL`: frontend origin used by CORS

## Frontend

- `NEXT_PUBLIC_API_URL`: API base URL, default `http://localhost:5000/api`

## Example

```bash
# backend/.env
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# frontend/.env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```