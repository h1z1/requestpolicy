/*
 * ***** BEGIN LICENSE BLOCK *****
 *
 * RequestPolicy - A Firefox extension for control over cross-site requests.
 * Copyright (c) 2008 Justin Samuel
 * Copyright (c) 2014 Martin Kimmerle
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * ***** END LICENSE BLOCK *****
 */

/// <reference path="../../conditional/legacy/content/bootstrap/api/services/xul-service.d.ts" />

import { App } from "app/interfaces";
import { JSMs } from "bootstrap/api/interfaces";
import { C } from "data/constants";

declare const Services: JSMs.Services;
const appID = Services.appinfo.ID;

// tslint:disable:object-literal-sort-keys
// tslint:disable:max-line-length

// differences in seamonkey:
// https://developer.mozilla.org/en-US/Add-ons/SeaMonkey_2
const isSeamonkey = appID === C.SEAMONKEY_ID;

export const TOOLBARBUTTON_ATTRIBUTES = {
  id: "/* @echo ALPHABETICAL_ID */ToolbarButton",
  label: "RequestPolicy",
  tooltiptext: "RequestPolicy Continued",
  popup: "rpc-popup",
};

export const getMaybeIncompleteXulTreeLists = (
    overlay: App.windows.window.IOverlay,
): IMaybeIncompleteXulTreeLists => ({
  toolbarbutton: [
    {
      parent: {
        // $("#navigator-toolbox").palette
        special: {
          type: "subobject",
          id: "navigator-toolbox",
          tree: ["palette"],
        },
      },

      tag: "toolbarbutton",
      attributes: TOOLBARBUTTON_ATTRIBUTES,
    },
  ],

  mainTree: [
    {
      parent: {id: isSeamonkey ? "taskPopup" : "menu_ToolsPopup"},

      tag: "menu",
      attributes: {label: "RequestPolicy Continued",
                  accesskey: "r"},
      children: [
        {
          tag: "menupopup",
          children: [
            {
              tag: "menuitem",
              attributes: {label: "__MSG_managePolicies@menu__",
                          accesskey: "m"},
              events: {command: overlay.boundMethods.get(overlay.openPolicyManager) as () => void},
            },
            {
              tag: "menuitem",
              attributes: {label: "__MSG_rp_requestLog_title__",
                          accesskey: "l"},
              events: {command: overlay.boundMethods.get(overlay.toggleRequestLog) as () => void},
            },
            {
              tag: "menuitem",
              attributes: {label: "__MSG_rp_menu_preferences__",
                          accesskey: "p"},
              events: {command: overlay.boundMethods.get(overlay.openPrefs) as () => void},
            },
          ],
        },
      ],
    },

    {
      parent: {id: "contentAreaContextMenu"},

      tag: "menuitem",
      attributes: {id: "rpcontinuedContextMenuEntry",
                  label: "RequestPolicy Continued"},
      events: {command: overlay.boundMethods.get(overlay.toggleMenu) as () => void},
    },

    {
      parent: {special: {type: "__window__"}},

      tag: "keyset",
      attributes: {id: "rpcontinuedKeyset"},
    },

    {
      parent: {special: {type: "__window__"}},

      tag: "popupset",
      attributes: {id: "rpcontinuedPopupset"},
      children: [
        {
          tag: "menupopup",
          attributes: {id: "rpcontinuedRedirectAddRuleMenu"},
        }, {
          tag: "menupopup",
          attributes: {id: "rpc-popup",
                      noautohide: "true",
                      position: "after_start"},
          events: {popupshowing: overlay.boundMethods.get(overlay.onPopupShowing) as () => void,
                   popuphidden: overlay.boundMethods.get(overlay.onPopupHidden) as () => void},
          children: [
            {
              tag: "iframe",
              attributes: {id: "rpc-popup-frame",
                          type: "chrome",
                          src: "chrome://rpcontinued/content/ui/popup/popup.html"},
            },
          ],
        },
      ],
    },

    {
      parent: {id: "appcontent"},
      tag: "splitter",
      attributes: {id: "rpcontinued-requestLog-splitter",
                  hidden: "true"},
    },
    {
      parent: {id: "appcontent"},
      tag: "vbox",
      attributes: {id: "rpcontinued-requestLog",
                  height: "300",
                  hidden: "true",
                  persist: "height"},
      children: [
        {
          tag: "toolbox",
          attributes: {id: "rpcontinued-requestLog-header"},
          children: [
            {
              tag: "toolbar",
              attributes: {id: "rpcontinued-requestLog-toolbar",
                          align: "center"},
              children: [
                {
                  tag: "label",
                  attributes: {id: "rpcontinued-requestLog-title",
                              control: "rpcontinued-requestLog-frame",
                              value: "__MSG_rp_requestLog_title__",
                              crop: "end"},
                }, {
                  tag: "button",
                  attributes: {id: "rpcontinued-requestLog-clear",
                              label: "__MSG_rp_requestLog_clear__"},
                  events: {command: overlay.boundMethods.get(overlay.clearRequestLog) as () => void},
                }, {
                  tag: "vbox",
                  attributes: {flex: "1"},
                }, {
                  tag: "toolbarbutton",
                  attributes: {id: "rpcontinued-requestLog-close",
                              align: "right"},
                  events: {command: overlay.boundMethods.get(overlay.toggleRequestLog) as () => void},
                },
              ],
            },
          ],
        },
        // The src of this iframe is set to
        // chrome://rpcontinued/content/ui/request-log/request-log.xul in overlay.js
        {
          tag: "iframe",
          attributes: {id: "rpcontinued-requestLog-frame",
                      type: "chrome",
                      flex: "1"},
        },
      ],
    },
  ],
});
