xcomponents.models['contact'] = {
	name : 'Contact',
	fields : [
		{ label : 'First name *' , field: 'firstName', required: true, read: false},
		{ label : 'Last name *' , field: 'lastName', required: true, read: false},
		{ field : 'name', edit: false, formula : ['firstName', 'lastName'] },
		{ field : 'title' }, 
		{ field : 'city' },
		{ field : 'company' },
		{ field : 'country', type : 'select', options : ['UK', 'USA (West Coast)', 'USA (East Coast)', 'The Netherlands']},
		{ label : 'Mobile enabled', field : 'mobileEnabled', type : 'toggle', labelTrue : 'On', labelFalse : 'Off'},
		{ field : 'devices', type : 'select-multiple', options : ['iPad 4', 'iPad Air', 'iPhone 6', 'iPhone 6 Plus', 'iPod Touch']},
		{ label : 'Email *' , field:'email', type:'email', required: true},
		{ label : 'Phone', field:'phone', type: 'phone'},
		{ label : 'Last contact', field : 'lastContact', type : 'date', default : 'now'},
		{ field : 'comments', type : 'multiline'}
	],
	imageBase : 'http://demo.linqed.eu/unplugged/xcontrolssampler_v1_2.nsf/'
};
