export const API_ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY: '/verify',
    PROFILE: '/profile'
  },
  
  VEHICLES: {
    LIST: '/',
    DETAIL: '/:vehicule_id',
    CREATE: '/',
    UPDATE: '/:vehicule_id',
    DELETE: '/:vehicule_id'
  },
  
  DOSSIERS: {
    LIST: '/api/dossiers',
    UPLOAD: '/api/dossiers/upload',
    STATUS: '/api/dossiers/:id/status',
    DETAIL: '/api/dossiers/:id'
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