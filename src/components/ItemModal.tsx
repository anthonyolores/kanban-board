import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { ItemData } from './type';

type ItemModalProps = {
	showModal: boolean;
	onAddItem: (item: ItemData) => void;
	onClose: () => void;
};
const ItemModal: React.FC<ItemModalProps> = ({
	showModal,
	onAddItem,
	onClose,
}) => {
	const [show, setShow] = useState<boolean>(showModal);
	const [item, setItem] = useState<ItemData>({
		id: Date.now().toString(),
		name: '',
		description: '',
	});

	useEffect(() => {
		setShow(showModal);
	}, [showModal]);

	function handleChangeName(e) {
		setItem({ ...item, name: e.target.value.toString() });
	}

	function handleChangeDesc(e) {
		setItem({ ...item, description: e.target.value.toString() });
	}

	function handleSave() {
		if (item.name) onAddItem(item);
		onClose();
	}

	function handleClose() {
		onClose();
	}

	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Task Item</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter Item Name'
								onChange={handleChangeName}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Description</Form.Label>
							<Form.Control
								type='textarea'
								placeholder='Enter Item Description'
								onChange={handleChangeDesc}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Close
					</Button>
					<Button variant='primary' onClick={handleSave}>
						Save
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ItemModal;
