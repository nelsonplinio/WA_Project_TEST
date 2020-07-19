import React from 'react';
import { Switch, Route } from 'react-router-dom';

import OrderList from './List';

const Orders: React.FC = () => {
  return (
    <Switch>
      <Route path='/' component={OrderList} />
    </Switch>
  );
};

export default React.memo(Orders);
