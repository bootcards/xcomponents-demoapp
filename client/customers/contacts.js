xcomponents.modelName = 'Contact';

xcomponents.fields = [
		{ label : 'First name' , field: 'firstName', required: true, read: false},
		{ label : 'Last name' , field: 'lastName', required: true, read: false},
		{ field : 'name', edit: false, formula : ['firstName', 'lastName'] },
		{ field : 'title' }, 
		{ field : 'city' },
		{ field : 'company' },
		{ field : 'country', read : false},
		{ label : 'Mobile enabled', field : 'mobileEnabled', type : 'toggle', labelTrue : 'On', labelFalse : 'Off'},
		{ label : 'Device (local)', field : 'devicesPersonal', type : 'select', options : ['iPad 4', 'iPad Air', 'iPhone 6', 'iPhone 6 Plus', 'iPod Touch']},
		{ label : 'Devices (remote)', field : 'devicesBusiness', type : 'select-multiple', options : { endpoint:'/api/Devices', label : 'name', value : 'id'} },
		{ label : 'Email' , field:'email', type:'email', required: true},
		{ label : 'Phone', field:'phone', type: 'phone'},
		{ field : 'comments', type : 'multiline'}
	];

xcomponents.imageBase = 'http://demo.linqed.eu/unplugged/xcontrols-latest.nsf/';
