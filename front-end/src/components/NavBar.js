import styled from 'styled-components';

export const navBarHeight = '60px';

const NavBar = styled.nav`
  height: ${navBarHeight};
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.06);
  position: relative;

  .server-details {
    margin-right: 15px;
    display: flex;
    align-items: center;

    .user-info {
      margin-right: 10px;
      display: flex;
      align-items: center;
    }
  }
`;

export default NavBar;
