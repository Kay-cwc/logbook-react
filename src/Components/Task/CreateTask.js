import React, { Component } from 'react'
import { Button, Form, Modal, Header, Label, Icon } from 'semantic-ui-react';
import API from "../../Helpers/API";
import { toast } from 'react-semantic-toasts';
import SearchBar from "./SearchBar";
import MyEditor from "../../Helpers/TextEditor";


export default class CreateTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      description: '',
      collaborator:[],
      taskList: [],
      status: 'OP',
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
    let task_members = [];
    this.state.collaborator.forEach( (member) => {
      task_members.push(member.id)
    })
    console.log(this.state.description)
    let data = {
      subject: this.state.subject,
      description: this.state.description,
      task_members: task_members.join(),
      status: this.state.status
    }
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      console.log(data)
    }
    let header = {
      Authorization: 'TOKEN ' + localStorage.getItem('LOGBOOK_AUTH_TOKEN')
    }
    let url = 'api/logs/tasks/'
    let method = 'post'
    if (this.props.editToggle) {
      url = url + this.props.taskid + '/'
      method = "put"
    }
    API({
      method: method,
      url: url, 
      data: data, 
      headers: header
    })
      .then(res => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.log(res)
        }
        let message = 'task created'
        if (this.props.editToggle) {
          message = 'task updated'
          this.props.getTask(this.props.taskid)
        } else {
          this.props.getTask()
        }
        this.getToast(message, 'success')
        this.props.createTaskToggler()     
      })
      .catch(err => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.log(err.response)
        }
        this.getToast(err.response.data.data, 'error')
      })
  }

  componentDidMount () {
    if (this.props.editToggle) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log('editing')
      }
      let header = {
        Authorization: 'TOKEN ' + localStorage.getItem('LOGBOOK_AUTH_TOKEN')
      }
      API.get(`api/logs/tasks/${this.props.taskid}`, {headers: header})
        .then( res => {
          if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            console.log(res)
          }
          this.setState({
            subject: res.data.subject,
            description: res.data.description,
            taskMember: res.data.task_members_obj,
            collaborator: res.data.task_members_obj,
            status: res.data.status
          })
        })
        .catch( err => {
          console.log(err)
      })
    }
  }

  selectUser = (user) => {
    console.log(user)
    let validator = this.state.collaborator.filter( val => val.id === user.id)
    console.log(validator.length)
    if (validator.length !== 0) {
      toast({
        title: 'duplicated memeber.',
        type: 'error',
        time: 5000,
        icon: 'envelope',
        size: 'mini',
      })
      return true
    } else {
      console.log('else')
      let newArr = [
        ...this.state.collaborator,
        user
      ]
      console.log(newArr)
      this.setState({
        collaborator: newArr
      })
  }}

  removeUser = (id) => {
    console.log(id)
    let newArr = this.state.collaborator.filter( user => user.id !== id )
    this.setState({
      collaborator: newArr
    })
  }

  storeEditorContent = (data) => {
    this.setState({
      description: data
    })
    console.log(this.state.description)
  }

  render() {
    let Collaborator = this.state.collaborator.map( (user) => {
      return (
        <Label key={user.id}>
          {user.alias}
          <Icon name="close" id={user.id} onClick={ () => this.removeUser(user.id)} />
        </Label>
      )
    })
    return (
      <div>
          <Header content="create new task" />
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
                  {/* <Form.TextArea
                    style={{minHeight: 300}}
                    value={this.state.description}
                    onChange={(e) => this.setState({
                      description: e.target.value
                    })}
                  /> */}
                  <MyEditor
                    storeEditorContent={this.storeEditorContent}
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Select 
                    placeholder='task status'
                    selection
                    defaultValue={
                      !this.props.editToggle ?
                      this.state.status :
                      this.props.taskStatus
                    }
                    options={statusOptions}
                    onChange={(e, {value}) => {
                      this.setState({
                        status: value
                      })
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>collaborators</label>
                  <SearchBar selectUser={this.selectUser} />
                  <div className="my_label">
                  { Collaborator }
                  </div>
                </Form.Field>
            </Modal.Content>
            <Modal.Actions>
              <div className="my_button_wrapper">
                <Button
                  className="my_button my_button_negative"
                  type="button"
                  onClick={() => this.props.createTaskToggler()}
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


const statusOptions = [
  {
    key: 'OP',
    text: 'ON PROGRESS',
    value: 'OP'
  },
  {
    key: 'RE',
    text: 'UNDER REVIEWING',
    value: 'RE'
  },
  {
    key: 'FU',
    text: 'NEED FOLLOW UP',
    value: 'FU'
  },
  {
    key: 'CP',
    text: 'COMPLETED',
    value: 'CP'
  },
]
