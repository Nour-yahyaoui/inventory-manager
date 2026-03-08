'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Item {
  id: number;
  garage_id: number;
  garage_name?: string;
  name: string;
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

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ garages: 0, items: 0, totalValue: 0 });
  const [loading, setLoading] = useState(true);
  const [recentItems, setRecentItems] = useState<Item[]>([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (!data.user) {
        router.push("/");
        return;
      }
      setUser(data.user);
      await Promise.all([loadStats(), loadRecentItems()]);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const garagesRes = await fetch("/api/garages");
      const garages = await garagesRes.json();

      const itemsRes = await fetch("/api/items");
      const items = await itemsRes.json();

      const totalValue = items.reduce((sum: number, item: any) => {
        const price = getItemPrice(item);
        return sum + item.quantity * price;
      }, 0);

      setStats({
        garages: garages.length || 0,
        items: items.length || 0,
        totalValue: totalValue || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadRecentItems = async () => {
    try {
      const res = await fetch("/api/items?limit=5");
      const items = await res.json();
      setRecentItems(items.slice(0, 5));
    } catch (error) {
      console.error("Error loading recent items:", error);
    }
  };

  const getItemPrice = (item: any): number => {
    const price =
      item.selling_price ??
      item.purchase_price ??
      item.price ??
      item.SellingPrice ??
      item.PurchasePrice ??
      item.Price ??
      0;

    return typeof price === "string" ? parseFloat(price) || 0 : price || 0;
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                نظام إدارة المخزن
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* About Link */}
              <Link
                href="/about"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition"
              >
                من نحن
              </Link>
              
              <span className="text-sm text-gray-700">
                {user?.full_name || user?.username || "مستخدم"}
              </span>
              
              <button
                onClick={logout}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 py-6 max-w-lg mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"
                />
              </svg>
              <span className="text-lg font-bold text-gray-900">
                {stats.garages}
              </span>
            </div>
            <p className="text-sm text-gray-600">المخازن</p>
          </div>

          <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                />
              </svg>
              <span className="text-lg font-bold text-gray-900">
                {stats.items}
              </span>
            </div>
            <p className="text-sm text-gray-600">الأصناف</p>
          </div>

          <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"
                />
              </svg>
              <span className="text-lg font-bold text-gray-900">
                ${stats.totalValue.toFixed(0)}
              </span>
            </div>
            <p className="text-sm text-gray-600">القيمة</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link
            href="/garages"
            className="bg-black text-white rounded-xl p-6 text-center hover:bg-gray-800 transition"
          >
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-1">المخازن</h3>
            <p className="text-sm text-gray-300">إدارة وتنظيم المخازن</p>
          </Link>
          
          <Link
            href="/items"
            className="bg-gray-800 text-white rounded-xl p-6 text-center hover:bg-gray-700 transition"
          >
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-1">الأصناف</h3>
            <p className="text-sm text-gray-300">إدارة المخزون والأصناف</p>
          </Link>

          <Link
            href="/sales"
            className="bg-gray-700 text-white rounded-xl p-6 text-center hover:bg-gray-600 transition"
          >
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-1">المبيعات</h3>
            <p className="text-sm text-gray-300">إدارة الفواتير والمبيعات</p>
          </Link>

          <Link
            href="/about"
            className="bg-gray-500 text-white rounded-xl p-6 text-center hover:bg-gray-600 transition"
          >
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-1">من نحن</h3>
            <p className="text-sm text-gray-300">تعرف على فريقنا</p>
          </Link>
        </div>

        {/* Recent Items */}
        {recentItems.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                آخر الأصناف المضافة
              </h3>
              <Link
                href="/items"
                className="text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                عرض الكل
              </Link>
            </div>

            <div className="space-y-3">
              {recentItems.map((item) => {
                const price = getItemPrice(item);
                const garageName = item.garage_name || "مخزن غير معروف";

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-300 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover border border-gray-300"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-300">
                            <svg
                              className="w-7 h-7 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16"
                              />
                            </svg>
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-base text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600">{garageName}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg text-gray-900">
                          ${price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}