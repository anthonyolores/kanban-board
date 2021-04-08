import React, { CSSProperties, useState } from 'react';
import styled from 'styled-components';
import { ColumnData, ItemData } from './type';
import ColumnModal from './ColumnModal';
import ColumnButton from './ColumnButton';
import ItemModal from './ItemModal';
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
	item: ItemData;
	containerId: number;
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
	dropColumn?: (
		colId: string,
		sourceContainerId: number,
		destContainerId: number
	) => void;
	dropColumnContainer?: (
		sourceContainerId: number,
		destContainerId: number
	) => void;
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
							{
								<ColumnThumbnailDrag
									containerId={item.id}
									column={item.column}
								/>
							}
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

const ColumnContainer: React.FC<ColumnContainerProps> = ({
	containerId,
	dropColumn,
	dropColumnContainer,
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
			column,
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
		<div>
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
							{column.items.map((item, i) => {
								return (
									<ColumnContent
										containerId={containerId}
										item={item}
										key={i + item.name}
									/>
								);
							})}
							<ColumnButton name={'Add Item'} onClick={handleAddItem} />
						</ColumnContainerStyled>
					</div>
				</div>
			</ColumnContainerDragLayer>
			{showItemModal && (
				<ItemModal
					showModal={showItemModal}
					onAddItem={(item: ItemData) => onAddItem(containerId, item)}
					onClose={handleCloseItem}
				/>
			)}
		</div>
	);
};

const ColumnThumbnailDrag: React.FC<{
	containerId: number;
	column: ColumnData;
}> = ({ containerId, column }) => {
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
		</div>
	);
};

export default ColumnContainer;
