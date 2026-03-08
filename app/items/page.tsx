'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '../components/ImageUpload';

interface Item {
  id: number;
  garage_id: number;
  garage_name?: string;
  name: string;
  description?: string;
  quantity: number;
  selling_price?: number;
  purchase_price?: number;
  price?: number;
  SellingPrice?: number;
  PurchasePrice?: number;
  Price?: number;
  image_url?: string | null;
  created_at: string;
  [key: string]: any;
}

interface Garage {
  id: number;
  name: string;
}

export default function ItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [garages, setGarages] = useState<Garage[]>([]);
  const [selectedGarage, setSelectedGarage] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    garage_id: '',
    name: '',
    quantity: '',
    price: '',
    image_url: ''
  });

  useEffect(() => {
    loadGarages();
  }, []);

  const loadGarages = async () => {
    try {
      const res = await fetch('/api/garages');
      const data = await res.json();
      setGarages(data);
      loadItems();
    } catch (error) {
      console.error('Error loading garages:', error);
    }
  };

  const loadItems = async (garageId?: string) => {
    try {
      setLoading(true);
      const url = garageId && garageId !== 'all' 
        ? `/api/items?garageId=${garageId}` 
        : '/api/items';
      const res = await fetch(url);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGarageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const garageId = e.target.value;
    setSelectedGarage(garageId);
    loadItems(garageId);
  };

  const handleImageUploaded = (url: string) => {
    setFormData({ ...formData, image_url: url });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      garage_id: '',
      name: '',
      quantity: '',
      price: '',
      image_url: ''
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      garage_id: parseInt(formData.garage_id),
      name: formData.name,
      quantity: formData.quantity ? parseInt(formData.quantity) : 0,
      price: formData.price ? parseFloat(formData.price) : 0,
      image_url: formData.image_url || null
    };

    try {
      const url = editingItem ? `/api/items/${editingItem.id}` : '/api/items';
      const method = editingItem ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (res.ok) {
        await loadItems(selectedGarage);
        resetForm();
      } else {
        alert('فشل في حفظ العنصر');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert('حدث خطأ في حفظ العنصر');
    }
  };

  const handleEdit = (item: Item) => {
    const priceValue = 
      item.selling_price || 
      item.purchase_price || 
      item.price || 
      item.SellingPrice || 
      item.PurchasePrice || 
      item.Price || 
      0;
    
    setEditingItem(item);
    setFormData({
      garage_id: item.garage_id.toString(),
      name: item.name,
      quantity: item.quantity.toString(),
      price: priceValue.toString(),
      image_url: item.image_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    
    try {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadItems(selectedGarage);
      } else {
        alert('فشل في حذف العنصر');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('حدث خطأ في حذف العنصر');
    }
  };

  const getItemPrice = (item: Item): number => {
    const price = 
      item.selling_price ?? 
      item.purchase_price ?? 
      item.price ?? 
      item.SellingPrice ?? 
      item.PurchasePrice ?? 
      item.Price ?? 
      0;
    
    return typeof price === 'string' ? parseFloat(price) || 0 : price || 0;
  };

  const totalValue = (items: Item[]): number => {
    return items.reduce((sum, item) => {
      const price = getItemPrice(item);
      return sum + (item.quantity * price);
    }, 0);
  };

  const getStockStatus = (item: Item) => {
    if (item.quantity <= 0) return { label: 'غير متوفر', color: 'bg-red-100 text-red-700' };
    if (item.quantity <= 5) return { label: 'مخزون منخفض', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'متوفر', color: 'bg-green-100 text-green-800' };
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
            <h1 className="text-lg font-bold text-gray-900">الأصناف</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 py-6 max-w-lg mx-auto">
        {/* Header with Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">الأصناف</h2>
              <p className="text-sm text-gray-600 mt-1">الإجمالي: {items.length}</p>
            </div>
            
            <button
              onClick={() => {
                setEditingItem(null);
                resetForm();
                setShowForm(!showForm);
              }}
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

          {/* Garage Filter */}
          <select
            value={selectedGarage}
            onChange={handleGarageChange}
            className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
          >
            <option value="all">جميع المخازن</option>
            {garages.map((garage) => (
              <option key={garage.id} value={garage.id}>
                {garage.name}
              </option>
            ))}
          </select>
        </div>

        {/* Total Value Card */}
        {items.length > 0 && (
          <div className="bg-black text-white rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm mb-1">القيمة الإجمالية</p>
                <h3 className="text-2xl font-bold">${totalValue(items).toFixed(2)}</h3>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingItem ? 'تعديل الصنف' : 'إضافة صنف جديد'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">المخزن *</label>
                <select
                  name="garage_id"
                  value={formData.garage_id}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
                  disabled={!!editingItem}
                >
                  <option value="">اختر المخزن</option>
                  {garages.map((garage) => (
                    <option key={garage.id} value={garage.id}>
                      {garage.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">اسم الصنف *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
                  placeholder="إطار سيارة"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">الكمية</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">السعر ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <ImageUpload 
                  onImageUploaded={handleImageUploaded}
                  currentImage={formData.image_url}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 rounded-xl text-sm font-medium"
                >
                  {editingItem ? 'تحديث' : 'حفظ'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl text-sm font-medium"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Items Grid */}
        {items.length === 0 ? (
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-10 text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد أصناف</h3>
            <p className="text-gray-600 mb-4 text-sm">
              {selectedGarage !== 'all' ? 'هذا المخزن لا يحتوي على أصناف' : 'ابدأ بإضافة صنف جديد'}
            </p>
            {selectedGarage !== 'all' ? (
              <button
                onClick={() => setSelectedGarage('all')}
                className="bg-black text-white px-6 py-3 rounded-xl text-sm font-medium"
              >
                عرض جميع المخازن
              </button>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="bg-black text-white px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                إضافة صنف
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const price = getItemPrice(item);
              const stockStatus = getStockStatus(item);
              const garageName = item.garage_name || garages.find(g => g.id === item.garage_id)?.name || 'مخزن';
              
              return (
                <div key={item.id} className="bg-white border border-gray-300 rounded-xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-gray-300" />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-300">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-gray-900">{item.name}</h3>
                          <span className={`${stockStatus.color} px-2 py-0.5 rounded-full text-xs font-medium`}>
                            {stockStatus.label}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{garageName}</p>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">الكمية: {item.quantity}</span>
                          <span className="font-bold text-gray-900">${price.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg text-xs font-medium"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-100 text-red-700 py-2 px-4 rounded-lg text-xs font-medium"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
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