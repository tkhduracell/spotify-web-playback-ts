
export type SpotifyPlayerError = 'initialization_error' | 'authentication_error'| 'account_error'| 'playback_error'

export type SpotifyPlayerTrack = {
  uri: string, // Spotify URI
  id?: string, // Spotify ID from URI (can be null)
  type: 'track' | 'episode' | 'ad', // Content type: can be "track", "episode" or "ad"
  media_type: 'audio' | 'video', // Type of file: can be "audio" or "video"
  name: string, // Name of content
  is_playable: boolean, // Flag indicating whether it can be played
  album: {
    uri: string, // Spotify Album URI
    name: string,
    images: [
      { url: string }
    ]
  },
  artists: [
    { uri: string, name: string }
  ]
}

export type SpotifyPlayerState = {
  context: {
    uri?: string, // The URI of the context (can be null)
    metadata?: Record<string, string | number>, // Additional metadata for the context (can be null)
  },
  disallows: { // A simplified set of restriction controls for
    pausing: boolean, // The current track. By default, these fields
    peeking_next: boolean, // will either be set to false or undefined, which
    peeking_prev: boolean, // indicates that the particular operation is
    resuming: boolean, // allowed. When the field is set to `true`, this
    seeking: boolean, // means that the operation is not permitted. For
    skipping_next: boolean, // example, `skipping_next`, `skipping_prev` and
    skipping_prev: boolean // `seeking` will be set to `true` when playing an
                              // ad track.
  },
  paused: boolean, // Whether the current track is paused.
  position: number, // The position_ms of the current track.
  repeat_mode: 0 | 1 | 2, // The repeat mode. No repeat mode is 0,
                  // repeat context is 1 and repeat track is 2.
  shuffle: boolean, // True if shuffled, false otherwise.
  track_window: {
    current_track: SpotifyPlayerTrack, // The track currently on local playback
    previous_tracks: SpotifyPlayerTrack[], // Previously played tracks. Number can vary.
    next_tracks: SpotifyPlayerTrack[] // Tracks queued next. Number can vary.
  }
}