/**
 * Redux-style Action
 * Base class for all actions
 */
export class Action {
  constructor(public type: string, public payload?: any) { }
}

/**
 * Auth Action: Login Success
 */
export class LoginSuccess extends Action {
  constructor(payload: any) {
    super('[Auth] Login Success', payload);
  }
}

/**
 * Auth Action: Logout
 */
export class Logout extends Action {
  constructor() {
    super('[Auth] Logout');
  }
}

/**
 * Auth State
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Initial Auth State
 */
export const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null
};

/**
 * Auth Reducer
 * Pure function to handle auth state transitions
 */
export const authReducer = (state: AuthState = initialAuthState, action: Action): AuthState => {
  switch (action.type) {
    case '[Auth] Login Success':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
    case '[Auth] Logout':
      return initialAuthState;
    default:
      return state;
  }
};
