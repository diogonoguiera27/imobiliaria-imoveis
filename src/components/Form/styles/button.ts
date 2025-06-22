import styled from "styled-components";

export const ButtonElement = styled.button`
  background-color: var(--color-cardapiaPrimaryColor);
  color: white;
  font-weight: bold;
  width: 100%;
  text-decoration-color: var(--primary-foreground);
  box-shadow: var(--shadow-xs);
  padding: 0.75rem;
  border-radius: 0.375rem;
  transition: all ease-in-out 0.1s;

  &:hover {
    cursor: pointer;
    box-shadow: 0 0 10px 0 var(--color-cardapiaPrimaryColor);
  }

  &[data-active="true"] {
    background-color: #c23628;
    box-shadow: 0 0 10px 0 #c23628;
  }
`;
