class SoundManager {
  public musicVolume: number;
  public sfxVolume: number;
  public music: HTMLAudioElement;
  public sfx: { [key: string]: HTMLAudioElement };
  public audioLoaded: boolean = false;

  constructor() {
    this.musicVolume = 0.5;
    this.sfxVolume = 0.5;
    this.music = new Audio("sounds/bg-music.mp3");
    this.sfx = {
      damage: new Audio("sounds/enemy_hit.ogg"),
      collect: new Audio("sounds/coin.ogg"),
      gameOver: new Audio("sounds/gameOver.ogg"),
      gun: new Audio("sounds/gun.ogg"),
      level_up: new Audio("sounds/level_up.ogg"),
      whip: new Audio("sounds/whip.ogg"),
      enemy_death: new Audio("sounds/enemy_death.ogg"),
      take_damage: new Audio("sounds/take_damage.ogg"),
    };

    this.updateVolume();
  }

  updateVolume(musicVolume?: number, sfxVolume?: number) {
    if (musicVolume !== undefined) this.musicVolume = musicVolume;
    if (sfxVolume !== undefined) this.sfxVolume = sfxVolume;

    this.music.volume = this.musicVolume;
    Object.values(this.sfx).forEach((sound) => {
      sound.volume = this.sfxVolume;
    });
  }

  playMusic() {
    this.music.loop = true;
    this.music.play().catch((error) => {
      console.log("Error playing music:", error);
    });
  }

  playSFX(key: string) {
    const sound = this.sfx[key];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch((error) => {
        console.log("Error playing SFX:", error);
      });
    }
  }

  public checkIfAudioLoaded() {
    const audioElements = [this.music, ...Object.values(this.sfx)];
    let loadedCount = 0;

    audioElements.forEach((audio) => {
      audio.addEventListener("loadeddata", () => {
        loadedCount++;
        if (loadedCount === audioElements.length) {
          this.audioLoaded = true;
          console.log("All audio files loaded.");
        }
      });
    });
  }
}

export const soundManager = new SoundManager();
