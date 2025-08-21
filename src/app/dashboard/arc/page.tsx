'use client';
import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useThemeConfig } from '@/components/active-theme';

interface DashboardData {
  totalFeatures: number;
  geometryTypes: Record<string, number>;
  layerInfo: any;
  sampleFeatures: any[];
  lastUpdated: string;
  serviceStatus: 'loading' | 'success' | 'error';
  error?: string;
}

export default function ArcDashboardPage() {
  const { activeTheme } = useThemeConfig();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const themeClasses = {
    container: 'mx-auto min-h-0 w-full max-w-7xl space-y-6',
    title: 'text-3xl font-bold tracking-tight',
    subtitle: 'text-muted-foreground',
    grid: 'grid gap-4 md:grid-cols-2 lg:grid-cols-4',
    card: 'p-6',
    cardTitle: 'text-sm font-medium text-muted-foreground',
    cardValue: 'text-2xl font-bold',
    cardDescription: 'text-xs text-muted-foreground',
    statusBadge: 'px-2 py-1 text-xs',
    refreshButton: 'ml-auto',
    errorCard: 'col-span-full bg-red-50 border-red-200 text-red-800',
    loadingCard: 'col-span-full bg-muted border-muted text-muted-foreground'
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      console.log('🔄 Fetching dashboard data...');
      
      // Fetch dashboard data from our API route
      const response = await fetch('/api/dashboard-data');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }

      console.log('✅ Dashboard data fetched successfully:', result.data);

      setDashboardData(result.data);
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setDashboardData({
        totalFeatures: 0,
        geometryTypes: {},
        layerInfo: null,
        sampleFeatures: [],
        lastUpdated: new Date().toLocaleString(),
        serviceStatus: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <PageContainer className="p-4 md:px-6">
        <div className={themeClasses.container}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={themeClasses.title}>ArcGIS Dashboard</h1>
              <p className={themeClasses.subtitle}>Loading data...</p>
            </div>
          </div>
          <div className={themeClasses.grid}>
            <Card className={themeClasses.loadingCard}>
              <CardContent className={themeClasses.card}>
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!dashboardData) {
    return (
      <PageContainer className="p-4 md:px-6">
        <div className={themeClasses.container}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={themeClasses.title}>ArcGIS Dashboard</h1>
              <p className={themeClasses.subtitle}>No data available</p>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="p-4 md:px-6">
      <div className={themeClasses.container}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={themeClasses.title}>ArcGIS Dashboard</h1>
            <p className={themeClasses.subtitle}>
              Real-time data from Permian Basin Feature Server
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            className={themeClasses.refreshButton}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        {dashboardData.serviceStatus === 'error' && (
          <Card className={themeClasses.errorCard}>
            <CardContent className={themeClasses.card}>
              <h3 className="font-semibold">Error Loading Data</h3>
              <p className="text-sm">{dashboardData.error}</p>
            </CardContent>
          </Card>
        )}

        <div className={themeClasses.grid}>
          {/* Total Features */}
          <Card>
            <CardContent className={themeClasses.card}>
              <CardTitle className={themeClasses.cardTitle}>Total Features</CardTitle>
              <div className={themeClasses.cardValue}>{dashboardData.totalFeatures.toLocaleString()}</div>
              <p className={themeClasses.cardDescription}>
                Features in layer 12
              </p>
            </CardContent>
          </Card>

          {/* Geometry Types */}
          <Card>
            <CardContent className={themeClasses.card}>
              <CardTitle className={themeClasses.cardTitle}>Network Types</CardTitle>
              <div className={themeClasses.cardValue}>
                {Object.keys(dashboardData.geometryTypes).length}
              </div>
              <p className={themeClasses.cardDescription}>
                Different network classifications
              </p>
            </CardContent>
          </Card>

          {/* Service Status */}
          <Card>
            <CardContent className={themeClasses.card}>
              <CardTitle className={themeClasses.cardTitle}>Service Status</CardTitle>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={dashboardData.serviceStatus === 'success' ? 'default' : 'destructive'}
                  className={themeClasses.statusBadge}
                >
                  {dashboardData.serviceStatus === 'success' ? 'Connected' : 'Error'}
                </Badge>
              </div>
              <p className={themeClasses.cardDescription}>
                ArcGIS Feature Server
              </p>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <Card>
            <CardContent className={themeClasses.card}>
              <CardTitle className={themeClasses.cardTitle}>Last Updated</CardTitle>
              <div className={themeClasses.cardValue}>
                {new Date(dashboardData.lastUpdated).toLocaleTimeString()}
              </div>
              <p className={themeClasses.cardDescription}>
                {new Date(dashboardData.lastUpdated).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Network Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Network Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(dashboardData.geometryTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">{type || 'Unknown'}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sample Features */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.sampleFeatures.map((feature: any, index: number) => (
                <div key={feature.attributes.OBJECTID} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">#{feature.attributes.OBJECTID}</Badge>
                    <div>
                      <div className="font-medium">
                        {feature.attributes.link_id || 'No ID'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Type: {feature.attributes.net_type || 'Unknown'} | 
                        Direction: {feature.attributes.net_dir || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  {feature.attributes.SHAPE__Len && (
                    <Badge variant="secondary">
                      {feature.attributes.SHAPE__Len.toFixed(2)} units
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Information */}
        {dashboardData.layerInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Layer Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">Name:</span> {dashboardData.layerInfo.name || 'N/A'}</div>
                    <div><span className="text-muted-foreground">ID:</span> {dashboardData.layerInfo.id || 'N/A'}</div>
                    <div><span className="text-muted-foreground">Type:</span> {dashboardData.layerInfo.type || 'N/A'}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Data Source</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">Server:</span> Permian Basin CCN</div>
                    <div><span className="text-muted-foreground">Features:</span> {dashboardData.totalFeatures}</div>
                    <div><span className="text-muted-foreground">Status:</span> Active</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
