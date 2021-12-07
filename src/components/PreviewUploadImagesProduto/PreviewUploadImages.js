//PreviewUploadImages
import React from "react";

import Dropzone from '../dropzone/dropzone';

import Progress from '../progress/progress';

import "./upload.css";

class PreviewUploadImages extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false,
    }
    this.handleChange = this.handleChange.bind(this)
    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.resetFiles = this.resetFiles.bind(this);
    this.removeFile = this.removeFile.bind(this);

  }
  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    })
  }

  resetFiles(){
    this.setState({ files: [] });
  }

  renderProgress(file) {
    const uploadProgress = this.state.uploadProgress[file.name];
    if (this.state.uploading || this.state.successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
          <img
            className="CheckIcon"
            alt="done"
            src="baseline-check_circle_outline-24px.svg"
            style={{
              opacity:
                uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
            }}
          />
        </div>
      );
    }
  }

  onFilesAdded(files) {
    if (this.props.type=='simple') {
      let filesNew = [];
      filesNew.push(files[0]);
      this.setState(prevState => ({
        files: filesNew
      }));
    } else {
      this.setState(prevState => ({
        files: prevState.files.concat(files)
      }));
    }
    
  }

  removeFile(index){
    this.state.files.splice(index,1);
    this.setState({files: this.state.files});
  }

  render() {
    return (
        <div className="Upload">
            <div className="titleUpload">
            <span className="Title">Selecione as Imagens</span>
            </div>
            <div className="Content">
            <div>
                <Dropzone type={this.props.type}
                onFilesAdded={this.onFilesAdded}
                disabled={this.state.uploading || this.state.successfullUploaded}
                />
            </div>
            <div className="Files Row">
                {this.state.files.map((file, index) => {
                return (
                    <div key={file.name} className="container-imgs" title="Remover" style={{margin: "4px 12px"}}>
                      <span className="img-remove" onClick={() => { this.removeFile(index) }} >X</span>
                      <img className="preview" src={URL.createObjectURL(file)}/>
                      {this.renderProgress(file)}
                    </div>
                );
                })}
            </div>
            </div>
        </div>
    );
  }
}
export { PreviewUploadImages }