import React, { Component } from 'react'
import uniqBy from 'lodash/uniqBy'

import photoData from './photoData.json'
import { PHOTO_HEIGHT, TOP_MARGIN, HEADER_HEIGHT } from './enums'
import Image from './Image'

photoData.sort((a, b) => parseInt(b.dir) - parseInt(a.dir))

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeThing: { id: [], ratio: 0, date: null },
      activeIds: [],
      docHeight: photoData.length * (PHOTO_HEIGHT + TOP_MARGIN) + HEADER_HEIGHT
    }

    const parseDate = dir => {
      const [year, month] = [dir.slice(0, 4), dir.slice(4)]
      return `${month} - ${year}`
    }

    this.buckets = uniqBy(photoData, 'dir').map(({ dir }) => parseDate(dir))
    this.rootRef = React.createRef()
    this.singleRefs = photoData.reduce((acc, value) => {
      acc[value.file] = {
        date: parseDate(value.dir),
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
        this.setState(prevState => {
          return {
            ...prevState,
            activeThing,
            activeIds: prevState.activeIds.includes(activeThing.id)
              ? prevState.activeIds
              : [...prevState.activeIds, activeThing.id]
          }
        })
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
        <div style={{ flex: 1 }}>
          <div
            style={{
              position: 'fixed',
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100vh - 24px)',
              marginLeft: 12,
              marginTop: 12,
              marginBottom: 12
            }}
          >
            {this.buckets.map((bucket, idx) => {
              return (
                <span
                  key={idx}
                  style={{ flex: 1, fontSize: 12, fontWeight: this.state.activeThing.date === bucket ? 700 : 400 }}
                >
                  {bucket} {this.state.activeThing.date === bucket && '◀'}
                </span>
              )
            })}
          </div>
        </div>
        <div style={{ flex: 1 }} ref={this.rootRef}>
          {photoData.map((image, idx) => {
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
        <div
          style={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'flex-end',
            marginTop: 12,
            marginRight: 12
          }}
        >
          <span
            style={{
              position: 'fixed',
              fontWeight: 700,
              fontSize: 12
            }}
          >
            IG-ME
          </span>
        </div>
      </div>
    )
  }
}

export default App
