import React from 'react';
import './App.css';
import { IData } from './types';
import dataFromJson from './data/data.json';
import { dataToMap } from './helpFunction/helpFunction';
import { folderUrl, fileUrl, FOLDER } from './constants';

interface IStateForApp {
  currentFolderId: number,
  data: Map<number, IData>,
}

class App extends React.Component<{}, IStateForApp> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentFolderId: 0,
      data: new Map(),
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

  render() {
    const { data, currentFolderId } = this.state;
    const currentFolder: IData | undefined = data.get(currentFolderId);
    return (
      <div className="wrapper">
        {currentFolder ?
          <>
            <div className="top_panel">
              <div className="top_panel-up" onClick={this.handleClickToUp}>Up</div>
              <div className="top_panel-name">{currentFolder.name}</div>
            </div>
            <div className="cells_container">
              {currentFolder.children && currentFolder.children.map((child) => (
                <div className="cells_container-cell" key={child.id} data-id={child.id} data-type={child.type} onDoubleClick={this.handleDoubleClick}>
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
