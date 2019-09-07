import React, { MouseEvent } from 'react';
import './App.css';
import { IData } from '../types';
import dataFromJson from '../data/data.json';
import { dataToMap } from '../helpFunction/helpFunction';
import { folderUrl, fileUrl, FOLDER, FILE } from '../constants';
import ContextMenu from './ContextMenu';
import TopPanel from './TopPanel';

interface IStateForApp {
  currentFolderId: number,
  data: Map<number, IData>,
  isDragging: boolean,
  contextMenu: {
    isOpen: boolean,
    coords: { x: number, y: number },
    type: string,
    elementId: number | null,
  },
  changingElementId: number | null,
  changingElementName: string,
}

class App extends React.Component<{}, IStateForApp> {
  private inputElement: React.RefObject<HTMLInputElement>;

  constructor(props: any) {
    super(props);
    this.inputElement = React.createRef();
    this.state = {
      currentFolderId: 0,
      data: new Map(),
      isDragging: false,
      contextMenu: {
        isOpen: false,
        coords: { x: 0, y: 0 },
        type: '',
        elementId: null,
      },
      changingElementId: null,
      changingElementName: '',
    }
  }

  componentDidMount() {
    const data: IStateForApp['data'] = dataToMap(dataFromJson);
    document.addEventListener('mousedown', (e) => this.handleClickOutside(e));
    document.addEventListener('keypress', (e) => this.handleClickOutside(e));
    this.setState({
      data,
    })
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', (e) => this.handleClickOutside(e));
    document.removeEventListener('keypress', (e) => this.handleClickOutside(e));
  }

  handleClickOutside = (event: any) => {
    if ((this.inputElement.current && !this.inputElement.current.contains(event.target)) || event.which === 13) {
      const { data, changingElementId, changingElementName } = this.state;
      let copyData = new Map(data);
      let elem = changingElementId !== null && copyData.get(changingElementId);
      if (elem) elem.name = changingElementName;
      this.setState({
        data: copyData,
        changingElementName: '',
        changingElementId: null,
      })
    }
  }

  handleDoubleClick = (event: React.SyntheticEvent<HTMLElement>) => {
    const elemData = event.currentTarget.dataset;
    if (elemData.type === FOLDER) {
      this.setState({
        currentFolderId: Number(elemData.id),
      })
    }
  }

  handleClickToBack = () => {
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
    if (elem && sourceElem && elemId !== sourceElemId) {
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

  handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    let htmlElem = event.target as any;
    let type = htmlElem.dataset ? htmlElem.dataset.type : null;
    let elementId = htmlElem.dataset ? Number(htmlElem.dataset.id) : null;
    if (!this.state.contextMenu.isOpen) {
      let x = event.clientX;
      let y = event.clientY;
      this.setState(prevState => ({
        ...prevState,
        contextMenu: {
          coords: {
            x,
            y
          },
          isOpen: true,
          type,
          elementId,
        }
      }))
    }
    return false;
  }

  closeContextMenu = () => {
    this.setState(prevState => ({
      ...prevState,
      contextMenu: {
        coords: {
          x: prevState.contextMenu.coords.x,
          y: prevState.contextMenu.coords.y
        },
        isOpen: false,
        type: '',
        elementId: null,
      }
    }))
  }

  changeElement = (id: number | null) => {
    this.setState({
      changingElementId: id,
    })
    this.closeContextMenu();
  }

  changeElementName = (event: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      changingElementName: event.currentTarget.value
    })
  }

  createElement = (type: string) => {
    const { data, currentFolderId } = this.state;
    let newElement = {
      id: data.size,
      name: `new ${type}`,
      type,
      parentId: currentFolderId,
      children: [],
    }
    let copyData = new Map(data);
    let parentElement = copyData.get(currentFolderId);
    parentElement && parentElement.children.push(newElement);
    copyData.set(data.size, newElement);
    this.setState({
      data: copyData,
      changingElementName: newElement.name,
    }, () => this.changeElement(newElement.id));
  }

  render() {
    const { data, currentFolderId, isDragging, contextMenu, changingElementId } = this.state;
    const currentFolder: IData | undefined = data.get(currentFolderId);
    return (
      <div className="wrapper" onContextMenu={this.handleContextMenu}>
        {currentFolder ?
          <>
            <TopPanel 
            currentFolder={currentFolder} 
            handleClickToBack={this.handleClickToBack}
            handleDrop={this.handleDrop}
            handleDragOver={this.handleDragOver}
            isDragging={isDragging} />
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
                  {changingElementId === child.id ?
                    <input
                      ref={this.inputElement}
                      onChange={this.changeElementName}
                      defaultValue={child.name}
                      className="cells_container-cell-name"></input>
                    :
                    <span className="cells_container-cell-name">{child.name}</span>}
                </div>
              ))}
              {contextMenu.isOpen &&
                <ContextMenu
                  changeElement={this.changeElement}
                  elementId={contextMenu.elementId}
                  type={contextMenu.type}
                  closeContextMenu={this.closeContextMenu}
                  createElement={this.createElement}
                  coords={contextMenu.coords} />}
            </div>
          </> : 'Loading...'
        }
      </div>
    )
  }
}

export default App;
