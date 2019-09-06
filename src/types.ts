export interface IData extends IDataFromJson {
    children: IData,
}

export interface IDataFromJson {
    id: number,
    name: string,
    type: string,
    parentId: number | null,
}