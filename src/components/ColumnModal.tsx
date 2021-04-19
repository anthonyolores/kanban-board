import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { ColumnData } from './type';

type ColumnModalProps = {
	showModal: boolean;
	onAddColumn: (column: ColumnData) => void;
	onClose: () => void;
};
const ColumnModal: React.FC<ColumnModalProps> = ({
	showModal,
	onAddColumn,
	onClose,
}) => {
	const [show, setShow] = useState<boolean>(showModal);
	const [item, setItem] = useState<ColumnData>({
		id: Date.now().toString(),
		name: '',
		items: [],
	});

	useEffect(() => {
		setShow(showModal);
	}, [showModal]);

	function handleChangeName(e) {
		setItem({ ...item, name: e.target.value.toString() });
	}

	function handleSave() {
		if (item.name) onAddColumn(item);
		onClose();
	}

	function handleClose() {
		onClose();
	}

	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Column</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter Column Name'
								onChange={handleChangeName}
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
