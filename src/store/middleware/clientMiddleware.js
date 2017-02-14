export default function clientMiddleware(client) {
  return ({dispatch, getState}) => {
    return next => action => {
      const { promise, types, ...rest } = action;
      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({...rest, type: REQUEST});

      const actionPromise = promise(client);
      actionPromise.then(
        (result) => {
          const success = result.errcode === 0 && result.ret === 0;
          return next({
            ...rest,
            payload: result,
            type: success ? SUCCESS : FAILURE
          });
        },
        (error) => next({
          ...rest,
          payload: error,
          type: FAILURE
        })
      ).catch((error) => {
        if (__DEV__) {
          console.error('MIDDLEWARE ERROR:', error);
          throw error;
        }
        next({
          ...rest,
          payload: {
            errcode: -1,
            errmsg: error.message,
            data: error
          },
          type: FAILURE
        });
      });

      return actionPromise;
    };
  };
}
