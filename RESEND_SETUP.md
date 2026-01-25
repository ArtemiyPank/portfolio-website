# Resend Email Setup Guide

## Quick Setup (5 minutes)

### 1. Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up (free, no credit card required)
3. Verify your email

### 2. Get API Key
1. Go to [API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "Portfolio Contact Form")
4. Click "Add"
5. **Copy the API key** (starts with `re_...`)

### 3. Configure Environment Variables

Update your `.env` file:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx  # Your actual API key
RESEND_FROM_EMAIL=onboarding@resend.dev  # Default sender (works immediately)
RESEND_TO_EMAIL=ad.pankrat@gmail.com  # Your email where messages will arrive
```

For production (VPS), update `.env.production`:
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=ad.pankrat@gmail.com
```

### 4. Test Locally

```bash
# Rebuild Docker
docker-compose down
docker-compose up --build -d

# Open http://localhost:3000/contact
# Fill the form and submit
```

Check your email inbox for the message!

## Using Custom Domain (Optional)

To send emails from `contact@artemiypank.com` instead of `onboarding@resend.dev`:

1. Go to [Domains](https://resend.com/domains)
2. Add your domain: `artemiypank.com`
3. Add DNS records (provided by Resend) to your domain
4. Wait for verification (~1-2 hours)
5. Update `.env`:
   ```bash
   RESEND_FROM_EMAIL=contact@artemiypank.com
   ```

## Free Tier Limits

- ✅ 100 emails per day
- ✅ 3,000 emails per month
- ✅ Perfect for portfolio contact forms

## Troubleshooting

### "API key not found" error
- Make sure you copied the full API key (starts with `re_`)
- Check `.env` file has correct variable name: `RESEND_API_KEY`
- Restart Docker after changing `.env`

### Emails not arriving
- Check spam/junk folder
- Verify `RESEND_TO_EMAIL` is correct
- Check Resend dashboard for logs

### Production issues
- Make sure `.env.production` is copied to VPS
- Verify environment variables are loaded in Docker

## Support

- Resend Docs: https://resend.com/docs
- Resend Status: https://status.resend.com
