import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (password !== confirm) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError('حدث خطأ أثناء تحديث كلمة المرور');
    } else {
      setMessage('تم تغيير كلمة المرور بنجاح! جاري التحويل...');
      setTimeout(() => navigate('/admin/login'), 2000);
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border p-8 card-shadow text-center max-w-sm w-full">
            <p className="text-muted-foreground">رابط إعادة التعيين غير صالح أو منتهي الصلاحية.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-card rounded-xl border border-border p-8 card-shadow">
            <h1 className="text-xl font-bold text-foreground text-center mb-6">تعيين كلمة مرور جديدة</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 rounded-lg border border-border bg-background text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full h-11 rounded-lg border border-border bg-background text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg hero-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
