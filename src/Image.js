import React from 'react'

import { BASE_URL, PHOTO_HEIGHT, TOP_MARGIN } from './enums'

class Image extends React.Component {
  constructor() {
    super()
    this._container = React.createRef()
    this.state = {
      isCentered: false
    }
  }

  componentDidMount() {
    var options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    }
    console.log(this._container)
    const observer = new IntersectionObserver(() => this.setState({ isCentered: true }), options)
    observer.observe(this._container.current)
  }

  render() {
    const { colors, dir, file } = this.props
    return (
      <div
        ref={this._container}
        style={{
          marginLeft: Math.random() * 100,
          height: PHOTO_HEIGHT,
          width: 500,
          marginTop: TOP_MARGIN,
          backgroundColor: colors[0],
          border: `3px solid ${colors[1]}`,
          borderRadius: 3,
          transition: 'all 750ms ease'
        }}
      >
        {this.state.isCentered && (
          <img
            src={`${BASE_URL}/${dir}/${file}`}
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
  }
}

export default Image
