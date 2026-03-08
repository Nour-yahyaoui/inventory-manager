'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GaragesPage() {
  const router = useRouter();
  const [garages, setGarages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    monthly_rent: '',
    monthly_electricity: '',
    monthly_water: ''
  });

  useEffect(() => {
    loadGarages();
  }, []);

  const loadGarages = async () => {
    try {
      const res = await fetch('/api/garages');
      const data = await res.json();
      setGarages(data);
    } catch (error) {
      console.error('Error loading garages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      name: formData.name,
      address: formData.address || null,
      monthly_rent: formData.monthly_rent ? parseFloat(formData.monthly_rent) : 0,
      monthly_electricity: formData.monthly_electricity ? parseFloat(formData.monthly_electricity) : 0,
      monthly_water: formData.monthly_water ? parseFloat(formData.monthly_water) : 0
    };

    await fetch('/api/garages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData)
    });

    setFormData({ name: '', address: '', monthly_rent: '', monthly_electricity: '', monthly_water: '' });
    setShowForm(false);
    loadGarages();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    await fetch(`/api/garages/${id}`, { method: 'DELETE' });
    loadGarages();
  };

  const totalMonthlyCost = (garage: any) => {
    const rent = Number(garage.monthly_rent) || 0;
    const electricity = Number(garage.monthly_electricity) || 0;
    const water = Number(garage.monthly_water) || 0;
    return rent + electricity + water;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
          <p className="mt-4 text-gray-600 text-base">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-10">
        <div className="px-5 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm">الرئيسية</span>
            </Link>
            <h1 className="text-lg font-bold text-gray-900">المخازن</h1>
            <div className="w-16"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 py-6 max-w-lg mx-auto">
        {/* Header with Stats */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">المخازن</h2>
            <p className="text-sm text-gray-600 mt-1">الإجمالي: {garages.length}</p>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-black text-white px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
          >
            {showForm ? (
              <>إلغاء</>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>إضافة</span>
              </>
            )}
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">إضافة مخزن جديد</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">اسم المخزن *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
                  placeholder="المخزن الرئيسي"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">العنوان</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
                  placeholder="شارع الملك - المدينة"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">الإيجار</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.monthly_rent}
                    onChange={(e) => setFormData({...formData, monthly_rent: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">الكهرباء</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.monthly_electricity}
                    onChange={(e) => setFormData({...formData, monthly_electricity: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">المياه</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.monthly_water}
                    onChange={(e) => setFormData({...formData, monthly_water: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 rounded-xl text-sm font-medium"
                >
                  حفظ
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl text-sm font-medium"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Garages Grid */}
        {garages.length === 0 ? (
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-10 text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد مخازن</h3>
            <p className="text-gray-600 mb-4 text-sm">ابدأ بإضافة مخزن جديد</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-black text-white px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              إضافة مخزن
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {garages.map((garage: any) => {
              const totalCost = totalMonthlyCost(garage);
              
              return (
                <div key={garage.id} className="bg-white border border-gray-300 rounded-xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{garage.name}</h3>
                      <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                        نشط
                      </span>
                    </div>

                    {garage.address && (
                      <div className="flex items-start gap-2 mb-4 text-gray-600 text-sm">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <p>{garage.address}</p>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">التكاليف الشهرية:</span>
                        <span className="text-lg font-bold text-gray-900">${totalCost.toFixed(2)}</span>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        {garage.monthly_rent > 0 && (
                          <div className="flex justify-between text-gray-600">
                            <span>الإيجار:</span>
                            <span>${Number(garage.monthly_rent).toFixed(2)}</span>
                          </div>
                        )}
                        {garage.monthly_electricity > 0 && (
                          <div className="flex justify-between text-gray-600">
                            <span>الكهرباء:</span>
                            <span>${Number(garage.monthly_electricity).toFixed(2)}</span>
                          </div>
                        )}
                        {garage.monthly_water > 0 && (
                          <div className="flex justify-between text-gray-600">
                            <span>المياه:</span>
                            <span>${Number(garage.monthly_water).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/items?garageId=${garage.id}`}
                        className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                        </svg>
                        <span>الأصناف</span>
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(garage.id)}
                        className="bg-red-100 text-red-700 py-3 px-5 rounded-xl text-sm font-medium"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}