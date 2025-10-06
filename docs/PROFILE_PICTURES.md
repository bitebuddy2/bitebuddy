# Profile Picture Upload Documentation

## Overview

Users can upload and manage their profile pictures on Bite Buddy. Profile pictures are stored in Supabase Storage and displayed throughout the app.

## Features

- ✅ Upload profile pictures (JPEG, PNG, WebP, GIF)
- ✅ **Automatic client-side compression** (resizes to 400x400px, ~1MB)
- ✅ Maximum original file size: 10MB (compressed to ~1MB before upload)
- ✅ Automatic image optimization and storage
- ✅ Delete/replace existing profile pictures
- ✅ Display in header navigation (desktop & mobile)
- ✅ Display in mobile hamburger menu
- ✅ Large display on account page with hover overlay
- ✅ Secure upload with authentication
- ✅ Fast uploads thanks to compression

## Setup Instructions

### 1. Create Supabase Storage Bucket

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** in the sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `profile-pictures`
   - **Public bucket**: ✅ **Enable** (checked)
   - **File size limit**: 2097152 (2MB in bytes - images are compressed client-side to ~1MB)
   - **Allowed MIME types**:
     ```
     image/jpeg,image/jpg,image/png,image/webp,image/gif
     ```
5. Click **"Create bucket"**

**Note**: While Supabase free tier supports up to 50MB per file, we compress images client-side to 400x400px (~1MB) for optimal performance and fast uploads.

### 2. Set Up Storage Policies

Create policies for the `profile-pictures` bucket in the Supabase Dashboard:

**Go to: Storage → profile-pictures → Policies**

#### Policy 1: Allow Authenticated Users to Upload (INSERT)

- **Policy name**: `Authenticated users can upload avatars`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
(bucket_id = 'profile-pictures'::text)
```

> This allows any authenticated user to upload files to the profile-pictures bucket.

#### Policy 2: Allow Public Read Access (SELECT)

- **Policy name**: `Public can view avatars`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**:
```sql
(bucket_id = 'profile-pictures'::text)
```

> This allows anyone (including unauthenticated users) to view profile pictures.

#### Policy 3: Allow Users to Delete Their Own Avatars (DELETE)

- **Policy name**: `Users can delete own avatars`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
(bucket_id = 'profile-pictures'::text)
```

> This allows authenticated users to delete files. Additional validation happens in the API route (only allows deleting own avatar).

#### Alternative: Using Supabase Dashboard UI

Instead of SQL, you can create these policies in the Supabase Dashboard:

1. Go to **Storage** → **profile-pictures** → **Policies**
2. Click **"New Policy"**
3. Choose **"Custom"** or **"For full customization"**
4. Select the operation(s): `SELECT`, `INSERT`, `DELETE`
5. Set the target roles
6. Use the simple policy definition: `bucket_id = 'profile-pictures'`

**Note**: We use simpler policies because the API route (`/api/upload-avatar`) handles user-specific validation with the service role key. This is more flexible and easier to manage.

### 3. Environment Variables

Ensure you have these environment variables in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important**: The `SUPABASE_SERVICE_ROLE_KEY` is required for the upload API to work.

### 4. Verify Setup

To verify everything is working:

1. Sign in to your app
2. Go to `/account`
3. Hover over the profile picture
4. Click the camera icon to upload
5. Select an image (max 5MB)
6. Check that the image appears in:
   - Account page header
   - Desktop navigation
   - Mobile hamburger menu

## File Structure

### API Routes

**`/api/upload-avatar`** (`src/app/api/upload-avatar/route.ts`)
- **POST**: Upload a new profile picture
- **DELETE**: Remove the current profile picture

### Components

**Account Page** (`src/app/account/page.tsx`)
- Profile picture upload UI
- Hover overlay with upload/delete buttons
- Loading states

**Header** (`src/components/Header.tsx`)
- Display profile picture in desktop nav
- Display profile picture in mobile menu
- Fallback to user icon if no picture

## Usage

### For Users

1. **Upload Profile Picture**:
   - Go to "My Account"
   - Hover over your profile picture
   - Click the camera icon
   - Select an image file
   - Wait for upload confirmation

2. **Delete Profile Picture**:
   - Go to "My Account"
   - Hover over your profile picture
   - Click the trash icon
   - Confirm deletion

### For Developers

#### Upload Avatar Programmatically

```typescript
const uploadAvatar = async (file: File) => {
  const { data: { session } } = await supabase.auth.getSession();

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload-avatar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data.avatarUrl;
};
```

#### Get User Avatar URL

```typescript
const { data: { user } } = await supabase.auth.getUser();
const avatarUrl = user?.user_metadata?.avatar_url;
```

## File Naming Convention

Avatar files are stored with the following naming pattern:
```
avatars/{user_id}-{timestamp}.{extension}
```

Example:
```
avatars/a1b2c3d4-e5f6-7890-abcd-ef1234567890-1699999999999.jpg
```

## Image Compression

### How It Works

1. **User selects image** (any size up to 10MB)
2. **Client-side compression** runs automatically:
   - Resizes to 400x400px (maintains aspect ratio)
   - Converts to JPEG format
   - Compresses to ~85% quality
   - Target size: ~1MB or less
3. **Compressed image uploaded** to Supabase
4. **Fast upload** due to small file size

### Compression Details

- **Algorithm**: HTML5 Canvas API
- **Max dimensions**: 400x400px
- **Output format**: JPEG
- **Quality**: 85% (adjusts down if still too large)
- **Target size**: 1MB
- **Performance**: Runs in browser, no server load

### Benefits

- ✅ **Faster uploads** (1MB vs potentially 10MB+)
- ✅ **Lower bandwidth** usage
- ✅ **Consistent quality** across all avatars
- ✅ **Better UX** (no waiting for huge files)
- ✅ **Optimized storage** usage
- ✅ **Well within** Supabase free tier limits (50MB per file)

## Validation

### Client-Side Validation
- **File types**: JPEG, JPG, PNG, WebP, GIF (converted to JPEG after compression)
- **Max original file size**: 10MB
- **Max compressed size**: 2MB (generous buffer, target is 1MB)
- **Displays error** if validation fails

### Server-Side Validation
- **Authentication**: Required (JWT token)
- **File type check**: MIME type validation
- **File size limit**: 2MB (after compression)
- **Returns 400/401** on validation failure

## Storage Structure

```
profile-pictures/
└── avatars/
    ├── {user_id}-{timestamp}.jpg
    ├── {user_id}-{timestamp}.png
    └── ...
```

## Security

### Authentication
- All upload/delete operations require authentication
- JWT token passed in `Authorization` header
- Server verifies user identity before processing

### File Access
- Profile pictures are **publicly readable**
- Only the owner can upload/update/delete their picture
- Service role key used server-side for admin operations

### Automatic Cleanup
- Old avatars are automatically deleted when a new one is uploaded
- Prevents orphaned files and storage bloat

## Troubleshooting

### Upload fails with "Unauthorized"
- Check that user is signed in
- Verify JWT token is being passed correctly
- Check Supabase service role key in `.env.local`

### Image doesn't display
- Check Supabase Storage bucket is public
- Verify RLS policies are set correctly
- Check browser console for CORS errors
- Ensure URL is accessible: `https://{project}.supabase.co/storage/v1/object/public/profile-pictures/avatars/{filename}`

### "File too large" error
- Original image must be under 10MB
- If you see this, the automatic compression may have failed
- Try a smaller or different image
- The system automatically compresses to ~1MB, so this is rare

### Storage policies not working
- Verify policies are created on `storage.objects` table
- Check user UUID matches policy conditions
- Test with Supabase SQL editor

### Image shows in account but not in header
- Clear cache and hard reload (Ctrl+Shift+R)
- Check that session is being refreshed after upload
- Verify `user.user_metadata.avatar_url` is set

## Best Practices

### For Users
1. Any image works - automatic compression handles the rest!
2. Original files up to 10MB supported
3. Square images look best, but any aspect ratio works
4. Use clear, professional photos
5. Avoid offensive or inappropriate content

### For Developers
1. ✅ Client-side compression is already implemented
2. Always validate files before compression
3. Show loading states during compression and upload
4. Handle errors gracefully with user-friendly messages
5. Refresh user session after upload to update metadata
6. Log compression results to console for debugging
7. Consider adding image cropping UI for even better UX

## Future Enhancements

- [ ] Image cropping tool
- [x] ✅ Automatic image compression (implemented!)
- [ ] Multiple image sizes (thumbnail, medium, large)
- [ ] Default avatar options/templates
- [ ] Gravatar integration as fallback
- [ ] AI-powered background removal
- [ ] Profile picture history/gallery
- [ ] Progressive image loading with blur effect

## API Reference

### POST /api/upload-avatar

Upload a new profile picture.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Body:**
```
file: File (image/jpeg, image/png, image/webp, image/gif)
```

**Response (Success):**
```json
{
  "success": true,
  "avatarUrl": "https://...supabase.co/storage/v1/object/public/profile-pictures/avatars/..."
}
```

**Response (Error):**
```json
{
  "error": "File too large. Maximum size is 5MB."
}
```

### DELETE /api/upload-avatar

Remove the current profile picture.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (Success):**
```json
{
  "success": true
}
```

**Response (Error):**
```json
{
  "error": "Failed to delete profile picture"
}
```

## Performance Considerations

- Profile pictures are served from Supabase CDN
- Images are cached by browsers
- Consider implementing lazy loading for lists of avatars
- Use Next.js Image component for automatic optimization

## Accessibility

- All avatar images have proper `alt` text
- Fallback icon shown when no picture uploaded
- Keyboard accessible upload interface
- Screen reader friendly labels

---

For more information, see:
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Next.js Image Component](https://nextjs.org/docs/api-reference/next/image)
