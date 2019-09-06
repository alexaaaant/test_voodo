import React from 'react';
import './App.css';
import { IData } from './types';

interface IData {
  id: number,
  name: string,
  type: string,
  children: IData,
}

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
  render() {
    return (
      <div></div>
    )
  }
}

export default App;
