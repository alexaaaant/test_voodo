import React from 'react';
import './App.css';
import { IData } from './types';
import dataFromJson from './data/data.json';
import { dataToMap } from './helpFunction/helpFunction';

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
  render() {
    const { data, currentFolderId } = this.state;
    const currentFolder: IData | undefined = data.get(currentFolderId);
    return (
      <div className="wrapper">
        {currentFolder ?
          <>
            <div className="top_panel">
              <div className="top_panel-up">Up</div>
              <div className="top_panel-name">{currentFolder.name}</div>
            </div>
            <div className="cells_container">
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
              <div className="cells_container-cell"></div>
            </div>
          </> : 'Loading...'
        }
      </div>
    )
  }
}

export default App;
