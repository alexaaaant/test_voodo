import React from 'react';
import './ContextMenu.css';
import { FOLDER, FILE } from '../constants';

interface IPropsForContextMenu {
    closeContextMenu(): void,
    changeElement(id: number | null): void,
    coords: { x: number, y: number },
    type: string | null,
    elementId: number | null,
}

interface IStateForContextMenu {
    coords: IPropsForContextMenu['coords'],
    type: IPropsForContextMenu['type'],
    selectedElementId: IPropsForContextMenu['elementId'], 
}

class ContextMenu extends React.Component<IPropsForContextMenu, IStateForContextMenu> {
    private contextMenu: React.RefObject<HTMLDivElement>;

    constructor(props: IPropsForContextMenu) {
        super(props);
        this.contextMenu = React.createRef();
        this.state = {
            coords: {
                x: 0,
                y: 0,
            },
            type: null,
            selectedElementId: null,
        }
    }

    componentDidMount() {
        const { coords, type, elementId } = this.props;
        document.addEventListener('mousedown', (e) => this.handleClickOutside(e));
        this.setState({
            coords,
            type,
            selectedElementId: elementId,
        })
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', (e) => this.handleClickOutside(e));
    }

    handleClickOutside = (event: any) => {
        if (this.contextMenu.current && !this.contextMenu.current.contains(event.target)) {
            event.button !== 2 && this.props.closeContextMenu();
            if (event.button === 2) {
                let x = event.clientX;
                let y = event.clientY;
                let type = event.target.dataset.type;
                let id = Number(event.target.dataset.id);
                this.setState({
                    coords: { x, y },
                    type,
                    selectedElementId: id,
                })
            }
        }
    }

    renderContextMenu = () => {
        const { type, coords, selectedElementId } = this.state;
        const { changeElement } = this.props;
        switch (type) {
            case FOLDER:
            case FILE: {
                return <div style={{ left: coords.x, top: coords.y }} ref={this.contextMenu} className='context_menu'>
                    <span className='context_menu-item' onClick={(e) => changeElement(selectedElementId)}>Rename element</span>
                    <span className='context_menu-item'>Delete element</span>
                </div>
            }
            default:
                return <div style={{ left: coords.x, top: coords.y }} className='context_menu' ref={this.contextMenu}>
                    <span className='context_menu-item'>Create folder</span>
                    <span className='context_menu-item'>Create file</span>
                </div>
        }
    }

    render() {
        return (
            this.renderContextMenu()
        )
    }
};

export default ContextMenu;
