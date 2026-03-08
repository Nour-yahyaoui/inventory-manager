'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialCheck, setInitialCheck] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          // User is logged in, redirect immediately
          router.replace('/dashboard');
          return;
        }
      }
    } catch (err) {
      console.error('Auth check error:', err);
    } finally {
      // Show login form only after checking auth
      setInitialCheck(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = isLogin ? '/api/login' : '/api/register';
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setError(data.error || 'حدث خطأ');
        } catch {
          setError(`خطأ ${res.status}: ${res.statusText}`);
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      
      if (data.user) {
        // Use replace instead of push to prevent going back to login
        router.replace('/dashboard');
      } else {
        setError('بيانات غير صالحة');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('فشل الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen while checking auth
  if (initialCheck) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
          <p className="mt-4 text-gray-600">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">نظام إدارة المخزن</h1>
            <p className="text-gray-600 mt-2 text-sm">
              {isLogin ? 'تسجيل الدخول إلى حسابك' : 'إنشاء حساب جديد'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="bg-white border border-gray-300 rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">الاسم الكامل</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                    placeholder="محمد أحمد"
                    disabled={loading}
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  placeholder="example@email.com"
                  dir="ltr"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">كلمة المرور</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  placeholder="••••••••"
                  dir="ltr"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    جاري التحميل...
                  </span>
                ) : (
                  isLogin ? 'دخول' : 'تسجيل'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium disabled:opacity-50"
                disabled={loading}
              >
                {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب؟ سجل دخول'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">
            جميع الحقوق محفوظة © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}