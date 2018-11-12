import React, { Component } from 'react'

import photoData from './photoData.json'
import { PHOTO_HEIGHT, TOP_MARGIN, HEADER_HEIGHT } from './enums'
import Image from './Image'

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
          {this.state.data.map((image, idx) => {
            return (
              <Image
                key={idx}
                ref={this.singleRefs[image.file].ref}
                id={this.singleRefs[image.file].id}
                activeIds={this.state.activeIds}
                image={image}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

export default App
