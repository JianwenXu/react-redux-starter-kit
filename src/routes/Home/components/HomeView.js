import React, { PropTypes } from 'react';
import DuckImage from '../assets/Duck.jpg';
import classes from './HomeView.scss';

const HomeView = (props) => (
  <div>
    <h4>{props.message}</h4>
    <img
      alt='This is a duck, because Redux!'
      className={classes.duck}
      src={DuckImage} />
    <button className='btn btn-default' onClick={props.sayHello}>
      Get message from server
    </button>
  </div>
);

HomeView.propTypes = {
  message: PropTypes.string.isRequired,
  sayHello: PropTypes.func.isRequired
};

export default HomeView;
