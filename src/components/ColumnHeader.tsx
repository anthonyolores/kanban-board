import React from 'react';
import styled from 'styled-components';

export type ColumnHeaderProps = { name: string };

const ColumnItemStyled = styled.div({
	padding: '15px',
	fontSize: '1.5em',
	fontWeight: 'bold',
});

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ name }) => {
	return <ColumnItemStyled>{name}</ColumnItemStyled>;
};

export default ColumnHeader;
