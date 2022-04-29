// Developed by Luis Diplan All Rights Reserved 2022

import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import UserDashboard from '../Pages/UserDashboard';
import AdminDashboard from '../Pages/AdminDashboard';
import Login from '../Pages/Login';
import Products from '../Pages/Products';
import Invoices from '../Pages/Invoices';
import Users from '../Pages/Users';
import NewInvoice from '../Pages/NewInvoice';

export default function Routes(){
    return(
        <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Login}/>
            <Route exact path="/udashboard" component={UserDashboard}/>
            <Route exact path="/adashboard" component={AdminDashboard} />
            <Route exact path="/products" component={Products} />
            <Route exact path="/invoices" component={Invoices} />
            <Route exact path="/Users" component={Users} />
            <Route exact path="/newInvoice" component={NewInvoice} />
        </Switch>
        </BrowserRouter>
    )
}