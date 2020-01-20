import React, { Component } from 'react';

class ImageAsset extends Component {
  render() {
    const assetManager = this.props.assetManager;
    const src = assetManager.load(this.props.assetId);
    return <img src={src} alt="img" />;
  }
}

export default ImageAsset;
