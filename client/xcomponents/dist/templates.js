angular.module('templates-main', ['xc-card.html', 'xc-chart.html', 'xc-footer.html', 'xc-header.html', 'xc-image.html', 'xc-list-accordion.html', 'xc-list-categorised.html', 'xc-list-flat.html', 'xc-list.html', 'xc-login.html', 'xc-summary-item.html', 'xc-summary.html']);

angular.module("xc-card.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-card.html",
    "<div>\n" +
    "\n" +
    "	<!-- text if no item is selected -->\n" +
    "	<div ng-class=\"{'panel panel-default' : true , 'hidden' : selectedItem || !defaultText }\">\n" +
    "		<div class=\"list-group\">\n" +
    "			<div class=\"list-group-item\">\n" +
    "				{{defaultText}}\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<!-- card (read) -->\n" +
    "	<div ng-class=\"{'panel panel-default' : true , 'hidden' : !selectedItem}\">\n" +
    "\n" +
    "		<div class=\"panel-heading clearfix\">\n" +
    "			<h3 class=\"panel-title pull-left\">{{modelName}}</h3>\n" +
    "			<a class=\"btn btn-primary pull-right hidden-xs\" data-toggle=\"modal\" data-target=\"#editModal\">\n" +
    "				<i class=\"fa fa-pencil\"></i><span>Edit</span>\n" +
    "			</a>\n" +
    "\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"list-group\">\n" +
    "\n" +
    "			<div ng-repeat=\"field in fieldsRead\">\n" +
    "\n" +
    "				<div class=\"list-group-item\" ng-show=\"field.type=='text'\">\n" +
    "					<label>{{field.label}}</label>\n" +
    "					<h4 class=\"list-group-item-heading\">{{selectedItem[field.field]}}</h4>\n" +
    "				</div>\n" +
    "				<div class=\"list-group-item\" ng-show=\"field.type=='multiline'\">\n" +
    "					<label>{{field.label}}</label>\n" +
    "					<h4 class=\"list-group-item-heading\">{{selectedItem[field.field]}}</h4>\n" +
    "				</div>\n" +
    "				<a href=\"mailto:{{selectedItem[field.field]}}\" class=\"list-group-item\" \n" +
    "					ng-show=\"field.type=='email'\">\n" +
    "					<label>{{field.label}}</label>\n" +
    "					<h4 class=\"list-group-item-heading\">{{selectedItem[field.field]}}</h4>\n" +
    "				</a>\n" +
    "				<a href=\"tel:{{selectedItem[field.field]}}\" class=\"list-group-item\" \n" +
    "					ng-show=\"field.type=='phone'\">\n" +
    "					<label>{{field.label}}</label>\n" +
    "					<h4 class=\"list-group-item-heading\">{{selectedItem[field.field]}}</h4>\n" +
    "				</a>\n" +
    "\n" +
    "			<div>\n" +
    "		</div>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<!--modal to edit details-->\n" +
    "	<form class=\"form-horizontal\" name=\"cardForm\" role=\"form\">\n" +
    "	<div class=\"modal fade\" id=\"editModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"editModal\" aria-hidden=\"true\">\n" +
    "		<div class=\"modal-dialog\">\n" +
    "			<div class=\"modal-content\">\n" +
    "			\n" +
    "				<div class=\"modal-header\">\n" +
    "\n" +
    "					<div class=\"btn-group pull-left\">\n" +
    "						<button class=\"btn btn-danger\" data-dismiss=\"modal\" type=\"button\">\n" +
    "							Cancel\n" +
    "						</button>\n" +
    "					</div>\n" +
    "				\n" +
    "					<div class=\"btn-group pull-right\">\n" +
    "						<button class=\"btn btn-success\" type=\"button\" ng-click=\"saveItem(cardForm, '#editModal')\">\n" +
    "							Save\n" +
    "						</button>\n" +
    "					</div>\n" +
    "					<h4 class=\"modal-title\">Edit {{modelName}}</h4>		\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"modal-body\">\n" +
    "\n" +
    "					<div class=\"form-group\" ng-repeat=\"field in fieldsEdit\" ng-class=\"{ 'has-error': cardForm[field.field].$invalid }\">\n" +
    "\n" +
    "						<label class=\"col-xs-3 control-label\">{{field.label}}</label>\n" +
    "						<div class=\"col-xs-9\">\n" +
    "							<input class=\"form-control\" name=\"{{field.field}}\" ng-model=\"selectedItem[field.field]\" ng-required=\"field.required\" ng-show=\"field.type!='multiline'\" />\n" +
    "							<textarea class=\"form-control\" name=\"{{field.field}}\" ng-model=\"selectedItem[field.field]\" ng-required=\"field.required\" ng-show=\"field.type=='multiline'\" />\n" +
    "						</div>\n" +
    "\n" +
    "					</div>\n" +
    "\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"modal-footer\">\n" +
    "					<button type=\"button\" class=\"btn btn-danger btn-block\" ng-click=\"deleteItem()\" data-dismiss=\"modal\">\n" +
    "						<i class=\"fa fa-trash-o\"></i>\n" +
    "						Delete Contact\n" +
    "					</button>		\n" +
    "				</div>\n" +
    "\n" +
    "\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>	\n" +
    "	</form>\n" +
    "\n" +
    "</div>");
}]);

angular.module("xc-chart.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-chart.html",
    "<div>\n" +
    "\n" +
    "	<div class=\"panel panel-default bootcards-chart\">\n" +
    "		\n" +
    "		<div class=\"panel-heading\">\n" +
    "			<h3 class=\"panel-title\">{{title}}</h3>					\n" +
    "		</div>\n" +
    "\n" +
    "		<div>\n" +
    "\n" +
    "			<!--bar chart-->\n" +
    "			<div class=\"bootcards-chart-canvas\" id=\"chartClosedSales\"></div>\n" +
    "\n" +
    "			<div class=\"panel-footer\">\n" +
    "				<button class=\"btn btn-default btn-block\"\n" +
    "					onClick=\"toggleChartData(event)\">\n" +
    "					<i class=\"fa fa-table\"></i>\n" +
    "					Show Data\n" +
    "				</button>				\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		\n" +
    "		<div class=\"panel-footer\">\n" +
    "			<small class=\"pull-left\">Built with Bootcards - Chart Card</small>\n" +
    "		</div>					\n" +
    "\n" +
    "	</div>		\n" +
    "\n" +
    "	<!-- Table Card data -->\n" +
    "	<div class=\"panel panel-default bootcards-table\" style=\"display:none\">\n" +
    "		<div class=\"panel-heading\">\n" +
    "			<h3 class=\"panel-title\">{{title}}</h3>							\n" +
    "		</div>	\n" +
    "		<table class=\"table table-hover\">\n" +
    "			<thead>				\n" +
    "				<tr class=\"active\"><th>Name</th><th class=\"text-right\">Sales value</th></tr>\n" +
    "			</thead>\n" +
    "			<tbody>\n" +
    "				<tr ng-repeat=\"row in chartData\">\n" +
    "					<td>{{row.label}}</td><td class=\"text-right\">{{valuePrefix}} {{row.value | number : 0}}</td>\n" +
    "				<tr>\n" +
    "					<td><strong>Total</strong></td><td class=\"text-right\"><strong>{{valuePrefix}} {{chartTotal | number : 0}}</strong></td></tr>\n" +
    "			</tbody>\n" +
    "		</table>\n" +
    "		<div class=\"panel-footer\">\n" +
    "			<button class=\"btn btn-default btn-block\" onClick=\"toggleChartData(event, closedSalesChart)\">\n" +
    "				<i class=\"fa fa-bar-chart-o\"></i>\n" +
    "				Show Chart\n" +
    "			</button>				\n" +
    "		</div>\n" +
    "		<div class=\"panel-footer\">\n" +
    "			<small class=\"pull-left\">Built with Bootcards - Table Card</small>\n" +
    "			<a class=\"btn btn-link btn-xs pull-right\"\n" +
    "							href=\"/snippets/table\"\n" +
    "							data-toggle=\"modal\"\n" +
    "							data-target=\"#docsModal\">\n" +
    "							View Source</a>\n" +
    "		</div>													\n" +
    "	</div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("xc-footer.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-footer.html",
    "<div class=\"navbar navbar-default navbar-fixed-bottom\">\n" +
    "		<div class=\"container\">\n" +
    "			\n" +
    "			<div class=\"bootcards-desktop-footer clearfix\">\n" +
    "				<p class=\"pull-left\">XComponents | version 0.1</p>\n" +
    "			</div>\n" +
    "\n" +
    "			<div class=\"btn-group\">\n" +
    "				<ng-transclude></ng-transclude>     \n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>");
}]);

angular.module("xc-header.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-header.html",
    "<div>\n" +
    "\n" +
    "<div class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n" +
    "\n" +
    "	<div class=\"container\">\n" +
    "\n" +
    "		<div class=\"navbar-header\">\n" +
    "\n" +
    "			<a class=\"navbar-brand\">{{title}}</a>	\n" +
    "\n" +
    "		</div>\n" +
    "\n" +
    "		<!--slide-in menu button-->\n" +
    "		<button type=\"button\" class=\"btn btn-default btn-menu pull-left offCanvasToggle\" data-toggle=\"offcanvas\">\n" +
    "	   <i class=\"fa fa-lg fa-bars\"></i><span>Menu</span>\n" +
    "	   </button>\n" +
    "\n" +
    "    <div class=\"navbar-collapse collapse\">\n" +
    "      <ul class=\"nav navbar-nav\">\n" +
    "        <li ng-repeat=\"o in menuOptions\" ng-class=\"{'active' : isActive(o)}\">\n" +
    "          <a href=\"{{o.url}}\">\n" +
    "            <i class=\"fa\" ng-class=\"o.icon ? o.icon : null\"></i>\n" +
    "            {{o.label}}\n" +
    "          </a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "	</div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<!--slide in menu-->\n" +
    "  <nav id=\"offCanvasMenu\" class=\"navmenu offcanvas offcanvas-left\">\n" +
    "    <ul class=\"nav\">\n" +
    "      <li ng-repeat=\"o in menuOptions\" ng-class=\"{'active' : isActive(o)}\">\n" +
    "        <a href=\"{{o.url}}\">\n" +
    "          <i class=\"fa fa-lg\" ng-class=\"o.icon ? o.icon : null\"></i>\n" +
    "          {{o.label}}\n" +
    "        </a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <div ng-show=\"{{appVersion}}\" style=\"margin-top:20px; padding-left: 20px; font-size: 12px; color: #777\">{{appVersion}}</div>\n" +
    "  </nav>\n" +
    "\n" +
    "</div>");
}]);

angular.module("xc-image.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-image.html",
    "<div class=\"panel panel-default bootcards-media\" ng-class=\"{'hidden' : !imageSrc}\">\n" +
    "\n" +
    "	<div ng-show=\"title\" class=\"panel-heading\" ng-class=\"{'hidden' : !title}\">\n" +
    "		<h3 class=\"panel-title\">{{title}}</h3>\n" +
    "	</div>\n" +
    "	<!-- <div class=\"panel-body\">\n" +
    "		description\n" +
    "	</div> -->\n" +
    "	\n" +
    "	<img ng-src=\"{{imageSrc}}\" class=\"img-responsive\" />\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("xc-list-accordion.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-list-accordion.html",
    "<div class='container bootcards-container'>\n" +
    "\n" +
    " <div class='row'>\n" +
    "\n" +
    " 	<div class='bootcards-list {{colLeft}}'>\n" +
    "\n" +
    "		<div class=\"panel\">\n" +
    "\n" +
    "			<!--add a new item-->\n" +
    "			<div class=\"panel-body\">\n" +
    "				<div class=\"search-form\">\n" +
    "					<div class=\"row\">\n" +
    "					    <div class=\"col-xs-9\">\n" +
    "					      <div class=\"form-group\">\n" +
    "						      <input type=\"text\" class=\"form-control\" ng-model=\"filter\" placeholder=\"Search {{modelName}}...\">\n" +
    "						      <i class=\"fa fa-search\"></i>\n" +
    "					      </div>\n" +
    "					    </div>\n" +
    "					    <div class=\"col-xs-3\">\n" +
    "							<a class=\"btn btn-primary btn-block\" href=\"#\" data-toggle=\"modal\" data-target=\"#addModal\">\n" +
    "								<i class=\"fa fa-plus\"></i> \n" +
    "								<span>Add</span>\n" +
    "							</a>\n" +
    "					    </div>\n" +
    "					</div>						    \n" +
    "				</div>				\n" +
    "			</div>\n" +
    "\n" +
    "			<div class=\"list-group\">\n" +
    "\n" +
    "				<div ng-repeat=\"group in groups\" class=\"animate-repeat\">\n" +
    "					<a ng-class=\"{'collapsed' : group.collapsed}\" class=\"list-group-item bootcards-list-subheading\" ng-click=\"toggleCategory(group)\">\n" +
    "						{{group.name}}\n" +
    "					</a>\n" +
    "				\n" +
    "					<a class=\"list-group-item\" ng-show=\"!group.collapsed\" ng-repeat=\"item in group.entries | filter : filter\" ng-click=\"select(item)\"\n" +
    "						ng-class=\"{'active' : selected == item}\">\n" +
    "\n" +
    "						<!--placeholder icon-->\n" +
    "						<i ng-show=\"showPlaceholder(item)\" class=\"fa fa-2x pull-left\" ng-class=\"'fa-' + imagePlaceholderIcon\"></i>\n" +
    "					\n" +
    "					<!--image-->\n" +
    "						<img \n" +
    "						ng-show=\"showImage(item)\"\n" +
    "						class=\"img-rounded pull-left\" \n" +
    "						ng-src=\"{{ imageBase + item[imageField] }}\" />\n" +
    "\n" +
    "						<h4 class=\"list-group-item-heading\">{{item[summaryField]}}</h4>\n" +
    "\n" +
    "						<p class=\"list-group-item-text\">{{item[detailsField]}}</p>\n" +
    "						\n" +
    "					</a>\n" +
    "\n" +
    "					\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"list-group-item\" ng-show=\"isLoading\">\n" +
    "					<i class=\"fa fa-spinner fa-spin fa-fw\" style=\"margin-right:0; opacity: 1;\"></i>Loading...\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"list-group-item\" ng-show=\"!isLoading && hasMore\" ng-click=\"loadMore()\">\n" +
    "					Load more...\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "\n" +
    "		</div>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<div class='bootcards-cards {{colRight}}'>\n" +
    "\n" +
    "		<ng-transclude></ng-transclude>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    " </div>\n" +
    "\n" +
    "<!--modal to add details-->\n" +
    "<form class=\"form-horizontal\" name=\"cardNewForm\" role=\"form\">\n" +
    "	<div class=\"modal fade\" id=\"addModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addModal\" aria-hidden=\"true\">\n" +
    "		<div class=\"modal-dialog\">\n" +
    "			<div class=\"modal-content\">\n" +
    "			\n" +
    "				<div class=\"modal-header\">\n" +
    "\n" +
    "					<div class=\"btn-group pull-left\">\n" +
    "						<button class=\"btn btn-danger\" data-dismiss=\"modal\" type=\"button\">\n" +
    "							Cancel\n" +
    "						</button>\n" +
    "					</div>\n" +
    "				\n" +
    "					<div class=\"btn-group pull-right\">\n" +
    "						<button class=\"btn btn-success\" type=\"button\" ng-click=\"saveNewItem(cardNewForm, '#addModal')\">\n" +
    "							Save\n" +
    "						</button>\n" +
    "					</div>\n" +
    "					<h4 class=\"modal-title\">Add {{modelName}}</h4>		\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"modal-body\">\n" +
    "\n" +
    "					<div class=\"form-group\" ng-repeat=\"field in fieldsEdit\" ng-class=\"{ 'has-error': cardNewForm[field.field].$invalid }\">\n" +
    "\n" +
    "						<label class=\"col-xs-3 control-label\">{{field.label}}</label>\n" +
    "						<div class=\"col-xs-9\">\n" +
    "							<input class=\"form-control\" name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\" />\n" +
    "						</div>\n" +
    "\n" +
    "					</div>\n" +
    "\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>	\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("xc-list-categorised.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-list-categorised.html",
    "<div class='container bootcards-container'>\n" +
    "\n" +
    " <div class='row'>\n" +
    "\n" +
    " 	<div class='bootcards-list {{colLeft}}'>\n" +
    "\n" +
    "		<div class=\"panel\">\n" +
    "\n" +
    "			<!--add a new item-->\n" +
    "			<div class=\"panel-body\">\n" +
    "				<div class=\"search-form\">\n" +
    "					<div class=\"row\">\n" +
    "					    <div class=\"col-xs-9\">\n" +
    "					      <div class=\"form-group\">\n" +
    "						      <input type=\"text\" class=\"form-control\" ng-model=\"filter\" placeholder=\"Search {{modelName}}...\">\n" +
    "						      <i class=\"fa fa-search\"></i>\n" +
    "					      </div>\n" +
    "					    </div>\n" +
    "					    <div class=\"col-xs-3\">\n" +
    "							<a class=\"btn btn-primary btn-block\" href=\"#\" data-toggle=\"modal\" data-target=\"#addModal\">\n" +
    "								<i class=\"fa fa-plus\"></i> \n" +
    "								<span>Add</span>\n" +
    "							</a>\n" +
    "					    </div>\n" +
    "					</div>						    \n" +
    "				</div>				\n" +
    "			</div>\n" +
    "\n" +
    "			<div class=\"list-group\">\n" +
    "\n" +
    "				<div ng-repeat=\"group in groups\" class=\"animate-repeat\">\n" +
    "					<div class=\"list-group-item bootcards-list-subheading\" >\n" +
    "						{{group.name}}\n" +
    "					</div>\n" +
    "				\n" +
    "					<a class=\"list-group-item\" ng-repeat=\"item in group.entries | filter : filter\" ng-click=\"select(item)\"\n" +
    "						ng-class=\"{'active' : selected == item}\">\n" +
    "\n" +
    "						<!--placeholder icon-->\n" +
    "						<i ng-show=\"showPlaceholder(item)\" class=\"fa fa-2x pull-left\" ng-class=\"'fa-' + imagePlaceholderIcon\"></i>\n" +
    "					\n" +
    "					<!--image-->\n" +
    "						<img \n" +
    "						ng-show=\"showImage(item)\"\n" +
    "						class=\"img-rounded pull-left\" \n" +
    "						ng-src=\"{{ imageBase + item[imageField] }}\" />\n" +
    "\n" +
    "						<h4 class=\"list-group-item-heading\">{{item[summaryField]}}</h4>\n" +
    "\n" +
    "						<p class=\"list-group-item-text\">{{item[detailsField]}}</p>\n" +
    "						\n" +
    "					</a>\n" +
    "\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"list-group-item\" ng-show=\"isLoading\">\n" +
    "					<i class=\"fa fa-spinner fa-spin fa-fw\" style=\"margin-right:0; opacity: 1;\"></i>Loading...\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"list-group-item\" ng-show=\"!isLoading && hasMore\" ng-click=\"loadMore()\">\n" +
    "					Load more...\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "\n" +
    "		</div>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<div class='bootcards-cards {{colRight}}'>\n" +
    "\n" +
    "		<ng-transclude></ng-transclude>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    " </div>\n" +
    "\n" +
    "<!--modal to add details-->\n" +
    "<form class=\"form-horizontal\" name=\"cardNewForm\" role=\"form\">\n" +
    "	<div class=\"modal fade\" id=\"addModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addModal\" aria-hidden=\"true\">\n" +
    "		<div class=\"modal-dialog\">\n" +
    "			<div class=\"modal-content\">\n" +
    "			\n" +
    "				<div class=\"modal-header\">\n" +
    "\n" +
    "					<div class=\"btn-group pull-left\">\n" +
    "						<button class=\"btn btn-danger\" data-dismiss=\"modal\" type=\"button\">\n" +
    "							Cancel\n" +
    "						</button>\n" +
    "					</div>\n" +
    "				\n" +
    "					<div class=\"btn-group pull-right\">\n" +
    "						<button class=\"btn btn-success\" type=\"button\" ng-click=\"saveNewItem(cardNewForm, '#addModal')\">\n" +
    "							Save\n" +
    "						</button>\n" +
    "					</div>\n" +
    "					<h4 class=\"modal-title\">Add {{modelName}}</h4>		\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"modal-body\">\n" +
    "\n" +
    "					<div class=\"form-group\" ng-repeat=\"field in fieldsEdit\" ng-class=\"{ 'has-error': cardNewForm[field.field].$invalid }\">\n" +
    "\n" +
    "						<label class=\"col-xs-3 control-label\">{{field.label}}</label>\n" +
    "						<div class=\"col-xs-9\">\n" +
    "							<input class=\"form-control\" name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\" />\n" +
    "						</div>\n" +
    "\n" +
    "					</div>\n" +
    "\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>	\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("xc-list-flat.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-list-flat.html",
    "<div class='container bootcards-container'>\n" +
    "\n" +
    " <div class='row'>\n" +
    "\n" +
    " 	<div class='bootcards-list {{colLeft}}'>\n" +
    "\n" +
    "		<div class=\"panel\">\n" +
    "\n" +
    "			<!--add a new item-->\n" +
    "			<div class=\"panel-body\">\n" +
    "				<div class=\"search-form\">\n" +
    "					<div class=\"row\">\n" +
    "					    <div class=\"col-xs-9\">\n" +
    "					      <div class=\"form-group\">\n" +
    "						      <input type=\"text\" class=\"form-control\" ng-model=\"filter\" placeholder=\"Search {{modelName}}...\">\n" +
    "						      <i class=\"fa fa-search\"></i>\n" +
    "					      </div>\n" +
    "					    </div>\n" +
    "					    <div class=\"col-xs-3\">\n" +
    "							<a class=\"btn btn-primary btn-block\" href=\"#\" data-toggle=\"modal\" data-target=\"#addModal\">\n" +
    "								<i class=\"fa fa-plus\"></i> \n" +
    "								<span>Add</span>\n" +
    "							</a>\n" +
    "					    </div>\n" +
    "					</div>						    \n" +
    "				</div>				\n" +
    "			</div>\n" +
    "\n" +
    "			<div class=\"list-group\">\n" +
    "				\n" +
    "				<a class=\"list-group-item animate-repeat\" ng-repeat=\"item in itemsPage | filter : filter track by item.id\"  ng-click=\"select(item)\"\n" +
    "					ng-class=\"{'active' : selected == item}\">\n" +
    "\n" +
    "					<!--placeholder icon-->\n" +
    "					<i ng-show=\"showPlaceholder(item)\" class=\"fa fa-2x pull-left\" ng-class=\"'fa-' + imagePlaceholderIcon\"></i>\n" +
    "					\n" +
    "					<!--image-->\n" +
    "					<img \n" +
    "						ng-show=\"showImage(item)\"\n" +
    "						class=\"img-rounded pull-left\" \n" +
    "						ng-src=\"{{ imageBase + item[imageField] }}\" />\n" +
    "\n" +
    "					<h4 class=\"list-group-item-heading\">{{item[summaryField]}}</h4>\n" +
    "\n" +
    "					<p class=\"list-group-item-text\">{{item[detailsField]}}</p>\n" +
    "					\n" +
    "				</a>\n" +
    "\n" +
    "				<div class=\"list-group-item\" ng-show=\"isLoading\">\n" +
    "					<i class=\"fa fa-spinner fa-spin fa-fw\" style=\"margin-right:0; opacity: 1;\"></i>Loading...\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"list-group-item\" ng-show=\"!isLoading && hasMore\" ng-click=\"loadMore()\">\n" +
    "					Load more...\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "\n" +
    "		</div>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<div class='bootcards-cards {{colRight}}'>\n" +
    "\n" +
    "		<ng-transclude></ng-transclude>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    " </div>\n" +
    "\n" +
    "<!--modal to add details-->\n" +
    "<form class=\"form-horizontal\" name=\"cardNewForm\" role=\"form\">\n" +
    "	<div class=\"modal fade\" id=\"addModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addModal\" aria-hidden=\"true\">\n" +
    "		<div class=\"modal-dialog\">\n" +
    "			<div class=\"modal-content\">\n" +
    "			\n" +
    "				<div class=\"modal-header\">\n" +
    "\n" +
    "					<div class=\"btn-group pull-left\">\n" +
    "						<button class=\"btn btn-danger\" data-dismiss=\"modal\" type=\"button\">\n" +
    "							Cancel\n" +
    "						</button>\n" +
    "					</div>\n" +
    "				\n" +
    "					<div class=\"btn-group pull-right\">\n" +
    "						<button class=\"btn btn-success\" type=\"button\" ng-click=\"saveNewItem(cardNewForm, '#addModal')\">\n" +
    "							Save\n" +
    "						</button>\n" +
    "					</div>\n" +
    "					<h4 class=\"modal-title\">Add {{modelName}}</h4>		\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"modal-body\">\n" +
    "\n" +
    "					<div class=\"form-group\" ng-repeat=\"field in fieldsEdit\" ng-class=\"{ 'has-error': cardNewForm[field.field].$invalid }\">\n" +
    "\n" +
    "						<label class=\"col-xs-3 control-label\">{{field.label}}</label>\n" +
    "						<div class=\"col-xs-9\">\n" +
    "							<input class=\"form-control\" name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\" />\n" +
    "						</div>\n" +
    "\n" +
    "					</div>\n" +
    "\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>	\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("xc-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-list.html",
    "<div class=\"panel\">\n" +
    "\n" +
    "\n" +
    "	<div class=\"list-group\" lr-infinite-scroll=\"loadMore\">\n" +
    "\n" +
    "		<a class=\"list-group-item\" ng-repeat=\"item in items | orderBy : orderBy : orderReversed\" ng-click=\"select(item)\"\n" +
    "			ng-class=\"{'active' : selected == item}\">\n" +
    "\n" +
    "			<h4 class=\"list-group-item-heading\">{{item[summaryField]}}</h4>\n" +
    "\n" +
    "			<p class=\"list-group-item-text\">{{item[detailsField]}}</p>\n" +
    "			<!--{{$index}}-->\n" +
    "\n" +
    "		</a>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("xc-login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-login.html",
    "<div>\n" +
    "\n" +
    "	<div ng-show=\"!isSignedIn\">\n" +
    "\n" +
    "		You're not signed in yet.\n" +
    "		<a class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#loginModal\">Sign in</a>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<!--modal to sign in-->\n" +
    "	<form class=\"form-horizontal\" name=\"loginForm\" role=\"form\">\n" +
    "	<div class=\"modal fade\" id=\"loginModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"loginModal\" aria-hidden=\"true\">\n" +
    "		<div class=\"modal-dialog\">\n" +
    "			<div class=\"modal-content\">\n" +
    "			\n" +
    "				<div class=\"modal-header\">\n" +
    "\n" +
    "					<div class=\"btn-group pull-left\">\n" +
    "						<button class=\"btn btn-danger\" data-dismiss=\"modal\" type=\"button\">\n" +
    "							Cancel\n" +
    "						</button>\n" +
    "					</div>\n" +
    "				\n" +
    "					<div class=\"btn-group pull-right\">\n" +
    "						<button class=\"btn btn-success\" type=\"button\" ng-click=\"login(loginForm, '#loginModal')\">\n" +
    "							Login\n" +
    "						</button>\n" +
    "					</div>\n" +
    "					<h4 class=\"modal-title\">Sign In</h4>		\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"modal-body\">\n" +
    "\n" +
    "					<div class=\"form-group\" ng-class=\"{ 'has-error': loginForm.username.$invalid }\">\n" +
    "\n" +
    "						<label class=\"col-xs-3 control-label\">Username</label>\n" +
    "						<div class=\"col-xs-9\">\n" +
    "							<input class=\"form-control\" name=\"username\" ng-model=\"username\" ng-required=\"true\" />\n" +
    "						</div>\n" +
    "\n" +
    "					</div>\n" +
    "\n" +
    "					<div class=\"form-group\" ng-class=\"{ 'has-error': loginForm.password.$invalid }\">\n" +
    "\n" +
    "						<label class=\"col-xs-3 control-label\">Password</label>\n" +
    "						<div class=\"col-xs-9\">\n" +
    "							<input class=\"form-control\" name=\"password\" ng-model=\"password\" ng-required=\"true\" />\n" +
    "						</div>\n" +
    "\n" +
    "					</div>\n" +
    "\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>	\n" +
    "	</form>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<div ng-show=\"isSignedIn\">You're signed in and good to go!</div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("xc-summary-item.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-summary-item.html",
    "<div class=\"col-xs-6 col-sm-4\">\n" +
    "	<a class=\"bootcards-summary-item\" \n" +
    "		href=\"{{target}}\" \n" +
    "		style=\"padding-top:35px;\">\n" +
    "		<i class=\"fa fa-3x {{icon}}\"></i>\n" +
    "		<h4>\n" +
    "			{{title}}\n" +
    "			<span class=\"label label-info\">{{count}}</span>\n" +
    "		</h4>\n" +
    "	</a>\n" +
    "</div>");
}]);

angular.module("xc-summary.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-summary.html",
    "<div class=\"panel panel-default bootcards-summary\">\n" +
    "	\n" +
    "	<div class=\"panel-heading\">\n" +
    "		<h3 class=\"panel-title\">{{title}}</h3>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"panel-body\">\n" +
    "		<div class=\"row\">\n" +
    "			<ng-transclude></ng-transclude>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>");
}]);
