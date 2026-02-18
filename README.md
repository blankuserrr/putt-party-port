# Putt Party Port
A an early experiment in porting the Discord-only game Putt Party to the web, and emulating the server. 

## Guide
Run the `index.ts` and open the `index.html` on the same device. Open your devtools, (CTRL+Shift+i or F12 or right click (context menu) -> Inspect.
In the newly opened menu, go to the Console and look for an iframe at discord's domain (look below), type "allow pasting" into the console, hit enter, then paste the `inject.js` in it, and hit enter to run it. Now you can play the game!
<img width="560" height="371" alt="image" src="https://github.com/user-attachments/assets/ef5b34f9-09cc-451a-a2c7-dfadea742cc5" />

## Issues
- HTML Page involves an iframe in an iframe which makes it annoying to style as it doesn't follow top level rules well.
- Issue with (what looks like) debug buttons show at the mode selection screen, but go away from map selection until the game finishes.
- After game finishes, contiue button cannot be pressed, may be related to above.
- During both mode and map selection timers, the select noise plays during each decrement. 
- Attempting to deselect the chosen mode/map doesn't work.
- Possible desync between timer and screen switch.
- Profile customization and multiplayer functionality is not implemeneted.
- User required to run an IIFE in the browser console in the specific iframe context instead of being able play instantly.
- "Connecting..." text stays on screen even after running script.
- (Nitpick) Local Node.JS-based server isn't preferred, should be hosted somewhere natively or server should be emulated fully in the browser.
- (Nitpick) We should move from an iframe to hosting more or all of it. A code restructure could and likely would break functionality.
- (Issue with both official and port) Weird logic causes the server to not think the ball is in the hole, when it is. May be related to powerups.
- (Issue with both official and port | Nitpick) Timer probably shouldn't decrement (or exist) during solo games.

## Desired features
- Game customization/Mods
- Custom maps with rudimentary editor
- Golf ball skins
- More game modes with a rule editor
- Multiplayer and Authentication (likely sharing logic with an upcoming Gartic Phone clone 👀)
- Debug/Dev menu

## Contributing
Please do so!!! The game's most important logic is in the beautified (though, not yet un-minified and modularized) index.9fbea.js, have a gander and see if you can fix any of the issues.
