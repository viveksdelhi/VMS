import React, { createContext, useContext, useState, useEffect } from 'react';
import { slugify } from '../utils/slugify';

const CustomEventContext = createContext();

export const useCustomEvents = () => {
  const context = useContext(CustomEventContext);
  if (!context) {
    throw new Error('useCustomEvents must be used within a CustomEventProvider');
  }
  return context;
};

export const CustomEventProvider = ({ children }) => {
  const [customEvents, setCustomEvents] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load custom events from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('customEvents');
    const hasBeenInitialized = localStorage.getItem('customEventsInitialized');
    
    
    if (saved) {
      try {
        const parsedEvents = JSON.parse(saved);
        setCustomEvents(parsedEvents);
        setIsInitialized(true);
        // Set the initialized flag if it's not set
        if (!hasBeenInitialized) {
          localStorage.setItem('customEventsInitialized', 'true');
        }
      } catch (error) {
        console.error('Error loading custom events:', error);
        setCustomEvents([]);
        localStorage.setItem('customEventsInitialized', 'true');
      }
    } else {
      // No saved data - check if this is first time or if user cleared everything
      if (!hasBeenInitialized) {
        // First time - load sample events
        const sampleEvents = [
          {
            id: 1,
            name: 'High Traffic Detection',
            conditions: [
              { object: 'Person', operator: '>', threshold: 5 },
              { object: 'Vehicle', operator: '>=', threshold: 3 }
            ],
            cameras: [1, 2, 3],
            scheduling: {
              dateRange: {
                startDate: '',
                endDate: ''
              },
              specificDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              timeRange: {
                startTime: '08:00',
                endTime: '18:00'
              },
              isEnabled: true
            },
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            name: 'Security Alert',
            conditions: [
              { object: 'Person', operator: '>', threshold: 1 },
              { object: 'Bag', operator: '>=', threshold: 1 }
            ],
            cameras: [1, 2],
            scheduling: null,
            createdAt: new Date().toISOString()
          },
          {
            id: 3,
            name: 'Vehicle Monitoring',
            conditions: [
              { object: 'Car', operator: '>', threshold: 2 },
              { object: 'Bus', operator: '>=', threshold: 1 }
            ],
            cameras: [2, 3],
            scheduling: {
              dateRange: {
                startDate: '2024-01-01',
                endDate: '2024-12-31'
              },
              specificDays: ['Saturday', 'Sunday'],
              timeRange: {
                startTime: '06:00',
                endTime: '22:00'
              },
              isEnabled: true
            },
            createdAt: new Date().toISOString()
          }
        ];
        setCustomEvents(sampleEvents);
        setIsInitialized(true);
        localStorage.setItem('customEventsInitialized', 'true');
      } else {
        // App was initialized before but no saved data - start empty
        setCustomEvents([]);
        setIsInitialized(true);
      }
    }
  }, []);

  // Save custom events to localStorage whenever they change
  useEffect(() => {
    // Only save after initialization is complete
    if (isInitialized) {
      localStorage.setItem('customEvents', JSON.stringify(customEvents));
    }
  }, [customEvents, isInitialized]);

  const addCustomEvent = (eventData) => {
    // Get the next sequential ID, ensuring it's unique
    const nextId = customEvents.length > 0 ? Math.max(...customEvents.map(e => e.id)) + 1 : 1;
    
    const newEvent = {
      id: nextId,
      name: eventData.name,
      description: eventData.description || null,
      tags: eventData.tags || [],
      presetEvents: eventData.presetEvents || [],
      conditions: eventData.conditions,
      cameras: eventData.cameras,
      scheduling: eventData.scheduling || null,
      createdAt: new Date().toISOString()
    };
    setCustomEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const removeCustomEvent = (eventId) => {
    setCustomEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const updateCustomEvent = (eventId, updatedData) => {
    setCustomEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, ...updatedData, updatedAt: new Date().toISOString() }
        : event
    ));
  };

  const clearAllCustomEvents = () => {
    setCustomEvents([]);
    localStorage.removeItem('customEvents');
    localStorage.removeItem('customEventsInitialized');
  };

  const getCustomEventsForSidebar = () => {
    return customEvents.map(event => ({
      key: `custom_${event.id}`,
      label: event.name,
      path: `/analytics/event/${slugify(event.name)}`,
      isCustom: true
    }));
  };

  const getCustomEventBySlug = (slug) => {
    return customEvents.find(event => slugify(event.name) === slug);
  };

  return (
    <CustomEventContext.Provider value={{
      customEvents,
      addCustomEvent,
      removeCustomEvent,
      updateCustomEvent,
      clearAllCustomEvents,
      getCustomEventsForSidebar,
      getCustomEventBySlug
    }}>
      {children}
    </CustomEventContext.Provider>
  );
};
