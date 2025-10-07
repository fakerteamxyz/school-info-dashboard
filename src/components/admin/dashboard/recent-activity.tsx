'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, BookOpen, Megaphone, Users } from 'lucide-react';

interface Activity {
  id: string;
  type: 'student' | 'teacher' | 'class' | 'announcement';
  action: 'created' | 'updated' | 'deleted';
  description: string;
  timestamp: string;
  user: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - in a real app, this would come from an API
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'student',
        action: 'created',
        description: 'New student John Doe enrolled in Grade 10',
        timestamp: '2 hours ago',
        user: 'Admin User',
      },
      {
        id: '2',
        type: 'announcement',
        action: 'created',
        description: 'School holiday announcement posted',
        timestamp: '4 hours ago',
        user: 'Principal Smith',
      },
      {
        id: '3',
        type: 'teacher',
        action: 'updated',
        description: 'Teacher Jane Doe profile updated',
        timestamp: '1 day ago',
        user: 'Admin User',
      },
      {
        id: '4',
        type: 'class',
        action: 'created',
        description: 'New class Grade 7-A created',
        timestamp: '2 days ago',
        user: 'Admin User',
      },
    ];

    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'student':
        return Users;
      case 'teacher':
        return UserPlus;
      case 'class':
        return BookOpen;
      case 'announcement':
        return Megaphone;
      default:
        return Users;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'student':
        return 'bg-blue-100 text-blue-600';
      case 'teacher':
        return 'bg-green-100 text-green-600';
      case 'class':
        return 'bg-purple-100 text-purple-600';
      case 'announcement':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          ) : (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.user} • {activity.timestamp}
                    </p>
                  </div>
                  
                  <Badge variant="secondary" className="text-xs">
                    {activity.action}
                  </Badge>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}