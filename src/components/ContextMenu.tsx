import React from 'react';
import './ContextMenu.css';
import { FOLDER, FILE } from '../constants';

interface IPropsForContextMenu {
    closeContextMenu(): void,
    coords: { x: number, y: number },
    type: string | null,
}

interface IStateForContextMenu {
    coords: IPropsForContextMenu['coords'],
    type: IPropsForContextMenu['type'],
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
        }
    }

    componentDidMount() {
        const { coords, type } = this.props;
        document.addEventListener('mousedown', (e) => this.handleClickOutside(e));
        this.setState({
            coords,
            type
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
                this.setState({
                    coords: { x, y },
                    type,
                })
            }
        }
    }

    renderContextMenu = () => {
        const { type, coords } = this.state;
        switch (type) {
            case FOLDER:
            case FILE: {
                return <div style={{ left: coords.x, top: coords.y }} ref={this.contextMenu} className='context_menu'>
                    <span className='context_menu-item'>Rename element</span>
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
