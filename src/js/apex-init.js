/**
 * Ignores a selector of objects from the given jQuery selector
 * @param {string} selector - jQuery selector to be ignored.
 * @returns {object} currated jQuery selector
 */
$.fn.ignore = function (selector) {
	return this.clone().find(selector || ">*").remove().end();
};

/**
 * Removes empty objects from the DOM based on the given selector
 * @returns {object}
 */
$.fn.removeEmpty = function () {
	return this.filter(function () {
		return $.trim($(this).text()) === "" && $(this).children().length === 0;
	}).remove();
};

/**
 * Removes empty objects from the DOM based on the given selector
 * @returns {object}
 */
$.fn.removeEmptySpaces = function () {
	return this.filter(function () {
		return $.trim($(this).text()) === "";
	}).remove();
};

/**
 * Verifies if the given class exists on the DOM
 * This is performed in vanilla JS instead of jQuery to increase performance
 * @returns {boolean} true if the class exists, false if it doesn't
 */
var classExists = function (className) {
	return document.getElementsByClassName(className).length > 0;
};

/**
 * @namespace materialAPEX
 **/
var materialAPEX = materialAPEX || {};

/**
 * @module debug
 **/
materialAPEX.debug = {
	time: function (name) {
		if (apex.debug.getLevel() > apex.debug.LOG_LEVEL.OFF) {
			console.time(name);
		}
	},

	timeEnd: function (name) {
		if (apex.debug.getLevel() > apex.debug.LOG_LEVEL.OFF) {
			console.timeEnd(name);
		}
	}
};

/**
 * @module sideNav
 **/
materialAPEX.sideNav = {
	init: function () {
		if (!classExists("sidenav")) return;
		materialAPEX.debug.time("materialAPEX.sideNav.init");

		$("#app-sidenav li.active")
			.parents(".collapsible-body").css("display", "block")
			.siblings(".collapsible-header")
			.addClass("active")
			.parents("li")
			.addClass("active");

		$(".sidenav").prepend(function () {
			return $(".user-view");
		});

		$(".user-view").wrap("<li></li>");
		materialAPEX.debug.timeEnd("materialAPEX.sideNav.init");
	}
};

/**
 * @module wizard
 **/
materialAPEX.wizard = {
	init: function () {
		if (!classExists("ma-wizard")) return;
		materialAPEX.debug.time("materialAPEX.wizard.init");

		// finds the current step and flags all previous ones to complete
		$(".ma-wizard")
			.find(".ma-wizard-step.is-active")
			.prevAll(".ma-wizard-step")
			.addClass("is-complete");

		materialAPEX.debug.timeEnd("materialAPEX.wizard.init");
	}
};

/**
 * @module messages
 **/
materialAPEX.messages = {
	init: function () {
		// message is missing for theme roller
		apex.lang.addMessages({
			"PE.SELECT": "- Select -"
		});
	}
};

/**
 * @module items
 **/
materialAPEX.items = {
	init: function (selectorPrefix) {
		materialAPEX.debug.time("materialAPEX.items.init");

		var prefix = selectorPrefix || "";
		// fix for empty checkbox and radio labels
		$(".a-GV " + prefix + " input[type='checkbox'], .a-GV " + prefix + " input[type='radio']").addClass("filled-in");

		// fix for empty checkbox and radio labels
		$(prefix + " [type='checkbox'], " + prefix + " [type='radio']").each(function () {
			// add an ID to the checkbox or radio if it doesn't exist
			if (!this.id) {
				this.id = M.guid();
			}

			// add a label next to the checkbox or radio if it doesn't exist
			// UNLESS IT'S IN A SWITCH COMPONENT
			if (!$(this).next().is("label") && !$(this).next().is("span.lever")) {
				$(this).after("<label for='" + this.id + "'></label>");
			}
		});

		// Fix for label issue with many components. Need to have label after component.
		$(".input-field > label").each(function () {
			$(this).appendTo($(this).parent());
		});

		materialAPEX.debug.timeEnd("materialAPEX.items.init");
	},

	utr: function () {
		if (!classExists("a-LiveTemplateOptions")) return;
		$(".a-Property-checkbox-input").addClass("filled-in");
	}
};

/**
 * @module ir
 **/
materialAPEX.ir = {
	init: function () {
		if (!classExists("a-IRR")) return;
		materialAPEX.debug.time("materialAPEX.ir.init");

		$(".a-IRR-search-field")
			.attr("placeholder", apex.lang.getMessage("APEX.IG.SEARCH"))
			.parent().addClass("input-field");

		$(".a-IRR-button--actions").html('TODO');
		$(".a-IRR-button--colSearch").html('TODO');

		$(".a-IRR-controlsCheckbox").addClass("filled-in");

		materialAPEX.debug.timeEnd("materialAPEX.ir.init");
	}
};

/**
 * @module textarea
 **/
materialAPEX.textarea = {
	init: function () {
		$("[id*='_CHAR_COUNTER']").parent().addClass("character-counter");

		$(".textarea").prepend(function () {
			return $(this).siblings();
		});

		$('textarea').addClass('materialize-textarea');
	}
};

/**
 * @module initial
 **/
materialAPEX.initial = {
	init: function () {
		materialAPEX.debug.time("materialAPEX.initial.init");

		$.datepicker.setDefaults({
			beforeShow: function (input, inst) {
				materialAPEX.datepicker.materialDatePicker();
			},
			onSelect: function (input, inst) {
				$(".ui-datepicker a").removeAttr("href");
				materialAPEX.datepicker.materialDatePicker();
			},
			onChangeMonthYear: function (year, month) {
				materialAPEX.datepicker.materialDatePicker();
			},
			onClose: function (dateText, inst) {
				// ensures the label is on top of the datepicker when user picks a value
				if (dateText !== "") {
					$(inst.input[0]).siblings("label").addClass("active");
				}
			}
		});

		// Show the hamburger menu only if there is any sidebar menu entry
		if ($(".sidenav .sidenav-entry").length > 0) {
			$("#app-sidenav-trigger").removeClass("hide");
		}

		// Grid - Handling s12 default override
		$(".s1,.s2,.s3,.s4,.s5,.s6,.s7,.s8,.s9,.s10,.s11").removeClass("s12");

		// Deletes empty html tags
		$('.card-content, .card-action, span.badge, .ma-button-label').removeEmpty();
		$('.ma-region-buttons, .ma-region-header').removeEmptySpaces();

		// Fixed Action Button
		$(".fixed-action-btn").each(function () {
			var fab = $(this);

			var fabPosition = " fab-position-right ";
			if (fab.hasClass("fab-position-right")) fabPosition = " fab-position-right ";
			if (fab.hasClass("fab-position-left")) fabPosition = " fab-position-left ";
			if (fab.hasClass("fab-position-absolute")) fabPosition = " fab-position-absolute ";

			var fabDirection = "top";
			if (fab.hasClass("fab-direction-top")) fabDirection = "top";
			if (fab.hasClass("fab-direction-right")) fabDirection = "right";
			if (fab.hasClass("fab-direction-bottom")) fabDirection = "bottom";
			if (fab.hasClass("fab-direction-left")) fabDirection = "left";

			var fabHoverEnabled = true;
			if (fab.hasClass("fab-open-behavior-hover")) fabHoverEnabled = true;
			if (fab.hasClass("fab-open-behavior-click")) fabHoverEnabled = false;

			var fabToolbarEnabled = false;
			if (fab.hasClass("fab-toolbar")) fabToolbarEnabled = true;
			if (fab.hasClass("fab-toolbar")) fabPosition += " toolbar ";

			fab.siblings(".btn, .btn-flat").addClass("btn-floating").removeClass("btn btn-flat");
			fab.siblings(".btn-floating").addBack().wrapAll("<div class='fixed-action-btn " + fabPosition + "'>");
			fab.siblings(".btn-floating").wrapAll("<ul>").wrap("<li>");
			fab.removeClass("fixed-action-btn fab-position-right fab-position-left fab-position-absolute");

			fab.parent().floatingActionButton({
				direction: fabDirection,
				hoverEnabled: fabHoverEnabled,
				toolbarEnabled: fabToolbarEnabled
			});
		});

		$(".fixed-action-btn ul li .btn-floating").each(function () {
			var buttonText = ($(this).find(".ma-button-label").text() || $(this).attr("title")).trim();
			if (buttonText !== '') {
				$(this)
					.attr("data-tooltip", buttonText)
					.attr("data-position", "left");
			}
		});

		$("div.fab-position-absolute").parent().addClass("fab-relative");

		// Switches
		$(".switch").closest('.input-field').addClass('ma-switch-container');

		// Some components need to have the class input-field removed
		$("select, .switch").closest('.input-field').removeClass('input-field');

		// Parallax
		$(".parallax-container")
			.closest(".col").removeClass()
			.closest(".row").removeClass();

		// Display only & read only
		$(".display_only")
			.siblings("label")
			.addClass("active");

		// Checkbox and radio
		$(".checkbox_group, .radio_group")
			.siblings("label")
			.addClass("active label-block")
			.closest('.input-field')
			.removeClass('input-field');

		// Textarea
		materialAPEX.textarea.init();

		// Popup LOV
		$(".lov").parent().addClass("ma-popuplov");

		// Media
		$(".apex-materialbox img").addClass("materialboxed responsive-img").each(function () {
			$(this).attr("data-caption", $(this).parent().attr("data-caption"));
			$(this).parent().removeAttr("data-caption");
		});

		// Tooltips
		$("[data-tooltip][data-tooltip!='']").each(function () {
			$(this).siblings("i, span").attr("data-tooltip", $(this).attr("data-tooltip"));
		});

		// Icons
		$("i[class='']").remove();

		// Search Bar
		$(".top-nav li a i:contains('search')").parent().click(function () {
			$(".main-nav-wrapper").toggleClass("hide");
			$(".search-nav-wrapper").toggleClass("hide");
			$("#P0_SEARCH").focus();
		});

		$("#P0_SEARCH")
			.attr("type", "search")
			.blur(function () {
				$(".main-nav-wrapper").toggleClass("hide");
				$(".search-nav-wrapper").toggleClass("hide");
			});

		// Closes a toast
		$(document).on("click", ".ma-toast-close", function () {
			$(this).closest(".toast").remove();
		});

		// Closes a panel
		$(document).on("click", ".panel-close", function () {
			$(this).closest(".card-panel").remove();
		});

		// Checkboxes and radio alternate look
		$(".ma-alternate-look input[type='checkbox']").addClass("filled-in");
		$(".ma-alternate-look input[type='radio']").addClass("with-gap");

		// this is for displaying a success message when a modal page closes
		$("body").on("apexafterclosedialog", function (e, data) {
			if (data.successMessage.text) {
				apex.message.showPageSuccess(data.successMessage.text);
			}
		});

		// overwrites apex.theme.defaultStickyTop to help with the region display selector
		apex.theme.defaultStickyTop = function () {
			return $("header .top-nav").height();
		};

		// showSpinner
		if (typeof apex.util.showSpinner === "function") {
			var showSpinnerOld = apex.util.showSpinner;
			apex.util.showSpinner = function (container, options) {
				var opt = options || {};
				var newSpinner = showSpinnerOld(container, options);

				var spinnerLayer = function (layerColor) {
					return '<div class="spinner-layer spinner-' + layerColor + '"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div>';
				};

				var layers = (opt.color ?
					spinnerLayer(opt.color + "-only") :
					spinnerLayer("blue") +
					spinnerLayer("red") +
					spinnerLayer("yellow") +
					spinnerLayer("green")
				);

				if ($(".u-Processing[data-container='" + String(container) + "']").length === 0) {
					$(newSpinner)
						.attr('data-container', String(container))
						.append('<div class="preloader-wrapper ' + opt.size + ' active">' + layers + '</div>');
				}

				return newSpinner;
			};
		}

		materialAPEX.debug.timeEnd("materialAPEX.initial.init");
	}
};

$(function () {
	materialAPEX.initial.init();
	materialAPEX.messages.init();
	materialAPEX.items.init();
});
