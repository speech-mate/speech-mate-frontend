import React from "react";
import propTypes from "prop-types";
import styled from "styled-components";

function NavBar({ onReturnBtnClick }) {
  return (
    <NavBarLayout>
      <ReturnBox onClick={onReturnBtnClick}>
        <i className="fa-solid fa-chevron-left"></i>
        <span>뒤로가기</span>
      </ReturnBox>
    </NavBarLayout>
  );
}

const NavBarLayout = styled.nav`
  width: 100%;
  height: 70px;
`;

const ReturnBox = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  i {
    margin-left: 15px;
    font-size: 18px;
  }

  span {
    margin-left: 10px;
    font-size: 20px;
  }
`;

NavBar.propTypes = {
  onReturnBtnClick: propTypes.func,
};

export default NavBar;
