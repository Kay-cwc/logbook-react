import React, { Component } from 'react'
import { Button, Form, Modal, Header } from 'semantic-ui-react';
import API from "../../Helpers/API";


export default class CreateLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      detail: '',
      taskList: [],
    }
  }


  componentDidMount () {
    switch(this.props.logType) {
      case 'EDIT':
        if (this.props.logData.length > 0) {
          this.setState({
            subject: this.props.logData[0].subject,
            detail: this.props.logData[0].detail,
          })
        }
        break
      default:
        console.log('create')
    }
  }

  
  handleSubmit = (event) => {
    let data = {}
    let url = 'api/logs/logs/'
    let method = 'post'
    event.preventDefault();
    if (this.props.logType === 'CREATE') {
      data = {
        subject: this.state.subject,
        detail: this.state.detail,
        project: this.props.taskid 
      }
    } else if (this.props.logType === 'EDIT') {      
      data = {
        subject: this.state.subject,
        detail: this.state.detail,
        id: this.props.logId,
      }
      url = `api/logs/logs/${this.props.logId}/`
      method = 'put'
    }
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      console.log(data)
      console.log(this.props.logData)
    }
    let header = {
      Authorization: 'TOKEN ' + localStorage.getItem('LOGBOOK_AUTH_TOKEN')
    }
    API({
      method: method,
      url: url,
      data: data,
      headers: header
    }).then(res => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.log(res)
        }
        let message = ''
        switch(this.props.logType) {
          case 'CREATE':
            message = 'log created'
            break
          case 'EDIT':
            message = 'log edited'
            break
          default:
            console.log('create')
        }
        this.props.getToast(message, 'success') 
        this.props.closeLogModal()
        this.props.getLogs(this.props.taskid) 
      })
      .catch(err => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.log(err)
        }
      })
  }
  render() {
    return (
      <div>
          <Header content="create logs" />
          <Form onSubmit={this.handleSubmit} className="my_form">
            <Modal.Content>
                <Form.Field>
                  <label>subject</label>
                  <Form.Input
                    type="text"
                    value={this.state.subject}
                    onChange={(e) => this.setState({
                      subject: e.target.value
                    })}
                  />
                </Form.Field>
                <Form.Field>
                  <label>description</label>
                  <Form.TextArea
                    style={{minHeight: 300}}
                    value={this.state.detail}
                    onChange={(e) => this.setState({
                      detail: e.target.value
                    })}
                  />
                </Form.Field>
            </Modal.Content>
            <Modal.Actions>
              <div className="my_button_wrapper">
                <Button
                  className="my_button my_button_negative"
                  type="button"
                  onClick={() => this.props.closeLogModal()}
                >
                  close
                </Button>
              </div>
              <div className="my_button_wrapper">
                <Button
                  className="my_button my_button_positive"
                  type="submit"
                >
                  submit
                </Button>
              </div>          
            </Modal.Actions>
          </Form>
      </div>
    )
  }
}
