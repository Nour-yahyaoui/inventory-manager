'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Sale {
  id: number;
  garage_id: number;
  garage_name: string;
  customer_name: string | null;
  customer_phone: string | null;
  total_amount: number | string;
  payment_method: string;
  payment_status: string;
  sale_date: string;
  created_at: string;
}

export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [garages, setGarages] = useState<any[]>([]);
  const [selectedGarage, setSelectedGarage] = useState('all');
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    total_sales: 0,
    total_revenue: 0,
    total_profit: 0,
    average_sale: 0
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/me');
      if (!res.ok) {
        router.push('/');
        return;
      }
      await Promise.all([
        loadGarages(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const loadGarages = async () => {
    try {
      const res = await fetch('/api/garages');
      const data = await res.json();
      setGarages(data || []);
      await loadSales();
    } catch (error) {
      console.error('Error loading garages:', error);
      setGarages([]);
    }
  };

  const loadSales = async (garageId?: string) => {
    try {
      const url = garageId && garageId !== 'all' 
        ? `/api/sales?garageId=${garageId}` 
        : '/api/sales';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSales(data || []);
      } else {
        setSales([]);
      }
    } catch (error) {
      console.error('Error loading sales:', error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/sales/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.summary || {
          total_sales: 0,
          total_revenue: 0,
          total_profit: 0,
          average_sale: 0
        });
      } else {
        // If API fails, set default values
        setStats({
          total_sales: 0,
          total_revenue: 0,
          total_profit: 0,
          average_sale: 0
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({
        total_sales: 0,
        total_revenue: 0,
        total_profit: 0,
        average_sale: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleGarageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const garageId = e.target.value;
    setSelectedGarage(garageId);
    setLoading(true);
    loadSales(garageId);
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
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
      transfer: 'تحويل',
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
            <h1 className="text-lg font-bold text-gray-900">المبيعات</h1>
            <Link
              href="/sales/new"
              className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>فاتورة جديدة</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 py-6 max-w-lg mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
            <p className="text-gray-600 text-xs mb-1">إجمالي المبيعات</p>
            {statsLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900">{stats.total_sales}</p>
            )}
          </div>
          
          <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
            <p className="text-gray-600 text-xs mb-1">الإيرادات</p>
            {statsLoading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900">
                ${toNumber(stats.total_revenue).toFixed(2)}
              </p>
            )}
          </div>
          
          <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
            <p className="text-gray-600 text-xs mb-1">الأرباح</p>
            {statsLoading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-bold text-green-700">
                ${toNumber(stats.total_profit).toFixed(2)}
              </p>
            )}
          </div>
          
          <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
            <p className="text-gray-600 text-xs mb-1">متوسط الفاتورة</p>
            {statsLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900">
                ${toNumber(stats.average_sale).toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
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

        {/* Sales List */}
        {sales.length === 0 ? (
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-10 text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد مبيعات</h3>
            <p className="text-gray-600 mb-4 text-sm">ابدأ بإضافة فاتورة جديدة</p>
            <Link
              href="/sales/new"
              className="bg-black text-white px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              فاتورة جديدة
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sales.map((sale) => (
              <Link
                key={sale.id}
                href={`/sales/${sale.id}`}
                className="block bg-white border border-gray-300 rounded-xl p-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-sm text-gray-500">فاتورة #{sale.id}</span>
                    <h3 className="font-bold text-gray-900">
                      {sale.customer_name || 'عميل نقدي'}
                    </h3>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    ${toNumber(sale.total_amount).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-600">{sale.garage_name}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{getPaymentMethodText(sale.payment_method)}</span>
                  </div>
                  <span className="text-gray-500">{formatDate(sale.sale_date)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}