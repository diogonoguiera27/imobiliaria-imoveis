import styled from "styled-components";

export const SelectElement = styled.select`
  padding: 10px 13px;

  font-size: 14px;
  font-weight: 500;

  color: #5e6278;
  border: 1px solid #e1e3ea;
  border-radius: 4px;

  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;

  &:focus {
    border-color: #115e59;
    box-shadow: 0 3px 10px 0 rgba(34, 41, 47, 0.1);
  }

  &:focus-visible {
    border-color: #115e59;
    box-shadow: 0 3px 10px 0 rgba(34, 41, 47, 0.1);
  }
`;
