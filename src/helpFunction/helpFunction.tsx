import { IDataFromJson, IData } from '../types';

export const dataToMap = (data: IDataFromJson[]): Map<number, IData> => {
    let dataMap = new Map();
    data.forEach((elem: any) => {
        dataMap.set(elem.id, elem);
        if (elem.parentId !== null) {
            let parent = dataMap.get(elem.parentId);
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(elem);
        }
    })
    return dataMap;
}