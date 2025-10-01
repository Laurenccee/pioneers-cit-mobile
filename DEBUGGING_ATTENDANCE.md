# Debugging Attendance System

## Steps to Debug "Failed to Process Attendance" Error

### 1. Check Console Logs

After the latest updates, run the scanner and check the console output. You should see:

- "Processing attendance for: {studentId, eventId}"
- "Checking if student exists..."
- "Student check result: {exists, student}"

### 2. Most Common Issues

#### **Issue 1: No Students in Database**

**Symptom:** Console shows "Student not found in database"
**Solution:** Add test students to your Firestore `students` collection

#### **Issue 2: Missing Collections**

**Symptom:** Firebase errors about missing collections
**Solution:** Create the required collections in Firestore

#### **Issue 3: Event ID Issues**

**Symptom:** eventId is undefined or null
**Solution:** Check that the event card passes the ID correctly

### 3. Create Test Data

Add these documents to your Firestore database:

**Collection: `students`**

```javascript
// Document 1
{
  studentId: "TEST001",
  name: "Test Student One",
  email: "test1@school.edu",
  course: "Computer Science",
  year: "3rd Year"
}

// Document 2
{
  studentId: "2024001",
  name: "Alice Johnson",
  email: "alice@school.edu",
  course: "Engineering",
  year: "2nd Year"
}

// Document 3
{
  studentId: "2024002",
  name: "Bob Smith",
  email: "bob@school.edu",
  course: "Business",
  year: "1st Year"
}
```

### 4. Test Process

1. **Go to scanner screen**
2. **Click "Test DB" button** (added for debugging)
3. **Check console output** to see where it fails
4. **Try scanning QR code** with content "TEST001" or "2024001"

### 5. Create Required Firestore Collections

Make sure these collections exist in your Firestore:

- ✅ `students` - Contains student data
- ✅ `events` - Contains event data
- ✅ `eventAttendance` - Will be created automatically when first attendance is recorded

### 6. QR Code Testing

Create QR codes with these contents for testing:

- **TEST001** (for test student)
- **2024001** (for Alice Johnson)
- **2024002** (for Bob Smith)

### 7. Firestore Rules

Make sure your Firestore rules allow read/write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For testing only - make more secure in production
    }
  }
}
```

### 8. Check Network Connection

Ensure you have:

- ✅ Internet connection
- ✅ Firebase project is active
- ✅ Firestore is enabled in Firebase console

### 9. Environment Variables

Check that your `.env` file has correct Firebase configuration:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# ... other Firebase config
```

### 10. Remove Test Button

After debugging, remove the "Test DB" button from the scanner by deleting the test button code.
