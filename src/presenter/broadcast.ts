import type { ExperienceMode } from '../state/presentationStore';
import type { MagazineViewMode } from '../experiences/magazine/magazineTypes';

export interface PresentationSyncMessage {
  type: 'SYNC_STATE' | 'ACTION';
  viewMode: 'cover' | 'library' | 'chapter';
  chapterIndex: number;
  sceneIndex: number;
  beatIndex: number;
  isBlackout: boolean;
  action?: string;
  payload?: any;
  timestamp: number;
  experienceMode?: ExperienceMode;
  selectedBook?: number;
  magazinePage?: number;
  magazineViewMode?: MagazineViewMode;
}

const CHANNEL_NAME = 'mln-presentation-channel';

export class PresentationChannel {
  private channel: BroadcastChannel | null = null;
  private onMessageCallback: ((msg: PresentationSyncMessage) => void) | null = null;

  constructor(onMessage?: (msg: PresentationSyncMessage) => void) {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      if (onMessage) {
        this.onMessageCallback = onMessage;
        this.channel.onmessage = (event) => {
          this.onMessageCallback?.(event.data);
        };
      }
    }
  }

  public postState(state: {
    viewMode: 'cover' | 'library' | 'chapter';
    chapterIndex: number;
    sceneIndex: number;
    beatIndex: number;
    isBlackout: boolean;
    action?: string;
    experienceMode?: ExperienceMode;
    selectedBook?: number;
    magazinePage?: number;
    magazineViewMode?: MagazineViewMode;
  }) {
    if (this.channel) {
      this.channel.postMessage({
        type: 'SYNC_STATE',
        ...state,
        timestamp: Date.now(),
      });
    }
  }

  public close() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}
