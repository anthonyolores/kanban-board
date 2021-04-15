import React from 'react';
import { useState } from 'react';
import { ColumnData } from './type';

type BoardContextStore = {
	columns: Array<ColumnData>;
	setColumns: (columns: Array<ColumnData>) => void;
	hideEditor: boolean;
	setHideEditor: (hideEditor: boolean) => void;
};
export const AppContext = React.createContext<BoardContextStore | undefined>(
	undefined
);

const BoardContext: React.FC = ({ children }) => {
	const [columns, setColumns] = useState<Array<ColumnData>>([
		{
			id: '0',
			name: 'In-progress',
			items: [{ id: '00', name: 'Todo name', description: 'Todo description' }],
		},
		{
			id: '01',
			name: 'Code review',
			items: [
				{ id: '010', name: 'Todo name 2', description: 'Todo description 2' },
			],
		},
	]);
	const [hideEditor, setHideEditor] = useState<boolean>(true);

	return (
		<AppContext.Provider
			value={{ columns, setColumns, hideEditor, setHideEditor }}>
			{children}
		</AppContext.Provider>
	);
};

export default BoardContext;
