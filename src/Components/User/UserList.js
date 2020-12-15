import React, { Component } from 'react'
import { Container, Table, Dropdown} from 'semantic-ui-react';
import API from "../../Helpers/API";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [
        {
          'id': 0,
          'alias': 'alias',
          'email': 'email@local.host',
          'group': {
            'id': 0,
            'name': 'editor'
          },
        }
      ],
      groupList: [
        {
          key: 1,
          text: 'manager',
          value: 'manager'
        }, {
          key: 2,
          text: 'editor',
          value: 'editor'
        }
      ]
    }
  }

  componentDidMount () {
    this.getUserList()
    this.getGroupList()
  }

  getUserList = () => {
    let header = {
      Authorization: 'TOKEN ' + localStorage.getItem('LOGBOOK_AUTH_TOKEN')
    }
    API.get('api/user/group/', {headers: header})
    .then( res => {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log(res)
      }
      this.setState({
        userList: res.data.data
      })
    })
    .catch( err => {
      console.log(err)
    })
  }

  getGroupList = () => {
    let header = {
      Authorization: 'TOKEN ' + localStorage.getItem('LOGBOOK_AUTH_TOKEN')
    }
    API.get('api/user/group/groupList/', {headers: header})
    .then( res => {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log(res)
      }
      this.setState({
        groupList: res.data.data
      })
 
    })
    .catch( err => {
      console.log(err)
    })
  } 

  render() {
    let userList = this.state.userList.map( (list) => {
      return (
        <Table.Row >
          <Table.Cell verticalAlign="middle">{list.alias}</Table.Cell>
          <Table.Cell verticalAlign="middle">{list.email}</Table.Cell>
          <Table.Cell id={list.id} verticalAlign="middle">
            <Dropdown 
              placeholder={list.group.name}
              selection
              options={this.state.groupList}
            />
          </Table.Cell>
        </Table.Row>
      )
    }) 

    return (
      <Container className="my_container">
        <div className="row">
          <div className='my_title_wrapper col align-self-start'>
            <h1>My Team</h1>
          </div>
        </div>
        <Table inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>alias</Table.HeaderCell>
              <Table.HeaderCell>email</Table.HeaderCell>
              <Table.HeaderCell>access group</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {userList}
          </Table.Body> 
        </Table> 
      </Container>
    )
  }
}

export default UserList;