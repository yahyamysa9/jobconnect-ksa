
-- Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  type text NOT NULL DEFAULT 'new_job',
  is_read boolean NOT NULL DEFAULT false,
  job_id uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Anyone can read notifications (public feature)
CREATE POLICY "Anyone can view notifications" ON public.notifications FOR SELECT TO public USING (true);

-- Only service role / admin can insert
CREATE POLICY "Admins can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update (mark as read)
CREATE POLICY "Admins can update notifications" ON public.notifications FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete notifications" ON public.notifications FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create trigger function to auto-create notification on new job
CREATE OR REPLACE FUNCTION public.notify_new_job()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.notifications (title, body, type, job_id)
  VALUES (
    'وظيفة جديدة: ' || NEW.title,
    NEW.company_name || ' - ' || NEW.city,
    'new_job',
    NEW.id
  );
  RETURN NEW;
END;
$$;

-- Create trigger on jobs table
CREATE TRIGGER on_new_job_notify
  AFTER INSERT ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_job();
