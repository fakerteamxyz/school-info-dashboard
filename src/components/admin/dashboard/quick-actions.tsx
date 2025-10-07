'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UserPlus, 
  BookOpen, 
  Megaphone, 
  Users, 
  Plus,
  FileText,
  Download
} from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'Add Student',
      description: 'Enroll a new student',
      icon: UserPlus,
      href: '/dashboard/students?action=add',
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    },
    {
      title: 'Add Teacher',
      description: 'Register a new teacher',
      icon: Users,
      href: '/dashboard/teachers?action=add',
      color: 'bg-green-50 text-green-600 hover:bg-green-100',
    },
    {
      title: 'Create Class',
      description: 'Set up a new class',
      icon: BookOpen,
      href: '/dashboard/classes?action=add',
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    },
    {
      title: 'New Announcement',
      description: 'Post an announcement',
      icon: Megaphone,
      href: '/dashboard/announcements?action=add',
      color: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    },
  ];

  const reports = [
    {
      title: 'Student Report',
      description: 'Generate student list',
      icon: FileText,
      action: 'export-students',
    },
    {
      title: 'Class Schedule',
      description: 'View class schedules',
      icon: Download,
      action: 'export-schedule',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href}>
                  <Button
                    variant="outline"
                    className={`w-full justify-start h-auto p-4 ${action.color} border-transparent`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm opacity-75">{action.description}</div>
                    </div>
                  </Button>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Reports & Exports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {reports.map((report) => {
              const Icon = report.icon;
              return (
                <Button
                  key={report.title}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => {
                    // Handle report generation
                    console.log(`Generating ${report.action}`);
                  }}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{report.title}</div>
                    <div className="text-sm text-gray-500">{report.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}