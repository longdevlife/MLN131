import type { PresentationState } from './presentationStore';
import { chapters } from '../content/chapters';

export const selectCurrentChapter = (state: PresentationState) => {
  return chapters[state.chapterIndex] ?? chapters[0];
};

export const selectCurrentScene = (state: PresentationState) => {
  const chapter = selectCurrentChapter(state);
  return chapter?.scenes[state.sceneIndex] ?? chapter?.scenes[0];
};

export const selectCurrentBeat = (state: PresentationState) => {
  const scene = selectCurrentScene(state);
  return scene?.beats[state.beatIndex] ?? scene?.beats[0];
};

export const selectNextScene = (state: PresentationState) => {
  const chapter = selectCurrentChapter(state);
  if (!chapter) return null;
  if (state.sceneIndex < chapter.scenes.length - 1) {
    return chapter.scenes[state.sceneIndex + 1];
  }
  if (state.chapterIndex < chapters.length - 1) {
    return chapters[state.chapterIndex + 1]?.scenes[0] ?? null;
  }
  return null;
};
