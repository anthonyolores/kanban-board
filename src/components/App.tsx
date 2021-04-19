import * as React from 'react';
import './style.scss';
import Board from './Board';
import BoardContext, { AppContext } from './BoardContext';
import JSONEditor from './JSONEditor';
import styled from 'styled-components';
import ColumnModal from './ColumnModal';
import { ColumnData } from './type';
import logo from './../assets/logo.svg';

const Row = styled.div({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'nowrap',
	width: '100%',
});

const JSONEditorContainerStyled = styled.div({
	height: '100vh',
});

const BoardContainerStyled = styled.div<{ editorWidth: number }>((s) => {
	return {
		width: `calc(100% - ${s.editorWidth}px)`,
	};
});

const ActionButton = styled.button({
	position: 'relative',
	fontSize: '1.2em',
	zIndex: 1,
	margin: '1px',
	top: '0',
	padding: '15px',
	border: 'none',
	background: '#556779',
	color: '#c4c7ca',
	'&:hover': {
		background: '#2A4158',
	},
	'&:active': {
		background: '#556779',
	},
});

const BoardContainer: React.FC = () => {
	const {
		hideEditor,
		setHideEditor,
		showColumnModal,
		setShowColumnModal,
		columns,
		setColumns,
	} = React.useContext(AppContext);

	function handleAddColumn(column: ColumnData) {
		setColumns([...columns, column]);
	}

	function handleCloseColumn() {
		setShowColumnModal(false);
	}
	return (
		<BoardContainerStyled editorWidth={hideEditor ? 0 : 500}>
			<ActionButton onClick={() => setHideEditor(!hideEditor)}>
				{'</> Editor'}
			</ActionButton>
			<ActionButton
				onClick={() => {
					setShowColumnModal(true);
				}}>
				+ Add Column
			</ActionButton>
			<Board />
			{showColumnModal && (
				<ColumnModal
					showModal={showColumnModal}
					onAddColumn={(column: ColumnData) => handleAddColumn(column)}
					onClose={handleCloseColumn}
				/>
			)}
		</BoardContainerStyled>
	);
};

const JSONEditorContainer: React.FC = () => {
	const { hideEditor } = React.useContext(AppContext);

	if (!hideEditor)
		return (
			<JSONEditorContainerStyled>
				<JSONEditor />
			</JSONEditorContainerStyled>
		);

	return null;
};

const HeaderRow = styled.div({
	height: '80px',
	display: 'flex',
	alignItems: 'center',
	padding: '10px',
	backgroundColor: '#fff',
	' .header': {
		justifyContent: '50%',
		paddingLeft: '20px',
		fontSize: '1.5rem',
		fontWeight: 'bold',
		color: '#2A4158',
	},
});

const App: React.FC = () => {
	return (
		<BoardContext>
			<HeaderRow>
				<div className='header'>
					<img src={logo} alt='React Logo' height='60' />
					&nbsp;Kanban Board
				</div>
			</HeaderRow>
			<Row>
				<JSONEditorContainer />
				<BoardContainer />
			</Row>
		</BoardContext>
	);
};

export default App;
