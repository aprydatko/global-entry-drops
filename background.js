import { fetchLocations } from './api/fetchLocations.js'
import { fetchOpenSlots } from './api/fetchOpenSlots.js'
import { createNotification } from './lib/createNotification.js'

const ALARM_JOB_NAME = 'DROP_ALARM'

let cachedPrefs = {}
let firstAppTimestamp = null

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
	cachedPrefs = {}
	firstAppTimestamp = null
}

const handleOnStart = (prefs) => {
	console.log('prefs received', prefs)
	cachedPrefs = prefs
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
			// immediately run the job
			openSlotsJob()
			chrome.alarms.create(ALARM_JOB_NAME, { periodInMinutes: 0.1 })
		}
	})
}

const stopAlarm = () => {
	chrome.alarms.clearAll()
}

chrome.alarms.onAlarm.addListener(() => {
	console.log('onAlarm scheduled code running...')
	openSlotsJob()
})

const openSlotsJob = () => {
	fetchOpenSlots(cachedPrefs).then((data) => handleOpenSlots(data))
}

const handleOpenSlots = (openSlots) => {
	console.log('openSlots', openSlots)
	console.log('firstAppTimestamp', firstAppTimestamp)
	console.log('openSlots[0].timestamp', openSlots[0].timestamp)
	if (
		openSlots &&
		openSlots.length > 0 &&
		openSlots[0].timestamp != firstAppTimestamp
	) {
		firstAppTimestamp = openSlots[0].timestamp
		createNotification(openSlots[0], openSlots.length, cachedPrefs)
	}
}
