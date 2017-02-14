import makeReducer from 'store/makeReducer';

// ------------------------------------
// Constants
// ------------------------------------
export const SAY_HELLO = 'SAY_HELLO';
export const SAY_HELLO_SUCCESS = SAY_HELLO + '_SUCCESS';
export const SAY_HELLO_FAIL = SAY_HELLO + '_FAIL';

// ------------------------------------
// Actions
// ------------------------------------
export function hello(value = initialState) {
  return {
    type: SAY_HELLO,
    payload: value
  };
}

export const sayHello = () => {
  return {
    types: [SAY_HELLO, SAY_HELLO_SUCCESS, SAY_HELLO_FAIL],
    promise: (client) => client.get('/say')
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
    return { message: 'LOADING...' };
  },
  [SAY_HELLO_SUCCESS]: (state, action) => {
    const { data } = action.payload;
    return { message: data.msg };
  },
  [SAY_HELLO_FAIL]: (state, action) => {
    const { errmsg } = action.payload;
    return { message: errmsg || 'NET ERROR!' };
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  message: 'Welcome!'
};
const helloReducer = makeReducer(ACTION_HANDLERS, initialState);
export default helloReducer;
