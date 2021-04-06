import { useState } from 'react';
import { ColumnData } from './type';
import Column from './Column';
import React from 'react';
import styled from 'styled-components';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const BoardContainer = styled.div({
	display: 'flex',
	flexDirection: 'row',
	overflowX: 'auto',
	width: '100%',
	padding: '25px',
	backgroundColor: '#eee',
});

const Board: React.FC = () => {
	const [columns, setColumns] = useState<Array<ColumnData[]>>([
		[
			{
				id: '11',
				name: 'Column 1',
				description: 'Description Item 1',
			},
		],
		[
			{
				id: '22',
				name: 'Column 2',
				description: 'Description Item 2',
			},
		],
		[
			{
				id: '33',
				name: 'Column 3',
				description: 'Description Item 3',
			},
		],
	]);

	function handleDropColumnItem(
		colId: string,
		sourceContainerId: number,
		destContainerId: number
	) {
		const sourceItemIndex = columns[sourceContainerId].findIndex(
			(c) => c.id === colId
		);

		if (sourceItemIndex !== -1) {
			const next = [...columns];

			//add item to destination column
			next[destContainerId].push(
				columns[sourceContainerId].find((c) => c.id === colId)
			);

			//remove item from source column
			next[sourceContainerId].splice(sourceItemIndex, 1);

			setColumns(next);
		}
	}

	function handleDropColumnContainer(
		sourceContainerId: number,
		destContainerId: number
	) {
		const next = [...columns];
		const hold = columns[sourceContainerId];
		next[sourceContainerId] = columns[destContainerId];
		next[destContainerId] = hold;

		setColumns(next);
	}

	return (
		<div>
			<DndProvider backend={HTML5Backend}>
				<BoardContainer>
					{columns.map((column, i) => {
						return (
							<Column
								containerId={i}
								dropColumn={handleDropColumnItem}
								dropColumnContainer={handleDropColumnContainer}
								key={'column-' + i}
								columns={column}></Column>
						);
					})}
				</BoardContainer>
			</DndProvider>
		</div>
	);
};

export default Board;
