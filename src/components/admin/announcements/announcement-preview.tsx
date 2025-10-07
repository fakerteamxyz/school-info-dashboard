import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Megaphone, Clock } from 'lucide-react';
import { Announcement } from '@/lib/db';

interface AnnouncementPreviewProps {
  announcement: Announcement;
}

export function AnnouncementPreview({ announcement }: AnnouncementPreviewProps) {
  const getTypeBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      general: 'default',
      urgent: 'destructive',
      academic: 'secondary',
      event: 'outline',
      holiday: 'default',
    };
    return <Badge variant={variants[type] || 'default'}>{type}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600',
      normal: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600',
    };
    return <Badge className={colors[priority] || colors.normal}>{priority}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isAnnouncementActive = () => {
    const now = new Date();
    const startDate = new Date(announcement.start_date);
    const endDate = announcement.end_date ? new Date(announcement.end_date) : null;
    
    return announcement.is_active && 
           startDate <= now && 
           (!endDate || endDate >= now);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-xl">{announcement.title}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {getTypeBadge(announcement.type)}
                {getPriorityBadge(announcement.priority)}
                <Badge 
                  variant={isAnnouncementActive() ? 'default' : 'secondary'}
                  className={isAnnouncementActive() ? 'bg-green-100 text-green-800' : ''}
                >
                  {isAnnouncementActive() ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Content */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">
              {announcement.content}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Announcement Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Schedule */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <Calendar className="h-4 w-4" />
                Schedule
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-600">Start:</span>
                  <span className="font-medium">{formatDate(announcement.start_date)}</span>
                </div>
                {announcement.end_date && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">End:</span>
                    <span className="font-medium">{formatDate(announcement.end_date)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <Users className="h-4 w-4" />
                Target Audience
              </div>
              <div className="flex flex-wrap gap-2">
                {announcement.target_audience.map((audience, index) => {
                  // Convert audience codes to readable labels
                  const getAudienceLabel = (audience: string) => {
                    const labels: Record<string, string> = {
                      all: 'All Users',
                      students: 'Students',
                      teachers: 'Teachers',
                      parents: 'Parents',
                      grade_1: 'Grade 1',
                      grade_2: 'Grade 2',
                      grade_3: 'Grade 3',
                      grade_4: 'Grade 4',
                      grade_5: 'Grade 5',
                      grade_6: 'Grade 6',
                      grade_7: 'Grade 7',
                      grade_8: 'Grade 8',
                      grade_9: 'Grade 9',
                      grade_10: 'Grade 10',
                      grade_11: 'Grade 11',
                      grade_12: 'Grade 12',
                    };
                    return labels[audience] || audience;
                  };

                  return (
                    <Badge key={index} variant="outline">
                      {getAudienceLabel(audience)}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Attachments */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="text-sm font-medium text-gray-900">Attachments</div>
              <div className="space-y-2">
                {announcement.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <a 
                      href={attachment} 
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {attachment.split('/').pop() || `Attachment ${index + 1}`}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Information */}
          <div className="mt-6 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Created: {formatDate(announcement.created_at || new Date().toISOString())}
              {announcement.updated_at && announcement.updated_at !== announcement.created_at && (
                <span className="ml-4">
                  Updated: {formatDate(announcement.updated_at)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}