// src/games/minesweeper/sfx.ts
type SfxName = "click" | "flag" | "boom" | "win";

const urls: Record<SfxName, string> = {
  click: "/sfx/click.mp3",
  flag: "/sfx/flag.mp3",
  boom: "/sfx/boom.mp3",
  win: "/sfx/win.mp3",
};

let enabled = true;
let unlocked = false;

const cache: Record<SfxName, HTMLAudioElement> = {
  click: new Audio(urls.click),
  flag: new Audio(urls.flag),
  boom: new Audio(urls.boom),
  win: new Audio(urls.win),
};

cache.click.volume = 0.45;
cache.flag.volume = 0.45;
cache.boom.volume = 0.6;
cache.win.volume = 0.55;

(Object.values(cache) as HTMLAudioElement[]).forEach((a) => {
  a.preload = "auto";
});

export function setSfxEnabled(v: boolean) {
  enabled = v;
}

// call ONCE on first user gesture
export async function unlockSfx() {
  if (unlocked) return;
  unlocked = true;

  await Promise.all(
    (Object.values(cache) as HTMLAudioElement[]).map(async (a) => {
      const prevVol = a.volume;
      a.volume = 0;

      try {
        a.currentTime = 0;
        await a.play();
        a.pause();
      } catch {
        // ignore
      } finally {
        a.volume = prevVol;
        a.currentTime = 0;
      }
    })
  );
}

export function playSfx(name: SfxName) {
  if (!enabled) return;

  const a = cache[name];
  try {
    a.pause();
    a.currentTime = 0;
  } catch {}

  void a.play().catch(() => {});
}
