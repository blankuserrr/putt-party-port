# Putt Party Port
An early experiment in porting the Discord-only game Putt Party to the web by emulating the server. 

## Requirements
- A brain
- A JavaScript runtime (Bun or Deno are preferred)

## Guide
1. Run `index.ts` with your JS runtime of choice then open `index.html` on the same device.
2. Open devtools (CTRL + Shift + I or F12)
3. In the opened menu, go to the Console, you should see a dropdown that says "top", open it. 
4. Look for an iframe at discord's domain (see below), and select it.
5. Try pasting `inject.js` and running it, if it works, now you can play the game! 
If it warns you about pasting, follow the instructions (usally by running "allow pasting"). 

<img width="560" height="371" alt="image" src="https://github.com/user-attachments/assets/ef5b34f9-09cc-451a-a2c7-dfadea742cc5" />

## Issues
- **Styling**: HTML Page has an iframe in another iframe, making it annoying to style, this can probably be fixed by someone better at HTML/CSS (related to iframe desired change below)
- **UI Bugs**: Issue with (what looks like) debug buttons showing at the mode selection screen, they go away after the map selection, but show up once the game finishes.

  After game finishes, contiue button cannot be pressed, may be related to above.

  During both mode and map selection timers, the select noise plays during each decrement. 

  Attempting to deselect the chosen mode/map by clicking the currently selected one doesn't work, but switching to others does. 
- Possible desync between timer and screen switch.
- Profile customization and multiplayer functionality is not implemeneted.
- User required to run an IIFE in the browser console in the specific iframe context instead of being able play instantly.
- "Connecting..." text stays on screen even after running script.
- (Issue with both official and port) Weird logic causes the server to not think the ball is in the hole, when it is. May be related to powerups.
- (Issue with both official and port | Nitpick) Timer probably shouldn't decrement (or exist) during solo games.

## Desired features
- Game customization/Mods
- Custom maps with rudimentary editor
- Golf ball skins
- More game modes with a rule editor
- Multiplayer and Authentication (likely sharing logic with an upcoming Gartic Phone clone 👀)
- Debug/Dev menu
- Server hould be hosted somewhere natively or server should be emulated fully in the browser, instead of the current local JS server.
- Move from an iframe to hosting more or all of the game ourselves. A code restructure could and likely would break functionality, styling is a pain in the ass, and we don't even need an iframe!

## Contributing
Please do so!!! The game's most important logic is in the beautified (though, not yet un-minified and modularized) index.9fbea.js, have a gander and see if you can fix any of the issues.
