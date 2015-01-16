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
				{ label : 'Accordion', url : 'contacts-accordion.html', icon : 'fa-th-list' },
				{ label : 'Categorized', url : 'contacts-categorized.html', icon : 'fa-list' },
				{ label : 'Flat', url : 'contacts-flat.html', icon : 'fa-list-list' }
			]
		},
		{ label : 'Cards', url : 'cards.html', icon : 'fa-book' },
		{ label : 'Other controls', url : 'lists.html', icon : 'fa-th-large',
			menuOptions : [
				{ label : 'Carousel', url : 'carousel.html', icon : 'fa-files-o' },
				{ label : 'Dialog', url : 'modal.html', icon : 'fa-comment' }
			]
		},
		{ label : 'Settings', url : 'settings.html', icon : 'fa-gears' }
	]

};