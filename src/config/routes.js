export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    VERIFY: '/api/auth/verify',
    PROFILE: '/api/auth/profile'
  },
  
  VEHICLES: {
    LIST: '/vehicles',
    DETAIL: '/vehicles/:id',
    CREATE: '/vehicles',
    UPDATE: '/vehicles/:id',
    DELETE: '/vehicles/:id'
  },
  
  DOSSIERS: {
    LIST: '/dossiers',
    UPLOAD: '/dossiers/upload',
    STATUS: '/dossiers/:id/status'
  },
  
  RESERVATIONS: {
    LIST: '/reservations',
    CREATE: '/reservations/create',
    DETAIL: '/reservations/:reservation_id',
    UPDATE_STATUS: '/reservations/:reservation_id/status',
    DOCUMENTS: '/reservations/:reservation_id/documents',
    USER_RESERVATIONS: '/reservations/user/:user_id'
  },
  
  FILTERS: {
    VEHICLES: '/filter',
    AVAILABLE: '/available',
    TYPES: '/types'
  },
  
  ADMIN: {
    DOSSIERS: {
      LIST: '/api/admin/dossiers',
      UPDATE_STATUS: '/api/admin/dossiers/:id/status'
    },
    USERS: {
      LIST: '/api/admin/users',
      UPDATE_ROLE: '/api/admin/users/:id/role'
    },
    NOTIFICATIONS: {
      SEND: '/api/admin/notifications'
    },
    VEHICLES: {
      CREATE: '/api/admin/vehicles',
      UPDATE: '/api/admin/vehicles/:id'
    }
  }
}; 