<p align="center">
 <img width="100px" src="https://raw.githubusercontent.com/tkhduracell/spotify-web-playback-ts/main/.github/images/favicon512x512-npm.png" align="center" alt="spotify-web-playback-ts" />
 <h2 align="center">spotify-web-playback-ts</h2>
 <p align="center">TypeScript Wrapper for Spotify Playback SDK</p>
  <p align="center">
    <a href="https://github.com/tkhduracell/spotify-web-playback-ts/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/tkhduracell/spotify-web-playback-ts?style=flat&color=336791" />
    </a>
    <a href="https://github.com/tkhduracell/spotify-web-playback-ts/pulls">
      <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/tkhduracell/spotify-web-playback-ts?style=flat&color=336791" />
    </a>
     <a href="https://github.com/tkhduracell/spotify-web-playback-ts">
      <img alt="GitHub Downloads" src="https://img.shields.io/npm/dw/spotify-web-playback-ts?style=flat&color=336791" />
    </a>
    <a href="https://github.com/tkhduracell/spotify-web-playback-ts">
      <img alt="GitHub Total Downloads" src="https://img.shields.io/npm/dt/spotify-web-playback-ts?color=336791&label=Total%20downloads" />
    </a>
 <a href="https://github.com/tkhduracell/spotify-web-playback-ts">
      <img alt="GitHub release" src="https://img.shields.io/github/release/tkhduracell/spotify-web-playback-ts.svg?style=flat&color=336791" />
    </a>
    <br />
    <br />
 <a href="https://github.com/tkhduracell/spotify-web-playback-ts/actions/workflows/node.js-macos.yml">
      <img alt="Node.js CI on Darwin" src="https://github.com/tkhduracell/spotify-web-playback-ts/actions/workflows/node.js-macos.yml/badge.svg" />
    </a>
  <a href="https://github.com/tkhduracell/spotify-web-playback-ts/actions/workflows/node.js-ubuntu.yml">
      <img alt="Node.js CI on Ubuntu" src="https://github.com/tkhduracell/spotify-web-playback-ts/actions/workflows/node.js-ubuntu.yml/badge.svg" />
    </a>
 <a href="https://github.com/tkhduracell/spotify-web-playback-ts/actions/workflows/node.js-windows.yml">
      <img alt="Node.js CI on Windows" src="https://github.com/tkhduracell/spotify-web-playback-ts/actions/workflows/node.js-windows.yml/badge.svg" />
    </a>
    <br />
    <br />
 <a href="https://github.com/tkhduracell/spotify-web-playback-ts/actions/workflows/npm-publish.yml">
      <img alt="Node.js Package" src="https://github.com/tkhduracell/spotify-web-playback-ts/actions/workflows/npm-publish.yml/badge.svg" />
    </a>
 <a href="https://github.com/tkhduracell/spotify-web-playback-ts/actions/workflows/codeql-analysis.yml">
      <img alt="CodeQL" src="https://github.com/tkhduracell/spotify-web-playback-ts/actions/workflows/codeql-analysis.yml/badge.svg?style=flat&color=336791" />
    </a>
    <br />
    <br />
  <a href="https://github.com/tkhduracell/spotify-web-playback-ts/issues/new/choose">Report Bug</a>
  <a href="https://github.com/tkhduracell/spotify-web-playback-ts/issues/new/choose">Request Feature</a>
  </p>
 <h3 align="center">Systems on which it has been tested:</h3>
 <p align="center">
   <a href="https://www.apple.com/br/macos/">
      <img alt="Macos" src="https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=apple&logoColor=white&style=flat" />
  </a>
</p>

# Getting started

## Installation
```bash
npm i --save spotify-web-playback-ts
```

## Usage
```js
async function load() {
  const accessToken = '...'
  // Init playback SDK by adding async script to document and await load
  const player = await SpotifyPlayer.init(document, 'Browser Player!', 0.5, cb => cb(accessToken))
  
  // Connect the player
  await player.connect()

  // Listen to player state
  player.onPlayerStateChanged(state => console.log('State changed', state)

  // Toggle playback
  await player.togglePlay()
}

load()
```

## Documentation

1. Read the [Spotify Playback SDK Quickstart](https://developer.spotify.com/documentation/web-playback-sdk/quick-start/)

2. Read the [Spotify Playback SDK API reference](https://developer.spotify.com/documentation/web-playback-sdk/reference/#api-spotify-player)

3. See [SpotifyPlayer type insterface](./src/index.ts) for usage
