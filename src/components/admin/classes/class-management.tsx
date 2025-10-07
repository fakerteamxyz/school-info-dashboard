'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Plus, Search, Edit, Trash2, Users, UserPlus, Settings } from 'lucide-react';
import { Class } from '@/lib/db';
import { ClassForm } from './class-form';
import { ClassStudentAssignment } from './class-student-assignment';

export function ClassManagement() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchClasses = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(gradeFilter && { grade_level: gradeFilter }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/classes?${params}`);
      const result = await response.json();

      if (result.success) {
        setClasses(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [currentPage, searchTerm, gradeFilter, statusFilter]);

  const handleEdit = (classData: Class) => {
    setEditingClass(classData);
    setIsDialogOpen(true);
  };

  const handleDelete = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class? This will also remove all student enrollments.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/classes/${classId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchClasses();
      }
    } catch (error) {
      console.error('Failed to delete class:', error);
    }
  };

  const handleStudentAssignment = (classData: Class) => {
    setSelectedClass(classData);
    setAssignmentDialogOpen(true);
  };

  const handleFormSubmit = () => {
    setIsDialogOpen(false);
    setEditingClass(null);
    fetchClasses();
  };

  const handleAssignmentComplete = () => {
    setAssignmentDialogOpen(false);
    setSelectedClass(null);
    fetchClasses();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      inactive: 'secondary',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const getCapacityProgress = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    return {
      percentage,
      color: percentage >= 90 ? 'text-red-600' : percentage >= 70 ? 'text-yellow-600' : 'text-green-600'
    };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Class Management</span>
            <div className="flex space-x-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingClass(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Class
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingClass ? 'Edit Class' : 'Create New Class'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingClass 
                        ? 'Update the class information below.' 
                        : 'Fill in the information to create a new class.'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <ClassForm
                    classData={editingClass}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Grade Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Grades</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                  <SelectItem key={grade} value={grade.toString()}>
                    Grade {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Classes Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Code</TableHead>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No classes found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((classData) => {
                    const capacity = getCapacityProgress(classData.current_students, classData.max_students);
                    
                    return (
                      <TableRow key={classData.id}>
                        <TableCell className="font-medium">
                          {classData.class_code}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{classData.name}</div>
                            {classData.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {classData.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>Grade {classData.grade_level}</TableCell>
                        <TableCell>{classData.academic_year}</TableCell>
                        <TableCell>{classData.room_number || '-'}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{classData.current_students}/{classData.max_students}</span>
                              <span className={capacity.color}>{Math.round(capacity.percentage)}%</span>
                            </div>
                            <Progress 
                              value={capacity.percentage} 
                              className="h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(classData.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStudentAssignment(classData)}
                              title="Manage Students"
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(classData)}
                              title="Edit Class"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(classData.id!)}
                              title="Delete Class"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Assignment Dialog */}
      <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage Student Assignments</DialogTitle>
            <DialogDescription>
              Assign or remove students from {selectedClass?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <ClassStudentAssignment
              classData={selectedClass}
              onComplete={handleAssignmentComplete}
              onCancel={() => setAssignmentDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}