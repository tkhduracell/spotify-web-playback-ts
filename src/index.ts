import { SpotifyPlayerError, SpotifyPlayerState } from "./types"

type SpotifyPlayerInternal = {
    on: (event: SpotifyPlayerError, callback: (error: Error) => void) => boolean
  
    connect: () => Promise<boolean>
    disconnect: () => void
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addListener: (event: SpotifyPlayerEvent, callback: (data: any) => void) => boolean,
    removeListener: (event: SpotifyPlayerEvent) => boolean
    getCurrentState: () => Promise<SpotifyPlayerState>
  
    setName: (name: string) => void
    getVolume: () => Promise<number>
    setVolume: (volume: number) => Promise<void>
    pause: () => Promise<void>
    resume: () => Promise<void>
    togglePlay: () => Promise<void>
    seek: () => Promise<void>
    previousTrack: () => Promise<void>
    nextTrack: () => Promise<void>
    activateElement: () => Promise<void>
}

export type SpotifyPlayerEvent = 'ready' | 'not_ready' | 'player_state_changed' | 'autoplay_failed'

export type SpotifyDeviceId = { device_id: string }

export type SpotifyTokenRefreshFunction = (callback: (token: string) => void) => void

export class SpotifyPlayer {
    player: SpotifyPlayerInternal
    
    static init(document: Document, name: string, initalVolume: number, getOAuthToken: SpotifyTokenRefreshFunction): Promise<SpotifyPlayer> {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script)
        const w = (window as unknown as { 
            onSpotifyWebPlaybackSDKReady: () => void,
            Spotify: {
                Player: {
                    new(args: { name: string, getOAuthToken: SpotifyTokenRefreshFunction, volume: number }): SpotifyPlayerInternal
                }
            }
        })
        return new Promise((resolve) => {
            w.onSpotifyWebPlaybackSDKReady = () => {
                const player = new w.Spotify.Player({
                    name,
                    getOAuthToken,
                    volume: initalVolume
                });
                resolve(new SpotifyPlayer(player))
            }
        })
    }
    
    private constructor(player: SpotifyPlayerInternal) {
        this.player = player
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event: SpotifyPlayerError, callback: (error: any) => void) {
        this.player.on(event, callback)
    }

    connect(): Promise<boolean> {
        return this.player.connect()
    }

    disconnect(): void {
        return this.player.disconnect()
    }

    onReady(callback: (device: SpotifyDeviceId) => void) {
        return this.player.addListener('ready', callback)
    }
    onNotReady(callback: (device: SpotifyDeviceId) => void) {
        return this.player.addListener('not_ready', callback)
    }
    onPlayerStateChanged(callback: (state: SpotifyPlayerState) => void) {
        return this.player.addListener('player_state_changed', callback)
    }
    onAutoPlayFailed(callback: () => void) {
        return this.player.addListener('autoplay_failed', callback)
    }

    removeReady() {
        this.player.removeListener('ready')
    }
    removeNotReady() {
        this.player.removeListener('not_ready')
    }
    removePlayerStateChanged() {
        this.player.removeListener('player_state_changed')
    }
    removeAutoPlayFailed() {
        this.player.removeListener('autoplay_failed')
    }
    
    getCurrentState(): Promise<SpotifyPlayerState> {
        return this.player.getCurrentState()
    }

    setName(name: string): void {
        this.player.setName(name)
    }
    getVolume(): Promise<number> {
        return this.player.getVolume()
    }
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
    seek(): Promise<void> {
        return this.player.seek()
    }
    previousTrack(): Promise<void> {
        return this.player.previousTrack()
    }
    nextTrack(): Promise<void> {
        return this.player.nextTrack()
    }
    activateElement(): Promise<void> {
        return this.player.activateElement()
    }
}