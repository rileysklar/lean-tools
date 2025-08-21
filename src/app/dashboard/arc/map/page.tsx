'use client';

import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useRef } from 'react';
import { useThemeConfig } from '@/components/active-theme';
import { MapPin, Loader2, RefreshCw, CheckCircle, BarChart3 } from 'lucide-react';

export default function ArcMapPage() {
  const { activeTheme } = useThemeConfig();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [arcgisData, setArcgisData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Theme-aware classes
  const themeClasses = {
    container: 'mx-auto min-h-0 w-full max-w-7xl space-y-6',
    title: 'text-3xl font-bold tracking-tight',
    subtitle: 'text-muted-foreground',
    mapContainer: 'w-full h-[600px] rounded-lg border bg-muted',
    controls: 'flex flex-wrap gap-2',
    statusBadge: 'px-3 py-1 text-sm',
    errorCard: 'bg-red-50 border-red-200 text-red-800'
  };

  // Load ArcGIS data
  const loadArcgisData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch ArcGIS features directly for the map
      const featuresResponse = await fetch('/api/arcgis-features');
      const featuresData = await featuresResponse.json();
      
      if (featuresData.success) {
        setArcgisData(featuresData.geoJSON);
      } else {
        throw new Error(featuresData.error || 'Failed to fetch ArcGIS features');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initMap = async () => {
      try {
        // Dynamic import of Mapbox GL JS
        const mapboxgl = await import('mapbox-gl');
        
        // Set access token (you'll need to add this to your .env)
        mapboxgl.default.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

        map.current = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-110.0, 36.2], // Permian Basin area
          zoom: 8,
          attributionControl: true
        });

        map.current.on('load', () => {
          setMapLoaded(true);
          console.log('🗺️ Map loaded successfully');
        });

        map.current.on('error', (e: any) => {
          console.error('🗺️ Map error:', e);
          setError(`Map error: ${e.error?.message || 'Unknown map error'}`);
        });

      } catch (err) {
        console.error('🗺️ Failed to initialize map:', err);
        setError('Failed to initialize map');
      }
    };

    initMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add ArcGIS data to map when both map and data are ready
  useEffect(() => {
    if (!mapLoaded || !arcgisData || !map.current) return;

    const addDataToMap = async () => {
      try {
        // Remove existing source if it exists
        if (map.current.getSource('arcgis-data')) {
          map.current.removeLayer('arcgis-lines');
          map.current.removeSource('arcgis-data');
        }

        // Add the GeoJSON source
        map.current.addSource('arcgis-data', {
          type: 'geojson',
          data: arcgisData
        });

        // Add the line layer
        map.current.addLayer({
          id: 'arcgis-lines',
          type: 'line',
          source: 'arcgis-data',
          paint: {
            'line-color': '#3b82f6',
            'line-width': 3,
            'line-opacity': 0.8
          }
        });

        // Fit map to data bounds
        if (arcgisData.features && arcgisData.features.length > 0) {
          const mapboxgl = await import('mapbox-gl');
          const bounds = new mapboxgl.default.LngLatBounds();
          
          arcgisData.features.forEach((feature: any) => {
            if (feature.geometry && feature.geometry.coordinates) {
              feature.geometry.coordinates.forEach((coord: number[]) => {
                // Validate coordinates are within valid ranges
                const [lng, lat] = coord;
                if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
                  bounds.extend(coord as [number, number]);
                } else {
                  console.warn('🗺️ Skipping invalid coordinates:', coord);
                }
              });
            }
          });
          
          if (!bounds.isEmpty()) {
            map.current.fitBounds(bounds, { padding: 50 });
          } else {
            console.warn('🗺️ No valid coordinates found for bounds fitting');
          }
        }

        console.log('🗺️ ArcGIS data added to map successfully');
      } catch (err) {
        console.error('🗺️ Error adding ArcGIS data to map:', err);
        setError('Failed to add data to map');
      }
    };

    addDataToMap();
  }, [mapLoaded, arcgisData]);

  return (
    <PageContainer className="p-4 md:px-6">
      <div className={themeClasses.container}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={themeClasses.title}>ArcGIS Data Map</h1>
            <p className={themeClasses.subtitle}>
              Visualize ArcGIS features on an interactive map
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold tracking-tight lg:text-2xl">
                    Interactive Map
                  </CardTitle>
                </div>
                <p className="text-muted-foreground text-sm">
                  Visualize ArcGIS features on an interactive map
                </p>
              </div>
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-3 sm:space-y-0">
                <Button
                  onClick={loadArcgisData}
                  disabled={loading || !mapLoaded}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Load ArcGIS Data
                    </>
                  )}
                </Button>
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                  {mapLoaded && (
                    <Badge variant="secondary" className="w-full sm:w-auto justify-center">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Map Ready
                    </Badge>
                  )}
                  {arcgisData && (
                    <Badge variant="default" className="w-full sm:w-auto justify-center">
                      <BarChart3 className="mr-1 h-3 w-3" />
                      {arcgisData.features?.length || 0} Features
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className={`p-3 rounded-lg border ${themeClasses.errorCard}`}>
                <strong>Error:</strong> {error}
              </div>
            )}
            
            <div className={themeClasses.mapContainer}>
              <div ref={mapContainer} className="w-full h-full" />
            </div>

            {arcgisData && (
              <div className="text-sm text-muted-foreground">
                <strong>Data Info:</strong> Loaded {arcgisData.features?.length || 0} features from ArcGIS service.
                The map shows pipeline segments in the Permian Basin area.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
