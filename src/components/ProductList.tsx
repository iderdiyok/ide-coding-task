import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { fetchProducts } from '../api/mockApi';
import type { Product } from '../types';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(price / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {refreshing && <Loader2 className="w-4 h-4 animate-spin" />}
          Refresh
        </button>
      </div>
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">Type {product.type}</h2>
                <div className="flex items-baseline gap-4">
                  {product.promotionPrice && (
                    <span className="text-lg text-green-600 font-semibold">
                      {formatPrice(product.promotionPrice)}
                    </span>
                  )}
                  <span className={`text-lg ${product.promotionPrice ? 'line-through text-gray-500' : 'font-bold'}`}>
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}