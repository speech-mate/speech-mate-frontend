import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

function Modal({ setOnModal, children }) {
  const closeModal = () => {
    setOnModal(false);
  };

  return (
    <ModalWrapper>
      <ModalOverlay onClick={closeModal} />
      <ModalContent>{children}</ModalContent>
    </ModalWrapper>
  );
}

const ModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const ModalOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  height: 100%;
  width: 100%;
  position: absolute;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: var(--ice-grey-color);
  padding: 20px 10px;
  width: 80%;
  text-align: center;
  border-radius: 5px;
  color: black;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
`;

Modal.propTypes = {
  setOnModal: PropTypes.func,
  children: PropTypes.element,
};

export default Modal;
