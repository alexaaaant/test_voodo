import React from 'react';
import './App.css';
import { IData } from '../types';
import dataFromJson from '../data/data.json';
import { dataToMap } from '../helpFunction/helpFunction';
import { folderUrl, fileUrl, FOLDER, FILE } from '../constants';

interface IStateForApp {
  currentFolderId: number,
  data: Map<number, IData>,
  isDragging: boolean,
}

class App extends React.Component<{}, IStateForApp> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentFolderId: 0,
      data: new Map(),
      isDragging: false,
    }
  }

  componentDidMount() {
    const data: IStateForApp['data'] = dataToMap(dataFromJson);
    this.setState({
      data,
    })
  }

  handleDoubleClick = (event: React.SyntheticEvent<HTMLElement>) => {
    const elemData = event.currentTarget.dataset;
    if (elemData.type === FOLDER) {
      this.setState({
        currentFolderId: Number(elemData.id),
      })
    }
  }

  handleClickToUp = () => {
    const { currentFolderId, data } = this.state;
    const currentFolder = data.get(currentFolderId);
    if (currentFolder && currentFolder.parentId !== null) {
      this.setState({
        currentFolderId: currentFolder.parentId
      })
    }
  }

  handleDragStart = (event: React.DragEvent<HTMLElement>) => {
    event.dataTransfer.effectAllowed = 'move'
    if (event.currentTarget.dataset.id) {
      event.dataTransfer.setData('text', event.currentTarget.dataset.id);
    }
    this.setState({
      isDragging: true,
    })
  }

  handleDrop = (event: React.DragEvent<HTMLElement>) => {
    const elemId = Number(event.dataTransfer.getData('text'));
    const sourceElemId = Number(event.currentTarget.dataset.id);
    const { data } = this.state;
    let copyData = new Map(data);
    let sourceElem = copyData.get(sourceElemId);
    let elem = copyData.get(elemId);
    if (elem && sourceElem) {
      let parentElem = elem.parentId !== null && copyData.get(elem.parentId);
      if (parentElem) {
        parentElem.children = parentElem.children.filter((child) => child.id !== elem!.id);
      }
      elem.parentId = sourceElem.id;
      sourceElem.children.push(elem);
    }
    this.setState({
      data: copyData,
      isDragging: false,
    })
  }

  handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    if (event.currentTarget.dataset.type === FILE) {
      event.dataTransfer.dropEffect = 'none';
    }
  }

  handleDragEnd = () => {
    this.setState({
      isDragging: false,
    })
  }

  render() {
    const { data, currentFolderId, isDragging } = this.state;
    const currentFolder: IData | undefined = data.get(currentFolderId);
    return (
      <div className="wrapper">
        {currentFolder ?
          <>
            <div className="top_panel">
              {currentFolder.parentId !== null && <div className="top_panel-up" onClick={this.handleClickToUp}>Come back</div>}
              {isDragging && currentFolder.parentId !== null &&
                <div
                  className="top_panel-dropToUp"
                  data-id={currentFolder.parentId}
                  onDrop={this.handleDrop}
                  onDragOver={this.handleDragOver}>Drop to up folder
                  </div>}
              <div className="top_panel-name">{`Current position: ${currentFolder.name}`}</div>
            </div>
            <div className="cells_container">
              {currentFolder.children && currentFolder.children.map((child) => (
                <div
                  className="cells_container-cell"
                  onDragStart={this.handleDragStart}
                  onDrop={this.handleDrop}
                  onDragEnd={this.handleDragEnd}
                  onDragOver={this.handleDragOver}
                  draggable
                  key={child.id}
                  data-id={child.id}
                  data-type={child.type}
                  onDoubleClick={this.handleDoubleClick}>
                  <img className="cells_container-cell-img" src={child.type === FOLDER ? folderUrl : fileUrl} alt='folder..'></img>
                  <span className="cells_container-cell-name">{child.name}</span>
                </div>
              ))}
            </div>
          </> : 'Loading...'
        }
      </div>
    )
  }
}

export default App;
