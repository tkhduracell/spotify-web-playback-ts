import { SpotifyDeviceId, SpotifyPlayerError, SpotifyPlayerErrorObject, SpotifyPlayerState } from "./types"

export * from "./types"

export type SpotifyPlayerEvent = 'ready' | 'not_ready' | 'player_state_changed' | 'autoplay_failed'

export type SpotifyTokenRefreshFunction = (callback: (token: string) => void) => void

/** Optional `Spotify.Player` constructor arguments. */
export type SpotifyPlayerOptions = {
    /** If true, the Media Session API is set with metadata and action handlers. Default: false. */
    enableMediaSession?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listener = (data: any) => void

type SpotifyPlayerInternal = {
    connect: () => Promise<boolean>
    disconnect: () => void

    on: (event: SpotifyPlayerError, callback: (error: SpotifyPlayerErrorObject) => void) => boolean
    addListener: (event: SpotifyPlayerEvent | SpotifyPlayerError, callback: Listener) => boolean
    removeListener: (event: SpotifyPlayerEvent | SpotifyPlayerError, callback?: Listener) => boolean

    getCurrentState: () => Promise<SpotifyPlayerState | null>

    setName: (name: string) => Promise<void>
    getVolume: () => Promise<number>
    setVolume: (volume: number) => Promise<void>
    pause: () => Promise<void>
    resume: () => Promise<void>
    togglePlay: () => Promise<void>
    seek: (positionMs: number) => Promise<void>
    previousTrack: () => Promise<void>
    nextTrack: () => Promise<void>
    activateElement: () => Promise<void>
}

type SpotifyWindow = {
    onSpotifyWebPlaybackSDKReady?: () => void,
    Spotify?: {
        Player: {
            new(args: {
                name: string,
                getOAuthToken: SpotifyTokenRefreshFunction,
                volume?: number,
                enableMediaSession?: boolean
            }): SpotifyPlayerInternal
        }
    }
}

export class SpotifyPlayer {
    player: SpotifyPlayerInternal

    /**
     * Loads the Web Playback SDK script and creates a `Spotify.Player`.
     *
     * @param document the document to add the SDK script to
     * @param name name of the Spotify Connect player, visible in other Spotify apps
     * @param initalVolume default volume, a decimal between 0 and 1
     * @param getOAuthToken called on `connect` and when the access token has expired; must call back with a valid token for a Premium user
     * @param options optional extra `Spotify.Player` arguments
     */
    static init(
        document: Document,
        name: string,
        initalVolume: number,
        getOAuthToken: SpotifyTokenRefreshFunction,
        options: SpotifyPlayerOptions = {}
    ): Promise<SpotifyPlayer> {
        const w = window as unknown as SpotifyWindow

        return new Promise((resolve) => {
            const create = () => {
                const Player = (w.Spotify as NonNullable<SpotifyWindow['Spotify']>).Player
                resolve(new SpotifyPlayer(new Player({
                    name,
                    getOAuthToken,
                    volume: initalVolume,
                    enableMediaSession: options.enableMediaSession
                })))
            }

            // SDK already loaded, e.g. init called twice
            if (w.Spotify) {
                return create()
            }

            // Set the ready callback before the script can run
            w.onSpotifyWebPlaybackSDKReady = create

            const script = document.createElement("script")
            script.src = "https://sdk.scdn.co/spotify-player.js"
            script.async = true
            document.body.appendChild(script)
        })
    }

    private constructor(player: SpotifyPlayerInternal) {
        this.player = player
    }

    /** Listen to an error event. Returns true if the listener is unique for the event. */
    on(event: SpotifyPlayerError, callback: (error: SpotifyPlayerErrorObject) => void): boolean {
        return this.player.on(event, callback)
    }

    /** Resolves with whether the connection to Spotify succeeded. */
    connect(): Promise<boolean> {
        return this.player.connect()
    }

    disconnect(): void {
        return this.player.disconnect()
    }

    onReady(callback: (device: SpotifyDeviceId) => void): boolean {
        return this.player.addListener('ready', callback)
    }
    onNotReady(callback: (device: SpotifyDeviceId) => void): boolean {
        return this.player.addListener('not_ready', callback)
    }
    onPlayerStateChanged(callback: (state: SpotifyPlayerState) => void): boolean {
        return this.player.addListener('player_state_changed', callback)
    }
    onAutoPlayFailed(callback: () => void): boolean {
        return this.player.addListener('autoplay_failed', callback)
    }

    /** Removes the given listener, or all `ready` listeners if none is given. */
    removeReady(callback?: (device: SpotifyDeviceId) => void): boolean {
        return this.player.removeListener('ready', callback)
    }
    removeNotReady(callback?: (device: SpotifyDeviceId) => void): boolean {
        return this.player.removeListener('not_ready', callback)
    }
    removePlayerStateChanged(callback?: (state: SpotifyPlayerState) => void): boolean {
        return this.player.removeListener('player_state_changed', callback)
    }
    removeAutoPlayFailed(callback?: () => void): boolean {
        return this.player.removeListener('autoplay_failed', callback)
    }

    /** Resolves with the local playback state, or null if not playing through the SDK. */
    getCurrentState(): Promise<SpotifyPlayerState | null> {
        return this.player.getCurrentState()
    }

    setName(name: string): Promise<void> {
        return this.player.setName(name)
    }
    getVolume(): Promise<number> {
        return this.player.getVolume()
    }
    /** Volume between 0 and 1. Not settable on iOS. */
    setVolume(volume: number): Promise<void> {
        return this.player.setVolume(volume)
    }
    pause(): Promise<void> {
        return this.player.pause()
    }
    resume(): Promise<void> {
        return this.player.resume()
    }
    togglePlay(): Promise<void> {
        return this.player.togglePlay()
    }
    /** Seek to a position, in milliseconds, in the current track. */
    seek(positionMs: number): Promise<void> {
        return this.player.seek(positionMs)
    }
    previousTrack(): Promise<void> {
        return this.player.previousTrack()
    }
    nextTrack(): Promise<void> {
        return this.player.nextTrack()
    }
    /** Call from a user gesture so playback state survives transfer on autoplay-restricted browsers. */
    activateElement(): Promise<void> {
        return this.player.activateElement()
    }
}
