import { injectGlobal } from 'styled-components';
import OpenSansLight300Woff2 from '../../fonts/open-sans-v15-latin/open-sans-v15-latin-300.woff2';
import OpenSansLight300Woff from '../../fonts/open-sans-v15-latin/open-sans-v15-latin-300.woff';
import OpenSansRegularWoff from '../../fonts/open-sans-v15-latin/open-sans-v15-latin-regular.woff';
import OpenSansRegularWoff2 from '../../fonts/open-sans-v15-latin/open-sans-v15-latin-regular.woff2';
import RobotoWoff from '../../fonts/roboto-v18-latin/roboto-v18-latin-regular.woff';
import RobotoWoff2 from '../../fonts/roboto-v18-latin/roboto-v18-latin-regular.woff2';

injectGlobal`
  /* Material Design icons, https://google.github.io/material-design-icons/ */
  /* @import '~material-design-icons/iconfont/material-icons.css'; */

  /* Fonts downloaded from:
   * https://google-webfonts-helper.herokuapp.com/fonts */

  /* open-sans-300 - latin */
  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 300;
    src: local('Open Sans Light'), local('OpenSans-Light'),
      url('${OpenSansLight300Woff2}') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
      url('${OpenSansLight300Woff}') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
  }

  /* open-sans-regular - latin */
  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 400;
    src: local('Open Sans Regular'), local('OpenSans-Regular'),
      url('${OpenSansRegularWoff2}') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
      url('${OpenSansRegularWoff}') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */

  }

  /* roboto-regular - latin */
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: local('Roboto'), local('Roboto-Regular'),
      url('${RobotoWoff2}') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
      url('${RobotoWoff}') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
  }

  /* Apply a natural box layout model to all elements, but allowing components to change */
  html {
    font-family: 'Open Sans', sans-serif;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }

  /* Add any global CSS below */
  .App-container {
    font-family: 'Open Sans', sans-serif;
  }

  /* This style is used to visually hide content that should only be read to screen-readers */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    border: 0;
  }
`;
