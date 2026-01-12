'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OwnerDashboard() {
  const router = useRouter();
  const [store, setStore] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const result = await api.owner.dashboard();
    if (result.data) {
      setStore(result.data.store);
      setRatings(result.data.ratings);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await api.auth.logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Store Owner Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : store ? (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{store.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  Average Rating: {store.averageRating || 'No ratings yet'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ratings ({ratings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {ratings.length === 0 ? (
                  <p className="text-center py-4 text-gray-600">No ratings yet</p>
                ) : (
                  <div className="space-y-4">
                    {ratings.map((rating) => (
                      <div key={rating.id} className="border-b pb-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-bold">{rating.user.name}</p>
                            <p className="text-sm text-gray-600">{rating.user.email}</p>
                            <p className="text-sm text-gray-600">{rating.user.address}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">Rating: {rating.score}/5</p>
                            <p className="text-sm text-gray-600">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}
