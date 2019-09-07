import React from 'react';
import { IData } from '../types';
import './TopPanel.css';

interface IPropsForTopPanel {
    currentFolder: IData,
    handleClickToBack(): void,
    handleDragOver(event: React.DragEvent<HTMLElement>): void,
    handleDrop(event: React.DragEvent<HTMLElement>): void,
    isDragging: boolean,
}

const TopPanel: React.FC<IPropsForTopPanel> = ({ currentFolder, handleClickToBack, isDragging, handleDragOver, handleDrop }) => {
    return (
        <div className="top_panel">
            {currentFolder.parentId !== null &&
                <div className="top_panel-up" onClick={handleClickToBack}>Go back</div>}
            {isDragging && currentFolder.parentId !== null &&
                <div
                    className="top_panel-dropToUp"
                    data-id={currentFolder.parentId}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}>Drop to up folder
            </div>}
            <div className="top_panel-name">{`Current position: ${currentFolder.name}`}</div>
        </div>
    )
}

export default TopPanel;
