import React, { Component } from 'react'
import { List, Button, Form, Input } from 'semantic-ui-react'
import API from "../../Helpers/API";
import { toast } from 'react-semantic-toasts';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      resetToggle: false,
      newPassword1: '',
      newPassword2: '',
      aliasToggle: false,
      user: {},
      newAlias: '',
    }
  }

  componentDidMount () {
    this.getUserProfile()
  }
  
  getUserProfile = () => {
    let header = {
      Authorization: 'TOKEN ' + localStorage.getItem('LOGBOOK_AUTH_TOKEN')
    }
    API.get('api/user/auth/user/', {headers: header})
    .then( res => {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log(res)
      }
      this.setState({
        user: res.data
      })
    })
    .catch( err => {
      console.log(err)
    })
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


  editAlias = () => {
    let data = {
      alias: this.state.newAlias,
      email: this.state.user.email
    }
    let header = {
      Authorization: 'TOKEN ' + localStorage.getItem('LOGBOOK_AUTH_TOKEN')
    }
    API.put('api/user/auth/user/', data, {headers: header})
    .then( res => {
      this.getToast('updated alias', 'success')
      this.setState({
        aliasToggle: false
      })
      this.getUserProfile()
    })
    .catch( err => {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log(err.response)
      }
      this.getToast('something went wrong. please try again later.', 'error')
    })
  }

  handleSubmit = () => {
    let data = {
      new_password1: this.state.newPassword1,
      new_password2: this.state.newPassword2,
    }
    let header = {
      Authorization: 'TOKEN ' + localStorage.getItem('LOGBOOK_AUTH_TOKEN')
    }
    API.post('api/user/auth/password/change/', data, {headers: header})
    .then( res => {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log(res)
      }
      this.getToast(res.data.detail, 'success')
    })
    .catch( err => {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log(err.response)
      }
      switch(err.response.stats) {
        case 400:
          this.getToast('two password does not match', 'error')
          break
        case 500:
          this.getToast('something went wrong. please try again later.', 'error')
          break
        default:
          break
      }
    })
  }

  render() {
    return (
      <div className="singleForm">
        <List>
          <List.Item icon='envelope' content={this.state.user.email} />
        </List>
        <List>
          <List.Item>
            <List.Icon name='user' />
            <List.Content>
              {this.state.user.alias}&nbsp;  
              {
                !this.state.aliasToggle &&
                <span onClick={() => this.setState({aliasToggle: true})}><i>(edit)</i></span>
              }
            </List.Content>
            {
                this.state.aliasToggle &&
                <div className="my_button_wrapper">
                  <Input 
                    className="my_input_inline"
                    focus
                    placehoder="new alias"
                    value={this.state.newAlias}
                    onChange={(e) => this.setState({
                      newAlias: e.target.value
                    })}
                  />
                  <Button
                    className="my_button"
                    onClick={() => this.editAlias()}
                  >confirm</Button>
                  <Button 
                    className="my_button"
                    onClick={() => this.setState({
                      aliasToggle: false
                    })}
                  >cancel</Button>
                </div>
              }
          </List.Item>
        </List>
        <div style={{marginTop: 10}}>
          { 
            this.state.resetToggle && 
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <label>New password</label>
                <Form.Input
                  type="password"
                  required={true}
                  value={this.state.newPassword1}
                  onChange={(e) => this.setState({
                    newPassword1: e.target.value
                  })}
                />
              </Form.Field>
              <Form.Field>
                <label>Confirm password</label>
                <Form.Input
                  type="password"
                  required={true}
                  value={this.state.newPassword2}
                  onChange={(e) => this.setState({
                    newPassword2: e.target.value
                  })}
                />
              </Form.Field>
              <div className="my_button_wrapper"><Button className="my_button" type='submit'>submit</Button></div>
            </Form>
          }
          {
            !this.state.aliasToggle &&
            <div className="my_button_wrapper">
              <Button
                className="my_button"
                onClick={() => this.setState({
                  resetToggle: !this.state.resetToggle
                })}
              >{ this.state.resetToggle ? 'cancel' : 'reset password'}</Button>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default Profile;