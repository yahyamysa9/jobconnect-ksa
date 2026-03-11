import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin');
    }
  }, [authLoading, user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError('بيانات الدخول غير صحيحة');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-card rounded-xl border border-border p-8 card-shadow">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-xl hero-gradient flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-foreground font-bold text-2xl">م</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">تسجيل دخول الأدمن</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 rounded-lg border border-border bg-background text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 rounded-lg border border-border bg-background text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              {forgotMsg && <p className="text-sm text-green-600">{forgotMsg}</p>}

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                className="text-sm text-primary hover:underline"
              >
                {forgotLoading ? 'جاري الإرسال...' : 'نسيت كلمة المرور؟'}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg hero-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
