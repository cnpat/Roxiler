'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const result = await api.admin.dashboard();
    if (result.data) {
      setStats(result.data.stats);
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : stats ? (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Stores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalStores}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalRatings}</p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/admin/users')} className="w-full">
                View Users
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Manage Stores</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/admin/stores')} className="w-full">
                View Stores
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
