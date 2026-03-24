/**
 * Redux-style Action
 * Base class for all actions
 */
export class Action {
  constructor(public type: string, public payload?: any) { }
}

/**
 * User Action: Load Users
 */
export class LoadUsers extends Action {
  constructor(payload?: any) {
    super('[User] Load Users', payload);
  }
}

/**
 * User Action: Load Users Success
 */
export class LoadUsersSuccess extends Action {
  constructor(payload: any[]) {
    super('[User] Load Users Success', payload);
  }
}

/**
 * User Action: Load Users Failure
 */
export class LoadUsersFailure extends Action {
  constructor(payload: string) {
    super('[User] Load Users Failure', payload);
  }
}

/**
 * User Action: Update User
 */
export class UpdateUser extends Action {
  constructor(payload: any) {
    super('[User] Update User', payload);
  }
}

/**
 * User Action: Delete User
 */
export class DeleteUser extends Action {
  constructor(userId: string) {
    super('[User] Delete User', userId);
  }
}

/**
 * User State
 */
export interface UserState {
  users: any[];
  selectedUser: any;
  loading: boolean;
  error: string | null;
}

/**
 * Initial User State
 */
export const initialUserState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null
};

/**
 * User Reducer
 * Pure function to handle user state transitions
 */
export const userReducer = (state: UserState = initialUserState, action: Action): UserState => {
  switch (action.type) {
    case '[User] Load Users':
      return {
        ...state,
        loading: true,
        error: null
      };
    case '[User] Load Users Success':
      return {
        ...state,
        users: action.payload,
        loading: false,
        error: null
      };
    case '[User] Load Users Failure':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case '[User] Update User':
      return {
        ...state,
        users: state.users.map(u =>
          u.id === action.payload.id ? action.payload : u
        )
      };
    case '[User] Delete User':
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.payload)
      };
    default:
      return state;
  }
};
