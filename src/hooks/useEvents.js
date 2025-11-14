import { useState, useEffect } from 'react';
import axios from 'axios';

// Event API URL - can be moved to config if needed
const EVENT_API_URL = 'http://14.195.152.244:9009';

/**
 * Custom hook to fetch events from the API
 * @returns {Object} { events, loading, error, refetch }
 */
export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // No authentication required for this endpoint
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.get(`${EVENT_API_URL}/api/event/`, config);
      
      // Handle paginated response
      if (response.data && response.data.results) {
        setEvents(response.data.results);
      } else if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
  };
};

