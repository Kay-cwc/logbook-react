import md5 from 'md5';
import React, { Component } from 'react'
import { toast } from 'react-semantic-toasts';
import { Button, Form } from 'semantic-ui-react';
import API from "../../Helpers/API";

class LogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);
    let data = {
      email: this.state.email,
      password: md5(this.state.password),
    }
    API.post('api/user/auth/login/', data)
      .then(res => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.log(res)
        }
        localStorage.setItem('LOGBOOK_AUTH_TOKEN', res.data.key)
        toast({
          title: 'login success',
          type: 'success',
          time: 5000,
          icon: 'envelope',
          size: 'mini',
        })
        this.props.history.push('/profile')
      })
      .catch(err => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.log(err)
        }
      })
  }

  render() {
    return (
      <div className="singleForm">
        <div>
          <h1>create task</h1>
        </div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Email</label>
            <Form.Input
              type="text"
              value={this.state.email}
              onChange={(e) => this.setState({
                email: e.target.value
              })}
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <Form.Input
              type="password"
              value={this.state.password}
              onChange={(e) => this.setState({
                password: e.target.value
              })}
            />
          </Form.Field>
          <div className="my_button_wrapper">
            <Button className='my_button' type="submit">log in</Button>
          </div>
        </Form>
        <div className="my_button_wrapper">
          <Button secondary className='my_button' onClick={() => this.props.history.push('/user/register')}>doesn't have an account?</Button>
        </div>
      </div>
    )
  }
}

export default LogContainer;