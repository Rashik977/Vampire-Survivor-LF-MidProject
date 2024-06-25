// Class to manage the sound effects and background music
class SoundManager {
  public musicVolume: number;
  public sfxVolume: number;
  public music: HTMLAudioElement;
  public sfx: { [key: string]: HTMLAudioElement };
  public audioLoaded: boolean = false;

  constructor() {
    //set default volume
    this.musicVolume = 0.5;
    this.sfxVolume = 0.5;

    // get music and sound effects
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

  // function to update the volume of the music and sound effects
  updateVolume(musicVolume?: number, sfxVolume?: number) {
    if (musicVolume !== undefined) this.musicVolume = musicVolume;
    if (sfxVolume !== undefined) this.sfxVolume = sfxVolume;

    // set the volume of the music
    this.music.volume = this.musicVolume;

    // set the volume of the sound effects
    Object.values(this.sfx).forEach((sound) => {
      sound.volume = this.sfxVolume;
    });
  }

  // function to play the background music
  playMusic() {
    this.music.loop = true;
    this.music.play().catch((error) => {
      console.log("Error playing music:", error);
    });
  }

  // function to play the sound effects
  playSFX(key: string) {
    const sound = this.sfx[key];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch((error) => {
        console.log("Error playing SFX:", error);
      });
    }
  }

  // function to check if the audio has loaded before playing
  public checkIfAudioLoaded() {
    const audioElements = [this.music, ...Object.values(this.sfx)];
    let loadedCount = 0;

    audioElements.forEach((audio) => {
      audio.addEventListener("loadeddata", () => {
        loadedCount++;
        if (loadedCount === audioElements.length) {
          this.audioLoaded = true;
        }
      });
    });
  }
}

export const soundManager = new SoundManager();
