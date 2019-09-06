import { IDataFromJson, IData } from '../types';
import { FOLDER } from '../constants';

export const dataToMap = (data: IDataFromJson[]): Map<number, IData> => {
    let dataMap = new Map();
    data.forEach((elem: any) => {
        dataMap.set(elem.id, elem);
        if (elem.type === FOLDER) {
            elem.children = [];
        }
        if (elem.parentId !== null) {
            let parent = dataMap.get(elem.parentId);
            parent.children.push(elem);
        }
    })
    return dataMap;
}