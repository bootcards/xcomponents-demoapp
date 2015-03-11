xcomponents.modelName = 'Company';

xcomponents.fields = [
		{ field : 'name', required : true},
		{ field : 'city' },
		{ field : 'country', read : false},
		{ field : 'type', read : false, type : 'select', options:['Prospect', 'Customer', 'Inactive'] },
		{ field : 'website', type : 'link' },
		{ field : 'phone', type :'phone' }

	];

xcomponents.imageBase = 'http://demo.linqed.eu/unplugged/xcontrolssampler_v1_2.nsf/';

/*

  "properties": {
    "website": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "country": {
      "type": "string"
    },
    "id": {
      "type": "string"
    },
    "city": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "address1": {
      "type": "string"
    },
    "address2": {
      "type": "string"
    },
    "zipCode": {
      "type": "string"
    },
    "phone": {
      "type": "string"
    }
  },*/