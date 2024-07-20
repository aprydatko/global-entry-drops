import fetchLocations from './api/fetchLocations.js'

const ALARM_JOB_NAME = 'DROP_ALARM'

chrome.runtime.onInstalled.addListener((details) => {
	fetchLocations()
})

chrome.runtime.onMessage.addListener((data) => {
	const { event, prefs } = data
	switch (event) {
		case 'onStop':
			handleOnStop()
			break
		case 'onStart':
			handleOnStart(prefs)
			break
		default:
			break
	}
})

const handleOnStop = () => {
	console.log('On stop in background')
	setRunningStatus(false)
	stopAlarm()
}

const handleOnStart = (prefs) => {
	console.log('prefs received', prefs)
	chrome.storage.local.set(prefs)
	setRunningStatus(true)
	createAlarm()
}

const setRunningStatus = (isRunning) => {
	chrome.storage.local.set({ isRunning })
}

const createAlarm = () => {
	chrome.alarms.get(ALARM_JOB_NAME, (existingAlarm) => {
		if (!existingAlarm) {
			chrome.alarms.create(ALARM_JOB_NAME, { periodInMinutes: 0.1 })
		}
	})
}

const stopAlarm = () => {
	chrome.alarms.clearAll()
}

chrome.alarms.onAlarm.addListener(() => {
	console.log('onAlarm scheduled code running...')
})
