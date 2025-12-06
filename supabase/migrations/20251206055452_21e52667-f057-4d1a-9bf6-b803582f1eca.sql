-- Create meter_registrations table
CREATE TABLE public.meter_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  meter_numbers TEXT[] NOT NULL,
  purchase_date DATE,
  purchase_location TEXT,
  receipt_number TEXT,
  warranty_extended BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meter_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can register meters"
ON public.meter_registrations
FOR INSERT
WITH CHECK (true);

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
ON public.meter_registrations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create quote_requests table
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_type TEXT NOT NULL,
  meter_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  location TEXT NOT NULL,
  timeline TEXT,
  budget TEXT,
  requirements TEXT,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit quotes"
ON public.quote_requests
FOR INSERT
WITH CHECK (true);

-- Admins can view all quotes
CREATE POLICY "Admins can view all quotes"
ON public.quote_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update quotes
CREATE POLICY "Admins can update quotes"
ON public.quote_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));