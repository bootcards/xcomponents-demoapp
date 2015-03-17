xcomponents.modelName = 'Note';

xcomponents.fields = [
		{ field : 'subject', required : true, filter : 'notesname' }, 
		{ field : 'date', type :'date', required : true, 'default' : 'now' },
		{ field : 'details', type : 'html', label : null }
	];

xcomponents.imageBase = 'http://demo.linqed.eu/unplugged/xcontrols-latest.nsf/';
