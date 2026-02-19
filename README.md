# Putt Party Port
An early experiment in porting the Discord-only game Putt Party to the web by **proxying requests back to discord's servers. bypassing almost every issue that the emulator has, even including name selection/multiplayer.** An alternative to emulation.

## Issues
- Loading: Takes a bit to load initially, sometimes it *fails to load into maps*, though I'm 72% sure this is just because it fails to connect to the proxy.
- Still no profile customization other than username.
- ROOMS: Major issue. Multiplayer is centralized per instance of the proxy. See `SERVER.md` for ideas on how to solve this..
- Consider other ways to proxy other than just downloading assets on a server as you play.

TODO: Finish this
