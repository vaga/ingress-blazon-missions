const createMap = id => L.map(id, { center: [45.505, 35.09], zoom: 13, zoomControl: false, attributionControl: false })
  .addLayer(L.tileLayer('https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'))

const createMissionIcon = iconUrl => L.icon({ iconUrl, iconSize: [30, 30], iconAnchor: [15, 15], className: 'map-mission-icon' })

const createMissionMarker = mission => L.marker(mission.coords, { icon: createMissionIcon(mission.icon) })
  .bindTooltip(mission.name, { direction: 'top' })

const createWaypointMarker = waypoint => L.circleMarker(waypoint.coords, { color: 'black' })
  .bindTooltip(`${waypoint.name} (${waypoint.type})`, { direction: 'top' })

document.addEventListener('DOMContentLoaded', () => {
  const globalMap = createMap('globalMap')
  const missionMap = createMap('missionMap')
  const missionTitleElement = document.getElementById('missionTitle')

  let globalMarkers = []
  let missionMarkers = []

  const showMission = mission => {
    missionTitleElement.innerHTML = `<img src="${mission.icon}" /><span>${mission.name}</span>`
    missionMarkers.forEach(marker => missionMap.removeLayer(marker))
    missionMarkers = mission.waypoints.map(waypoint => createWaypointMarker(waypoint)
      .addTo(missionMap))
    missionMap.fitBounds(missionMarkers.map(marker => marker.getLatLng()))
  }

  fetch('data/missions.json')
    .then(response => response.json())
    .then(missions => {
      globalMarkers = missions.map(mission => createMissionMarker(mission)
        .on('click', () => showMission(mission))
        .addTo(globalMap))
      showMission(missions[0])
      globalMap.fitBounds(globalMarkers.map(marker => marker.getLatLng()))
    })
})
