import React from 'react';
import { IData } from '../types';
import './TopPanel.css';
import { GO_BACK, CURRENT_POSITION, DROP_TO_UP_FOLDER } from '../constants';

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
                <div className="top_panel-up" onClick={handleClickToBack}>{GO_BACK}</div>}
            {isDragging && currentFolder.parentId !== null &&
                <div
                    className="top_panel-dropToUp"
                    data-id={currentFolder.parentId}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}>{DROP_TO_UP_FOLDER}
            </div>}
            <div className="top_panel-name">{`${CURRENT_POSITION}: ${currentFolder.name}`}</div>
        </div>
    )
}

export default TopPanel;
