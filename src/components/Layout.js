import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

const MainLayout = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
`;

function Layout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

export default Layout;
