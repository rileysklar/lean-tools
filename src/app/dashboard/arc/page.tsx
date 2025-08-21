'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  Factory,
  Users,
  Zap,
  BarChart3,
  Activity
} from 'lucide-react';

// Placeholder data for manufacturing efficiency metrics
const efficiencyData = [
  { name: 'Mon', efficiency: 87, target: 90, downtime: 23 },
  { name: 'Tue', efficiency: 92, target: 90, downtime: 18 },
  { name: 'Wed', efficiency: 89, target: 90, downtime: 31 },
  { name: 'Thu', efficiency: 95, target: 90, downtime: 12 },
  { name: 'Fri', efficiency: 88, target: 90, downtime: 28 },
  { name: 'Sat', efficiency: 91, target: 90, downtime: 19 },
  { name: 'Sun', efficiency: 86, target: 90, downtime: 34 }
];

const cellPerformanceData = [
  { name: 'Assembly Line A', efficiency: 94, cycleTime: 45, throughput: 128 },
  { name: 'Welding Station', efficiency: 87, cycleTime: 32, throughput: 156 },
  { name: 'Quality Check', efficiency: 96, cycleTime: 18, throughput: 320 },
  { name: 'Packaging', efficiency: 91, cycleTime: 25, throughput: 230 },
  { name: 'Shipping Prep', efficiency: 89, cycleTime: 38, throughput: 189 }
];

const downtimeReasons = [
  { name: 'Machine Maintenance', value: 35, color: '#ef4444' },
  { name: 'Material Shortage', value: 25, color: '#f59e0b' },
  { name: 'Operator Break', value: 20, color: '#3b82f6' },
  { name: 'Quality Issues', value: 15, color: '#8b5cf6' },
  { name: 'Power Outage', value: 5, color: '#6b7280' }
];

const shiftData = [
  { shift: '6AM-2PM', efficiency: 92, partsCompleted: 156, downtime: 28 },
  { shift: '2PM-10PM', efficiency: 88, partsCompleted: 142, downtime: 45 },
  { shift: '10PM-6AM', efficiency: 85, partsCompleted: 128, downtime: 52 }
];

const realTimeMetrics = {
  currentEfficiency: 91.2,
  todayTarget: 90.0,
  partsCompleted: 426,
  activeOperations: 8,
  downtimeMinutes: 125,
  bottleneckOperation: 'Welding Station'
};

export default function ManufacturingEfficiencyDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedCell, setSelectedCell] = useState('all');

  return (
    <>
      <style jsx>{`
        :global(body) {
          overflow: auto !important;
        }
      `}</style>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-6 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              
              <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">% Attainment Dashboard</h1>
            </div>
            <p className="text-muted-foreground text-sm lg:text-base max-w-2xl">
              Real-time monitoring and analytics for production optimization across all manufacturing cells and operations.
            </p>
          </div>
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-3 sm:space-y-0">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
              <label className="text-sm font-medium text-muted-foreground">Timeframe</label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
              <label className="text-sm font-medium text-muted-foreground">Cell</label>
              <Select value={selectedCell} onValueChange={setSelectedCell}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Select Cell" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cells</SelectItem>
                  <SelectItem value="assembly">Assembly Line A</SelectItem>
                  <SelectItem value="welding">Welding Station</SelectItem>
                  <SelectItem value="quality">Quality Check</SelectItem>
                  <SelectItem value="packaging">Packaging</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Start Shift
            </Button>
            <Button variant="outline" size="sm">
              <Target className="mr-2 h-4 w-4" />
              Set Targets
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" size="sm">
              <Factory className="mr-2 h-4 w-4" />
              Add Operation
            </Button>
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Manage Team
            </Button>
            <Button variant="outline" size="sm">
              <Zap className="mr-2 h-4 w-4" />
              Optimize Process
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeMetrics.currentEfficiency}%</div>
            <p className="text-xs text-muted-foreground">
              Target: {realTimeMetrics.todayTarget}%
            </p>
            <Progress 
              value={realTimeMetrics.currentEfficiency} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parts Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeMetrics.partsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Operations</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeMetrics.activeOperations}</div>
            <p className="text-xs text-muted-foreground">
              {realTimeMetrics.activeOperations}/12 total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downtime</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeMetrics.downtimeMinutes}m</div>
            <p className="text-xs text-muted-foreground">
              -8% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full overflow-x-auto flex-nowrap scrollbar-hide flex-col h-auto sm:flex-row sm:h-9">
          <TabsTrigger value="overview" className="whitespace-nowrap flex-shrink-0 w-full sm:w-auto">Overview</TabsTrigger>
          <TabsTrigger value="efficiency" className="whitespace-nowrap flex-shrink-0 w-full sm:w-auto">Efficiency Trends</TabsTrigger>
          <TabsTrigger value="cells" className="whitespace-nowrap flex-shrink-0 w-full sm:w-auto">Cell Performance</TabsTrigger>
          <TabsTrigger value="downtime" className="whitespace-nowrap flex-shrink-0 w-full sm:w-auto">Downtime Analysis</TabsTrigger>
          <TabsTrigger value="shifts" className="whitespace-nowrap flex-shrink-0 w-full sm:w-auto">Shift Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            {/* Weekly Efficiency Chart */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Weekly Efficiency Trend</CardTitle>
                <CardDescription>
                  Efficiency vs. target over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={efficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                      name="Efficiency %"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#ef4444" 
                      strokeDasharray="5 5"
                      name="Target %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Downtime Distribution */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Downtime Distribution</CardTitle>
                <CardDescription>
                  Breakdown of downtime reasons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={downtimeReasons}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {downtimeReasons.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bottleneck Alert */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                <span>Current Bottleneck</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-700">
                    <strong>{realTimeMetrics.bottleneckOperation}</strong> is currently the limiting factor
                  </p>
                  <p className="text-sm text-orange-600">
                    Cycle time: 32s | Standard: 28s | Impact: -12.5% efficiency
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Efficiency vs. Target Analysis</CardTitle>
              <CardDescription>
                Detailed view of efficiency performance and variance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Bar dataKey="efficiency" fill="#3b82f6" name="Actual Efficiency" />
                  <Bar dataKey="target" fill="#ef4444" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cells" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cell Performance Comparison</CardTitle>
              <CardDescription>
                Efficiency metrics across different production cells
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={cellPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="efficiency" fill="#10b981" name="Efficiency %" />
                  <Bar dataKey="cycleTime" fill="#f59e0b" name="Cycle Time (s)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cell Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Cell Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cellPerformanceData.map((cell, index) => (
                  <div key={index} className="flex flex-col space-y-4 p-4 border rounded-lg sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div>
                        <h4 className="font-medium">{cell.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Throughput: {cell.throughput} parts/day
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0">
                      <div className="flex items-center justify-between sm:flex-col sm:text-center">
                        <div className="sm:hidden">
                          <p className="text-sm text-muted-foreground">Efficiency</p>
                          <p className="text-lg font-bold text-green-600">{cell.efficiency}%</p>
                        </div>
                        <div className="hidden sm:block">
                          <p className="text-2xl font-bold text-green-600">{cell.efficiency}%</p>
                          <p className="text-xs text-muted-foreground">Efficiency</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:text-center">
                        <div className="sm:hidden">
                          <p className="text-sm text-muted-foreground">Cycle Time</p>
                          <p className="text-lg font-bold text-blue-600">{cell.cycleTime}s</p>
                        </div>
                        <div className="hidden sm:block">
                          <p className="text-2xl font-bold text-blue-600">{cell.cycleTime}s</p>
                          <p className="text-xs text-muted-foreground">Cycle Time</p>
                        </div>
                      </div>
                      <Badge variant={cell.efficiency >= 90 ? "default" : "secondary"} className="w-full sm:w-auto text-center">
                        {cell.efficiency >= 90 ? "Optimal" : "Needs Attention"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downtime" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Downtime Trends</CardTitle>
                <CardDescription>
                  Daily downtime minutes over the week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={efficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="downtime" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Downtime (min)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Downtime Categories</CardTitle>
                <CardDescription>
                  Breakdown by reason and impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {downtimeReasons.map((reason, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: reason.color }}
                        ></div>
                        <span className="text-sm">{reason.name}</span>
                      </div>
                      <span className="font-medium">{reason.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shift Performance Comparison</CardTitle>
              <CardDescription>
                Efficiency metrics across different shifts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={shiftData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="shift" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="efficiency" fill="#10b981" name="Efficiency %" />
                  <Bar dataKey="partsCompleted" fill="#3b82f6" name="Parts Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Shift Details */}
          <div className="grid gap-4 md:grid-cols-3">
            {shiftData.map((shift, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{shift.shift}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{shift.efficiency}%</p>
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Parts Completed:</span>
                      <span className="font-medium">{shift.partsCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Downtime:</span>
                      <span className="font-medium">{shift.downtime}m</span>
                    </div>
                  </div>
                  <Badge 
                    variant={shift.efficiency >= 90 ? "default" : "secondary"}
                    className="w-full justify-center"
                  >
                    {shift.efficiency >= 90 ? "Excellent" : "Good"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </>
  );
}
