import { fixture, Selector} from 'testcafe';
import { getDevices, updateDevice, deleteDevice, createDevice} from './requests'

fixture`Assessment Automation`
	.page('http://192.168.1.72:3001/')
	
// variables constants
const newType = 'MAC'			//device type to add
const newCapacity = '800'		//devide capacity to add
// SELECTORS - ADD/EDIT DEVICE
const inputName = Selector('input#system_name')
const selectType = Selector('select#type')
const inputCapacity = Selector('input#hdd_capacity')
const submitSaveDevice = Selector('button.submitButton')
// SELECTORS - LIST DEVICES
const listDevices = Selector('div.list-devices')
const deviceName = listDevices.find('span.device-name')
const deviceType = listDevices.find('span.device-type')
const deviceCapacity = listDevices.find('span.device-capacity')	
const submitAddDevice = Selector('a.submitButton')
const deviceOptions = text => deviceName.withText(text).parent(1).find('div.device-options') //search div whit class device-options
const optionType = selectType.find('option').withText(newType) //Search for a select option

//Metod get Random
const getRandomString = length => {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

test('Test 1', async t => {
	const devices =	await getDevices() // Get Devices from API

	for (const device of devices) {
		const option = deviceOptions(device.system_name)
		const editButton = option.find('a.device-edit')
		const removeButton = option.find('button.device-remove')

		await t
			.expect(deviceName.withText(device.system_name).visible).ok() // Validate device name
			.expect(deviceType.withText(device.type).visible).ok() // Validate device type
			.expect(deviceCapacity.withText(device.hdd_capacity).visible).ok() // Validate davice capacity
			.expect(editButton.exists).ok() //Validate button exists
			.expect(removeButton.exists).ok()	//Validate button exists
	}
});

test('Test 2', async t => {
	const newName = getRandomString(5) 	//device name to add

	await t
		.click(submitAddDevice)
		.typeText(inputName, newName)
		.click(selectType)
		.click(optionType)
		.typeText(inputCapacity, newCapacity)
		.click(submitSaveDevice)
		
	await t.eval(() => location.reload(true))
	
	const devices =	await getDevices()
	const newDevice = devices.find(device => device.system_name === newName) // search for new device added
	
	await t
		.expect(deviceName.withText(newDevice.system_name).visible).ok() // Validate device name
		.expect(deviceType.withText(newDevice.type).visible).ok() // Validate device type
		.expect(deviceCapacity.withText(newDevice.hdd_capacity).visible).ok() // Validate davice capacity
	
});

test('Test 3', async t => {
	const devices =	await getDevices()
	const newName = 'RENAMED DEVICE'
	const payload = {
		'system_name': newName,
		'type': devices[0].type,
		'hdd_capacity': devices[0].hdd_capacity
	}
	await updateDevice(devices[0].id, payload)	//Update device through API
	await t.eval(() => location.reload(true))
	const devicesUpdated = await getDevices()

	await t
		.expect(devicesUpdated[0].system_name).eql(newName)	// Validate device name in data
		.expect(deviceName.withText(newName).visible).ok() // Validate device name in UI
});

test('Test 4', async t => {
	const newName = getRandomString(5)
	const payload = {
		'system_name': newName,
		'type': newType,
		'hdd_capacity': newCapacity
	}

	await createDevice(payload)	//Create new device through API
	await t.eval(() => location.reload(true))

	await t.expect(deviceName.withText(newName).visible).ok()	// Validate new device name is visible on UI

	const devices =	await getDevices()
	const newDevice = devices.find(value => value.system_name === newName)	//Get new device data

	await deleteDevice(newDevice.id)	// Deleted the last device
	await t.eval(() => location.reload(true))
	await t.expect(deviceName.withText(newName).visible).notOk() // Validate new device name is not visible on UI
})