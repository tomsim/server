/*
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
(function() {
	'use strict';

	/**
	 * @class Search
	 * @memberOf OCA
	 *
	 * The Search class manages a search
	 *
	 * This is a simple method. Register a new search with your function as references.
	 * The events will forward the search or reset directly
	 *
	 * @param {function} searchCallback the function to run on a query search
	 * @param {function} resetCallback the function to run when the user reset the form
	 */
	var Search = function(searchCallback, resetCallback) {
		this.initialize(searchCallback, resetCallback);
	};

	/**
	 * @memberof OC
	 */
	Search.prototype = {
		/**
		 * Initialize the search box
		 *
		 * @param {function} searchCallback the function to run on a query search
		 * @param {function} resetCallback the function to run when the user reset the form
		 */
		initialize: function(searchCallback, resetCallback) {

			var self = this;

			if (typeof searchCallback !== 'function') {
				throw new Error('searchCallback must be a function');
			}
			if (typeof resetCallback !== 'function') {
				throw new Error('resetCallback must be a function');
			}
			if (!document.getElementById('searchbox')) {
				throw new Error('searchBox not available');
			}

			this.searchCallback = searchCallback;
			this.resetCallback = resetCallback;
			console.debug('New search handler registered');

			/**
			 * Search
			 */
			this.search = function(event) {
				event.preventDefault();
				var query = document.getElementById('searchbox').value;
				self.searchCallback(query);
			};

			/**
			 * Reset form
			 */
			this.reset = function(event) {
				event.preventDefault();
				document.getElementById('searchbox').value = '';
				self.resetCallback();
			};

			// Show search
			document.getElementById('searchbox').style.display = 'block';

			// Register input event
			document
				.getElementById('searchbox')
				.addEventListener('input', _.debounce(self.search, 500), true);
			document
				.querySelector('form.searchbox')
				.addEventListener('submit', function(event) {
					// Avoid form submit
					event.preventDefault();
					_.debounce(self.search, 500);
				}, true);

			// Register reset
			document
				.querySelector('form.searchbox')
				.addEventListener('reset', _.debounce(self.reset, 500), true);

			// Register esc key shortcut reset if focused
			document.addEventListener('keyup', function(event) {
				if (event.defaultPrevented) {
					return;
				}

				var key = event.key || event.keyCode;
				if (
					document.getElementById('searchbox') === document.activeElement &&
					document.getElementById('searchbox').value === ''
				) {
					if (key === 'Escape' || key === 'Esc' || key === 27) {
						_.debounce(self.reset, 500);
					}
				}
			});

			// Register ctrl+F key shortcut to focus
			document.addEventListener('keydown', function(event) {
				if (event.defaultPrevented) {
					return;
				}

				var key = event.key || event.keyCode;
				if (document.getElementById('searchbox') !== document.activeElement) {
					if (
						(event.ctrlKey || event.metaKey) && // CTRL or mac CMD
						!event.shiftKey &&					// Not SHIFT
						(key === 'f' || key === 70)			// F
					) {
						event.preventDefault();
						document.getElementById('searchbox').focus();
						document.getElementById('searchbox').select();
					}
				}
			});
		}
	};

	OCA.Search = Search;
})();
