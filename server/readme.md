
# Events
These are the possible events.

## Client: match.request
Signals that a player is ready for a game.
```
var message = { name: "Alice"}
```

## Client: match.cancelrequest
A player won't wait any longer for a game.
```
var message = {}
```

## Server: match.found
Opponent found. Starts the game.
```
var message = { playerA: "Bob", playerB:"Alice" }
```

## Client/Server: game.turn
A player placed a stone.
```
var message = {
  target: {
    x: 1,
    y: 1
  },
  direction: 4,
  turnNumber:123,
  player:"Alice"
};
```

## Client/Server: game.exit
A game exit. Due to:
* player win
* player inactive
* app crash / exit
```
var message = {
};
```

## Server: user.count
How many users are online?

```
var message = { users: 123 }
```
