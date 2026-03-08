import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'الاسم مطلوب').max(100, 'الاسم طويل جداً'),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح').max(255),
  subject: z.string().trim().min(1, 'الموضوع مطلوب').max(200, 'الموضوع طويل جداً'),
  message: z.string().trim().min(1, 'الرسالة مطلوبة').max(2000, 'الرسالة طويلة جداً'),
});

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSending(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="اتصل بنا - مسارك" description="تواصل مع فريق مسارك للاستفسارات والاقتراحات" />
      <Header />
      <main className="container py-10 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl hero-gradient flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">اتصل بنا</h1>
            <p className="text-muted-foreground">نسعد بتواصلك معنا! أرسل لنا رسالتك وسنرد عليك في أقرب وقت.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 md:p-8 space-y-5 card-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  placeholder="أدخل اسمك"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={errors.name ? 'border-destructive' : ''}
                  dir="rtl"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={errors.email ? 'border-destructive' : ''}
                  dir="ltr"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">الموضوع</Label>
              <Input
                id="subject"
                placeholder="موضوع الرسالة"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className={errors.subject ? 'border-destructive' : ''}
                dir="rtl"
              />
              {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">الرسالة</Label>
              <Textarea
                id="message"
                placeholder="اكتب رسالتك هنا..."
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={errors.message ? 'border-destructive' : ''}
                dir="rtl"
              />
              {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
            </div>

            <Button type="submit" className="w-full gap-2" disabled={sending}>
              <Send className="w-4 h-4" />
              {sending ? 'جاري الإرسال...' : 'إرسال الرسالة'}
            </Button>
          </form>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
