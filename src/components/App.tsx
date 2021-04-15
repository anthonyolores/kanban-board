import * as React from 'react';
import './style.scss';
import Board from './Board';
import BoardContext, { AppContext } from './BoardContext';
import JSONEditor from './JSONEditor';
import styled from 'styled-components';

const Row = styled.div({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	width: '100%',
});

const JSONEditorContainerStyled = styled.div({ height: '100vh' });

const BoardContainerStyled = styled.div({
	flexGrow: 1,
});

const HideButton = styled.button({
	position: 'relative',
	fontSize: '1.8em',
	zIndex: 1,
	top: '90%',
	transformY: 'translate(-90%)',
	left: '-33px',
	padding: '10px',
	borderRadius: '100%',
	border: 'none',
	background: '#095461',
	color: '#17a2b8',
	'&:hover': {
		background: '#117a8b',
	},
	'&:active': {
		background: '#095461',
	},
});

const BoardContainer: React.FC = () => {
	const { hideEditor, setHideEditor } = React.useContext(AppContext);
	return (
		<BoardContainerStyled>
			{/* <HideButton onClick={() => setHideEditor(!hideEditor)}>{'<>'}</HideButton> */}
			<Board />
		</BoardContainerStyled>
	);
};

const JSONEditorContainer: React.FC = () => {
	const { hideEditor } = React.useContext(AppContext);

	if (hideEditor)
		return (
			<JSONEditorContainerStyled>
				<JSONEditor />
			</JSONEditorContainerStyled>
		);

	return null;
};

const App: React.FC = () => {
	return (
		<BoardContext>
			<Row>
				<JSONEditorContainer />
				<BoardContainer />
			</Row>
		</BoardContext>
	);
};

export default App;
