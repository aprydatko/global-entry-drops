export const handleNotification = (activeAppointments) => {
	if (activeAppointments.length > 0) {
		createNotification(activeAppointments[0])
	}
}

const createNotification = (activeAppointment) => {
	chrome.notifications.create({
		title: 'Global Entry Drops',
		message: `Found an open interview at ${activeAppointment.timestamp}`,
		iconUrl: './images/icon-48.png',
		type: 'basic',
	})
}
