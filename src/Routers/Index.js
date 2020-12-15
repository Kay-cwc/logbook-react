import React, { Component } from 'react'
import {
  Route,
} from 'react-router-dom';
import Login from "../Components/User/Login";
import Register from "../Components/User/Register";
import Profile from "../Components/User/Profile";
import UserList from "../Components/User/UserList";

import LogContainer from "../Components/Log/Index";

import TaskContainer from "../Components/Task/TaskList";
import TaskDetailsContainer from "../Components/Task/TaskDetails";



export default class MyRouter extends Component {
  render() {
    return (
      <div className="bodyContainer" >
        <Route exact path="/" component={Login} />
        <Route path="/team/" component={UserList} />
        <Route path="/profile" component={Profile} />
        <Route path="/register" component={Register} />

        <Route path="/log" component={LogContainer} />

        <Route path="/task" component={TaskContainer} />
        <Route path="/details" component={TaskDetailsContainer} />
      </div>
    )
  }
}
