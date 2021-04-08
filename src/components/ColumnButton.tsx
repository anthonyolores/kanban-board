import React from 'react';
import styled from 'styled-components';

export type ColumnButtonProps = { name: string; onClick?: () => void };

const ColumnButtonStyled = styled.button({
	padding: '15px',
	marginBottom: '15px',
	border: 'dashed 1px #444',
	backgroundColor: '#efefef',
	fontWeight: 'bolder',
	opacity: '0.5',
});

const ColumnButton: React.FC<ColumnButtonProps> = ({ name, onClick }) => {
	function handleClick() {
		onClick?.();
	}

	return <ColumnButtonStyled onClick={handleClick}>{name}</ColumnButtonStyled>;
};

export default ColumnButton;
