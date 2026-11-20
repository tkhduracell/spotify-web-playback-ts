/**
 * @jest-environment jsdom
 */
import { SpotifyPlayer } from '../index'

type W = { Spotify?: unknown, onSpotifyWebPlaybackSDKReady?: () => void }
const w = window as unknown as W

const internal = () => ({
    connect: jest.fn().mockResolvedValue(true),
    disconnect: jest.fn(),
    on: jest.fn().mockReturnValue(true),
    addListener: jest.fn().mockReturnValue(true),
    removeListener: jest.fn().mockReturnValue(true),
    getCurrentState: jest.fn().mockResolvedValue(null),
    setName: jest.fn().mockResolvedValue(undefined),
    getVolume: jest.fn().mockResolvedValue(1),
    setVolume: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn().mockResolvedValue(undefined),
    resume: jest.fn().mockResolvedValue(undefined),
    togglePlay: jest.fn().mockResolvedValue(undefined),
    seek: jest.fn().mockResolvedValue(undefined),
    previousTrack: jest.fn().mockResolvedValue(undefined),
    nextTrack: jest.fn().mockResolvedValue(undefined),
    activateElement: jest.fn().mockResolvedValue(undefined),
})

describe('SpotifyPlayer', () => {
    let ctor: jest.Mock
    let mock: ReturnType<typeof internal>

    beforeEach(() => {
        document.body.innerHTML = ''
        delete w.Spotify
        delete w.onSpotifyWebPlaybackSDKReady
        mock = internal()
        ctor = jest.fn(() => mock)
    })

    const load = (options?: { enableMediaSession?: boolean }) => {
        const p = SpotifyPlayer.init(document, 'name', 0.5, cb => cb('tok'), options)
        // Simulate the SDK script loading
        w.Spotify = { Player: ctor }
        w.onSpotifyWebPlaybackSDKReady?.()
        return p
    }

    it('registers ready callback before adding script, and passes player args', async () => {
        const p = SpotifyPlayer.init(document, 'name', 0.5, cb => cb('tok'), { enableMediaSession: true })
        expect(typeof w.onSpotifyWebPlaybackSDKReady).toBe('function')
        expect(document.querySelector('script')?.src).toBe('https://sdk.scdn.co/spotify-player.js')
        w.Spotify = { Player: ctor }
        w.onSpotifyWebPlaybackSDKReady?.()
        await p
        expect(ctor).toHaveBeenCalledWith(expect.objectContaining({ name: 'name', volume: 0.5, enableMediaSession: true }))
    })

    it('resolves immediately if the SDK is already loaded', async () => {
        w.Spotify = { Player: ctor }
        await SpotifyPlayer.init(document, 'name', 1, cb => cb('tok'))
        expect(document.querySelector('script')).toBeNull()
        expect(ctor).toHaveBeenCalledTimes(1)
    })

    it('seek passes position_ms', async () => {
        const player = await load()
        await player.seek(60000)
        expect(mock.seek).toHaveBeenCalledWith(60000)
    })

    it('removeListener passes optional callback and returns result', async () => {
        const player = await load()
        const cb = jest.fn()
        expect(player.removeReady(cb)).toBe(true)
        expect(mock.removeListener).toHaveBeenCalledWith('ready', cb)
        player.removeAutoPlayFailed()
        expect(mock.removeListener).toHaveBeenLastCalledWith('autoplay_failed', undefined)
    })

    it('returns listener results and delegates error events', async () => {
        const player = await load()
        const cb = jest.fn()
        expect(player.on('account_error', cb)).toBe(true)
        expect(mock.on).toHaveBeenCalledWith('account_error', cb)
        expect(player.onPlayerStateChanged(cb)).toBe(true)
        expect(mock.addListener).toHaveBeenCalledWith('player_state_changed', cb)
    })

    it('getCurrentState can resolve null; setName returns a promise', async () => {
        const player = await load()
        await expect(player.getCurrentState()).resolves.toBeNull()
        await expect(player.setName('x')).resolves.toBeUndefined()
    })
})
