xcontrols.modelName = 'Contact';
xcontrols.fields = [
		{ label : 'First name' , field: 'firstName', required: true, read: false},
		{ label : 'Last name' , field: 'lastName', required: true, read: false},
		{ field : 'name', edit: false, formula : ['firstName', 'lastName'] }, 
		{ field : 'city' },
		{ field : 'company' },
		{ label : 'Email' , field:'email', type:'email', required: true},
		{ label : 'Phone', field:'phone', type: 'phone'},
		{ field : 'comments', type : 'multiline'}
	];
xcontrols.orderBy = 'lastName';
xcontrols.orderReversed = false;
xcontrols.imageBase = 'http://demo.linqed.eu/unplugged/xcontrols.nsf/';
