import React from 'react';
import { useState } from 'react';
import { ColumnData } from './type';

type BoardContextStore = {
	columns: Array<ColumnData>;
	setColumns: (columns: Array<ColumnData>) => void;
	hideEditor: boolean;
	setHideEditor: (hideEditor: boolean) => void;
	showColumnModal: boolean;
	setShowColumnModal: (showColumnModal: boolean) => void;
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
	const [hideEditor, setHideEditor] = useState<boolean>(false);
	const [showColumnModal, setShowColumnModal] = useState<boolean>(false);

	return (
		<AppContext.Provider
			value={{
				columns,
				setColumns,
				hideEditor,
				setHideEditor,
				showColumnModal,
				setShowColumnModal,
			}}>
			{children}
		</AppContext.Provider>
	);
};

export default BoardContext;
