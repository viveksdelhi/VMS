// Default detection triggers for each event type based on relevancy
export const DEFAULT_EVENT_TRIGGERS = {
  // Fire Detection Events
  'video-fire-detection': {
    name: 'Fire Detection',
    conditions: [
      { object: 'Fire', operator: '>=', threshold: 1 },
      { object: 'Flame', operator: '>=', threshold: 1 }
    ],
    description: 'Default trigger for fire detection - alerts when fire or flame is detected'
  },
  
  // Smoke Detection Events
  'video-smoke-detection': {
    name: 'Smoke Detection',
    conditions: [
      { object: 'Smoke', operator: '>=', threshold: 1 },
      { object: 'Fire', operator: '>=', threshold: 1 }
    ],
    description: 'Default trigger for smoke detection - alerts when smoke or fire is detected'
  },
  
  // Crowd-based Events
  'crowding-detection': {
    name: 'Crowd Density Alert',
    conditions: [
      { object: 'Person', operator: '>', threshold: 5 },
      { object: 'Group', operator: '>=', threshold: 2 }
    ],
    description: 'Default trigger for crowding detection - alerts when more than 5 people or 2+ groups detected'
  },
  
  'crowd-counting': {
    name: 'High Crowd Count',
    conditions: [
      { object: 'Person', operator: '>', threshold: 5 },
      { object: 'Adult', operator: '>', threshold: 3 }
    ],
    description: 'Default trigger for crowd counting - alerts when more than 5 people or 3+ adults detected'
  },
  
  'crowd-flow-detection': {
    name: 'Crowd Flow Alert',
    conditions: [
      { object: 'Person', operator: '>', threshold: 3 },
      { object: 'Group', operator: '>=', threshold: 1 }
    ],
    description: 'Default trigger for crowd flow detection - alerts when more than 3 people or groups detected'
  },
  
  // Security Events
  'tripwire': {
    name: 'Tripwire Breach',
    conditions: [
      { object: 'Person', operator: '>=', threshold: 1 },
      { object: 'Vehicle', operator: '>=', threshold: 1 }
    ],
    description: 'Default trigger for tripwire - alerts when person or vehicle crosses the line'
  },
  
  'trespass': {
    name: 'Trespass Detection',
    conditions: [
      { object: 'Person', operator: '>=', threshold: 1 },
      { object: 'Animal', operator: '>=', threshold: 1 }
    ],
    description: 'Default trigger for trespass detection - alerts when person or animal enters restricted area'
  },
  
  'loitering-detection': {
    name: 'Loitering Alert',
    conditions: [
      { object: 'Person', operator: '>=', threshold: 1 },
      { object: 'Group', operator: '>=', threshold: 1 }
    ],
    description: 'Default trigger for loitering detection - alerts when person or group loiters in area'
  },
  
  'tailgating-detection': {
    name: 'Tailgating Alert',
    conditions: [
      { object: 'Person', operator: '>=', threshold: 2 },
      { object: 'Vehicle', operator: '>=', threshold: 1 }
    ],
    description: 'Default trigger for tailgating detection - alerts when multiple people or vehicles detected'
  },
  
  // Object Detection Events
  'left-object-detection': {
    name: 'Abandoned Object Alert',
    conditions: [
      { object: 'Bag', operator: '>=', threshold: 1 },
      { object: 'Box', operator: '>=', threshold: 1 },
      { object: 'Suitcase', operator: '>=', threshold: 1 }
    ],
    description: 'Default trigger for left object detection - alerts when bags, boxes, or suitcases are left unattended'
  },
  
  'missing-object-detection': {
    name: 'Missing Object Alert',
    conditions: [
      { object: 'Laptop', operator: '>=', threshold: 1 },
      { object: 'Chair', operator: '>=', threshold: 1 },
      { object: 'TV', operator: '>=', threshold: 1 }
    ],
    description: 'Default trigger for missing object detection - alerts when laptops, chairs, or TVs are missing'
  },
  
  // Camera Events
  'camera-tampering': {
    name: 'Camera Tampering Alert',
    conditions: [
      { object: 'Camera Covered', operator: '>=', threshold: 1 },
      { object: 'Camera Moved', operator: '>=', threshold: 1 }
    ],
    description: 'Default trigger for camera tampering - alerts when camera is covered or moved'
  },
  
  // PTZ Events
  'continuous-auto-ptz-tracking': {
    name: 'Auto Tracking Alert',
    conditions: [
      { object: 'Person', operator: '>=', threshold: 1 },
      { object: 'Car', operator: '>=', threshold: 1 }
    ],
    description: 'Default trigger for continuous PTZ tracking - alerts when person or car is tracked'
  },
  
  'ptz-handoff': {
    name: 'PTZ Handoff Alert',
    conditions: [
      { object: 'Person', operator: '>=', threshold: 1 }
    ],
    description: 'Default trigger for PTZ handoff - alerts when person is handed off between cameras'
  },
  
  'ptz-preset-position-analytics': {
    name: 'PTZ Preset Alert',
    conditions: [
      { object: 'Vehicle', operator: '>=', threshold: 1 },
      { object: 'Bicycle', operator: '>=', threshold: 1 }
    ],
    description: 'Default trigger for PTZ preset analytics - alerts when vehicles or bicycles are detected at preset positions'
  },
  
  // Safety Events
  'slip-fall-detection': {
    name: 'Slip & Fall Alert',
    conditions: [
      { object: 'Person', operator: '>=', threshold: 1 }
    ],
    description: 'Default trigger for slip and fall detection - alerts when person is detected in fall position'
  }
};

// Helper function to get default triggers for an event type
export const getDefaultTriggers = (eventType) => {
  return DEFAULT_EVENT_TRIGGERS[eventType] || null;
};

// Helper function to get all default triggers
export const getAllDefaultTriggers = () => {
  return DEFAULT_EVENT_TRIGGERS;
};

// Helper function to check if an event type has default triggers
export const hasDefaultTriggers = (eventType) => {
  return eventType in DEFAULT_EVENT_TRIGGERS;
};

