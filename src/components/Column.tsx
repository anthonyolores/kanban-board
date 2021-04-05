import React = require('react');
import styled from 'styled-components';
import { ColumnData } from './type';
import ColumnHeader from './ColumnHeader';
import ColumnButton from './ColumnButton';
import { useDrag, useDrop } from 'react-dnd';
const ColumnContainerStyled = styled.div.attrs((props: any) => ({
	backgroundColor: props.className ? '#eee' : '#000',
}))({
	display: 'flex',
	flexDirection: 'column',
	width: '300px',
	flex: '0 0 auto',
	backgroundColor: '#fff',
	margin: '15px',
	padding: '25px',
});

export type ColumnContentProps = {
	column: ColumnData;
	containerId: number;
};

const ColumnContent: React.FC<ColumnContentProps> = ({
	column,
	containerId,
}) => {
	const [{ isDragging }, dragRef] = useDrag({
		type: 'Column',
		item: {
			id: column.id,
			containerId,
		},
		options: { dropEffect: 'move' },
		collect: (monitor) => {
			return {
				isDragging: monitor.isDragging(),
			};
		},
	});

	const customStyle = isDragging ? { opacity: '0.2' } : {};

	return (
		<div ref={dragRef} style={{ ...customStyle, marginBottom: '15px' }}>
			<ColumnHeader name={column.name} />
			<div>{column.description}</div>
		</div>
	);
};

export type ColumnContainerProps = {
	containerId: number;
	dropColumn: (
		colId: string,
		sourceContainerId: number,
		destContainerId: number
	) => void;
	dropColumnContainer: (
		sourceContainerId: number,
		destContainerId: number
	) => void;
	columns: ColumnData[];
};

const ColumnContainer: React.FC<ColumnContainerProps> = ({
	containerId,
	dropColumn,
	dropColumnContainer,
	columns,
}) => {
	// drop column item
	const [{ isOver }, dropRef] = useDrop({
		accept: 'Column',
		drop: (item: { id: string; containerId: number }) => {
			dropColumn(item.id, item.containerId, containerId);
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	});

	// drag column container
	const [{ isDragging: isDraggingContainer }, dragRefContainer] = useDrag({
		type: 'ColumnContainer',
		item: {
			id: containerId,
		},
		options: { dropEffect: 'move' },
		collect: (monitor) => {
			return {
				isDragging: monitor.isDragging(),
			};
		},
	});

	// drop column container
	const [{ isOver: isOverContainer }, dropRefContainer] = useDrop({
		accept: 'ColumnContainer',
		drop: (item: { id: number }) => {
			dropColumnContainer(item.id, containerId);
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	});

	const customStyle = isDraggingContainer ? { opacity: '0.2' } : {};

	return (
		<div
			ref={dropRefContainer}
			style={{
				backgroundColor: isOverContainer ? 'blue' : 'white',
				padding: '15px',
			}}>
			<div
				ref={dragRefContainer}
				style={{
					...customStyle,
					padding: '15px',
					backgroundColor: 'red',
				}}>
				<ColumnContainerStyled
					ref={dropRef}
					style={{
						backgroundColor: isOver ? 'blue' : 'white',
					}}>
					{columns.map((col, i) => {
						return (
							<ColumnContent
								containerId={containerId}
								column={col}
								key={i + col.name}
							/>
						);
					})}
					<ColumnButton name={'Add Item'} />
				</ColumnContainerStyled>
			</div>
		</div>
	);
};

export default ColumnContainer;
