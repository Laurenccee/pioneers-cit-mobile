# Database Schema for Attendance System

## Collections Structure

### 1. students

```javascript
{
  id: "auto-generated-id",
  studentId: "2024001", // Unique student ID (what gets scanned)
  name: "John Doe",
  email: "john.doe@school.edu",
  course: "Computer Science",
  year: "3rd Year",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

### 2. events

```javascript
{
  id: "auto-generated-id",
  title: "Annual School Festival",
  description: "School wide festival event",
  location: "Main Campus",
  date: "2025-01-15",
  startTime: "09:00",
  endTime: "17:00",
  isDone: false,
  isFeatured: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

### 3. eventAttendance

```javascript
{
  id: "auto-generated-id",
  studentId: "2024001", // Links to students.studentId
  eventId: "event-doc-id", // Links to events.id
  studentName: "John Doe", // Cached from students collection
  studentEmail: "john.doe@school.edu", // Cached from students collection
  checkInTime: serverTimestamp(), // When student checked in
  checkOutTime: null, // null if still checked in, serverTimestamp() when checked out
  createdAt: serverTimestamp()
}
```

## Sample Data to Add

### Students Collection Sample Data

```javascript
// Add these documents to your Firestore 'students' collection
[
  {
    studentId: '2024001',
    name: 'Alice Johnson',
    email: 'alice.johnson@school.edu',
    course: 'Computer Science',
    year: '3rd Year',
  },
  {
    studentId: '2024002',
    name: 'Bob Smith',
    email: 'bob.smith@school.edu',
    course: 'Engineering',
    year: '2nd Year',
  },
  {
    studentId: '2024003',
    name: 'Carol Williams',
    email: 'carol.williams@school.edu',
    course: 'Business',
    year: '4th Year',
  },
];
```

## How to Test

1. Add sample students to your Firestore `students` collection
2. Create an event and set it as featured
3. Click "SCAN ATTENDANCE" on the featured event card
4. Scanner opens for that specific event
5. Scan a QR code or barcode containing a studentId (e.g., "2024001")
6. System will:
   - Check if student exists in database
   - Check current attendance status for this event
   - Either check them IN or OUT accordingly
   - Prevent multiple check-ins
   - Show success/error messages

## QR Code Generation

You can generate QR codes containing just the student ID:

- Content: "2024001" (just the student ID)
- The scanner will process this and look up the student in the database

## Features

✅ **Student Validation**: Checks if student exists before processing
✅ **No Duplicate Check-ins**: Prevents multiple check-ins for same event
✅ **Automatic Toggle**: Automatically switches between check-in/check-out
✅ **Real-time Processing**: Live attendance tracking
✅ **Error Handling**: Clear messages for various error states
✅ **Event-specific**: Each event has separate attendance tracking
