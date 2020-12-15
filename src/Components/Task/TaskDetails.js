import React, { Component } from 'react'
import { toast } from 'react-semantic-toasts';
import { Container, Modal, Label, Icon, Dropdown} from 'semantic-ui-react';
import API from "../../Helpers/API";
import CreateTask from "./CreateTask";
import CreateLog from "./CreateLog";
import { convertFromRaw, Editor, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

class TaskDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalToggle: false,
      task: {
        created_at: '',
        created_by: 0,
        created_by_alias: '',
        description: '',
        id: 0,
        last_update: "",
        status: "",
        subject: "",
        task_members: "",
        task_members_obj: [],
      },
      taskId: 0,
      taskMember: [0],
      taskStatus: 'ON PROGRESS',
      topToggle: true,
      logToggle: false,
      logType: 'CREATE',
      logs: [],
      role: 'EDITOR',
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
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
        const query = new URLSearchParams(this.props.history.location.search)
        this.getTask(query.get('taskid'))
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
    const query = new URLSearchParams(this.props.history.location.search)
    this.getTask(query.get('taskid'))
    this.getLogs(query.get('taskid'))
    this.setState({
      taskid: query.get('taskid')
    })
  }

  getLogs = (taskid) => {
    let header = {
      Authorization: 'TOKEN ' + localStorage.getItem('LOGBOOK_AUTH_TOKEN')
    }
    API.get(`api/logs/logs/?taskid=${taskid}`, {headers: header})
    .then( res => {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log(res)
      }
      this.setState({
        logs: res.data.data.reverse()
      })
    }
  )
    
    .catch( err => {
      console.log(err)
    })
  }

  getTask = (taskid) => {
    let header = {
      Authorization: 'TOKEN ' + localStorage.getItem('LOGBOOK_AUTH_TOKEN')
    }
    API.get(`api/logs/tasks/${taskid}/`, {headers: header})
    .then( res => {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log(res)
      }
      localStorage.setItem('editorData', res.data.description)
      this.setState({
        task: res.data,
        taskMember: res.data.task_members_obj,
        role: res.data.accessRight.toUpperCase()
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

  closeLogModal = () => {
    this.setState({
      logToggle: false
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

  getTaskStatus = () => {
    let myStatus = ''
    let taskClassName = ''
    switch(this.state.task.status) {
      case 'RE':
        myStatus = 'UNDER REVIEW'
        taskClassName = 'my_status'
        break
      case 'FU':
        myStatus = 'FOLLOW UP'
        taskClassName = 'my_status my_status_alert'
        break
      case 'CP':
        myStatus = 'COMPLETED'
        taskClassName = 'my_status my_status_success'
        break
      default:
        myStatus = 'ON PROGRESS'
        taskClassName = 'my_status'
    }
    return (
      <span className={taskClassName}>{myStatus}</span>
    ) 
  }

  descriptionHandler = () => {
    var content = ''
    if (this.state.task.description.length > 0) {
      var rawContent = JSON.parse(this.state.task.description)
      var contentState = convertFromRaw(rawContent);
      var editorState = EditorState.createWithContent(contentState)
      content = stateToHTML(editorState.getCurrentContent())      
    }
    console.log(content)
    return content
  }

  MyLogs = () => {
      const myLog = this.state.logs.map( (log) => {
      return (
        <div className="my_comment">
          <div><h3 className="my_subject">{log.subject}</h3></div>
          <div className="my_comment_meta">
          
            <Icon name="user" />
            {log.created_by.alias} &nbsp;&nbsp;
            <Icon name="clock" />
            {log.created_at.split('T')[0]} &nbsp;
            {log.created_at.split('T')[1].split('.')[0]} &nbsp;&nbsp;
            <span
              style={{cursor: "pointer"}}
              data-logId={log.id}
              onClick={(e) => {
                this.setState({
                  logToggle: true,
                  logType: 'EDIT',
                  logId: e.target.getAttribute('data-logId')
                })
              }}
            >
              <Icon id={log.id} name="edit" />
              {'edit'} 
            </span>
          </div>
          <div>{log.detail}</div>
        </div>
      )
    })
    return myLog
  }

  render() {
    const query = new URLSearchParams(this.props.history.location.search)
    let Collaborator = this.state.taskMember.map( (user) => {
      return (
        <Label key={user.id}>
          {user.alias}
        </Label>
      )
    })
    return (
      <Container className="my_container">

        <div className='row'>
          <div className="col-8">
            <h3 className="my_subject" >
              {this.state.task.subject}
              {this.getTaskStatus()}
            </h3>
          </div>
          <div className="col-4 my_button_wrapper my_button_right">
          <div className="my_button_wrapper my_button_right">
            <Dropdown className="my_button" text="action">
              <Dropdown.Menu direction="left">
                <Dropdown.Item
                  icon="add circle"
                  text="add log"
                  onClick={() => {
                    this.setState({
                      logToggle: true,
                      logType: 'CREATE'
                    })
                  }}
                />
                {
                  this.state.role === 'MANAGER' &&
                  <Dropdown.Item
                    icon="edit"
                    className="my_button"
                    onClick={() => {
                      this.setState({
                        modalToggle: !this.state.modalToggle
                      })
                    }}
                    text={ this.state.modalToggle ? 'cancel' : 'edit task'}
                  />
                }
                <Dropdown.Item
                  icon={
                    this.state.topToggle ?
                    "arrow alternate circle up" :
                    "arrow alternate circle down"
                  }
                  text="collapse"
                  onClick={() => {
                    this.setState({
                      topToggle: !this.state.topToggle
                    })
                  }}
                />
                <Dropdown.Item
                  icon="arrow alternate circle left"
                  className="my_button"
                  onClick={() => this.props.history.push('/task')}
                  text="return"
                />
              </Dropdown.Menu>
            </Dropdown>
          </div>

          </div>
        </div>

        { 
          this.state.topToggle &&
          <div>
            <div dangerouslySetInnerHTML={{__html: this.descriptionHandler()}}></div>
            <div className="my_details"><i>task owner:</i> {this.state.task.created_by.alias}</div>
            <div className="my_details"><i>task members</i></div>
            { Collaborator }


            <div className="my_button_wrapper my_button_group_wrapper my_button_right">
            </div>
          </div>
        }
        <hr />

        <Modal 
          open={this.state.modalToggle}
          size="fullscreen"
          className="my_modal"
        >       
          <CreateTask 
            createTaskToggler={this.createTaskToggler} 
            editToggle={true}
            taskid={this.state.taskid}
            getTask={this.getTask}
            getToast={this.getToast}
            taskStatus={this.state.task.status}
          />
        </Modal>
        <Modal
          open={this.state.logToggle}
          size="fullscreen"
          className="my_modal"
        >
          <CreateLog 
            closeLogModal={this.closeLogModal}
            logType={this.state.logType}
            taskid={this.state.taskid}
            getToast={this.getToast}
            getLogs={this.getLogs}
            logId={this.state.logId}
            logData={this.state.logs.filter(log => log.id === this.state.logId)}
          />
        </Modal>

        <Container>


          <div className="my_comment_wrapper">
            {this.MyLogs()}
          </div>
        </Container>

      </Container>
    )
  }
}

export default TaskDetailsContainer;