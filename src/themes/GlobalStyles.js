import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`

html, body, #root{
    
    height: 100%;
    color:rgba(255,255,255,0.87);
    background-color:#171F24;
}

* {
    font-family: "Roboto", sans-serif;
    padding: 0 ;
    margin: 0;
    box-sizing: border-box;
    &:focus {
    outline: 0;
}
&:visited { text-decoration: none; color:rgba(255,255,255,0.87); }
}

a {
    text-decoration: none;
   }
`

export default GlobalStyles
