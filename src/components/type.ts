export type ItemData = {
    id: string;
    name: string;
    description: string;
};

export type ColumnData = {
    id: string;
    name: string;
    items: ItemData[]
}