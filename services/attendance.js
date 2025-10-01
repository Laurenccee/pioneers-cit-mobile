import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

// Attendance Services
export const attendanceService = {
  // Check if student exists in the database
  async checkStudentExists(studentId) {
    try {
      console.log('Looking for student with ID:', studentId);

      // Check in the students collection
      const studentQuery = query(
        collection(db, 'students'),
        where('student_id', '==', studentId)
      );
      const studentSnapshot = await getDocs(studentQuery);

      console.log(
        'Student query completed. Found:',
        studentSnapshot.size,
        'students'
      );

      if (studentSnapshot.empty) {
        console.log('No student found with ID:', studentId);
        return { exists: false, student: null };
      }

      const studentDoc = studentSnapshot.docs[0];
      const studentData = studentDoc.data();
      console.log('Student found:', studentData);

      return {
        exists: true,
        student: {
          id: studentDoc.id,
          ...studentData,
        },
      };
    } catch (error) {
      console.error('Error checking student existence:', error);
      console.error('Error details:', error.message);
      throw error;
    }
  },
  // Check if student is already checked in to an event
  async checkStudentAttendanceStatus(studentId, eventId) {
    try {
      console.log(
        'Checking attendance status for student:',
        studentId,
        'in event:',
        eventId
      );

      // Get all attendance records for this student in this event (without orderBy to avoid index requirement)
      const attendanceQuery = query(
        collection(db, 'events', eventId, 'attendance'),
        where('student_id', '==', studentId)
      );

      const attendanceSnapshot = await getDocs(attendanceQuery);
      console.log('Found attendance records:', attendanceSnapshot.size);

      if (attendanceSnapshot.empty) {
        console.log('No attendance records found for student');
        return { isCheckedIn: false, attendanceRecord: null };
      }

      // Get all records and sort them in JavaScript
      const attendanceRecords = attendanceSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by check_in_time in descending order (latest first)
      attendanceRecords.sort((a, b) => {
        if (!a.check_in_time || !b.check_in_time) return 0;
        // Convert Firestore timestamps to comparable values
        const aTime = a.check_in_time.toMillis
          ? a.check_in_time.toMillis()
          : new Date(a.check_in_time).getTime();
        const bTime = b.check_in_time.toMillis
          ? b.check_in_time.toMillis()
          : new Date(b.check_in_time).getTime();
        return bTime - aTime;
      });

      const latestRecord = attendanceRecords[0];
      console.log('Latest attendance record:', latestRecord);

      // If there's no check_out_time, student is still checked in
      const isCheckedIn = !latestRecord.check_out_time;
      console.log('Student is checked in:', isCheckedIn);

      return {
        isCheckedIn,
        attendanceRecord: latestRecord,
      };
    } catch (error) {
      console.error('Error checking attendance status:', error);
      throw error;
    }
  },

  // Check in student to event
  async checkInStudent(student_id, eventId, studentData) {
    try {
      console.log('Checking in student:', student_id, 'to event:', eventId);
      console.log('Student data for check-in:', studentData);

      // First check if student is already checked in
      const { isCheckedIn } = await this.checkStudentAttendanceStatus(
        student_id,
        eventId
      );

      if (isCheckedIn) {
        console.log('Student is already checked in');
        throw new Error('Student is already checked in to this event');
      }

      // Create new attendance record
      const attendanceData = {
        student_id: student_id,
        event_id: eventId,
        student_name:
          studentData.first_name && studentData.last_name
            ? `${studentData.first_name} ${studentData.last_name}`
            : studentData.name || 'Unknown Student',
        student_email: studentData.email || '',
        student_major: studentData.major || 'Unknown Major',
        student_course: studentData.course || 'Unknown Course',
        student_year: studentData.year || 'Unknown Year',
        student_section: studentData.section || 'Unknown Section',
        check_in_time: serverTimestamp(),
        check_out_time: null,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };

      console.log('Adding attendance record:', attendanceData);

      const docRef = await addDoc(
        collection(db, 'events', eventId, 'attendance'),
        attendanceData
      );

      console.log('Attendance record created with ID:', docRef.id);

      const studentName =
        studentData.first_name && studentData.last_name
          ? `${studentData.first_name} ${studentData.last_name}`
          : studentData.name || 'Student';

      return {
        success: true,
        attendanceId: docRef.id,
        action: 'check-in',
        message: `${studentName} checked in successfully`,
      };
    } catch (error) {
      console.error('Error checking in student:', error);
      throw error;
    }
  },

  // Check out student from event
  async checkOutStudent(studentId, eventId, attendanceRecordId) {
    try {
      // Update the attendance record with checkout time
      const attendanceRef = doc(
        db,
        'events',
        eventId,
        'attendance',
        attendanceRecordId
      );

      await updateDoc(attendanceRef, {
        check_out_time: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      return {
        success: true,
        action: 'check-out',
        message: 'Student checked out successfully',
      };
    } catch (error) {
      console.error('Error checking out student:', error);
      throw error;
    }
  },

  // Process attendance (main function for scanner)
  async processAttendance(studentId, eventId, intendedAction) {
    try {
      console.log('Processing attendance for:', {
        studentId,
        eventId,
        intendedAction,
      });

      // 1. Check if student exists
      console.log('Checking if student exists...');
      const { exists, student } = await this.checkStudentExists(studentId);
      console.log('Student check result:', { exists, student });

      if (!exists) {
        console.log('Student not found in database');
        return {
          success: false,
          error: 'Student not found in database',
          message: `Student ID ${studentId} is not registered`,
        };
      }

      // 2. Check current attendance status
      console.log('Checking attendance status...');
      const { isCheckedIn, attendanceRecord } =
        await this.checkStudentAttendanceStatus(studentId, eventId);
      console.log('Attendance status:', { isCheckedIn, attendanceRecord });

      // 3. Process based on intended action and current status
      if (intendedAction === 'login') {
        if (isCheckedIn) {
          console.log('Student is already checked in, cannot login again');
          return {
            success: false,
            error: 'Student is already logged in',
            message: 'Student is already logged in to this event',
            student,
            currentStatus: 'checked-in',
          };
        } else {
          console.log('Student is not checked in, logging in...');
          const result = await this.checkInStudent(studentId, eventId, student);
          console.log('Login result:', result);
          return {
            ...result,
            student,
            previousStatus: 'checked-out',
          };
        }
      } else if (intendedAction === 'logout') {
        if (!isCheckedIn) {
          console.log('Student is already checked out, cannot logout again');
          return {
            success: false,
            error: 'Student is already logged out',
            message: 'Student is already logged out from this event',
            student,
            currentStatus: 'checked-out',
          };
        } else {
          console.log('Student is checked in, logging out...');
          const result = await this.checkOutStudent(
            studentId,
            eventId,
            attendanceRecord.id
          );
          console.log('Logout result:', result);
          return {
            ...result,
            student,
            previousStatus: 'checked-in',
          };
        }
      } else {
        // Default behavior (backward compatibility) - toggle mode
        if (isCheckedIn) {
          console.log('Student is checked in, checking out...');
          const result = await this.checkOutStudent(
            studentId,
            eventId,
            attendanceRecord.id
          );
          console.log('Check out result:', result);
          return {
            ...result,
            student,
            previousStatus: 'checked-in',
          };
        } else {
          console.log('Student is not checked in, checking in...');
          const result = await this.checkInStudent(studentId, eventId, student);
          console.log('Check in result:', result);
          return {
            ...result,
            student,
            previousStatus: 'checked-out',
          };
        }
      }
    } catch (error) {
      console.error('Error processing attendance:', error);
      return {
        success: false,
        error: error.message || error.toString(),
        message: 'Failed to process attendance - see console for details',
      };
    }
  },

  // Get event attendance list
  async getEventAttendance(eventId) {
    try {
      const attendanceQuery = query(
        collection(db, 'events', eventId, 'attendance'),
        orderBy('check_in_time', 'desc')
      );

      const attendanceSnapshot = await getDocs(attendanceQuery);

      return attendanceSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching event attendance:', error);
      throw error;
    }
  },

  // Get student attendance history across all events
  async getStudentAttendance(studentId) {
    try {
      // Note: This requires querying multiple subcollections - more complex with subcollections
      // For now, we'll use a collection group query
      const attendanceQuery = query(
        collection(db, 'eventAttendance'), // Fallback to main collection for cross-event queries
        where('student_id', '==', studentId),
        orderBy('check_in_time', 'desc')
      );

      const attendanceSnapshot = await getDocs(attendanceQuery);

      return attendanceSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching student attendance:', error);
      throw error;
    }
  },
};
