-- Add 'sales' and 'hr' roles to app_role enum and allow them to insert delivery_locations

-- Add enum values (safe to re-run in environments that don't have the values yet)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'app_role' AND e.enumlabel = 'sales'
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'sales';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'app_role' AND e.enumlabel = 'hr'
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'hr';
  END IF;
END$$;

-- Allow users with role sales or hr to insert delivery locations (e.g., create deliveries on behalf of customers)
CREATE POLICY IF NOT EXISTS "Sales or HR can insert delivery locations"
  ON public.delivery_locations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('sales'::app_role, 'hr'::app_role)
    )
  );
