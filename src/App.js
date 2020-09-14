import React, {useRef, useState, useLayoutEffect} from 'react';
import styled, {css} from 'styled-components';
import { BsList, BsX } from 'react-icons/bs'
import { AiOutlineHeatMap } from "react-icons/ai";
import P5Wrapper from 'react-p5-wrapper';
import { Tabs, Tab, Panel } from '@bumaga/tabs';

import Collatz from "./sketches/collatz/Collatz";
import Voronoi from "./sketches/voronoi/Voronoi";
import Walks from "./sketches/walks/Walks";
import Recaman from "./sketches/recaman/Recaman";
import Corona from "./sketches/corona/Corona";
import Ringz from "./sketches/ringz/Ringz";
import PolarRoses from "./sketches/polar_roses/PolarRoses";


const transitionBezier = 'cubic-bezier(.5,0,.5,1);';
const transitionTime = '0.5s';

const Main = styled.div`
    background-color:${props => props.theme.background};
    overflow: hidden;
    height: auto;
    z-index:-10;
`

const Content = styled.main`
    transform-origin: top left;
    transition: transform ${transitionTime} ${transitionBezier};
    transform: ${props => props.isOpen ? 'translate(260px) ' : 'translate(0px)'};
    overflow:auto;
    height:auto;
`

const MenuToggle = styled.span`
    z-index: 10;
    position: fixed;
    top:0;
    left:0;
    display:block;
    cursor:pointer;
    width:4.0em;
    height:3.8em;
    background-color:${props => props.theme.primary};
    border-bottom-right-radius:35%;
`

const StyledOpenBtn = styled(BsList)`
    position:absolute;
    top:50%;
    left:50%;
    font-size:1.8rem;
    margin-top: -15px;
    margin-left: -12px;
    color: white;
`

const MenuItems = styled.ul`
    position:fixed;
    bottom:0;
    left:1.5em;
    list-style:none;
    margin:0;
    padding:0;
    padding-bottom:0.5em;
`

const MenuItem = styled.li`
    display:flex;
    height: 7.95vh;
    transform:translateX(-300px);
    transition:transform ${transitionTime} ${transitionBezier};
    ${ props => props.isOpen && css`
        transform: translateX(0);
        transition: transform ${transitionTime} ${transitionBezier};
    `} 
`
const menuIconStyles = `
    position: relative;
    width:2.25em;
    height:2.25em;
    display: inline-block;
    margin-right: 20px;
    color: rgba(255,255,255,0.87);
`

const MenuLink = styled.a`
    display:flex;
    line-height:2.25em;
    text-decoration:none;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: ${props => props.theme.medium};
    transition: color 0.2s;
    &:hover{
        color: ${props => props.theme.high};
        cursor:pointer;
    }
`

const ProcessingBtn = styled(AiOutlineHeatMap)`
  ${menuIconStyles}
`

const TabButtons = styled.div`
  
`

const TabButton = styled.button`
  padding: 0;
  font: inherit;
  color: black;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
`

function App() {

  return (
      <Main>
          <Content id={'content'}>
              <Tabs>
                  <TabButtons>
                      <Tab><TabButton>Tab 1</TabButton></Tab>
                      <Tab><TabButton>Tab 2</TabButton></Tab>
                      <Tab><TabButton>Tab 3</TabButton></Tab>
                      <Tab><TabButton>Tab 4</TabButton></Tab>
                      <Tab><TabButton>Tab 5</TabButton></Tab>
                      <Tab><TabButton>Tab 6</TabButton></Tab>
                      <Tab><TabButton>Tab 7</TabButton></Tab>
                  </TabButtons>
                  <Panel><P5Wrapper sketch={Recaman}/></Panel>
                  <Panel><P5Wrapper sketch={Ringz}/></Panel>
                  <Panel><P5Wrapper sketch={Voronoi}/></Panel>
                  <Panel><P5Wrapper sketch={Walks}/></Panel>
                  <Panel><P5Wrapper sketch={Corona}/></Panel>
                  <Panel><P5Wrapper sketch={PolarRoses}/></Panel>
                  <Panel><P5Wrapper sketch={Collatz}/></Panel>
              </Tabs>

          </Content>
      </Main>
  );
}

export default App;

// <div ref={voronoiRef}>
//     {/*<P5Wrapper sketch={Voronoi}/>*/}
// </div>
// <div ref={collatzRef}>
//     {/*<P5Wrapper sketch={Collatz}/>*/}
// </div>
// <div ref={walksRef}>
//     {/*<P5Wrapper sketch={Walks}/>*/}
// </div>
// <div ref={recamanRef}>
//     {/*<P5Wrapper sketch={Recaman}/>*/}
// </div>
// <div ref={coronaRef}>
//     {/*<P5Wrapper sketch={Corona}/>*/}
// </div>
// <div ref={ringzRef}>
//     {/*<P5Wrapper sketch={Ringz}/>*/}
// </div>
// <div ref={polarRosesRef}>
//     {/*<P5Wrapper sketch={PolarRoses}/>*/}
// </div>
