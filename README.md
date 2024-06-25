Vampire Survivors Clone

This is my minor project for my fellowship at LeapFrog Technologies.

Setup:
1. Clone the repo.
2. Use npm install, to install the dependencies (typescript -"^5.2.2" and vite-"^5.2.0")
3. Use npm run dev, for Vite live preview
4. Use npm run build, to build the game

Usage:
1. Start the game using the start button.
2. Choose your player (buy the player if you have collected enough score) Your purchased information will be stored in localStorage. Different characters give different playing styles.
3. Choose your background (buy if you have collected enough score) Also stored in localStorage.
4. Start the game with your choices.
5. Attacks are automatic, move and kill the enemies.
6. Killed enemies will drop coins for you to collect.
7. After collecting required amount of coins you will level up.
8. Upon leveling up you will be prompted with an upgrade menu.
9. Upgrade menu will consist of 3 randomly generated choices which will give you advantage in the game.
10. Upgrades include player upgrades such as (movement increase, health increase, coin attraction rage increase).
    Also a 15% chance to get a full health increase, this upgrade will replace the normal health increase if active.
11. Ugrades also include weapon buy and upgrade. if you don't own the weapon you will be prompted with buy weapon, and if you own the weapon that choice will dynamically be replaced with upgrade weapon.
12. Upgrade weapon will increase it's overal damage, and also increase the weapon specific elements such as (rotation speed, attack duration, attack interval etc)
13. After level 3 a new enemy type will start to spwan.
14. Game will get progressively harder as you level up. The spawn interval of  enemies and their health increase with level up.
15. You will die when your health reaches zero and the game will restart.
16. Your goal is to survive for as long as possible.
