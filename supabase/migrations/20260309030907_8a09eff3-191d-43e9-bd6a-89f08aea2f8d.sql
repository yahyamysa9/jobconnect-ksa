
-- Categories: recreate SELECT policies as permissive
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Cities: recreate SELECT policies as permissive
DROP POLICY IF EXISTS "Anyone can view cities" ON public.cities;
CREATE POLICY "Anyone can view cities" ON public.cities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert cities" ON public.cities;
CREATE POLICY "Admins can insert cities" ON public.cities FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update cities" ON public.cities;
CREATE POLICY "Admins can update cities" ON public.cities FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete cities" ON public.cities;
CREATE POLICY "Admins can delete cities" ON public.cities FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Companies: recreate SELECT policies as permissive
DROP POLICY IF EXISTS "Anyone can view companies" ON public.companies;
CREATE POLICY "Anyone can view companies" ON public.companies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert companies" ON public.companies;
CREATE POLICY "Admins can insert companies" ON public.companies FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update companies" ON public.companies;
CREATE POLICY "Admins can update companies" ON public.companies FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete companies" ON public.companies;
CREATE POLICY "Admins can delete companies" ON public.companies FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
