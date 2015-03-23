xcomponents.models['activity'] = {
	name : 'Activity',
	fields : [
		{ field : 'contact', required: true},
		{ field : 'company', required: true},
		{ field : 'date', type: 'date', default : 'now' }, 
		{ field : 'type', type : 'select', options : ['Document', 'Discussion', 'Call Report', 'To-do', 'Reminder', 'Note'] },
		{ label : 'Assigned to', field : 'assignedTo' },
		{ field : 'title'},
		{ label : 'Details', field : 'detail', type : 'multiline'}
	],
	imageBase : 'http://demo.linqed.eu/unplugged/xcontrolsssampler_v1_2.nsf/'
};
