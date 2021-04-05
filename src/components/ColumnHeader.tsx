import React = require('react');
import styled from 'styled-components';
import { ItemData } from './type';

export type ColumnHeaderProps = { name: string };

const ColumnItemStyled = styled.div({
	padding: '15px',
	marginBottom: '15px',
	fontSize: '1.5em',
	fontWeight: 'bold',
});

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ name }) => {
	return <ColumnItemStyled>{name}</ColumnItemStyled>;
};

export default ColumnHeader;
