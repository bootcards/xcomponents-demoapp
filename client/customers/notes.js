xcomponents.modelName = 'Note';

xcomponents.fields = [
		{ field : 'subject', required : true }, 
		{ field : 'date', type :'date', required : true, 'default' : 'now' },
		{ field : 'details', type : 'multiline' },
	];

xcomponents.imageBase = 'http://demo.linqed.eu/unplugged/xcomponents-latest.nsf/';
