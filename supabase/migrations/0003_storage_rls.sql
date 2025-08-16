-- Enable RLS on storage.objects
alter table storage.objects enable row level security;

-- Allow public read from product-images
create policy "Public read product-images" on storage.objects
for select using (
  bucket_id = 'product-images'
);

-- Allow insert/update via signed URL (enforced by Supabase Storage API) - policy is permissive
create policy "Upload to product-images via signed URL" on storage.objects
for insert with check (
  bucket_id = 'product-images'
);

create policy "Update product-images via signed URL" on storage.objects
for update using (
  bucket_id = 'product-images'
);