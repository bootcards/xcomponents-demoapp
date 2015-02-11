var xcontrols = {

	appVersion : '0.1',

	menuAlignRight : false,

	menuOptions : [

		{ label : 'Languages', isSecondary : true, icon : 'fa-globe' ,
			menuOptions : [
				{ label : 'Dutch', url : 'contacts-accordion.html'},
				{ label : 'English', url : 'contacts-accordion.html'}
			]
		},
		{ label : 'Help', isSecondary : true, icon : 'fa-question-circle'},
		
		{ label : 'Dashboard', url : 'index.html', icon : 'fa-dashboard' },
		{ label : 'Lists', url : 'lists.html', icon : 'fa-list',
			menuOptions : [
				{ label : 'Flat', url : 'contacts-flat.html', icon : 'fa-list-alt' },
				{ label : 'Detailed', url : 'contacts-detailed.html', icon : 'fa-list-alt' },
				{ label : 'Accordion', url : 'contacts-accordion.html', icon : 'fa-th-list' },
				{ label : 'Categorized', url : 'contacts-categorized.html', icon : 'fa-list' },
			]
		},
		{ label : 'Cards', url : 'cards.html', icon : 'fa-book' },
		{ label : 'Other controls', icon : 'fa-th-large',
			menuOptions : [
				{ label : 'Carousel', url : 'carousel.html', icon : 'fa-files-o' },
				{ label : 'Dialog', url : 'modal.html', icon : 'fa-comment' }
			]
		},
		{ label : 'Examples', icon : 'fa-edit',
			menuOptions : [
				{ label : 'Activities By Contact', url : 'activities-by-contact.html', icon : 'fa-tasks' },
				{ label : 'Activities By Dept', url : 'activities-by-dept.html', icon : 'fa-tasks' },
				{ label : 'Contacts', url : 'contacts-flat.html', icon : 'fa-users' },
				{ label : 'Depts', url : 'contacts-by-dept.html', icon : 'fa-building' },
				{ label : 'My Activities', url : 'activities-mine.html', icon : 'fa-tasks' }
			]
		}
	],

	footerOptions : [
		{ label : 'Dashboard', url : '/index.html', icon : 'fa-dashboard'},
		{ label : 'Contacts', url : 'contacts-flat.html', icon : 'fa-users' }
	]


};