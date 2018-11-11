import React, { Component } from 'react'

import photoData from './photoData.json'
import { BASE_URL, PHOTO_HEIGHT, TOP_MARGIN, HEADER_HEIGHT } from './enums'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeThing: { id: [], ratio: 0 },
      activeIds: [],
      docHeight: photoData.length * (PHOTO_HEIGHT + TOP_MARGIN) + HEADER_HEIGHT,
      data: photoData
    }
    this.rootRef = React.createRef()
    this.singleRefs = this.state.data.reduce((acc, value) => {
      acc[value.file] = {
        id: value.file,
        ref: React.createRef(),
        ratio: 0
      }
      return acc
    }, {})

    const callback = entries => {
      entries.forEach(entry => (this.singleRefs[entry.target.id].ratio = entry.intersectionRatio))
      const activeThing = Object.values(this.singleRefs).reduce(
        (acc, value) => (value.ratio > acc.ratio ? value : acc),
        this.state.activeThing
      )

      if (activeThing.ratio > this.state.activeThing.ratio) {
        if (!this.state.activeIds.includes(activeThing.id)) {
          this.setState(prevState => ({
            ...prevState,
            activeThing,
            activeIds: [...prevState.activeIds, activeThing.id]
          }))
        }
      }
    }

    this.observer = new IntersectionObserver(callback, {
      root: this.rootRef.current,
      threshold: new Array(101).fill(0).map((v, i) => i * 0.01)
    })
  }

  componentDidMount() {
    Object.values(this.singleRefs).forEach(value => this.observer.observe(value.ref.current))
  }

  render() {
    return (
      <div style={{ height: this.state.docHeight, display: 'flex', justifyContent: 'center' }}>
        <header style={{ height: HEADER_HEIGHT }}>header</header>
        <div ref={this.rootRef}>
          {this.state.data.map((img, idx) => {
            return (
              <div
                key={idx}
                ref={this.singleRefs[img.file].ref}
                id={this.singleRefs[img.file].id}
                style={{
                  height: PHOTO_HEIGHT,
                  width: 500,
                  marginTop: TOP_MARGIN,
                  backgroundColor: img.colors[0],
                  borderRadius: 3
                }}
              >
                {this.state.activeIds.includes(img.file) && (
                  <img
                    src={`${BASE_URL}/${img.dir}/${img.file}`}
                    alt="img"
                    style={{
                      width: 500,
                      height: PHOTO_HEIGHT,
                      borderRadius: 3
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default App
