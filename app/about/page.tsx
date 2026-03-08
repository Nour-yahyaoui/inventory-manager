import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'من نحن',
  description: 'تعرف على نظام إدارة المخازن والمبيعات - حلول متكاملة لإدارة الأعمال',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-5 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="font-bold text-gray-900">نظام المخازن</span>
            </Link>
            
            <nav className="flex gap-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">الرئيسية</Link>
              <Link href="/about" className="text-gray-900 font-medium text-sm">من نحن</Link>
              <Link href="/" className="bg-black text-white px-4 py-2 rounded-lg text-sm">دخول</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-5 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">من نحن</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نقدم حلولاً متكاملة لإدارة المخازن والمبيعات منذ 2024
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">رسالتنا</h2>
              <p className="text-gray-600 leading-relaxed">
                تمكين أصحاب الأعمال من إدارة مخازنهم بكفاءة عالية من خلال حلول تقنية بسيطة وفعالة، 
                تساعدهم على تتبع المخزون، زيادة المبيعات، وتحقيق أرباح أفضل.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">رؤيتنا</h2>
              <p className="text-gray-600 leading-relaxed">
                أن نكون المنصة الرائدة في المنطقة لإدارة الأعمال والمخازن، 
                نساعد آلاف الشركات على النمو والازدهار في العصر الرقمي.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16 border-y border-gray-200">
        <div className="container mx-auto px-5">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">ماذا نقدم؟</h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">إدارة المخازن</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                تتبع المخزون في عدة مواقع، معرفة الكميات المتوفرة، وإشعارات عند نفاد المخزون.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">نقطة بيع متكاملة</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                إنشاء فواتير بيع، تتبع المبيعات، وحساب الأرباح تلقائياً مع كل عملية بيع.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">تقارير وتحليلات</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                تقارير مفصلة عن المبيعات والأرباح، مع رسوم بيانية توضح أداء عملك.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">عميل</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">50k+</div>
              <div className="text-sm text-gray-600">فاتورة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">100k+</div>
              <div className="text-sm text-gray-600">صنف</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">دعم فني</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">ابدأ الآن مجاناً</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            جرب نظامنا لمدة 30 يوماً بدون أي التزام. لا تحتاج لبطاقة ائتمان.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-black text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition"
            >
              إنشاء حساب مجاني
            </Link>
            <Link
              href="/contact"
              className="bg-gray-100 text-gray-900 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-200 transition"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

 </div>
  );
}