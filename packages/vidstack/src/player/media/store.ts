import { createStore, tick } from 'maverick.js';

import type { MediaState } from './state';
import { createTimeRanges, getTimeRangesEnd, getTimeRangesStart } from './time-ranges';

export interface MediaStore extends MediaState {}

export const mediaStore = createStore<MediaStore>({
  autoplay: false,
  autoplayError: undefined,
  buffered: createTimeRanges(),
  duration: 0,
  canLoad: false,
  canPlay: false,
  canFullscreen: false,
  controls: false,
  poster: '',
  currentTime: 0,
  ended: false,
  error: undefined,
  fullscreen: false,
  loop: false,
  live: false,
  logLevel: __DEV__ ? 'warn' : 'silent',
  media: 'unknown',
  muted: false,
  paused: true,
  played: createTimeRanges(),
  playing: false,
  playsinline: false,
  preload: 'metadata',
  seekable: createTimeRanges(),
  seeking: false,
  source: { src: '', type: '' },
  sources: [],
  started: false,
  view: 'video',
  volume: 1,
  waiting: false,
  get currentSrc() {
    return this.source;
  },
  get bufferedStart() {
    return getTimeRangesStart(this.buffered) ?? 0;
  },
  get bufferedEnd() {
    return getTimeRangesEnd(this.buffered) ?? 0;
  },
  get seekableStart() {
    return getTimeRangesStart(this.seekable) ?? 0;
  },
  get seekableEnd() {
    return getTimeRangesEnd(this.seekable) ?? Infinity;
  },
  // ~~ user props ~~
  userIdle: false,
  userBehindLiveEdge: false,
  // ~~ live props ~~
  liveDelta: 0, // internal
  liveTolerance: 15,
  get currentLiveTime() {
    return this.live ? this.liveDelta + this.seekableEnd : 0;
  },
  get liveWindow() {
    const time = this.currentLiveTime;
    return time === Infinity ? 0 : time - this.seekableStart;
  },
  get liveEdge() {
    return (
      this.live &&
      (this.currentLiveTime === Infinity ||
        (!this.paused &&
          !this.userBehindLiveEdge &&
          Math.abs(this.currentLiveTime - this.currentTime) <= this.liveTolerance))
    );
  },
  // ~~ internal props ~~
  attemptingAutoplay: false,
  canLoadPoster: null,
});

const DO_NOT_RESET_ON_SRC_CHANGE = new Set<keyof MediaStore>([
  'autoplay',
  'canFullscreen',
  'canLoad',
  'controls',
  'loop',
  'logLevel',
  'muted',
  'playsinline',
  'preload',
  'poster',
  'source',
  'sources',
  'view',
  'volume',
  'canLoadPoster',
]);

/**
 * Resets all media state and leaves general player state intact (i.e., `autoplay`, `volume`, etc.).
 */
export function softResetMediaStore($media: MediaStore) {
  mediaStore.reset($media, (prop) => !DO_NOT_RESET_ON_SRC_CHANGE.has(prop));
  tick();
}
