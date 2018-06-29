/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
/*
This is a simple adaptive 2-columns grid. The first and every 4th item have
width:100%, and the rest of the items have width equals to the column width
(`columnWidth` in px). The grid will reflow to single column when 2 columns
(plus a defined gutter margin) no longer fit on screen.

    <two-columns-grid column-width="320" gutter="16">
      <div class="card"></div>
      <div class="card"></div>
      <div class="card"></div>
      <div class="card"></div>
      <div class="card"></div>
    </two-columns-grid>

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import {Polymer} from '@polymer/polymer/lib/legacy/polymer-fn.js';

import {html} from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style>

      :host {
        @apply --layout-horizontal;
        @apply --layout-wrap;
        max-width: calc(2 * var(--grid-column-width) + 4 * var(--grid-gutter));
        margin: var(--grid-gutter) auto;
        /* item has width/height ratio 4:3 */
        --grid-item-height: calc(3 * var(--grid-column-width) / 4);
      }

      :host > ::slotted(*) {
        @apply --layout-flex-none;
        width: var(--grid-column-width);
        height: var(--grid-item-height);
        margin: var(--grid-gutter);
        box-sizing: border-box;
      }

      /* https://github.com/webcomponents/shadycss/issues/15 */
      :host > ::slotted(*:nth-of-type(3n-2)) {
        width: calc(100% - 2 * var(--grid-gutter));
        /* large item has widht/height ratio 2:1 */
        height: calc(var(--grid-column-width)  + 2 * var(--grid-gutter));
      }

      :host([narrow-layout]) {
        max-width: none;
        margin: 0 var(--grid-gutter);
      }

      :host([narrow-layout]) > ::slotted(*) {
        width: 100% !important;
        height: var(--grid-item-height) !important;
        margin: var(--grid-gutter) 0;
      }

      iron-media-query {
        display: none;
      }

    </style>

    <slot></slot>

    <iron-media-query query="[[query]]" query-matches="{{narrowLayout}}"></iron-media-query>
`,

  is: 'two-columns-grid',

  properties: {

    /**
     * The width of the column in px.
     */
    columnWidth: {type: Number, value: 300},

    /**
     * The gutter width in px.
     */
    gutter: {type: Number, value: 8},

    /**
     * Indicates it is in narrow layout which means the grid is displayed as
     * single column.
     */
    narrowLayout: {type: Boolean, notify: true, reflectToAttribute: true}

  },

  observers: ['_updateLayout(columnWidth, gutter)'],

  attached: function() {
    // observers may run before attached, and updateStyles() will skip if it is
    // not attached. So we need to make sure updateStyles() is called after it's
    // attached.
    this._updateCustomStyles();
  },

  _updateLayout: function(columnWidth, gutter) {
    this.query = '(max-width:' + (2 * columnWidth + 4 * gutter) + 'px)';
    this._updateCustomStyles();
  },

  _updateCustomStyles: function() {
    this.updateStyles({
      '--grid-column-width': this.columnWidth + 'px',
      '--grid-gutter': this.gutter + 'px'
    });
  }
});
