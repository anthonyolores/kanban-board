import React, { useEffect } from 'react';
import { useContext } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { AppContext } from './BoardContext';

const JSONEditor: React.FC = () => {
	const { columns, setColumns } = useContext(AppContext);

	function handleJSONChange(next: any) {
		if (!next.error) setColumns(JSON.parse(next.json));
	}

	return (
		<JSONInput
			id='JSONInput'
			placeholder={JSON.parse(JSON.stringify(columns))}
			locale={locale}
			onChange={handleJSONChange}
			width='550px'
			height='100vh'
			style={{ body: { fontSize: '1.1em' } }}
			colors={{ background: '#111A23' }}
		/>
	);
};

export default JSONEditor;
