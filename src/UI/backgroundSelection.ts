import { Global } from "../Global";
import { GameInitialize } from "../GameInitialize";
import { backgrounds } from "../Background/BackgroundInfo";
import { displayScore } from "./drawScore";

export function backgroundSelection() {
  let selectedBackground: any = null;

  const backgroundSelectionScreen = document.querySelector(
    ".background-selection"
  ) as HTMLElement;
  const backgroundSelectionItems = document.querySelector(
    ".background-selection__items"
  ) as HTMLElement;
  const playerAlert = document.querySelector(
    ".background-alert"
  ) as HTMLElement;
  const startButton = document.querySelector(
    ".btn--start-game"
  ) as HTMLButtonElement;
  const buyButton = document.querySelector(
    ".btn--buyBackground"
  ) as HTMLButtonElement;
  backgroundSelectionScreen.classList.remove("hidden");
  backgroundSelectionScreen.classList.add("screen");

  backgrounds.forEach((background: any) => {
    const img = document.createElement("img");
    img.src = background.imgSrc;
    img.alt = background.name;
    img.addEventListener("mouseover", () => {
      if (background != selectedBackground)
        img.style.border = "2px solid yellow";
    });
    img.addEventListener("mouseout", () => {
      if (background != selectedBackground) img.style.border = "none";
    });
    img.addEventListener("click", () => {
      selectedBackground = background;
      if (selectedBackground.purchased) {
        startButton.classList.remove("hidden");
        buyButton.classList.add("hidden");
      } else {
        startButton.classList.add("hidden");
        buyButton.classList.remove("hidden");
        buyButton.innerText = `Buy for ${background.cost} coins`;
      }
      const backgroundImgs = document.querySelectorAll(
        ".background-selection__items img"
      ) as NodeListOf<HTMLImageElement>;
      backgroundImgs.forEach((el) => {
        el.style.border = "none";
      });
      img.style.border = "2px solid green";
    });
    backgroundSelectionItems.appendChild(img);
  });

  startButton.addEventListener("click", () => {
    Global.BACKGROUND_INDEX = backgrounds.indexOf(selectedBackground);

    const screen = document.querySelector(
      ".start-screen-wrapper"
    ) as HTMLElement;
    screen.classList.add("hidden");
    GameInitialize.init();
  });
  buyButton.addEventListener("click", () => {
    if (Global.SCORE >= selectedBackground.cost) {
      Global.SCORE -= selectedBackground.cost;
      localStorage.setItem("score", Global.SCORE.toString());
      selectedBackground.purchased = true;
      backgrounds[backgrounds.indexOf(selectedBackground)].purchased = true;
      localStorage.setItem("backgrounds", JSON.stringify(backgrounds));
      buyButton.classList.add("hidden");
      startButton.classList.remove("hidden");

      displayScore();
    } else {
      playerAlert.classList.remove("hidden");
      setTimeout(() => {
        playerAlert.classList.add("hidden");
      }, 2000);
    }
  });
}
