xcontrols.modelName = 'Note';

xcontrols.fields = [
		{ field : 'subject', required : true }, 
		{ field : 'date', type :'date', required : true, 'default' : 'now' },
		{ field : 'details', type : 'multiline' },
	];

xcontrols.imageBase = 'http://demo.linqed.eu/unplugged/xcontrols-latest.nsf/';
