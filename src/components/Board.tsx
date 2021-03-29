import { useState } from 'react';
import { Column } from './type';
import * as React from 'react';
import styled from 'styled-components';

const ColumnContainer = styled.div({
	display: 'flex',
	'flex-direction': 'row',
	width: '300px',
	'background-color': '#ccc',
});

const ColumnRow = styled.div({
	display: 'flex',
	'flex-direction': 'column',
});

const Board: React.FC = () => {
	const [columns, setColumns] = useState<Column[]>([
		{
			name: 'Column 1',
			items: [{ name: 'Item 1' }],
		},
		{
			name: 'Column 2',
			items: [{ name: 'Item 1' }, { name: 'Item 2' }],
		},
	]);

	return (
		<div>
			<div>Kanban Board</div>
			<ColumnContainer>
				{columns.map((column) => {
					return (
						<ColumnRow>
							<div>{column.name}</div>
							{column.items.map((item) => {
								return <ColumnRow>{item.name}</ColumnRow>;
							})}
							<div>Add Item</div>
						</ColumnRow>
					);
				})}
			</ColumnContainer>
		</div>
	);
};

export default Board;
