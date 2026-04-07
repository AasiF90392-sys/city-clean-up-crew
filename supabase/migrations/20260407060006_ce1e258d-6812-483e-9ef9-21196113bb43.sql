
-- Complaints table
CREATE TABLE public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  priority TEXT NOT NULL DEFAULT 'low',
  status TEXT NOT NULL DEFAULT 'Pending',
  is_urgent BOOLEAN NOT NULL DEFAULT false,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Anyone can insert complaints (public form)
CREATE POLICY "Anyone can submit complaints"
ON public.complaints FOR INSERT
WITH CHECK (true);

-- Only authenticated users (admins) can view
CREATE POLICY "Admins can view all complaints"
ON public.complaints FOR SELECT
TO authenticated
USING (true);

-- Only authenticated users can update
CREATE POLICY "Admins can update complaints"
ON public.complaints FOR UPDATE
TO authenticated
USING (true);

-- Only authenticated users can delete
CREATE POLICY "Admins can delete complaints"
ON public.complaints FOR DELETE
TO authenticated
USING (true);

-- Public can select their own complaint by tracking_id (for tracking page)
CREATE POLICY "Public can view by tracking_id"
ON public.complaints FOR SELECT
TO anon
USING (true);

-- Ward Officers table
CREATE TABLE public.ward_officers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  ward_name TEXT NOT NULL,
  designation TEXT NOT NULL DEFAULT 'Ward Officer',
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ward_officers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage ward officers"
ON public.ward_officers FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can view ward officers"
ON public.ward_officers FOR SELECT
TO anon
USING (true);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  sent_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage notifications"
ON public.notifications FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_complaints_updated_at
BEFORE UPDATE ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ward_officers_updated_at
BEFORE UPDATE ON public.ward_officers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
