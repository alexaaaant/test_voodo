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
  }
  render() {
    return (
      <div></div>
    )
  }
}

export default App;
