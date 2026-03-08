'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SaleItem {
  id: number;
  item_id: number;
  name: string;
  quantity: number;
  price_at_sale: number | string;
  cost_at_sale: number | string;
  total_price: number | string;
  image_url?: string;
}

interface Sale {
  id: number;
  garage_name: string;
  customer_name: string | null;
  customer_phone: string | null;
  subtotal: number | string;
  total_amount: number | string;
  payment_method: string;
  payment_status: string;
  sale_date: string;
  notes: string | null;
  items: SaleItem[];
}

export default function SaleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [saleId, setSaleId] = useState<string>('');

  useEffect(() => {
    const unwrapParams = async () => {
      const { id } = await params;
      setSaleId(id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (saleId) {
      loadSale();
    }
  }, [saleId]);

  const loadSale = async () => {
    try {
      const res = await fetch(`/api/sales/${saleId}`);
      if (!res.ok) {
        router.push('/sales');
        return;
      }
      const data = await res.json();
      setSale(data);
    } catch (error) {
      console.error('Error loading sale:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return date;
    }
  };

  const getPaymentMethodText = (method: string) => {
    const methods: Record<string, string> = {
      cash: 'نقدي',
      card: 'بطاقة',
      transfer: 'تحويل بنكي',
      credit: 'آجل'
    };
    return methods[method] || method;
  };

  // Helper function to safely convert to number
  const toNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const calculateProfit = (item: SaleItem) => {
    const price = toNumber(item.price_at_sale);
    const cost = toNumber(item.cost_at_sale);
    return (price - cost) * item.quantity;
  };

  const totalProfit = () => {
    return sale?.items.reduce((sum, item) => sum + calculateProfit(item), 0) || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!sale) return null;

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
            <h1 className="text-lg font-bold text-gray-900">فاتورة #{sale.id}</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 py-6 max-w-lg mx-auto">
        {/* Invoice Header */}
        <div className="bg-gray-50 border border-gray-300 rounded-xl p-5 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">تاريخ الفاتورة</p>
              <p className="font-medium text-gray-900">{formatDate(sale.sale_date)}</p>
            </div>
            <span className="bg-black text-white px-3 py-1 rounded-full text-xs">
              {getPaymentMethodText(sale.payment_method)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">المخزن</p>
              <p className="font-medium text-gray-900">{sale.garage_name}</p>
            </div>
            {sale.customer_name && (
              <div>
                <p className="text-sm text-gray-500">العميل</p>
                <p className="font-medium text-gray-900">{sale.customer_name}</p>
                {sale.customer_phone && (
                  <p className="text-xs text-gray-500">{sale.customer_phone}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">الأصناف</h2>
          <div className="space-y-3">
            {sale.items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-300 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-gray-600">الكمية: {item.quantity}</span>
                      <span className="text-gray-600">
                        السعر: ${toNumber(item.price_at_sale).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    ${toNumber(item.total_price).toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-green-600 mt-2">
                  الربح: ${calculateProfit(item).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 border border-gray-300 rounded-xl p-5">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">المجموع الفرعي:</span>
              <span className="font-medium text-gray-900">${toNumber(sale.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-300">
              <span className="text-gray-900">الإجمالي:</span>
              <span className="text-gray-900">${toNumber(sale.total_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600 pt-2">
              <span>صافي الربح:</span>
              <span>${totalProfit().toFixed(2)}</span>
            </div>
          </div>

          {sale.notes && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className="text-sm text-gray-500">ملاحظات:</p>
              <p className="text-sm text-gray-900">{sale.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-black text-white py-3 rounded-xl text-sm font-medium"
          >
            طباعة
          </button>
          <Link
            href="/sales"
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl text-sm font-medium text-center"
          >
            عودة
          </Link>
        </div>
      </main>
    </div>
  );
}