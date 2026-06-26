
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';

CREATE POLICY "Anyone can upload complaint photos"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'complaint-photos');

CREATE POLICY "Admins can view complaint photos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'complaint-photos');
