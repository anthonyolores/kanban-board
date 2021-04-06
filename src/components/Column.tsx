import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { ColumnData } from './type';
import ColumnHeader from './ColumnHeader';
import ColumnButton from './ColumnButton';
import { useDrag, useDragLayer, useDrop } from 'react-dnd';

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
			column,
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
	dropColumn?: (
		colId: string,
		sourceContainerId: number,
		destContainerId: number
	) => void;
	dropColumnContainer?: (
		sourceContainerId: number,
		destContainerId: number
	) => void;
	columns: ColumnData[];
};

const layerStyles: CSSProperties = {
	position: 'fixed',
	pointerEvents: 'none',
	zIndex: 100,
	left: 0,
	top: 0,
	width: '100%',
	height: '100%',
};

function getItemStyles(props) {
	const { currentOffset } = props;
	if (!currentOffset) {
		return {
			display: 'none',
		};
	}

	const { x, y } = currentOffset;
	const transform = `translate(${x}px, ${y}px)`;
	return {
		transform: transform,
		WebkitTransform: transform,
	};
}

const ColumnContainerDragLayer: React.FC = ({ children }) => {
	const {
		itemType,
		isDragging,
		item,
		initialOffset,
		currentOffset,
	} = useDragLayer((monitor) => ({
		item: monitor.getItem(),
		itemType: monitor.getItemType(),
		initialOffset: monitor.getInitialSourceClientOffset(),
		currentOffset: monitor.getSourceClientOffset(),
		isDragging: monitor.isDragging(),
	}));

	return (
		<div>
			{isDragging ? (
				itemType === 'ColumnContainer' ? (
					<div style={layerStyles}>
						<div
							style={getItemStyles({
								itemType,
								isDragging,
								item,
								initialOffset,
								currentOffset,
							})}>
							{<ThumbnailDrag containerId={item.id} columns={item.columns} />}
						</div>
					</div>
				) : itemType === 'Column' ? (
					<div style={layerStyles}>
						<div
							style={getItemStyles({
								itemType,
								isDragging,
								item,
								initialOffset,
								currentOffset,
							})}>
							{
								<ColumnContent
									containerId={item.containerId}
									column={item.column}
								/>
							}
						</div>
					</div>
				) : null
			) : null}
			{children}
		</div>
	);
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
	});

	// drag column container
	const [{ isDragging: isDraggingContainer }, dragRefContainer] = useDrag({
		type: 'ColumnContainer',
		item: {
			id: containerId,
			columns,
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

	const customStyle = isDraggingContainer ? { opacity: '0' } : {};

	return (
		<ColumnContainerDragLayer>
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
						cursor: 'drag',
						opacity: isOverContainer ? '0' : '1',
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
		</ColumnContainerDragLayer>
	);
};

const ThumbnailDrag: React.FC<{
	containerId: number;
	columns: ColumnData[];
}> = ({ containerId, columns }) => {
	return (
		<div
			style={{
				padding: '15px',
			}}>
			<div
				style={{
					padding: '15px',
				}}>
				<ColumnContainerStyled>
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
