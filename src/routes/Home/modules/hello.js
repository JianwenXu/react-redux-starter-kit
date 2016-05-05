import { get } from '../../netUtil';

// ------------------------------------
// Constants
// ------------------------------------
export const SAY_HELLO = 'SAY_HELLO';

// ------------------------------------
// Actions
// ------------------------------------
export function hello (value = initialState) {
  return {
    type: SAY_HELLO,
    payload: value
  };
}

/**
 * This is a thunk, meaning it is a function that immediately
 * returns a function for lazy evaluation. It is incredibly useful for
 * creating async actions, especially when combined with redux-thunk!
 *
 * NOTE: This is solely for demonstration purposes. In a real application,
 * you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
 * reducer take care of this logic.
 */
export const sayHello = () => {
  return (dispatch, getState) => {
    return get('/say', null,
      (json) => {
        const hasError = json.errcode !== 0;
        dispatch(hello({
          message: hasError ? json.errmsg : json.data.msg
        }));
      },
      (err) => {
        dispatch(hello({
          message: (__DEBUG__ && err.message) ? err.message : 'NET ERROR!'
        }));
      }
    );
  };
};

export const actions = {
  hello,
  sayHello
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SAY_HELLO]: (state, action) => {
    const { message } = action.payload;
    return { message };
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  message: 'Welcome!'
};
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
