import React, { Component } from 'react'
import { toast } from 'react-semantic-toasts';
import { Button, Container, Table, Modal} from 'semantic-ui-react';
import API from "../../Helpers/API";
import CreateTask from "./CreateTask";

class TaskContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: 'subject01',
      description: 'description01',
      modalToggle: false,
      taskList: [],
      role: 'ANONYMOYS'
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);
    let data = {
      subject: this.state.subject,
      description: this.state.description,
    }
    let header = {
      Authorization: 'TOKEN ' + localStorage.getItem('LOGBOOK_AUTH_TOKEN')
    }
    API.post('api/logs/tasks/', data, {headers: header})
      .then(res => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.log(res)
        }
        toast({
          title: res.data.data,
          type: 'success',
          time: 5000,
          icon: 'envelope',
          size: 'mini',
        })
        this.getTask()
        this.setState({
          createToggle: false
        })
      })
      .catch(err => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.log(err)
        }
      })
  }

  componentDidMount () {
    this.getTask()
    localStorage.removeItem('editorData')
  }

  getTask = () => {
    let header = {
      Authorization: 'TOKEN ' + localStorage.getItem('LOGBOOK_AUTH_TOKEN')
    }
    API.get('api/logs/tasks/', {headers: header})
    .then( res => {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log(res)
      }
      this.setState({
        taskList: res.data.data,
        role: res.data.accessRight
      })
    })
    .catch( err => {
      console.log(err)
    })
  }

  createTaskToggler = () => {
    this.setState({
      modalToggle: false
    })
  }

  render() {
    let taskList = this.state.taskList.map( (list) => {
      return (
        <Table.Row >
          <Table.Cell verticalAlign="middle">{list.subject}</Table.Cell>
          <Table.Cell id={list.created_by} verticalAlign="middle">{list.created_by.alias}</Table.Cell>
          <Table.Cell id={list.id} verticalAlign="middle">
            <Button
              onClick={() => {
                this.props.history.push(`/details?taskid=${list.id}`)
              }}
            >
              View
            </Button>
          </Table.Cell>
        </Table.Row>
      )
    }) 

    let taskForm = function() {
      return (
        <Modal
          onOpen={this.createToggle(true)}
        />
      )
    }
    return (
      <Container className="my_container">
        <div className="row">
          <div className='my_title_wrapper col align-self-start'>
            <h1>My task</h1>
          </div>
          <div className="col align-self-end">
            <div className="my_button_wrapper my_button_right">
              { this.state.role === 'MANAGER' && 
                <Button
                  className="my_button"
                  onClick={() => {
                    this.setState({
                      modalToggle: !this.state.modalToggle
                    })
                  }}
                >{ this.state.modalToggle ? 'cancel' : 'create task'}</Button>
              }
            </div>
          </div>
        </div>
        <Table inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={10}>task</Table.HeaderCell>
              <Table.HeaderCell>created by</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {taskList}
          </Table.Body> 
        </Table> 
        <Modal 
          open={this.state.modalToggle}
          size="fullscreen"
          className="my_modal"
        >       
          <CreateTask 
            createTaskToggler={this.createTaskToggler} 
            getTask={this.getTask}
          />
        </Modal>
      </Container>
    )
  }
}

export default TaskContainer;