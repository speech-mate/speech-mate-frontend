import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

const MainLayout = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
`;

export default Layout;
