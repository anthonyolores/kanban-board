import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ColumnData, ItemData } from './type';
import ColumnModal from './ColumnModal';
import ColumnButton from './ColumnButton';
import ItemModal from './ItemModal';
import { useDrag, useDragLayer, useDrop } from 'react-dnd';

const ColumnContainerStyled = styled.div<{
	isDropping?: boolean;
	isDragging?: boolean;
}>((p) => ({
	display: 'flex',
	flexDirection: 'column',
	width: '300px',
	flex: '0 0 auto',
	backgroundColor: p.isDropping ? 'blue' : '#fff',
	opacity: p.isDragging ? '0.2' : '1',
	margin: '15px',
	padding: '25px',
}));

const ColumnDraggable = styled.div<{
	isDragging?: boolean;
	isDropping?: boolean;
}>((p) => {
	return {
		padding: '15px',
		cursor: 'move',
		border: '1px solid #eee',
		background: p.isDragging ? 'red' : 'red',
		backgroundColor: p.isDropping ? 'blue' : 'red',
	};
});

const ColumnDroppableArea = styled.div<{ isDropping?: boolean }>((p) => ({
	background: p.isDropping ? 'red !important' : 'white',
}));

export type ColumnContentProps = {
	item: ItemData;
	containerId: number;
	isColumnDragging?: boolean;
};

const ColumnContent: React.FC<ColumnContentProps> = ({ item, containerId }) => {
	const [{ isDragging }, dragRef] = useDrag({
		type: 'Column',
		item: {
			id: item.id,
			containerId,
			item,
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
			<div>{item.name}</div>
			<div>{item.description}</div>
		</div>
	);
};

export type ColumnContainerProps = {
	containerId: number;
	dropColumnItem?: (
		colId: string,
		sourceContainerId: number,
		destContainerId: number
	) => void;
	dropColumn?: (sourceContainerId: number, destContainerId: number) => void;
	column: ColumnData;
	onAddItem: (containerId: number, item: ItemData) => void;
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

const DragLayer: React.FC = ({ children }) => {
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
							{<ColumnDragLayer containerId={item.id} column={item.column} />}
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
									item={item.item}
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

const Column: React.FC<ColumnContainerProps> = ({
	containerId,
	dropColumnItem,
	dropColumn,
	column,
	onAddItem,
}) => {
	const [showItemModal, setShowItemModal] = useState<boolean>(false);

	function handleAddItem() {
		setShowItemModal(true);
	}

	function handleCloseItem() {
		setShowItemModal(false);
	}

	// drop column item
	const [{ isOver: isOverColumnItem }, dropRef] = useDrop({
		accept: 'Column',
		drop: (item: { id: string; containerId: number }) => {
			dropColumnItem(item.id, item.containerId, containerId);
		},
	});

	// drag column container
	const [
		{ isDragging: isDraggingColumn, item: draggedItem },
		dragRefContainer,
	] = useDrag({
		type: 'ColumnContainer',
		item: {
			id: containerId,
			column,
		},
		options: { dropEffect: 'move' },
		collect: (monitor) => {
			return {
				isDragging: monitor.isDragging(),
				item: monitor.getItem(),
			};
		},
	});

	// drop column container
	const [{ isOver: isOverColumn }, dropRefContainer] = useDrop({
		accept: 'ColumnContainer',
		drop: (item: { id: number }) => {
			dropColumn(item.id, containerId);
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	});

	return (
		<>
			<DragLayer>
				<ColumnDroppableArea
					isDropping={isOverColumn}
					ref={dropRefContainer}
					style={{ height: 500 }}>
					<ColumnDraggable
						isDragging={isDraggingColumn}
						// set background of destination column
						isDropping={isOverColumn && draggedItem.id !== containerId}
						ref={dragRefContainer}>
						<ColumnContainerStyled
							isDropping={isOverColumnItem}
							ref={dropRef}
							isDragging={isDraggingColumn}>
							{column.items.map((item, i) => {
								return (
									<ColumnContent
										containerId={containerId}
										item={item}
										key={i + item.name}
									/>
								);
							})}
							<ColumnButton name='Add Item' onClick={handleAddItem} />
						</ColumnContainerStyled>
					</ColumnDraggable>
				</ColumnDroppableArea>
			</DragLayer>
			{showItemModal && (
				<ItemModal
					showModal={showItemModal}
					onAddItem={(item: ItemData) => onAddItem(containerId, item)}
					onClose={handleCloseItem}
				/>
			)}
		</>
	);
};
const ColumnDragLayer: React.FC<{
	containerId: number;
	column: ColumnData;
}> = ({ containerId, column }) => {
	return (
		<div
			style={{
				padding: '15px',
			}}>
			<ColumnContainerStyled>
				{column.items.map((item, i) => {
					return (
						<ColumnContent
							containerId={containerId}
							item={item}
							key={i + item.name}
						/>
					);
				})}
				<ColumnButton name={'Add Item'} />
			</ColumnContainerStyled>
		</div>
	);
};

export default Column;
