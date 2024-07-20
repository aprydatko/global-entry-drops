// ELEMENTS
const locationIdElement = document.getElementById('locationId')
const startDateElement = document.getElementById('startDate')
const endDateElement = document.getElementById('endDate')

// Button elements
const startButton = document.getElementById('startButton')
const stopButton = document.getElementById('stopButton')

// Span listeners
const runningSpan = document.getElementById('runningSpan')
const stoppedSpan = document.getElementById('stoppedSpan')

// Error message
const locationError = document.getElementById('locationError')
const startDateError = document.getElementById('startDateError')
const endDateError = document.getElementById('endDateError')

const hideElement = (elem) => {
	elem.style.display = 'none'
}

const showElement = (elem) => {
	elem.style.display = ''
}

const disableElement = (elem) => {
	elem.disabled = true
}

const enableElement = (elem) => {
	elem.disabled = false
}

const handleOnStartState = () => {
	// Spans
	showElement(runningSpan)
	hideElement(stoppedSpan)
	// Buttons
	disableElement(startButton)
	enableElement(stopButton)
	// Inputs
	disableElement(locationIdElement)
	disableElement(startDateElement)
	disableElement(endDateElement)
}

const handleOnStopState = () => {
	// Spans
	showElement(stoppedSpan)
	hideElement(runningSpan)
	// Buttons
	disableElement(stopButton)
	enableElement(startButton)
	// Inputs
	enableElement(locationIdElement)
	enableElement(startDateElement)
	enableElement(endDateElement)
}

const performOnStartValidations = () => {
	if (!locationIdElement.value) {
		showElement(locationError)
	} else {
		hideElement(locationError)
	}

	if (!startDateElement.value) {
		showElement(startDateError)
	} else {
		hideElement(startDateError)
	}

	if (!endDateElement.value) {
		showElement(endDateError)
	} else {
		hideElement(endDateError)
	}

	return (
		locationIdElement.value &&
		startDateElement.value &&
		endDateElement.value
	)
}

startButton.onclick = () => {
	const allFieldsValid = performOnStartValidations()

	if (allFieldsValid) {
		handleOnStartState()
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
}

stopButton.onclick = () => {
	handleOnStopState()
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

		console.log('isRunning', isRunning)

		if (isRunning) {
			handleOnStartState()
		} else {
			handleOnStopState()
		}
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
