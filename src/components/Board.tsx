import { useContext, useState } from 'react';
import { ColumnData, ItemData } from './type';
import Column from './Column';
import React from 'react';
import styled from 'styled-components';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import ColumnModal from './ColumnModal';
import ColumnButton from './ColumnButton';
import { AppContext } from './BoardContext';

const BoardContainer = styled.div({
	display: 'flex',
	flexDirection: 'row',
	overflowX: 'auto',
	width: '100%',
	padding: '25px',
	backgroundColor: '#eee',
});

const Board: React.FC = () => {
	const { columns, setColumns } = useContext(AppContext);
	const [showColumnModal, setShowColumnModal] = useState<boolean>(false);

	function handleAddColumn(column: ColumnData) {
		setColumns([...columns, column]);
	}

	function handleCloseColumn() {
		setShowColumnModal(false);
	}

	function handleDropColumnItem(
		colId: string,
		sourceContainerId: number,
		destContainerId: number
	) {
		const sourceItemIndex = columns[sourceContainerId].items.findIndex(
			(c) => c.id === colId
		);

		if (sourceItemIndex !== -1) {
			const next = [...columns];

			//add item to destination column
			next[destContainerId].items.push(
				columns[sourceContainerId].items.find((c) => c.id === colId)
			);

			//remove item from source column
			next[sourceContainerId].items.splice(sourceItemIndex, 1);

			setColumns(next);
		}
	}

	function handleDropColumn(
		sourceContainerId: number,
		destContainerId: number
	) {
		const next = [...columns];
		const hold = columns[sourceContainerId];
		next[sourceContainerId] = columns[destContainerId];
		next[destContainerId] = hold;

		setColumns(next);
	}

	function handleAddItem(containerId: number, item: ItemData) {
		const next = [...columns];
		next[containerId].items.push(item);
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
								dropColumnItem={handleDropColumnItem}
								dropColumn={handleDropColumn}
								key={'column-' + i}
								column={column}
								onAddItem={handleAddItem}
							/>
						);
					})}
					{showColumnModal && (
						<ColumnModal
							showModal={showColumnModal}
							onAddColumn={(column: ColumnData) => handleAddColumn(column)}
							onClose={handleCloseColumn}
						/>
					)}
					<ColumnButton
						name={'Add Column'}
						onClick={() => {
							setShowColumnModal(true);
						}}
					/>
				</BoardContainer>
			</DndProvider>
		</div>
	);
};

export default Board;
