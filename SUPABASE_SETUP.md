# Supabase Database Setup Guide

## Overview

This guide explains how to set up and connect Supabase as the database for the Manufacturing Efficiency Tracking System. **The authentication system is already implemented with Clerk.com**, so this guide focuses on setting up the database schema and implementing the core app functionality.

## Current Project Status ✅

- ✅ **Next.js 15 + React 18 + TypeScript** - Frontend framework ready
- ✅ **ShadCN/UI Components** - UI component library configured
- ✅ **Clerk Authentication** - User authentication system implemented
- ✅ **Role-Based Access Control (RBAC)** - Permission system in place
- ✅ **Protected Routes** - Route protection with `ProtectedRoute` component
- ✅ **User Role Management** - `useUserRole` hook and permission utilities
- ✅ **Clean Project Structure** - Organized feature-based architecture

## What We're Building Now 🚀

- 🗄️ **Supabase PostgreSQL Database** - Core data storage
- 🔗 **Database Schema** - Relational tables for manufacturing data
- ⚡ **Real-time Updates** - Live efficiency tracking
- 📊 **Data Functions** - CRUD operations and business logic
- 🔐 **Data Security** - Row Level Security (RLS) policies
- 📱 **App Features** - Machine cycle tracking, efficiency metrics, reporting

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier available)
- **Clerk.com project already configured**
- **Existing auth system working**

## 1. Create Supabase Project

### Step 1: Sign Up/Login
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"

### Step 2: Project Configuration
1. **Organization**: Select or create an organization
2. **Project Name**: `lean-tools` or `manufacturing-efficiency`
3. **Database Password**: Create a strong password (save this!)
4. **Region**: Choose closest to your users
5. **Pricing Plan**: Start with Free tier

### Step 3: Wait for Setup
- Database setup takes 2-3 minutes
- You'll receive an email when ready

## 2. Get Connection Details

### API Keys & URLs
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:

```bash
# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Public Anon Key (safe for client-side)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (keep secret, server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. Environment Configuration

### Update Existing Environment Files
Since you already have auth configured, add these to your existing `.env.local`:

```bash
# Existing Clerk variables (keep these)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
CLERK_SECRET_KEY=your-clerk-secret

# Add Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service Role for server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Add to .gitignore (if not already there)
```gitignore
# Environment files
.env.local
.env.production
.env*.local

# Supabase
.supabase/
```

## 4. Install Dependencies

```bash
# Install Supabase client
npm install @supabase/supabase-js

# Install Supabase CLI (optional, for local development)
npm install -g supabase
```

## 5. Database Schema Design

### Core Tables Structure

#### 1. Organizations & Sites
```sql
-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sites table (belongs to organizations)
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. Value Streams & Cells
```sql
-- Value Streams table
CREATE TABLE value_streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_efficiency DECIMAL(5,2) DEFAULT 100.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cells table (belongs to value streams)
CREATE TABLE cells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value_stream_id UUID REFERENCES value_streams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_cycle_time INTEGER, -- in seconds
  target_efficiency DECIMAL(5,2) DEFAULT 100.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. User Profiles (Integrate with Clerk)
```sql
-- User profiles (extends Clerk auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY, -- This will be Clerk user ID
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'manager', 'operator')) DEFAULT 'operator',
  organization_id UUID REFERENCES organizations(id),
  site_id UUID REFERENCES sites(id),
  value_stream_id UUID REFERENCES value_streams(id),
  cell_id UUID REFERENCES cells(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User permissions junction table
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. Machine Cycles & Efficiency
```sql
-- Machine cycles table
CREATE TABLE machine_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_id UUID REFERENCES cells(id) ON DELETE CASCADE,
  operator_id UUID REFERENCES user_profiles(id),
  machine_id TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  target_cycle_time INTEGER, -- in seconds
  actual_cycle_time INTEGER, -- in seconds
  status TEXT CHECK (status IN ('running', 'completed', 'failed')) DEFAULT 'running',
  efficiency DECIMAL(5,2), -- calculated field
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Efficiency metrics table
CREATE TABLE efficiency_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_id UUID REFERENCES cells(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_cycles INTEGER DEFAULT 0,
  completed_cycles INTEGER DEFAULT 0,
  total_efficiency DECIMAL(5,2) DEFAULT 0.00,
  average_cycle_time INTEGER DEFAULT 0,
  target_cycle_time INTEGER,
  downtime_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5. Downtime & Issues
```sql
-- Downtime events
CREATE TABLE downtime_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_id UUID REFERENCES cells(id) ON DELETE CASCADE,
  reported_by UUID REFERENCES user_profiles(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  category TEXT CHECK (category IN ('planned', 'unplanned', 'maintenance')),
  reason TEXT,
  status TEXT CHECK (status IN ('active', 'resolved')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Issue tracking
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_id UUID REFERENCES cells(id) ON DELETE CASCADE,
  reported_by UUID REFERENCES user_profiles(id),
  assigned_to UUID REFERENCES user_profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Enable Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE value_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE cells ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE efficiency_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE downtime_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
```

## 6. Client Setup

### Create Supabase Client
```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
```

### Server-Side Client (for API routes)
```typescript
// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
```

## 7. Database Functions & Triggers

### Efficiency Calculation Function
```sql
-- Function to calculate efficiency
CREATE OR REPLACE FUNCTION calculate_efficiency(
  actual_time INTEGER,
  target_time INTEGER
) RETURNS DECIMAL(5,2) AS $$
BEGIN
  IF target_time = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN ROUND((target_time::DECIMAL / actual_time::DECIMAL) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update efficiency when cycle completes
CREATE OR REPLACE FUNCTION update_cycle_efficiency()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_time IS NOT NULL AND NEW.actual_cycle_time IS NOT NULL THEN
    NEW.efficiency = calculate_efficiency(NEW.actual_cycle_time, NEW.target_cycle_time);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cycle_efficiency
  BEFORE UPDATE ON machine_cycles
  FOR EACH ROW
  EXECUTE FUNCTION update_cycle_efficiency();
```

### Daily Metrics Aggregation
```sql
-- Function to aggregate daily metrics
CREATE OR REPLACE FUNCTION aggregate_daily_metrics(target_date DATE)
RETURNS VOID AS $$
BEGIN
  INSERT INTO efficiency_metrics (
    cell_id, date, total_cycles, completed_cycles,
    total_efficiency, average_cycle_time, target_cycle_time
  )
  SELECT 
    cell_id,
    target_date,
    COUNT(*) as total_cycles,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_cycles,
    AVG(efficiency) as total_efficiency,
    AVG(actual_cycle_time) as average_cycle_time,
    AVG(target_cycle_time) as target_cycle_time
  FROM machine_cycles
  WHERE DATE(start_time) = target_date
  GROUP BY cell_id
  
  ON CONFLICT (cell_id, date) DO UPDATE SET
    total_cycles = EXCLUDED.total_cycles,
    completed_cycles = EXCLUDED.completed_cycles,
    total_efficiency = EXCLUDED.total_efficiency,
    average_cycle_time = EXCLUDED.average_cycle_time,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

## 8. Row Level Security Policies

### Organization-Level Access
```sql
-- Users can only see data from their organization
CREATE POLICY "Users can view own organization data" ON organizations
  FOR SELECT USING (id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can view own site data" ON sites
  FOR SELECT USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));
```

### Role-Based Access (Integrate with Existing RBAC)
```sql
-- Admin users can manage everything
CREATE POLICY "Admins can manage all data" ON machine_cycles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Operators can only view/manage their own cycles
CREATE POLICY "Operators can manage own cycles" ON machine_cycles
  FOR ALL USING (
    operator_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );
```

## 9. Real-Time Subscriptions

### Subscribe to Changes
```typescript
// hooks/use-realtime-efficiency.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useRealtimeEfficiency(cellId: string) {
  const [efficiency, setEfficiency] = useState<number>(0)

  useEffect(() => {
    const channel = supabase
      .channel(`efficiency:${cellId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'efficiency_metrics',
          filter: `cell_id=eq.${cellId}`
        },
        (payload) => {
          if (payload.new) {
            setEfficiency(payload.new.total_efficiency)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [cellId])

  return efficiency
}
```

## 10. App Feature Implementation

### 1. Machine Cycle Tracking
```typescript
// features/machine-cycles/hooks/use-machine-cycles.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useUserRole } from '@/hooks/use-user-role'

export function useMachineCycles(cellId?: string) {
  const [cycles, setCycles] = useState([])
  const [loading, setLoading] = useState(false)
  const { userRole, canAccessAttainment } = useUserRole()

  const fetchCycles = async () => {
    if (!canAccessAttainment) return
    
    setLoading(true)
    try {
      let query = supabase
        .from('machine_cycles')
        .select(`
          *,
          cells(name, target_cycle_time),
          user_profiles(full_name, email)
        `)
        .order('start_time', { ascending: false })

      if (cellId) {
        query = query.eq('cell_id', cellId)
      }

      const { data, error } = await query
      if (error) throw error
      setCycles(data || [])
    } catch (error) {
      console.error('Error fetching cycles:', error)
    } finally {
      setLoading(false)
    }
  }

  const startCycle = async (cycleData: any) => {
    try {
      const { data, error } = await supabase
        .from('machine_cycles')
        .insert([cycleData])
        .select()
        .single()

      if (error) throw error
      await fetchCycles()
      return data
    } catch (error) {
      console.error('Error starting cycle:', error)
      throw error
    }
  }

  const completeCycle = async (cycleId: string, endData: any) => {
    try {
      const { data, error } = await supabase
        .from('machine_cycles')
        .update(endData)
        .eq('id', cycleId)
        .select()
        .single()

      if (error) throw error
      await fetchCycles()
      return data
    } catch (error) {
      console.error('Error completing cycle:', error)
      throw error
    }
  }

  useEffect(() => {
    fetchCycles()
  }, [cellId, canAccessAttainment])

  return {
    cycles,
    loading,
    startCycle,
    completeCycle,
    refresh: fetchCycles
  }
}
```

### 2. Efficiency Dashboard
```typescript
// features/efficiency/components/efficiency-dashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRealtimeEfficiency } from '@/hooks/use-realtime-efficiency'
import { useMachineCycles } from '@/features/machine-cycles/hooks/use-machine-cycles'

export function EfficiencyDashboard({ cellId }: { cellId: string }) {
  const realtimeEfficiency = useRealtimeEfficiency(cellId)
  const { cycles, loading } = useMachineCycles(cellId)

  const todayCycles = cycles.filter(cycle => 
    new Date(cycle.start_time).toDateString() === new Date().toDateString()
  )

  const completedCycles = todayCycles.filter(cycle => cycle.status === 'completed')
  const averageEfficiency = completedCycles.length > 0 
    ? completedCycles.reduce((sum, cycle) => sum + (cycle.efficiency || 0), 0) / completedCycles.length
    : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Cycles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayCycles.length}</div>
          <p className="text-xs text-muted-foreground">
            {completedCycles.length} completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Live Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{realtimeEfficiency.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Real-time updates
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageEfficiency.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Today's average
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Cycles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {todayCycles.filter(cycle => cycle.status === 'running').length}
          </div>
          <p className="text-xs text-muted-foreground">
            Currently running
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 3. Cycle Control Panel
```typescript
// features/machine-cycles/components/cycle-control-panel.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMachineCycles } from '../hooks/use-machine-cycles'
import { useUserRole } from '@/hooks/use-user-role'

export function CycleControlPanel({ cellId }: { cellId: string }) {
  const [machineId, setMachineId] = useState('')
  const [notes, setNotes] = useState('')
  const { startCycle, completeCycle, cycles } = useMachineCycles(cellId)
  const { userRole } = useUserRole()

  const activeCycle = cycles.find(cycle => 
    cycle.cell_id === cellId && cycle.status === 'running'
  )

  const handleStartCycle = async () => {
    if (!machineId.trim()) return

    try {
      await startCycle({
        cell_id: cellId,
        machine_id: machineId,
        operator_id: 'current-user-id', // Get from Clerk
        start_time: new Date().toISOString(),
        notes: notes.trim() || null
      })
      
      setMachineId('')
      setNotes('')
    } catch (error) {
      console.error('Failed to start cycle:', error)
    }
  }

  const handleCompleteCycle = async () => {
    if (!activeCycle) return

    try {
      const endTime = new Date()
      const actualCycleTime = Math.floor(
        (endTime.getTime() - new Date(activeCycle.start_time).getTime()) / 1000
      )

      await completeCycle(activeCycle.id, {
        end_time: endTime.toISOString(),
        actual_cycle_time: actualCycleTime,
        status: 'completed'
      })
    } catch (error) {
      console.error('Failed to complete cycle:', error)
    }
  }

  if (!activeCycle) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="machine-id">Machine ID</Label>
          <Input
            id="machine-id"
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
            placeholder="Enter machine identifier"
          />
        </div>
        
        <div>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes"
          />
        </div>

        <Button 
          onClick={handleStartCycle}
          disabled={!machineId.trim()}
          className="w-full"
        >
          Start Cycle
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Active Cycle</p>
        <p className="text-lg font-semibold">Machine: {activeCycle.machine_id}</p>
        <p className="text-sm text-muted-foreground">
          Started: {new Date(activeCycle.start_time).toLocaleTimeString()}
        </p>
      </div>

      <Button 
        onClick={handleCompleteCycle}
        variant="destructive"
        className="w-full"
      >
        Complete Cycle
      </Button>
    </div>
  )
}
```

## 11. Local Development Setup

### Install Supabase CLI
```bash
# Install CLI
npm install -g supabase

# Login to your account
supabase login

# Initialize project
supabase init

# Start local development
supabase start

# Stop local development
supabase stop
```

### Local Environment Variables
```bash
# .env.local for local development
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

## 12. Testing & Validation

### Test Database Connection
```typescript
// Test connection in your app
import { supabase } from '@/lib/supabase/client'

async function testConnection() {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('Connection failed:', error)
  } else {
    console.log('Connection successful:', data)
  }
}
```

### Verify RLS Policies
```sql
-- Test RLS policies
-- Switch to different user roles and verify access
SELECT current_user, session_user;

-- Test as different roles
SET ROLE authenticated;
SELECT * FROM machine_cycles LIMIT 1;
```

## 13. Production Deployment

### Environment Variables
1. Set production environment variables in your hosting platform
2. Ensure `SUPABASE_SERVICE_ROLE_KEY` is only accessible server-side
3. Use different Supabase projects for staging/production

### Database Backups
1. Enable automatic backups in Supabase dashboard
2. Set up point-in-time recovery
3. Test restore procedures regularly

### Monitoring
1. Monitor database performance in Supabase dashboard
2. Set up alerts for high resource usage
3. Track query performance and optimize slow queries

## 14. Best Practices

### Security
- Always use RLS policies
- Never expose service role key to client
- Validate all inputs server-side
- Use parameterized queries

### Performance
- Create indexes on frequently queried columns
- Use pagination for large datasets
- Implement caching where appropriate
- Monitor query performance

### Data Integrity
- Use foreign key constraints
- Implement check constraints
- Use triggers for calculated fields
- Regular data validation

## 15. Troubleshooting

### Common Issues

#### Connection Errors
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Verify Supabase project is active
# Check network connectivity
```

#### RLS Policy Issues
```sql
-- Check current user
SELECT current_user, session_user;

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'your_table_name';

-- Test policies manually
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM your_table;
```

#### Performance Issues
```sql
-- Check slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Analyze table statistics
ANALYZE your_table_name;
```

## 16. Next Steps

1. **Set up your Supabase project** using the steps above
2. **Create the database schema** by running the SQL commands
3. **Update environment variables** with Supabase credentials
4. **Test the connection** and basic operations
5. **Implement the app features** (machine cycles, efficiency tracking)
6. **Add real-time subscriptions** for live updates
7. **Deploy and monitor** in production

## 17. Integration with Existing Auth

### Sync Clerk Users with Supabase
```typescript
// lib/supabase/sync-users.ts
import { supabaseAdmin } from './admin'
import { auth } from '@clerk/nextjs/server'

export async function syncUserProfile(userId: string, userData: any) {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        id: userId,
        email: userData.email,
        full_name: userData.fullName,
        role: 'operator', // Default role
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error syncing user profile:', error)
    throw error
  }
}
```

### Update ProtectedRoute to Check Supabase Permissions
```typescript
// components/auth/protected-route.tsx
// Add Supabase permission checks alongside existing Clerk role checks
import { supabase } from '@/lib/supabase/client'

// In your permission checking logic, add Supabase queries
const hasSupabasePermission = async (userId: string, resource: string) => {
  const { data, error } = await supabase
    .from('user_permissions')
    .select('*')
    .eq('user_id', userId)
    .eq('resource_type', resource)
    .single()

  return !error && data
}
```

---

**Need Help?** Check the [Supabase documentation](https://supabase.com/docs) or join the [Discord community](https://discord.supabase.com) for support.
