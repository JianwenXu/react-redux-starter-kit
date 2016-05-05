import React from 'react';
import { IndexLink, Link } from 'react-router';
import classes from './Header.scss';

export const Header = () => (
  <div>
    <h1>React Redux Starter Kit</h1>
    <IndexLink to='/' activeClassName={classes.route}>
      Home
    </IndexLink>
    {' · '}
    <Link to='/counter' activeClassName={classes.route}>
      Counter
    </Link>
  </div>
);

export default Header;
