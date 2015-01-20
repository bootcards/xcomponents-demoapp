xcontrols.modelName = 'Activity';

xcontrols.fields = [
		{ field : 'contact', required: true},
		{ field : 'company', required: true},
		{ field : 'date', type: 'date' }, 
		{ field : 'type', type : 'select', options : ['Document', 'Discussion', 'Call Report', 'To-do', 'Reminder', 'Note'] },
		{ label : 'Assigned to', field : 'assignedTo' },
		{ field : 'title'},
		{ label : 'Details', field : 'detail', type : 'multiline'}
	];

xcontrols.imageBase = 'http://demo.linqed.eu/unplugged/xcontrolssampler_v1_2.nsf/';
