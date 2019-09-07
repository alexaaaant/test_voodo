import React from 'react';
import './ContextMenu.css';

interface IPropsForContextMenu {
    closeContextMenu(): void,
    coords: { x: number, y: number },
}

interface IStateForContextMenu {
    coords: IPropsForContextMenu['coords'],
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
            }
        }
    }

    componentDidMount() {
        const { coords } = this.props;
        document.addEventListener('mousedown', (e) => this.handleClickOutside(e));
        this.setState({
            coords
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
                this.setState({
                    coords: { x, y }
                })
            }
        }
    }

    render() {
        const { coords } = this.state;
        return (
            <div style={{ left: coords.x, top: coords.y }} ref={this.contextMenu} className='context_menu'>
            </div>
        )
    }
};

export default ContextMenu;
