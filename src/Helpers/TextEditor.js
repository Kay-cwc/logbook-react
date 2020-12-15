import React, { Component } from 'react'
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";

export default class MyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      content: '',
    }
    this.onChange = editorState => {
      // convert to raw js object
      const raw = convertToRaw(editorState.getCurrentContent());
      this.saveEditorContent(raw);
      // set state
      this.setState({editorState})
    };
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  componentDidMount() {
    // load editor data (raw js object) from local storage
    const rawEditorData = this.getSaveEditorData();
    if (rawEditorData !== null) {
      const contentState = convertFromRaw(rawEditorData);
      this.setState({
        editorState: EditorState.createWithContent(contentState)
      })
    }
  }

  saveEditorContent(data) {
    const dataJSON = JSON.stringify(data)
    localStorage.setItem('editorData', dataJSON)
    this.props.storeEditorContent(dataJSON)
  }

  getSaveEditorData() {
    const savedData = localStorage.getItem('editorData');
    console.log(savedData)
    // if saved exist return parseed data
    return savedData ? JSON.parse(savedData) : null;
  }


  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled'
    }
    return 'not-handled'
  }

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  render() {
    return (
      <div>
        <span onClick={this._onBoldClick.bind(this)}>Bold</span>
        <Editor 
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        />
      </div>
    )
  }
}
