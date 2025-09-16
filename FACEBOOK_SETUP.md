# Facebook Ads Integration Setup Guide

This guide will help you set up Facebook App integration for your client dashboard to display real Facebook Ads data.

## Prerequisites

- A Facebook Developer account
- A Facebook Business Manager account
- Access to Facebook Ads Manager

## Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" and then "Create App"
3. Select "Business" as the app type
4. Fill in your app details:
   - **App Name**: Your Dashboard App
   - **App Contact Email**: Your email
   - **Business Manager Account**: Select your business account

## Step 2: Configure App Settings

1. In your app dashboard, go to "Settings" > "Basic"
2. Note down your **App ID** and **App Secret**
3. Add your domain to "App Domains": `localhost` (for development)
4. Set "Privacy Policy URL" and "Terms of Service URL" (required for review)

## Step 3: Add Marketing API Product

1. In your app dashboard, click "Add Product"
2. Find "Marketing API" and click "Set Up"
3. This will allow your app to access Facebook Ads data

## Step 4: Configure OAuth Settings

1. Go to "Marketing API" > "Tools"
2. Add OAuth Redirect URIs:
   - Development: `http://localhost:3000/api/facebook/callback`
   - Production: `https://yourdomain.com/api/facebook/callback`

## Step 5: Request Permissions

Your app will need the following permissions:
- `ads_read` - Read ads data
- `ads_management` - Manage ads (optional)
- `business_management` - Access business information

## Step 6: Environment Configuration

1. Copy `.env.example` to `.env.local`
2. Fill in your Facebook app credentials:

```env
FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/facebook/callback
```

## Step 7: Database Migration

Run the database migration to add Facebook integration fields:

```bash
# Apply the migration (this depends on your database setup)
# For Supabase, you can run the SQL in the Supabase dashboard
```

## Step 8: Test the Integration

1. Start your development server
2. Navigate to a client dashboard
3. Look for the "Facebook Connection" section
4. Click "Connect Facebook Account"
5. Complete the OAuth flow
6. Verify that real data appears in the KPI cards

## Troubleshooting

### Common Issues

1. **"Invalid OAuth access token"**
   - Check that your App ID and App Secret are correct
   - Ensure the redirect URI matches exactly

2. **"Insufficient permissions"**
   - Make sure you've requested the required permissions
   - Check that your app has been approved for Marketing API access

3. **"No ad accounts found"**
   - Ensure the user has access to ad accounts in Business Manager
   - Check that the ad accounts are active

### Development vs Production

- **Development**: Use `localhost` URLs and test with your own Facebook account
- **Production**: Update redirect URIs, submit app for review, and get permissions approved

## App Review Process

For production use, you'll need to submit your app for Facebook review:

1. Complete the App Review checklist
2. Provide detailed use case descriptions
3. Submit screen recordings of your integration
4. Wait for approval (typically 3-7 business days)

## Security Best Practices

1. Never commit your App Secret to version control
2. Use environment variables for all sensitive data
3. Implement proper error handling for API failures
4. Regularly rotate access tokens
5. Monitor API usage and rate limits

## Support

If you encounter issues:
1. Check the Facebook Developer documentation
2. Review the Marketing API changelog
3. Test with Facebook's Graph API Explorer
4. Contact Facebook Developer Support if needed