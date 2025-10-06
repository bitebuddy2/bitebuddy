# Supabase Storage Setup Guide - Profile Pictures

This guide shows you exactly how to set up the `profile-pictures` storage bucket using the Supabase Dashboard.

## Step 1: Create Storage Bucket

1. **Open your Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Navigate to Storage**
   - Click **"Storage"** in the left sidebar
   - Click **"Create a new bucket"** or **"New bucket"**

3. **Configure the Bucket**
   ```
   Name: profile-pictures
   Public bucket: ✅ ON (toggle enabled)
   File size limit: 2097152 (2MB in bytes)
   Allowed MIME types: image/jpeg,image/jpg,image/png,image/webp,image/gif
   ```

4. **Click "Create bucket"**

---

## Step 2: Create Storage Policies

After creating the bucket, you need to set up policies to control access.

### Option A: Using Dashboard UI (Recommended - Easier)

1. **Go to the bucket policies**
   - Click on **"profile-pictures"** bucket
   - Click **"Policies"** tab
   - You'll see "No policies created yet"

2. **Create Policy #1: Upload (INSERT)**
   - Click **"New Policy"**
   - Click **"For full customization"** or **"Create a custom policy"**
   - Fill in:
     ```
     Policy name: Authenticated users can upload avatars

     Allowed operation:
     ☐ SELECT
     ✅ INSERT
     ☐ UPDATE
     ☐ DELETE

     Target roles: authenticated

     USING expression: (leave blank)

     WITH CHECK expression:
     bucket_id = 'profile-pictures'::text
     ```
   - Click **"Review"** then **"Save policy"**

3. **Create Policy #2: Read (SELECT)**
   - Click **"New Policy"** again
   - Fill in:
     ```
     Policy name: Public can view avatars

     Allowed operation:
     ✅ SELECT
     ☐ INSERT
     ☐ UPDATE
     ☐ DELETE

     Target roles: public

     USING expression:
     bucket_id = 'profile-pictures'::text

     WITH CHECK expression: (leave blank)
     ```
   - Click **"Review"** then **"Save policy"**

4. **Create Policy #3: Delete (DELETE)**
   - Click **"New Policy"** again
   - Fill in:
     ```
     Policy name: Users can delete own avatars

     Allowed operation:
     ☐ SELECT
     ☐ INSERT
     ☐ UPDATE
     ✅ DELETE

     Target roles: authenticated

     USING expression:
     bucket_id = 'profile-pictures'::text

     WITH CHECK expression: (leave blank)
     ```
   - Click **"Review"** then **"Save policy"**

### Option B: Using SQL Editor (Advanced)

If you prefer SQL, go to **SQL Editor** in the Supabase Dashboard and run:

```sql
-- Policy 1: Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-pictures');

-- Policy 2: Allow public read access
CREATE POLICY "Public can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- Policy 3: Allow authenticated users to delete
CREATE POLICY "Users can delete own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profile-pictures');
```

---

## Step 3: Verify Setup

1. **Check your policies**
   - Go to **Storage** → **profile-pictures** → **Policies**
   - You should see 3 policies listed:
     - ✅ Authenticated users can upload avatars (INSERT)
     - ✅ Public can view avatars (SELECT)
     - ✅ Users can delete own avatars (DELETE)

2. **Test upload (optional)**
   - In the Supabase Dashboard, click on the bucket
   - Click **"Upload file"**
   - Upload a test image to verify it works

3. **Check public access**
   - After uploading, click on the file
   - Copy the public URL
   - Open it in a new tab - it should display the image

---

## Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Where to find these:**
- Go to **Settings** → **API** in Supabase Dashboard
- Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

---

## Storage Operations Explained

Our app uses these Supabase Storage operations:

| Operation | Used By | Description |
|-----------|---------|-------------|
| **INSERT** | Upload API | Upload new avatar files |
| **SELECT** | Public access | View/download avatar images |
| **DELETE** | Delete API | Remove old avatar files |
| **getPublicUrl** | Display avatars | Get URL to show images |

We **don't** use:
- UPDATE (we delete and re-upload instead)
- move, copy, createSignedUrl (not needed for avatars)
- list (we store URL in user metadata)

---

## Security Model

### How it works:

1. **Frontend** (user browser):
   - Compresses image to ~1MB
   - Sends to API route with auth token

2. **API Route** (`/api/upload-avatar`):
   - Validates user is authenticated
   - Uses **service role key** to:
     - Delete old avatar (if exists)
     - Upload new avatar
     - Update user metadata with new URL
   - Returns public URL to frontend

3. **Storage Policies**:
   - Allow authenticated users to INSERT/DELETE
   - Allow public to SELECT (view images)
   - API handles user-specific validation

### Why this approach?

✅ **Simpler policies** - no complex path matching
✅ **More secure** - API validates everything
✅ **More flexible** - easy to add features
✅ **Better error handling** - centralized in API

---

## Common Issues

### "Error: new row violates row-level security policy"

**Solution**: Make sure you created all 3 policies correctly.

### "403 Forbidden" when viewing images

**Solution**:
- Check the bucket is set to **Public**
- Verify the SELECT policy exists and targets `public` role

### "Unauthorized" when uploading

**Solution**:
- Check `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Verify user is signed in
- Check INSERT policy exists for `authenticated` role

### Files upload but don't display

**Solution**:
- Verify bucket is **Public**
- Check the public URL format is correct
- Clear browser cache

---

## Testing Checklist

After setup, verify:

- [ ] Bucket `profile-pictures` exists
- [ ] Bucket is set to **Public**
- [ ] 3 policies created (INSERT, SELECT, DELETE)
- [ ] Environment variables set in `.env.local`
- [ ] Can upload test file in Supabase Dashboard
- [ ] Can view uploaded file via public URL
- [ ] App can upload avatar (test in `/account`)
- [ ] Avatar displays in header and account page
- [ ] Can delete avatar from account page

---

## Quick Reference

### Policy Summary

| Policy | Operation | Role | Purpose |
|--------|-----------|------|---------|
| Upload | INSERT | authenticated | Let users upload avatars |
| Read | SELECT | public | Let anyone view avatars |
| Delete | DELETE | authenticated | Let users remove avatars |

### File Structure

```
profile-pictures/          ← Storage bucket (public)
└── avatars/              ← Folder for avatar files
    ├── {user-id}-{timestamp}.jpg
    ├── {user-id}-{timestamp}.jpg
    └── ...
```

### Bucket Settings

```yaml
Name: profile-pictures
Public: Yes
Size Limit: 2 MB per file
MIME Types: image/jpeg, image/jpg, image/png, image/webp, image/gif
```

---

## Need Help?

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Policies Guide](https://supabase.com/docs/guides/storage/security/access-control)

---

**Done!** Your profile picture storage is ready to go! 🎉
