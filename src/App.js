import React, {useRef, useState, useLayoutEffect} from 'react';
import styled, {css} from 'styled-components';
import { BsList, BsX } from 'react-icons/bs'
import { AiOutlineHeatMap } from "react-icons/ai";
import P5Wrapper from 'react-p5-wrapper';

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

function App() {

    const [isOpen, setIsOpen] = useState(false);
    const [delay, setDelay] = useState(true);
    const [savedPos, setSavedPos] = useState(0);

    const collatzRef = useRef();
    const walksRef = useRef();
    const voronoiRef = useRef();
    const recamanRef = useRef();
    const coronaRef = useRef();
    const ringzRef = useRef();
    const polarRosesRef = useRef();

    const scrollTo = ref => ref.current.scrollIntoView({ behavior: 'smooth' });


    const handleClick = (ref) => {
        toggleClose();
        setTimeout(() => {
            scrollTo(ref)
        }, 400)
    };


    const toggleOpen = () => {
        setIsOpen(true)
        setSavedPos(window.pageYOffset)
    }

    const toggleClose = () => {
        setIsOpen(false)
        // setTimeout(() =>{
        //     setDelay(!delay)
        // }, 700)
        // setSavedPos(contentRef.current.scrollTop);
    }

  return (
      <Main>
          <MenuToggle onClick={() => !isOpen ? toggleOpen() : toggleClose()}>
              <StyledOpenBtn />
          </MenuToggle>
          <MenuItems>
              <MenuItem isOpen={isOpen}>
                  <ProcessingBtn/>
                  <MenuLink onClick={() => handleClick(collatzRef)}>
                      Collatz
                  </MenuLink>
              </MenuItem>
              <MenuItem isOpen={isOpen}>
                  <ProcessingBtn/>
                  <MenuLink onClick={() => handleClick(walksRef)}>
                      Walks
                  </MenuLink>
              </MenuItem>
              <MenuItem isOpen={isOpen}>
                  <ProcessingBtn/>
                  <MenuLink onClick={() => handleClick(voronoiRef)}>
                      Voronoi
                  </MenuLink>
              </MenuItem>
              <MenuItem isOpen={isOpen}>
                  <ProcessingBtn/>
                  <MenuLink onClick={() => handleClick(recamanRef)}>
                      Recaman
                  </MenuLink>
              </MenuItem>
              <MenuItem isOpen={isOpen}>
                  <ProcessingBtn/>
                  <MenuLink onClick={() => handleClick(coronaRef)}>
                      Corona
                  </MenuLink>
              </MenuItem>
              <MenuItem isOpen={isOpen}>
                  <ProcessingBtn/>
                  <MenuLink onClick={() => handleClick(ringzRef)}>
                      Ringz
                  </MenuLink>
              </MenuItem>
              <MenuItem isOpen={isOpen}>
                  <ProcessingBtn/>
                  <MenuLink onClick={() => handleClick(polarRosesRef)}>
                      Polar Roses
                  </MenuLink>
              </MenuItem>
          </MenuItems>
          <Content id={'content'} isOpen={isOpen}>
              <div ref={voronoiRef}>
                  {/*<P5Wrapper sketch={Voronoi}/>*/}
              </div>
              <div ref={collatzRef}>
                  {/*<P5Wrapper sketch={Collatz}/>*/}
              </div>
              <div ref={walksRef}>
                  {/*<P5Wrapper sketch={Walks}/>*/}
              </div>
              <div ref={recamanRef}>
                  {/*<P5Wrapper sketch={Recaman}/>*/}
              </div>
              <div ref={coronaRef}>
                  {/*<P5Wrapper sketch={Corona}/>*/}
              </div>
              <div ref={ringzRef}>
                  {/*<P5Wrapper sketch={Ringz}/>*/}
              </div>
              <div ref={polarRosesRef}>
                  {/*<P5Wrapper sketch={PolarRoses}/>*/}
              </div>
          </Content>
      </Main>
  );
}

export default App;
