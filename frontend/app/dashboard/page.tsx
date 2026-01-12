'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

export default function Dashboard() {
  const router = useRouter();
  const [stores, setStores] = useState<any[]>([]);
  const [nameFilter, setNameFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStores();
  }, [nameFilter, addressFilter]);

  const loadStores = async () => {
    setLoading(true);
    const params: any = {};
    if (nameFilter) params.name = nameFilter;
    if (addressFilter) params.address = addressFilter;
    const result = await api.stores.list(params);
    if (result.data) {
      setStores(result.data.stores);
    }
    setLoading(false);
  };

  const handleRating = async (storeId: string, score: number) => {
    const result = await api.ratings.submit({ storeId, score });
    if (!result.error) {
      loadStores();
    } else {
      alert(result.error);
    }
  };

  const handleLogout = async () => {
    await api.auth.logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Store Ratings</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  placeholder="Search by name..."
                />
              </Field>
              <Field>
                <FieldLabel>Address</FieldLabel>
                <Input
                  value={addressFilter}
                  onChange={(e) => setAddressFilter(e.target.value)}
                  placeholder="Search by address..."
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {stores.map((store) => (
              <Card key={store.id}>
                <CardHeader>
                  <CardTitle>{store.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{store.address}</p>
                  <p className="mb-4">
                    Overall Rating: {store.overallRating || 'No ratings yet'}
                  </p>
                  <p className="mb-4">
                    Your Rating: {store.userRating || 'Not rated'}
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <Button
                        key={score}
                        variant={store.userRating === score ? 'default' : 'outline'}
                        onClick={() => handleRating(store.id, score)}
                      >
                        {score}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
