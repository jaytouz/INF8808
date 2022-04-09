/**
 * Sanitizes the names from the data in the "Player" column.
 *
 * Ensures each word in the name begins with an uppercase letter followed by lowercase letters.
 *
 * @param {object[]} data The dataset with unsanitized names
 * @returns {object[]} The dataset with properly capitalized names
 */
export function cleanNames (data) {
  // TODO: Clean the player name data
  return data.map(function (d) {
    d.Player = d.Player[0].toUpperCase() + d.Player.substring(1).toLowerCase()
    return d
  })
}

/**
 * filter valu
 * @param {object[]} data raw dataset
 * @param {string} property
 * @returns {object []} list of unique value for the property in the dataset
 */
var getDistinct = function (data, property) {
  return data.map(item => item[property])
    .filter((value, index, self) => self.indexOf(value) === index)
}
/**
 * Finds the names of the 5 players with the most lines in the play.
 *
 * @param {object[]} data The dataset containing all the lines of the play
 * @returns {string[]} The names of the top 5 players with most lines
 */
export function getTopPlayers (data) {
  // TODO: Find the five top players with the most lines in the play
  var distincPlayer = getDistinct(data, 'Player')
  var countLine = [] // {name: p, count: #}
  distincPlayer.forEach(p => countLine.push({ name: p, count: 0 }))
  data.map(line => line.Player).forEach(function (p) {
    var pIdx = countLine.findIndex(element => element.name === p)
    countLine[pIdx].count = countLine[pIdx].count + 1
  })

  countLine.sort(function (p1, p2) {
    return p2.count - p1.count
  })
  return countLine.map(d => d.name).slice(0, 5)
}

/**
 * Transforms the data by nesting it, grouping by act and then by player, indicating the line count
 * for each player in each act.
 *
 * The resulting data structure ressembles the following :
 *
 * [
 *  { Act : ___,
 *    Players : [
 *     {
 *       Player : ___,
 *       Count : ___
 *     }, ...
 *    ]
 *  }, ...
 * ]
 *
 * The number of the act (starting at 1) follows the 'Act' key. The name of the player follows the
 * 'Player' key. The number of lines that player has in that act follows the 'Count' key.
 *
 * @param {object[]} data The dataset
 * @returns {object[]} The nested data set grouping the line count by player and by act
 */
export function summarizeLines (data) { var structData = []
  data.forEach(function (line) {
    let struct = structData.find(s => s.Act === line.Act)
    if (struct === undefined) {
      struct = {
        Act: line.Act,
        Players: [
          {
            Player: line.Player,
            Count: 1
          }
        ]
      }
      structData.push(struct)
    } else {
      const player = struct.Players.find(p => p.Player === line.Player)
      if (player === undefined) {
        struct.Players.push({ Player: line.Player, Count: 1 })
      } else {
        player.Count = player.Count + 1
      }
    }
  })
  return structData
}

/**
 * For each act, replaces the players not in the top 5 with a player named 'Other',
 * whose line count corresponds to the sum of lines uttered in the act by players other
 * than the top 5 players.
 *
 * @param {object[]} data The dataset containing the count of lines of all players
 * @param {string[]} top The names of the top 5 players with the most lines in the play
 * @returns {object[]} The dataset with players not in the top 5 summarized as 'Other'
 */
export function replaceOthers (data, top) {
  // TODO : For each act, sum the lines uttered by players not in the top 5 for the play
  // and replace these players in the data structure by a player with name 'Other' and
  // a line count corresponding to the sum of lines
  data.forEach(function (act) {
    act.Players.forEach(function (p) {
      // console.log(p)
      if (top.indexOf(p.Player) === -1) {
        const playerObj = act.Players.find(obj => obj.Player === 'Other')
        if (playerObj === undefined) {
          act.Players.push({ Player: 'Other', Count: p.Count })
        } else {
          playerObj.Count = playerObj.Count + p.Count
        }
      }
    })
    act.Players = act.Players.filter(p => top.indexOf(p.Player) > -1 || p.Player === 'Other')
  })
  return data
}
