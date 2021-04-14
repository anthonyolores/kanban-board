import * as React from 'react';
import './style.scss';
import Board from './Board';
import BoardContext from './BoardContext';

const App: React.FC = () => {
	return (
		<BoardContext>
			<Board />
		</BoardContext>
	);
};

export default App;
