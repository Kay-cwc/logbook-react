import React, { Component } from 'react'
import { Button, Form } from 'semantic-ui-react';
import API from "../../Helpers/API";
import { toast } from 'react-semantic-toasts';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'kaytonchiu@techture.com',
      password1: 'workW37techture',
      password2: 'workW37techture',
      alias: 'kayton tt',
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

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.password1 !== this.state.password2) {
      this.getToast('The password does not match.', 'error')
      return true
    }
    if ( this.state.password1.length < 8 || this.state.password2.length < 8 ) {
      this.getToast('The password must contain at least 8 characters.', 'error')
      return true
    }
    let data = {
      email: this.state.email,
      password1: this.state.password1,
      password2: this.state.password2,
      alias: this.state.alias,
    }
    API.post('/api/user/auth/registration', data)
      .then(res => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.log(res)
        }
        this.getToast('User created.', 'success')
        localStorage.setItem('LOGBOOK_AUTH_TOKEN', res.data.key)
        this.props.history.push('/profile')
      })
      .catch(err => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.log(err.response.data)
        }
        for (const [key, value] of Object.entries(err.response.data)) {
          this.getToast(value, 'error')
        }
      })
  }

  render() {
    return (
      <div className="singleForm">
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Email</label>
            <input
              type="text"
              value={this.state.email}
              onChange={(e) => this.setState({
                email: e.target.value
              })}
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input
              type="password"
              value={this.state.password1}
              onChange={(e) => this.setState({
                password1: e.target.value
              })}
            />
          </Form.Field>
          <Form.Field>
            <label>Confirm Password</label>
            <input
              type="password"
              value={this.state.password2}
              onChange={(e) => this.setState({
                password2: e.target.value
              })}
            />
          </Form.Field>
          <Form.Field>
            <label>Alias</label>
            <input
              type="text"
              value={this.state.alias}
              onChange={(e) => this.setState({
                alias: e.target.value
              })}
            />
          </Form.Field>
          <div className="my_button_wrapper">
            <Button type="submit">sign up</Button>
          </div>
        </Form>
        <div className="my_button_wrapper">
          <Button className="my_button" secondary onClick={() => this.props.history.push('/')}>log in with my account instead</Button>
        </div>
      </div>
    )
  }
}

export default Register;