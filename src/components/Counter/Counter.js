import React, { PropTypes } from 'react';
import classes from './Counter.scss';

export const Counter = (props) => (
  <div>
    <h2 className={classes.counterContainer}>
      Counter:
      {' '}
      <span className={classes['counter--green']}>
        {props.counter}
      </span>
    </h2>
    <button className='btn btn-default' onClick={props.increment}>
      Increment
    </button>
    {' '}
    <button className='btn btn-default' onClick={props.doubleAsync}>
      Double (Async)
    </button>
  </div>
);

Counter.propTypes = {
  counter: PropTypes.number.isRequired,
  doubleAsync: PropTypes.func.isRequired,
  increment: PropTypes.func.isRequired
};

export default Counter;
