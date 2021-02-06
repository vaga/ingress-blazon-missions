const fs = require('fs')

const readJsonFile = (file) => JSON.parse(fs.readFileSync(file))

if (process.argv.length !== 3) {
  console.debug('node sanitize.js [file]')
  return
}

const newMissions = readJsonFile(process.argv[2]).map(mission => ({
  guid: mission.data.guid,
  name: mission.data.dap,
  coords: mission.latLng,
  icon: mission.data.image,
  waypoints: mission.data.waypoints.map(waypoint => ({
    name: waypoint.data[1],
    type: waypoint.data[0] === 1 ? 'hack' : 'capture',
    coords: waypoint.latLng,
  })),
}))

const missions = readJsonFile('missions.json')
newMissions.forEach(newMission => {
  if (!missions.some(mission => mission.guid === newMission.guid)) {
    missions.push(newMission)
    console.log(`[added] ${newMission.name}`)
  }
})

missions.sort((a, b) => {
  const ma = a.name.toLowerCase()
  const mb = b.name.toLowerCase()

  if (ma < mb) {
    return -1
  } else if (ma > mb) {
    return 1
  }

  return 0
})

fs.writeFileSync('missions.json', JSON.stringify(missions, null, 2))
