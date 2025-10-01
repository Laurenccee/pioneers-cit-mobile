import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

// Event Services
export const eventService = {
  // Create a new event
  async createEvent(eventData) {
    try {
      const event = {
        ...eventData,
        is_done: false,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'events'), event);
      return docRef.id;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Get all events
  async getAllEvents() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'events'), orderBy('created_at', 'description'))
      );

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Get upcoming events (not marked as done)
  async getUpcomingEvents() {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'events'),
          where('is_done', '==', false),
          orderBy('created_at', 'description')
        )
      );

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  },

  // Get single event by ID
  async getEvent(eventId) {
    try {
      const docRef = doc(db, 'events', eventId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },

  // Update event
  async updateEvent(eventId, updates) {
    try {
      const docRef = doc(db, 'events', eventId);
      await updateDoc(docRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete event
  async deleteEvent(eventId) {
    try {
      const docRef = doc(db, 'events', eventId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  // Mark event as done/completed
  async markEventAsDone(eventId) {
    try {
      await this.updateEvent(eventId, { is_done: true });
    } catch (error) {
      console.error('Error marking event as done:', error);
      throw error;
    }
  },

  // Mark event as not done/upcoming
  async markEventAsUpcoming(eventId) {
    try {
      await this.updateEvent(eventId, { is_done: false });
    } catch (error) {
      console.error('Error marking event as upcoming:', error);
      throw error;
    }
  },

  // Search events by title or location
  async searchEvents(searchTerm) {
    try {
      const allEvents = await this.getAllEvents();
      return allEvents.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching events:', error);
      throw error;
    }
  },

  // Real-time listener for events
  subscribeToEvents(callback) {
    try {
      // Check if db is available
      if (!db) {
        console.error('Firestore database is not initialized');
        callback([]);
        return () => {};
      }

      const eventsQuery = query(
        collection(db, 'events'),
        orderBy('created_at', 'desc')
      );

      const unsubscribe = onSnapshot(
        eventsQuery,
        (querySnapshot) => {
          try {
            console.log(
              'All events query snapshot received, size:',
              querySnapshot.size
            );
            const events = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            console.log('All events processed:', events.length);
            callback(events);
          } catch (snapshotError) {
            console.error('Error processing events snapshot:', snapshotError);
            callback([]);
          }
        },
        (error) => {
          console.error('Error in real-time listener:', error);
          callback([]);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up real-time listener:', error);
      // Return a dummy unsubscribe function to prevent null reference errors
      return () => {};
    }
  },

  // Real-time listener for upcoming events only
  subscribeToUpcomingEvents(callback) {
    try {
      const eventsQuery = query(
        collection(db, 'events'),
        where('is_done', '==', false),
        orderBy('created_at', 'description')
      );

      const unsubscribe = onSnapshot(
        eventsQuery,
        (querySnapshot) => {
          const events = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          callback(events);
        },
        (error) => {
          console.error('Error in upcoming events real-time listener:', error);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error(
        'Error setting up upcoming events real-time listener:',
        error
      );
      throw error;
    }
  },

  // Get featured event (isFeatured = true)
  async getFeaturedEvent() {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'events'),
          where('is_featured', '==', true),
          where('is_done', '==', false)
        )
      );

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]; // Get first featured event
        return {
          id: doc.id,
          ...doc.data(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching featured event:', error);
      throw error;
    }
  },

  // Real-time listener for featured event
  subscribeToFeaturedEvent(callback) {
    try {
      if (!db) {
        console.error('Firestore database is not initialized');
        callback(null);
        return () => {};
      }

      const featuredQuery = query(
        collection(db, 'events'),
        where('is_featured', '==', true),
        where('is_done', '==', false)
      );

      const unsubscribe = onSnapshot(
        featuredQuery,
        (querySnapshot) => {
          try {
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0];
              const featuredEvent = {
                id: doc.id,
                ...doc.data(),
              };
              callback(featuredEvent);
            } else {
              callback(null);
            }
          } catch (snapshotError) {
            console.error(
              'Error processing featured event snapshot:',
              snapshotError
            );
            callback(null);
          }
        },
        (error) => {
          console.error('Error in featured event real-time listener:', error);
          // Return empty results on connection errors
          callback(null);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error(
        'Error setting up featured event real-time listener:',
        error
      );
      callback(null);
      return () => {};
    }
  },

  // Get upcoming events for home screen (limit to 3)
  async getHomeUpcomingEvents(limit = 3) {
    try {
      // Get events that are not done (is_done === false)
      const querySnapshot = await getDocs(
        query(collection(db, 'events'), where('is_done', '==', false))
      );

      // Filter out featured events, sort by date, and limit results in JavaScript
      const events = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((event) => !event.is_featured) // Show only non-featured AND non-done events
        .sort((a, b) => {
          // Sort by date in ascending order
          if (!a.date || !b.date) return 0;
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        })
        .slice(0, limit);

      return events;
    } catch (error) {
      console.error('Error fetching home upcoming events:', error);
      throw error;
    }
  },

  // Real-time listener for home upcoming events
  subscribeToHomeUpcomingEvents(callback, limit = 3) {
    let unsubscribe = null;

    const setupListener = async () => {
      try {
        // Connection check before setting up listener
        if (!db) {
          console.warn('Database not initialized, retrying...');
          setTimeout(() => setupListener(), 1000);
          return;
        }

        console.log('Setting up home upcoming events real-time listener...');

        // Get events that are not done (is_done === false)
        const upcomingQuery = query(
          collection(db, 'events'),
          where('is_done', '==', false)
        );

        unsubscribe = onSnapshot(
          upcomingQuery,
          (querySnapshot) => {
            try {
              console.log(
                'Upcoming events query snapshot received, size:',
                querySnapshot.size
              );

              // Map all documents and filter non-featured events
              const allEvents = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              console.log('All non-done events from query:', allEvents.length);

              // Filter out featured events (show only non-featured AND non-done)
              const upcomingEvents = allEvents.filter(
                (event) => !event.is_featured
              );
              console.log(
                'Non-featured upcoming events:',
                upcomingEvents.length
              );

              // Sort by date in JavaScript (ascending order)
              const sortedEvents = upcomingEvents.sort((a, b) => {
                if (!a.date || !b.date) return 0;
                return new Date(a.date).getTime() - new Date(b.date).getTime();
              });

              const events = sortedEvents.slice(0, limit);
              console.log('Final upcoming events after limit:', events.length);
              callback(events);
            } catch (snapshotError) {
              console.error(
                'Error processing upcoming events snapshot:',
                snapshotError
              );
              callback([]);
            }
          },
          (error) => {
            console.error(
              'Error in home upcoming events real-time listener:',
              error
            );
            // Try to reconnect after a delay
            setTimeout(() => {
              console.log('Attempting to reconnect...');
              setupListener();
            }, 5000);
            callback([]);
          }
        );
      } catch (error) {
        console.error(
          'Error setting up home upcoming events real-time listener:',
          error
        );
        callback([]);
      }
    };

    // Start the listener setup
    setupListener();

    // Return cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  },
};

// Helper functions
export const formatEventDateTime = (date, startTime, endTime) => {
  const eventDate = new Date(date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `${formattedDate} from ${startTime} to ${endTime}`;
};

export const isEventUpcoming = (date, startTime) => {
  const eventDateTime = new Date(`${date}T${startTime}`);
  const now = new Date();
  return eventDateTime > now;
};

export const isEventToday = (date) => {
  const eventDate = new Date(date);
  const today = new Date();
  return eventDate.toDateString() === today.toDateString();
};

export const getEventStatus = (date, startTime, endTime) => {
  const now = new Date();
  const startDateTime = new Date(`${date}T${startTime}`);
  const endDateTime = new Date(`${date}T${endTime}`);

  if (now < startDateTime) {
    return 'upcoming';
  } else if (now >= startDateTime && now <= endDateTime) {
    return 'ongoing';
  } else {
    return 'completed';
  }
};
