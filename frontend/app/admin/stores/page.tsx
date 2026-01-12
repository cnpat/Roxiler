'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

export default function AdminStores() {
  const router = useRouter();
  const [stores, setStores] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [showCreate, setShowCreate] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner: '' });

  useEffect(() => {
    loadStores();
    loadUsers();
  }, [filters]);

  const loadStores = async () => {
    setLoading(true);
    const params: any = {};
    if (filters.name) params.name = filters.name;
    if (filters.email) params.email = filters.email;
    if (filters.address) params.address = filters.address;
    const result = await api.admin.listStores(params);
    if (result.data) {
      setStores(result.data.stores);
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    const result = await api.admin.listUsers({ role: 'owner' });
    if (result.data) {
      setUsers(result.data.users);
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await api.admin.createStore(newStore);
    if (!result.error) {
      setShowCreate(false);
      setNewStore({ name: '', email: '', address: '', owner: '' });
      loadStores();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Stores</h1>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/admin/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
            <Button onClick={() => setShowCreate(!showCreate)}>
              {showCreate ? 'Cancel' : 'Add Store'}
            </Button>
          </div>
        </div>

        {showCreate && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Store</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateStore}>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input
                      value={newStore.name}
                      onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      value={newStore.email}
                      onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Address</FieldLabel>
                    <Input
                      value={newStore.address}
                      onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Owner</FieldLabel>
                    <select
                      value={newStore.owner}
                      onChange={(e) => setNewStore({ ...newStore, owner: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Owner</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field>
                    <Button type="submit">Create Store</Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  value={filters.email}
                  onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel>Address</FieldLabel>
                <Input
                  value={filters.address}
                  onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4">
            {stores.map((store) => (
              <Card key={store.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold">{store.name}</p>
                      <p className="text-sm text-gray-600">{store.email}</p>
                      <p className="text-sm text-gray-600">{store.address}</p>
                      <p className="text-sm">Rating: {store.rating || 'No ratings yet'}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/admin/stores/${store.id}`)}
                    >
                      View Details
                    </Button>
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
