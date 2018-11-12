import React from 'react'

import { BASE_URL, PHOTO_HEIGHT, TOP_MARGIN } from './enums'

class Image extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasImageLoaded: false
    }
    this.img = React.createRef()
  }

  componentDidMount() {
    if (this.img.current && this.img.current.complete) {
      this.setState({ hasImageLoaded: true })
    }
  }

  render() {
    const { image, activeIds, id, forwardedRef } = this.props
    return (
      <div
        ref={forwardedRef}
        id={id}
        style={{
          height: PHOTO_HEIGHT,
          width: 500,
          marginTop: TOP_MARGIN,
          backgroundColor: image.colors[0],
          borderRadius: 3
        }}
      >
        {activeIds.includes(image.file) && (
          <img
            ref={this.img}
            className={this.state.hasImageLoaded ? 'fade-in-card' : 'hidden-card'}
            onLoad={() => this.setState({ hasImageLoaded: true })}
            src={`${BASE_URL}/${image.dir}/${image.file}`}
            alt="img"
            style={{ width: 500, height: PHOTO_HEIGHT, borderRadius: 3 }}
          />
        )}
      </div>
    )
  }
}

export default React.forwardRef((props, ref) => <Image forwardedRef={ref} {...props} />)
