import React from 'react';
import styled from 'styled-components';
import { ItemData } from './type';

export type ColumnButtonProps = { name: string };

const ColumnButtonStyled = styled.div({
	padding: '15px',
	marginBottom: '15px',
	border: 'dashed 1px #444',
	backgroundColor: '#efefef',
	fontWeight: 'bolder',
	opacity: '0.5',
});

const ColumnButton: React.FC<ColumnButtonProps> = ({ name }) => {
	return <ColumnButtonStyled>{name}</ColumnButtonStyled>;
};

export default ColumnButton;
