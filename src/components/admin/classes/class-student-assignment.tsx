'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Users, UserPlus, UserMinus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Class, Student } from '@/lib/db';

interface ClassStudentAssignmentProps {
  classData: Class;
  onComplete: () => void;
  onCancel: () => void;
}

export function ClassStudentAssignment({ classData, onComplete, onCancel }: ClassStudentAssignmentProps) {
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchAvailable, setSearchAvailable] = useState('');
  const [searchEnrolled, setSearchEnrolled] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      // Fetch all students and enrolled students
      const [allResponse, enrolledResponse] = await Promise.all([
        fetch('/api/admin/students?limit=100'),
        fetch(`/api/admin/students?status=active&grade_level=${classData.grade_level}&limit=100`)
      ]);

      const allResult = await allResponse.json();
      const enrolledResult = await enrolledResponse.json();

      if (allResult.success) {
        // In a real implementation, you'd have a proper API to get enrolled students for a class
        // For now, we'll simulate this by filtering
        const mockEnrolled = allResult.data.slice(0, Math.floor(Math.random() * 10));
        const available = allResult.data.filter(student => 
          !mockEnrolled.some(enrolled => enrolled.id === student.id) &&
          student.grade_level === classData.grade_level
        );

        setAvailableStudents(available);
        setEnrolledStudents(mockEnrolled);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [classData.id]);

  const filteredAvailable = availableStudents.filter(student =>
    student.first_name.toLowerCase().includes(searchAvailable.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchAvailable.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchAvailable.toLowerCase())
  );

  const filteredEnrolled = enrolledStudents.filter(student =>
    student.first_name.toLowerCase().includes(searchEnrolled.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchEnrolled.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchEnrolled.toLowerCase())
  );

  const handleEnrollStudents = async () => {
    if (selectedStudents.length === 0) return;

    setActionLoading(true);
    try {
      // In a real implementation, you'd call the enrollment API
      // For now, we'll simulate the enrollment
      const newEnrolled = availableStudents.filter(student => 
        selectedStudents.includes(student.id!)
      );
      
      setEnrolledStudents([...enrolledStudents, ...newEnrolled]);
      setAvailableStudents(availableStudents.filter(student => 
        !selectedStudents.includes(student.id!)
      ));
      setSelectedStudents([]);
    } catch (error) {
      console.error('Failed to enroll students:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    setActionLoading(true);
    try {
      // In a real implementation, you'd call the removal API
      const student = enrolledStudents.find(s => s.id === studentId);
      if (student) {
        setEnrolledStudents(enrolledStudents.filter(s => s.id !== studentId));
        setAvailableStudents([...availableStudents, student]);
      }
    } catch (error) {
      console.error('Failed to remove student:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Class Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{classData.name}</span>
            <Badge variant="outline">
              Capacity: {enrolledStudents.length}/{classData.max_students}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Class Code:</span>
              <p className="font-medium">{classData.class_code}</p>
            </div>
            <div>
              <span className="text-gray-500">Grade Level:</span>
              <p className="font-medium">Grade {classData.grade_level}</p>
            </div>
            <div>
              <span className="text-gray-500">Room:</span>
              <p className="font-medium">{classData.room_number || 'Not assigned'}</p>
            </div>
            <div>
              <span className="text-gray-500">Academic Year:</span>
              <p className="font-medium">{classData.academic_year}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Assignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Available Students ({filteredAvailable.length})
              </span>
              <Badge variant="secondary">
                {selectedStudents.length} selected
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search available students..."
                  value={searchAvailable}
                  onChange={(e) => setSearchAvailable(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Students List */}
              <ScrollArea className="h-96 border rounded-md">
                {filteredAvailable.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No available students found
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredAvailable.map((student) => (
                      <div
                        key={student.id}
                        className={`p-2 rounded border cursor-pointer transition-colors ${
                          selectedStudents.includes(student.id!)
                            ? 'bg-blue-50 border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleStudentSelection(student.id!)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {student.first_name} {student.last_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {student.student_id} • Grade {student.grade_level}
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id!)}
                            onChange={() => toggleStudentSelection(student.id!)}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Enroll Button */}
              <Button
                onClick={handleEnrollStudents}
                disabled={selectedStudents.length === 0 || actionLoading}
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Enroll Selected Students ({selectedStudents.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enrolled Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Enrolled Students ({enrolledStudents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search enrolled students..."
                  value={searchEnrolled}
                  onChange={(e) => setSearchEnrolled(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Students List */}
              <ScrollArea className="h-96 border rounded-md">
                {filteredEnrolled.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No enrolled students found
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredEnrolled.map((student) => (
                      <div
                        key={student.id}
                        className="p-2 rounded border hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {student.first_name} {student.last_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {student.student_id} • {student.email}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveStudent(student.id!)}
                            disabled={actionLoading}
                            className="text-red-600 hover:text-red-700"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onComplete}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}