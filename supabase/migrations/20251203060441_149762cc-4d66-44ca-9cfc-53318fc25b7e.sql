-- Add more customer detail fields to delivery_locations
ALTER TABLE public.delivery_locations
ADD COLUMN customer_name text,
ADD COLUMN phone_number text,
ADD COLUMN email text,
ADD COLUMN alternative_phone text,
ADD COLUMN county text,
ADD COLUMN town text,
ADD COLUMN building_name text,
ADD COLUMN floor_unit text;

-- Enable realtime for payments and orders tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;