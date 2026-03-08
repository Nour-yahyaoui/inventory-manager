'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Item {
  id: number;
  name: string;
  quantity: number;
  selling_price?: number | string;
  purchase_price?: number | string;
  price?: number | string;
  image_url?: string;
}

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  maxQuantity: number;
}

export default function NewSalePage() {
  const router = useRouter();
  const [garages, setGarages] = useState<any[]>([]);
  const [selectedGarage, setSelectedGarage] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    }
  };

  const loadItems = async (garageId: string) => {
    try {
      const res = await fetch(`/api/items?garageId=${garageId}`);
      const data = await res.json();
      setItems(data.filter((item: Item) => item.quantity > 0));
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleGarageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const garageId = e.target.value;
    setSelectedGarage(garageId);
    setCart([]);
    if (garageId) {
      loadItems(garageId);
    } else {
      setItems([]);
    }
  };

  // Helper function to get price as number
  const getItemPrice = (item: Item): number => {
    const price = item.selling_price || item.price || 0;
    return typeof price === 'string' ? parseFloat(price) || 0 : price || 0;
  };

  const addToCart = (item: Item) => {
    const existingItem = cart.find(i => i.id === item.id);
    const price = getItemPrice(item);

    if (existingItem) {
      if (existingItem.quantity < item.quantity) {
        setCart(cart.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ));
      }
    } else {
      setCart([...cart, {
        id: item.id,
        name: item.name,
        quantity: 1,
        price: price,
        maxQuantity: item.quantity
      }]);
    }
  };

  const updateCartQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(i => i.id !== itemId));
    } else {
      const item = cart.find(i => i.id === itemId);
      if (item && newQuantity <= item.maxQuantity) {
        setCart(cart.map(i =>
          i.id === itemId ? { ...i, quantity: newQuantity } : i
        ));
      }
    }
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(i => i.id !== itemId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('الرجاء إضافة أصناف إلى الفاتورة');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garage_id: parseInt(selectedGarage),
          items: cart.map(({ id, quantity }) => ({ id, quantity })),
          customer_name: customerName || null,
          customer_phone: customerPhone || null,
          payment_method: paymentMethod,
          notes: notes || null
        })
      });

      if (res.ok) {
        router.push('/sales');
      } else {
        const error = await res.text();
        alert('فشل في إنشاء الفاتورة: ' + error);
      }
    } catch (error) {
      console.error('Error creating sale:', error);
      alert('حدث خطأ في إنشاء الفاتورة');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-10">
        <div className="px-5 py-4">
          <div className="flex justify-between items-center">
            <Link href="/sales" className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm">المبيعات</span>
            </Link>
            <h1 className="text-lg font-bold text-gray-900">فاتورة جديدة</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 py-6 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Garage Selection */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">المخزن *</label>
            <select
              required
              value={selectedGarage}
              onChange={handleGarageChange}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
            >
              <option value="">اختر المخزن</option>
              {garages.map((garage) => (
                <option key={garage.id} value={garage.id}>
                  {garage.name}
                </option>
              ))}
            </select>
          </div>

          {selectedGarage && (
            <>
              {/* Item Search */}
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">بحث عن صنف</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
                  placeholder="اسم الصنف..."
                />
              </div>

              {/* Available Items */}
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">الأصناف المتوفرة</label>
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-xl p-2">
                  {filteredItems.length === 0 ? (
                    <p className="text-gray-500 text-center p-4">لا توجد أصناف متوفرة</p>
                  ) : (
                    filteredItems.map((item) => {
                      const price = getItemPrice(item);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => addToCart(item)}
                          className="w-full text-right p-3 hover:bg-gray-100 rounded-lg transition flex justify-between items-center"
                        >
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <span className="text-sm text-gray-600">
                            ${price.toFixed(2)} | الكمية: {item.quantity}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Cart */}
              {cart.length > 0 && (
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">الأصناف المضافة</label>
                  <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center"
                            disabled={item.quantity >= item.maxQuantity}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 bg-red-100 text-red-700 rounded-lg flex items-center justify-center"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t border-gray-300 pt-3 mt-3">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-gray-900">الإجمالي:</span>
                        <span className="text-gray-900">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">اسم العميل</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
                    placeholder="اختياري"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">رقم الهاتف</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
                    placeholder="اختياري"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">طريقة الدفع</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
                >
                  <option value="cash">نقدي</option>
                  <option value="card">بطاقة</option>
                  <option value="transfer">تحويل بنكي</option>
                  <option value="credit">آجل</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">ملاحظات</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900"
                  placeholder="اختياري"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    جاري الإنشاء...
                  </span>
                ) : (
                  'إنشاء الفاتورة'
                )}
              </button>
            </>
          )}
        </form>
      </main>
    </div>
  );
}