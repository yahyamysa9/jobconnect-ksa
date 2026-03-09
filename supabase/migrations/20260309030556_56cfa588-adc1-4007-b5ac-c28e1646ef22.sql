
-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.jobs;
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs
  FOR SELECT
  USING (is_active = true);

-- Also make admin view permissive
DROP POLICY IF EXISTS "Admins can view all jobs" ON public.jobs;
CREATE POLICY "Admins can view all jobs"
  ON public.jobs
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
