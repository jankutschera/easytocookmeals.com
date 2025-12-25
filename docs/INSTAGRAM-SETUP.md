# Instagram Basic Display API Setup

This guide explains how to set up the Instagram Basic Display API to automatically fetch images from @janshellskitchen.

## Prerequisites

- Facebook Developer Account
- Instagram Business or Creator Account
- Admin access to the Instagram account

---

## Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Select "Consumer" or "None" as the app type
4. Enter app name: "Easy To Cook Meals Instagram"
5. Click "Create App"

---

## Step 2: Add Instagram Basic Display Product

1. In your app dashboard, click "Add Product"
2. Find "Instagram Basic Display" and click "Set Up"
3. Click "Create New App" at the bottom
4. Note your **Instagram App ID** and **Instagram App Secret**

---

## Step 3: Configure Settings

1. Go to "Instagram Basic Display" → "Basic Display"
2. Add these OAuth Redirect URIs:
   ```
   https://easytocookmeals.com/api/instagram/callback
   https://localhost:3000/api/instagram/callback
   ```
3. Add these Deauthorize Callback URLs:
   ```
   https://easytocookmeals.com/api/instagram/deauth
   ```
4. Add your Instagram account as a Test User:
   - Go to "Roles" → "Instagram Testers"
   - Click "Add Instagram Testers"
   - Enter: `janshellskitchen`
   - Save

---

## Step 4: Accept Tester Invitation

1. Log in to Instagram as @janshellskitchen
2. Go to Settings → Apps and Websites → Tester Invites
3. Accept the invitation from your Facebook app

---

## Step 5: Get Access Token

### Option A: Use the Token Generator (Easiest)

1. In Facebook Developers, go to "Instagram Basic Display" → "Basic Display"
2. Scroll to "User Token Generator"
3. Click "Generate Token" for your test user
4. Log in and authorize the app
5. Copy the **Access Token**

### Option B: Manual OAuth Flow

1. Open this URL in your browser (replace YOUR_APP_ID):
   ```
   https://api.instagram.com/oauth/authorize
     ?client_id=YOUR_APP_ID
     &redirect_uri=https://localhost:3000/api/instagram/callback
     &scope=user_profile,user_media
     &response_type=code
   ```

2. Authorize the app and copy the `code` from the redirect URL

3. Exchange for access token:
   ```bash
   curl -X POST https://api.instagram.com/oauth/access_token \
     -F client_id=YOUR_APP_ID \
     -F client_secret=YOUR_APP_SECRET \
     -F grant_type=authorization_code \
     -F redirect_uri=https://localhost:3000/api/instagram/callback \
     -F code=YOUR_CODE
   ```

4. Get long-lived token (60 days):
   ```bash
   curl "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=YOUR_APP_SECRET&access_token=SHORT_LIVED_TOKEN"
   ```

---

## Step 6: Add Token to Environment

Add to your `.env` file:

```env
INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token_here
```

---

## Token Refresh

Long-lived tokens expire after **60 days**. To refresh:

```bash
curl "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=YOUR_CURRENT_TOKEN"
```

### Automatic Refresh (Recommended)

Create a cron job or scheduled task to refresh the token every 50 days:

```javascript
// scripts/refresh-instagram-token.js
const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;

fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`)
  .then(res => res.json())
  .then(data => {
    console.log('New token:', data.access_token);
    console.log('Expires in:', data.expires_in, 'seconds');
    // Update your .env or secret manager
  });
```

---

## Testing

Once configured, test the API:

```bash
curl "https://graph.instagram.com/me/media?fields=id,caption,media_url&access_token=YOUR_TOKEN"
```

Or visit: http://localhost:8101/api/instagram

---

## Troubleshooting

### "Token is invalid or expired"
- Generate a new token using the Token Generator
- Make sure you're using a long-lived token, not short-lived

### "User not found"
- Ensure the Instagram account accepted the tester invitation
- Verify the account is a Business or Creator account

### No images showing
- Check browser console for errors
- Verify the token in `.env` is correct
- Test the API endpoint directly: `/api/instagram`

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/instagram` | Fetches latest 12 Instagram posts |

The response is cached for 1 hour to reduce API calls.

---

## Resources

- [Instagram Basic Display API Docs](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Token Generator](https://developers.facebook.com/docs/instagram-basic-display-api/overview#user-token-generator)
- [API Reference](https://developers.facebook.com/docs/instagram-basic-display-api/reference)
