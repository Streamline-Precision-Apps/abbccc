# Database Child Branch Setup Guide

This guide explains how to configure your development environment to use a child branch database for safe development while keeping production data isolated.

## Updated .env Configuration

Here's how to modify your `.env` file to use the child branch:

```env
AUTH_SECRET="2Hi7wqGSuwpSxbgKvuUEO98gsj7uvwz4shvMfe30K+E="
NEXTAUTH_SECRET="xLGjdbYDkDLg9Ow+m9yTLpiZJ8E675cLPKDnnFvs3KI="
# AUTH_URL="https://shiftscanapp.com"
AUTH_TRUST_HOST=true
SENTRY_AUTH_TOKEN=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

# DEVELOPMENT DATABASE URLS (Child Branch)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19ibzdQNHEyQ2VSTmtLelVaczRNVm8iLCJhcGlfa2V5IjoiMDFLMUVKR0Q1NzNGTUtXSE1HWlZQODFORVEiLCJ0ZW5hbnRfaWQiOiIyZmRiOTlkMGRkMDEyZDZlMmRhNzM1YzY3MGFlNDA4OGI2Y2NkMThiZGQ0NjRiZTQ4MmM5NjdhNGEyZGQxNjQ0IiwiaW50ZXJuYWxfc2VjcmV0IjoiNzkwYzFkNDQtYzBkMS00MTA1LTk1MWItOTkxZjMzOTQ1Zjk1In0.8DWbE1bY2vqwKO2CaECUXiBy97G7WX0pPKt6iIYrnvc"
POSTGRES_PRISMA_URL="postgres://default:EMrbanTYv13o@ep-floral-violet-a6zl3mzc.us-west-2.aws.neon.tech:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NO_SSL="postgres://default:EMrbanTYv13o@ep-floral-violet-a6zl3mzc.us-west-2.aws.neon.tech:5432/verceldb"
POSTGRES_URL_NON_POOLING="postgres://default:EMrbanTYv13o@ep-floral-violet-a6zl3mzc.us-west-2.aws.neon.tech:5432/verceldb?sslmode=require"
POSTGRES_USER="default"
POSTGRES_HOST="ep-floral-violet-a6zl3mzc.us-west-2.aws.neon.tech"
POSTGRES_PASSWORD="EMrbanTYv13o"
POSTGRES_DATABASE="verceldb"

# PRODUCTION DATABASE URLS (Commented out for development)
# POSTGRES_PRISMA_URL="postgres://default:EMrbanTYv13o@ep-dark-heart-a6zdo2n8-pooler.us-west-2.aws.neon.tech:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15"
# POSTGRES_URL_NO_SSL="postgres://default:EMrbanTYv13o@ep-dark-heart-a6zdo2n8-pooler.us-west-2.aws.neon.tech:5432/verceldb"
# POSTGRES_URL_NON_POOLING="postgres://default:EMrbanTYv13o@ep-dark-heart-a6zdo2n8.us-west-2.aws.neon.tech:5432/verceldb?sslmode=require"
# POSTGRES_HOST="ep-dark-heart-a6zdo2n8-pooler.us-west-2.aws.neon.tech"

AUTH_RESEND_KEY="re_7HiZZ6pB_EUUzBiSCLPbVd4mCrFXCPB6N"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""
NEXT_PUBLIC_MAP_ID=""
IS_PROD_TEST="true"
NODE_ENV="development"
DOMAIN='shiftscanapp.com'
CRON_SECRET="iGnr2a4L6CE6kx028TBt"
GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
GOOGLE_CLOUD_KEY_PATH=./google-cloud-key.json

OPTIMIZE_API_KEY="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ3aWQiOiJjbWRxNGE5aTEwbHd1NTEwdmFkcnF5ZTN6IiwidWlkIjoiY21kcTRhOWxxMGx3eDUxMHZzZXJiemRzaSIsInRzIjoxNzUzOTA5NjQzMTgyfQ.-ikEO4aZPzLFbuD4CDpzz9JpErmBNA9_lIfKPI9zBxfhzXuuAY1CvepjzCfZS4XRoYL6CeKXOC4CiHEoYemBDQ"

NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY="BLfxD0jx0HqAEx8vbwDyCvzpFmILahuIH4wNitTQnLKPCrTIvulSob4pSThMsOBKZY2Jg6Z0eS6Bve0WdXpm_84"
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyBUBdLoaUHXzX2vR9x7vlrsGoQscf3ua8g"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="fcm-shift-scan.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="fcm-shift-scan"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="fcm-shift-scan.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="897456891133"
NEXT_PUBLIC_FIREBASE_APP_ID="1:897456891133:web:fee26fb80b6f4f021e0a94"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-TZHBBHJ7J7"

FIREBASE_SERVICE_JSON_TYPE="service_account"
FIREBASE_SERVICE_JSON_PROJECT_ID="fcm-shift-scan"
FIREBASE_SERVICE_JSON_PRIVATE_KEY_ID="e4325a037834ec7dc191a89cb1e649a44a3560e5"
FIREBASE_SERVICE_JSON_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDkKbRLFtIQleKp\nxHPjD0nhTVpa5deHfdjsk92ydg+V3pNXte0PKmttTGeMN5owyKDH/NwWhf6snGvq\nbsB9F1P5jMDYpeudYev0KboJyDRIeljViBiXJcgkVhlA8Z78Hs2BV1hkGFdYKTqK\n/qfllcAhS0+guazFZobJiw92N/DWwVhB5RdNcgHoBQh6OXV3ai2UF+gCHZ8NEDlW\nYxhfC0cHO27nKyK0xxkkvWrvsPofGhqUNgzZTbGbG8JE72bHYbiUgRbYYoaf0FPk\n6HUAtCeJlGo7G8psjqIDIlUexochCJe40rEaq5uLNc4D+Yqir7hVxe3UFC2RSAih\n1iNerUuLAgMBAAECggEAPHpPd23jnZDVRXG01BVb3HQQBLMSx6/UfZUOOT0xEWUv\nghrPbOsuEYkkk1azsMWlVI1SW0gGQwOtWTUlIaM615V3EpYcV5m6nPwoe2pNbX68\nqFEMT5gsrnEB/aRuI18Y0vVvkQygrlYzVd99ao4goNKhFzXQNXzhMnABV7EpTgru\ns08Pc+5GoJHGSpjG8CDoJimlXnBhbA5YmimJHgZHm5KYNBcqd1n5AxwzL2gEst9G\nKrQqvogmQ2ZBX3Ker5ESOv1rCF+BK47vgvru4f80/FK2DNoqRoWOkDInFGR0JXpY\nLvptZqf3iz/TBGqtiyKUN2p8qmINbxAOmcLK6ZqI0QKBgQD0q9KlUta/02O1IajI\nh3HU7gGpqV5RDqbS7SkReEkjT1qi97bT3cG3+nHiPrckABA/Ig79TZmXiAeNAZEA\nwH/gHkn718l9nU6YVEQo/cvRd5OnqEkctb/CYxYet81LCi+OaNRkD5iIZXg07GqC\nlKl0ZBsqbIBvMTceUBUYz1hpcQKBgQDuujPqfTU0ftyZVTRCuxUDOdsJvhLfIyWF\nJPxoif/L2FNVjVTWNFIK1Bx5nTBU2/MgCeCoEYehF5pUs3qaT2uUGNGXQE/M1Mqt\nwCHCse9byaohul2ubvYdx/0S4syD8H7WaCj5G9Mmq6QVsB5NlAvcNj3dWcIX8ZeI\njQUE+8mmuwKBgCjQEI8rRk8xP8yTFMh+b2qJWRWn/ueefg1pKhST7/9H2WKd1413\nzDyYNi77Lyl+KTeewslWDGzOcBQBUuLBOZN0+fpcgGvHtbiLNeNwknMaczLgS3HS\nj24pgSMWndQKmuwyaFtYjqUR5/9MAGhPzARyPmXRO4tQtlUEHsDItYLBAoGAF3r9\nDD1QdF9d9z7oKwAXqv+Pyb+GP6hHUnc21FlubXBTkgCarY7r2uDOBDAvxsjzet09\n2YoP2wplRZt5nZ/eJuziAIx0zOLJJJnXOD0kG9UUBMk92aBUWM2I2Mix8PBAqXoJ\nPac893q+Ytu1v0+mcvxqzVC8xHogu2+TZNAXH20CgYEAw/AKzbYL3ohUQYk4Am0W\nadiwFo2MMiMFL4ztwB5CGdSIiTpEHQfQGEwguMn9sSOuKK2xPeTQpwquurIj5NLP\n1ynN4Q2EwQTvIbta5VizibawbS+LSpCrRRv0DUZKwBlgCwJzyOs/m87u1C30Uf/R\nF88n/JnK3QDF7+CwHDY/ybs=\n-----END PRIVATE KEY-----\n"
FIREBASE_SERVICE_JSON_CLIENT_EMAIL="firebase-adminsdk-fbsvc@fcm-shift-scan.iam.gserviceaccount.com"
FIREBASE_SERVICE_JSON_CLIENT_ID="108364617359665811460"
FIREBASE_SERVICE_JSON_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
FIREBASE_SERVICE_JSON_TOKEN_URI="https://oauth2.googleapis.com/token"
FIREBASE_SERVICE_JSON_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
FIREBASE_SERVICE_JSON_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40fcm-shift-scan.iam.gserviceaccount.com"
FIREBASE_SERVICE_JSON_UNIVERSE_DOMAIN="googleapis.com"

URL="http://localhost:3000"
```

## Key Changes Made

1. **Updated Database URLs**: Changed from `ep-dark-heart-a6zdo2n8` (production) to `ep-floral-violet-a6zl3mzc` (child branch)
2. **Updated Host**: Changed `POSTGRES_HOST` to the child branch endpoint
3. **Commented Production URLs**: Kept original production URLs as comments for easy switching
4. **Fixed URL Protocol**: Changed `URL` from `https://localhost:3000` to `http://localhost:3000` for local development

## Database Migration Setup

After updating your `.env` file, you'll need to set up the child branch database:

```bash
# 1. Generate Prisma client with new connection
npx prisma generate

# 2. Push your current schema to the child branch database
npx prisma db push

# 3. (Optional) Seed the database with test data
npx prisma db seed
```

## Future Development Workflow

### 1. Development Environment Setup

- Keep the child branch URLs in your local `.env` file
- Use `.env.local` for any developer-specific overrides if needed
- Never commit `.env` files with sensitive data to version control

### 2. Environment Management Strategy

Create multiple environment files:

```bash
.env.development    # Child branch database URLs
.env.production     # Production database URLs
.env.local          # Local overrides (gitignored)
```

### 3. Recommended Git Strategy

```bash
# .gitignore should include:
.env
.env.local
.env.*.local
```

### 4. Database Schema Changes

When making schema changes during development:

```bash
# 1. Make changes to schema.prisma
# 2. Create migration (this will apply to child branch)
npx prisma migrate dev --name descriptive-migration-name

# 3. Generate updated client
npx prisma generate
```

### 5. Production Deployment

When ready to deploy to production:

```bash
# 1. Switch to production environment variables
# 2. Run migrations against production database
npx prisma migrate deploy

# 3. Generate production client
npx prisma generate
```

## Benefits of This Setup

1. **Data Isolation**: Development changes won't affect production data
2. **Safe Testing**: Test schema changes and new features safely
3. **Team Collaboration**: Multiple developers can work with separate child branches
4. **Migration Testing**: Test database migrations before applying to production

## Important Considerations

1. **Prisma Accelerate**: The `DATABASE_URL` still uses the Prisma Accelerate connection string - ensure your child branch is properly configured in Prisma Accelerate
2. **Data Sync**: The child branch starts with a copy of production data, but won't automatically sync future production changes
3. **Environment Variables**: Consider using environment-specific deployment configs for production vs. development
4. **Backup Strategy**: Ensure you have proper backup strategies for both production and development databases

## Environment Switching Commands

### Switch to Development (Child Branch)

```bash
# Uncomment child branch URLs in .env
# Comment out production URLs
npx prisma generate
npx prisma db push
```

### Switch to Production

```bash
# Comment out child branch URLs in .env
# Uncomment production URLs
npx prisma generate
npx prisma migrate deploy
```

## Team Member Setup (Joining Child Branch)

When a coworker wants to start using the same child branch database after you've already set it up, they should follow these steps:

### 1. Update Environment File

First, they need to update their local `.env` file with the child branch URLs (same as shown in the configuration section above).

### 2. Sync with Child Branch Database

```bash
# 1. Pull latest code changes (including any schema changes)
git pull origin your-branch-name

# 2. Generate Prisma client with new connection
npx prisma generate

# 3. Apply any pending migrations to sync with child branch schema
npx prisma migrate deploy

# 4. (Optional) Reset and resync if there are conflicts
# Only use this if you encounter schema conflicts
npx prisma migrate reset --force
npx prisma db push
```

### 3. Verify Connection

```bash
# Test the database connection
npx prisma db pull

# Check that you can see the expected tables
npx prisma studio
```

### Important Notes for Team Members:

- **Don't run `npx prisma db push`** initially - this might overwrite the existing child branch schema
- **Use `npx prisma migrate deploy`** to apply existing migrations
- **Only use `prisma db push`** if you're making new schema changes
- **Coordinate schema changes** with your team to avoid conflicts

## Team Development Workflow

### When Multiple Developers Use the Same Child Branch:

1. **Schema Changes Coordination**:

   ```bash
   # Developer A makes schema changes
   npx prisma migrate dev --name "add-user-preferences"
   git add . && git commit -m "Add user preferences migration"
   git push

   # Developer B syncs the changes
   git pull
   npx prisma migrate deploy
   npx prisma generate
   ```

2. **Handling Migration Conflicts**:

   ```bash
   # If migrations conflict, reset and resync
   npx prisma migrate reset --force
   npx prisma db push
   npx prisma generate
   ```

3. **Data Seeding for Team**:
   ```bash
   # If you need consistent test data across team
   npx prisma db seed
   ```

### Best Practices for Team Development:

1. **Communicate schema changes** in team chat/slack before pushing
2. **Use descriptive migration names** to help team understand changes
3. **Coordinate major migrations** to avoid downtime for other developers
4. **Keep migrations small and focused** for easier rollbacks if needed
5. **Test migrations locally** before pushing to shared child branch

## Troubleshooting Common Issues

### Issue: "Database schema is not in sync with migrations"

```bash
# Solution: Reset and resync
npx prisma migrate reset --force
npx prisma db push
npx prisma generate
```

### Issue: "Connection refused" or "Invalid database URL"

```bash
# Verify your .env file has the correct child branch URLs
# Check that DATABASE_URL and POSTGRES_PRISMA_URL are updated
# Restart your development server after .env changes
```

### Issue: "Prisma Client is not compatible"

```bash
# Regenerate the Prisma client
npx prisma generate
```

### Issue: Missing tables or data

```bash
# The child branch might need reseeding
npx prisma db seed

# Or you might need to apply migrations
npx prisma migrate deploy
```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use environment-specific configs** in deployment platforms
3. **Rotate database credentials** regularly
4. **Use least-privilege access** for database users
5. **Monitor database access logs** for suspicious activity

This setup provides a robust foundation for safe development while maintaining production data integrity.
