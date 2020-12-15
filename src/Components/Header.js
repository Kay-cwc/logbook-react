import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-semantic-toasts';
import { withRouter } from "react-router"

import API from "../Helpers/API";

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getToast = (msg, status) => {
    toast({
      title: msg,
      type: status,
      time: 5000,
      icon: 'envelope',
      size: 'mini',
    })
  }

  logout = (history) => {
    let header = {
      Authorization: 'TOKEN ' + localStorage.getItem('LOGBOOK_AUTH_TOKEN')
    }
    let data = {};
    API.post(`api/user/auth/logout/`, data, {headers: header})
    .then( res => {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log(res)
      }
      this.getToast(res.data.detail, 'success')
      localStorage.removeItem('LOGBOOK_AUTH_TOKEN')
      history.push('/')
    })
    .catch(err => {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log(err.response)
      }
      localStorage.removeItem('LOGBOOK_AUTH_TOKEN')
      history.push('/')
    })
  }

  render() {

    const { history } = this.props;

    return (

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link className="nav-item nav-link active" to="/" ><span role='img' aria-label='icon'>🦝</span></Link>
            {
              history.location.pathname !== '/' &&
              <Fragment>
                <Link className="nav-item nav-link active" to="/profile">Profile</Link>
                <Link className="nav-item nav-link active" to="/team">Team</Link>
                {/* <Link className="nav-item nav-link active" to="/log">Log</Link> */}
                <Link className="nav-item nav-link active" to="/task">Task</Link>
                <Link
                  className="nav-item nav-link active"
                  onClick={() => {
                    this.logout(history)
                  }}
                >Logout</Link>
              </Fragment>
            }
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(Header);
