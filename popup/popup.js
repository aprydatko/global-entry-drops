// ELEMENTS
const locationIdElement = document.getElementById('locationId')
const startDateElement = document.getElementById('startDate')
const endDateElement = document.getElementById('endDate')

// Button elements
const startButton = document.getElementById('startButton')
const stopButton = document.getElementById('stopButton')

startButton.onclick = () => {
	const prefs = {
		locationId: locationIdElement.value,
		startDate: startDateElement.value,
		endDate: endDateElement.value,
		tzData: locationIdElement.options[
			locationIdElement.selectedIndex
		].getAttribute('data-tz'),
	}
	chrome.runtime.sendMessage({ event: 'onStart', prefs })
}

stopButton.onclick = () => {
	chrome.runtime.sendMessage({ event: 'onStop' })
}

chrome.storage.local.get(
	['localtionId', 'startDate', 'endDate', 'locations', 'isRunning'],
	(result) => {
		const { locationId, startDate, endDate, locations, isRunning } = result

		setLocation(locations)

		if (locationId) {
			locationIdElement.value = locationId
		}

		if (startDate) {
			startDateElement.value = startDate
		}

		if (endDate) {
			endDateElement.value = endDate
		}

		console.log('Running Status', isRunning)
	}
)

const setLocation = (locations) => {
	locations.forEach((location) => {
		let optionElement = document.createElement('option')
		optionElement.value = location.id
		optionElement.innerHTML = location.name
		optionElement.setAttribute('data-tz', location.tzData)
		locationIdElement.appendChild(optionElement)
	})
}
