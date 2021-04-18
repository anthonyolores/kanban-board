import React from 'react';
import styled from 'styled-components';

export type ColumnButtonProps = { name: string; onClick?: () => void };

const ColumnButtonStyled = styled.button({
	padding: '15px',
	color: '#c4c7ca',
	backgroundColor: '#111a23',
	marginTop: '15px',
	fontWeight: 'bolder',
	border: '1px solid #2a4158',
	'&:hover': {
		backgroundColor: '#2A4158',
	},
	'&:active': {
		backgroundColor: '#2a4158',
	},
});

const ColumnButton: React.FC<ColumnButtonProps> = ({ name, onClick }) => {
	function handleClick() {
		onClick?.();
	}

	return <ColumnButtonStyled onClick={handleClick}>{name}</ColumnButtonStyled>;
};

export default ColumnButton;
