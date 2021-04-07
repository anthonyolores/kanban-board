import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { ColumnData, ItemData } from './type';

type ColumnModalProps = {
	showModal: boolean;
	onAddItem: (item: ColumnData) => void;
	onClose: () => void;
};
const ColumnModal: React.FC<ColumnModalProps> = ({
	showModal,
	onAddItem,
	onClose,
}) => {
	const [show, setShow] = useState<boolean>(showModal);
	const [item, setItem] = useState<ColumnData>({
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
		onAddItem(item);
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
						<Form.Group controlId='formBasicEmail'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter Item Name'
								onChange={handleChangeName}
							/>
						</Form.Group>
						<Form.Group controlId='formBasicEmail'>
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

export default ColumnModal;
