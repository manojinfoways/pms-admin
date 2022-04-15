import dataSlice from 'app/fuse-layouts/shared-components/quickPanel/store/dataSlice';

export const responseGranteeHandler = (data, grantorLength, granteeLength) => {
	let grantees = [];
	let grantors = [];

	for (let key in data) {
		try {
			let type = key.split('@');
			if (type[0] === 'grantee') {
				if (parseInt(granteeLength) <= parseInt(type[1] + 1)) {
					grantees.push(data[key]);
				}
			} else if (type[0] === 'grantor') {
				if (parseInt(grantorLength) <= parseInt(type[1] + 1)) {
					grantors.push(data[key]);
				}
			}
		} catch (e) {
			console.log(e);
		}
	}
	return {
		grantees,
		grantors
	};
};

export const responseHandlerForPropertDiscriptor = data => {
	// console.log('data is ', data);
	let newData = data;
	let arr = [];
	let newResponse = {};
	// const reg = /\d+/g;
	const reg2 = /(\d+)/;
	let muni, tract, block, lot, unit, condo, phase, increment;
	let property_type = 'LAND';

	muni = data.mun === 'M00' ? '' : data.mun;
	// console.log('my check 1');

	// tract = data.tract === '' ? '' : data.tract.split(reg2).slice(1).join('');
	tract = data.tract === '' ? '' : data.tract;

	// console.log('tract is', tract);

	// block = data.block === '' ? '' : data.block.split(reg2).slice(1).join('');
	block = data.block === '' ? '' : data.block;

	// lot =
	// 	data.lot.toLowerCase().charAt(0) === 'p'
	// 		? 'P' + data.lot.split(reg2).slice(1).join('')
	// 		: data.lot.split(reg2).slice(1).join('');
	lot = data.lot;

	// unit = data.unit === '' ? '' : data.unit.split(reg2).slice(1).join('');
	unit = data.unit === '' ? '' : data.unit;

	// condo = data.condo === '' ? '' : data.condo.split(reg2).slice(1).join('');
	condo = data.condo === '' ? '' : data.condo;

	// phase = data.phase === '' ? '' : data.phase.split(reg2).slice(1).join('');
	phase = data.phase === '' ? '' : data.phase;

	// console.log('my check 2', data.phase);
	// increment = data.increment === '' ? '' : data.increment.split(reg2).slice(1).join('');
	increment = data.increment === '' ? '' : data.increment;

	// console.log('my check');
	let property_descriptor = `${muni} ${tract} ${block} ${lot} ${unit} ${condo} ${phase} ${increment}`;

	let condo_property_descriptor = `${muni} ${data.condo_name} ${condo}`;
	let finalPropertyDescriptor = data.condo_name !== '' ? condo_property_descriptor : property_descriptor;
	// console.log(property_descriptor);
	newResponse = {
		...newData,
		property_type,
		property_descriptor: finalPropertyDescriptor.replace(/\s\s+/g, ' '),
		area: data.area === '' ? 0 : data.area,
		mun: data.mun === 'M00' ? 'M00' : data.mun,
		tract,
		block,
		lot,
		unit,
		condo,
		phase,
		increment
	};
	// console.log("newResponsenewResponsenewResponse",newResponse);
	return newResponse;
};

export const responseHandlerForPropertDiscriptorEdit = data => {
	// console.log('data is ', data);
	let newData = data;
	let arr = [];
	let newResponse = {};
	const reg2 = /(\d+)/;
	const reg = /\d+/g;
	let muni, tract, block, lot, unit, condo, phase, increment;

	muni = data.mun === 'M00' ? '' : data.mun;

	// tract = data.tract === '' ? '' : data.tract === null ? '' : data.tract.split(reg2).slice(1).join('');
	tract = data.tract === '' ? '' : data.tract === null ? '' : data.tract;

	// console.log('tract is', tract);

	// block = data.block === '' ? '' : data.block === null ? '' : data.block.split(reg2).slice(1).join('');
	block = data.block === '' ? '' : data.block === null ? '' : data.block;

	// lot =
	// 	data.lot === null
	// 		? ''
	// 		: data.lot === ''
	// 		? ''
	// 		: data.lot.toLowerCase().charAt(0) === 'p'
	// 		? 'P' + data.lot.split(reg2).slice(1).join('')
	// 		: data.lot.split(reg2).slice(1).join('');
	lot =
		data.lot === null
			? ''
			: data.lot === ''
			? ''
			: data.lot;

	// unit = data.unit === '' ? '' : data.unit === null ? '' : data.unit.split(reg2).slice(1).join('');
	unit = data.unit === '' ? '' : data.unit === null ? '' : data.unit;

	// condo = data.condo === '' ? '' : data.condo === null ? '' : data.condo.split(reg2).slice(1).join('');
	condo = data.condo === '' ? '' : data.condo === null ? '' : data.condo;

	// phase = data.phase === '' ? '' : data.phase === null ? '' : data.phase.split(reg2).slice(1).join('');
	phase = data.phase === '' ? '' : data.phase === null ? '' : data.phase;

	// console.log('my check 2', data.phase);
	// increment =
	// 	data.increment === '' ? '' : data.increment === null ? '' : data.increment.split(reg2).slice(1).join('');
	increment = data.increment === '' ? '' : data.increment === null ? '' : data.increment;

	let property_descriptor = `${muni} ${tract} ${block} ${lot} ${unit} ${condo} ${phase} ${increment}`;
	let condo_property_descriptor = `${muni} ${data.condo_name} ${condo}`;
	let finalPropertyDescriptor = data.condo_name !== '' ? condo_property_descriptor : property_descriptor;
	// console.log('ok report ', property_descriptor);
	newResponse = {
		...newData,
		property_descriptor: finalPropertyDescriptor.replace(/\s\s+/g, ' '),
		area: data.area === '' ? 0 : data.area,
		mun: data.mun === 'M00' ? 'M00' : data.mun,
		tract,
		block,
		lot,
		unit,
		condo,
		phase,
		increment
	};
	// console.log(newResponse);
	return newResponse;
};

export const grantCoverter = (data, vesting, ownerVesting, grant, currentType) => {
	if (data.length < 1) {
		return [];
	}
	const newArr = [];
	data.forEach(item => {
		let newObject = {
			...item
		};
		if (item.type) {
			grant.forEach(i => {
				if (i.type === item.type) {
					newObject = {
						...newObject,
						type: i[currentType === 'grantors' ? 'grantor_type_id' : 'grantee_type_id']
					};
				}
			});
		}
		if (item.vesting_option) {
			vesting.forEach(i => {
				if (i.vesting_option === item.vesting_option) {
					newObject = {
						...newObject,
						vesting_option: i.vesting_option_id
					};
				}
			});
		}
		if (item.ownership_vesting) {
			ownerVesting.forEach(i => {
				if (i.ownership_vesting === item.ownership_vesting) {
					newObject = {
						...newObject,
						ownership_vesting: i.ownership_vesting_id
					};
				}
			});
		}
		newArr.push(newObject);
	});
	return newArr;
};

export const generateNotes = (data, notesType) => {
	if (data.length < 1) {
		return [];
	}
	const newArr = [];
	data.forEach(item => {
		let newObject = {
			...item
		};
		if (item.note_type) {
			notesType.forEach(i => {
				if (item.note_type === i.note_type) {
					newObject = {
						...newObject,
						note_type: i.note_type_id
					};
				}
			});
		}
		newArr.push(newObject);
	});

	return newArr;
};
export const convertToFormDate = data => {
	const formData = new FormData();
	for (let key in data) {
		if (key === 'record') {
			formData.append(key, data[key]);
		} else {
			formData.append(key, JSON.stringify(data[key]));

			// if(data[key].length > 0){
			// 	let temp = [];
			// 	data[key].forEach(item => {
			// 		const tempFormData = new FormData();
			// 		for(let innerKey in item) {
			// 			tempFormData.append(innerKey, item[innerKey]);
			// 		}
			// 	})
			// }
		}
	}
	return formData;
};
