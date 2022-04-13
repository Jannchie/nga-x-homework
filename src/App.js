import './App.css';

import data from './data/data.json';
import ShuffleText from 'shuffle-text';
import { useEffect, useRef, useState } from 'react';

function animate({ timing, draw, duration }) {
  let start = performance.now();
  return requestAnimationFrame(function ani(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    let progress = timing(timeFraction);
    draw(progress);
    if (timeFraction < 1) {
      requestAnimationFrame(ani);
    }
  });
}

function Link(title) {
  const self = useRef(null)
  // init animation
  useEffect(() => {
    const text = new ShuffleText(self.current);
    if (self.current.innerText === title) {
      text.emptyCharacter = '';
      text.setText(title);
      text.start();
    }
  }, [title])
  return <li ref={self} onMouseEnter={(e) => {
    e.target.style.width = `${e.target.offsetWidth}px`
    const text = new ShuffleText(e.target);
    if (e.target.innerText === title) {
      text.emptyCharacter = '';
      text.setText(title);
      text.start();
    }
  }} className="link-item">
    <a href="/">{title}</a>
  </li>;
}

function Card(d) {
  let credits
  if (d.credits_thumb) {
    credits = d.credits_thumb?.map((c, i) => {
      return (
        <p className="desc-line" key={i}>
          {c.title} : {c.name}
        </p>
      )
    });
  } else {
    credits = d.credits?.filter((c, i) => i < 4).map((c, i) => {
      return (
        <p className="desc-line" key={i}>
          {c.title} : {c.name}
        </p>
      )
    });
  }
  const title = useRef(null)
  useEffect(() => {
    if (title.current?.innerText === d.title) {
      title.current.style.height = `${title.current.offsetHeight}px`
      var text = new ShuffleText(title.current);
      text.emptyCharacter = ''
      text.start();
    }
  }, [d.title])
  return (
    <div className="grid-item" onMouseEnter={() => {
      if (title.current?.innerText === d.title) {
        title.current.style.height = `${title.current.offsetHeight}px`
        var text = new ShuffleText(title.current);
        text.emptyCharacter = ''
        text.start();
      }
    }} key={d.title}>
      <div className="img-wrapper">
        <img className="img-item" alt={d.title} src={`http://kashiwasato.com/${d.mobile_image?.url ?? d.header_image ?? ""}`}></img>
      </div>
      <div className="title-wrapper">
        <div className="item-title" ref={title}>
          {d.title}
        </div>
      </div>
      <div className="item-thumb">
        {credits}
      </div>
      <p className="more">
        <span>READ MORE </span>
        <span className="plus">+</span>
      </p>
    </div>
  );
}

function App() {
  const [searchText, setSearchText] = useState("");
  let currentData;
  if (searchText !== "") {
    currentData = data.filter(d => {
      const jsonStr = JSON.stringify(d);
      return jsonStr.toLowerCase().includes(searchText.toLowerCase())
    })
  } else {
    currentData = data;
  }
  const titleDOM = useRef(null)
  const subTitleDOM = useRef(null)
  const gridList = [];
  for (let i = 0; i < currentData.length; i++) {
    gridList.push(<Card key={i} {...currentData[i]} />)
  }
  // init animation
  useEffect(() => {
    if (titleDOM.current?.innerText === "KASHIWA SATO" && subTitleDOM.current?.innerText === "SAMURAI INC. TOKYO") {
      const text1 = new ShuffleText(titleDOM.current);
      text1.setText("KASHIWA SATO")
      text1.emptyCharacter = ''
      text1.start();
      const text2 = new ShuffleText(subTitleDOM.current);
      text2.setText("SAMURAI INC. TOKYO")
      text2.emptyCharacter = ''
      text2.start();
    }
  }, [])
  return (
    <div className="App">
      <header className="header">
        <div className="black-bar" style={{ borderLeft: "34px solid #000", cursor: "pointer" }} onMouseEnter={
          (e) => {
            if (titleDOM.current?.innerText === "KASHIWA SATO" && subTitleDOM.current?.innerText === "SAMURAI INC. TOKYO") {
              const textTitle = new ShuffleText(titleDOM.current);
              textTitle.setText("KASHIWA SATO")
              textTitle.emptyCharacter = ''
              textTitle.start();
              const textSubTitle = new ShuffleText(subTitleDOM.current);
              textSubTitle.setText("SAMURAI INC. TOKYO")
              textSubTitle.emptyCharacter = ''
              textSubTitle.start();
            }
          }
        }>
          <div className="title-group">
            <span ref={titleDOM} className="page-title">KASHIWA SATO</span>
            <span ref={subTitleDOM} style={{
              marginLeft: 20,
              color: "#999",
            }}>SAMURAI INC. TOKYO</span>
          </div>
        </div>
        <div className="link-list" style={{ marginRight: 80, marginTop: -1 }}>
          <ul style={{ display: "inline-block" }}>
            {Link("PROJECT")}
            <li className="line"> </li>
            {Link("PROFILE")}
            <li className="line"> </li>
            {Link("CONTACT")}
          </ul>
          <ul style={{ display: "inline-block", marginRight: 38 }}>
            {Link("ENGLISH")}
            <li className="line"> </li>
            {Link("JAPANESE")}
            <li className="line"> </li>
            {Link("CHINESE")}
          </ul>
          {Seacher({ setSearchText })}
        </div>
      </header>
      <div className="grid-container">
        {gridList}
      </div>
      <footer style={{ margin: 80, marginBottom: 40, textAlign: "left" }}>COPYRIGHT © SAMURAI INC. ALL RIGHTS RESERVED.</footer>
    </div>
  );
}

export default App;
function Seacher({ setSearchText }) {
  const search = useRef(null)
  function circ(timeFraction) {
    return 1 - Math.sin(Math.acos(timeFraction));
  }
  return <div id="search" style={{ display: "inline", cursor: "pointer" }}
    onMouseEnter={(e) => {
      if (search.current && search.current !== document.activeElement && search.current.style.width === "0px") {
        animate({
          duration: 200,
          timing: circ,
          draw: (progress) => {
            if (search.current) {
              search.current.style.opacity = progress;
              search.current.style.width = `${progress * 300}px`;
            }
          },
        })
      }
    }}
    onMouseLeave={(e) => {
      if (search.current) {
        // if not focused
        if (search.current !== document.activeElement) {
          animate({
            duration: 50,
            timing: circ,
            draw: (progress) => {
              if (search.current) {
                search.current.style.opacity = 1 - progress;
                search.current.style.width = `${(1 - progress) * 300}px`;
              }
            },
          })
        }
      }
    }}
    onBlur={(e) => {
      animate({
        duration: 50,
        timing: circ,
        draw: (progress) => {
          if (search.current) {
            search.current.style.opacity = 1 - progress;
            search.current.style.width = `${(1 - progress) * 300}px`;
          }
        },
      })
    }}
  >
    <input
      type="text"
      className="search-text"
      ref={search}
      onChange={(e) => {
        setSearchText(e.target.value)
      }}
      placeholder="PLEASE INPUT KEYWORD"
      style={{
        width: 0,
        opacity: 0,
        position: "absolute",
        right: -5,
        marginTop: -8,
        zIndex: 10,
      }} />
    <div className="search-icon"></div>
  </div >;
}

