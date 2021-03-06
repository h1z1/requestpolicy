/*
 * ***** BEGIN LICENSE BLOCK *****
 *
 * RequestPolicy - A Firefox extension for control over cross-site requests.
 * Copyright (c) 2017 Martin Kimmerle
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

// @if BUILD_ALIAS='ui-testing'
import "ui-testing/services";
// @endif

import { JSMs, XPCOM } from "bootstrap/api/interfaces";
import { contentWindowHasAssociatedTab } from "lib/utils/window-utils";

declare const cfmm: XPCOM.ContentFrameMessageManager;
declare const Services: JSMs.Services;

function logSevereError(aMessage: string, aError: any) {
  console.error("[SEVERE] " + aMessage + " - Details:");
  console.dir(aError);
}

// FIXME: wait until 'tab.linkedBrowser' is available
Promise.resolve().then(() => {
  if (!contentWindowHasAssociatedTab(cfmm.content)) {
    // tslint:disable-next-line:no-string-throw
    throw "content window has no associated tab";
  }
  return Promise.all([
    import("legacy/lib/commonjs-unload-subject"),
    import("app/app.content"),
    import("app/log"),
  ]);
}).then(([
  { COMMONJS_UNLOAD_SUBJECT },
  { rp },
  { log },
]) => {
  // =========================================================================
  // shutdown
  // =========================================================================

  // shut down the framescript on the message manager"s
  // `unload`. That event will occur when the browsing context
  // (e.g. the tab) has been closed.

  const observer = {
    observe(subject: any, topic: any, reason: any) {
      if (subject.wrappedJSObject === COMMONJS_UNLOAD_SUBJECT) {
        try {
          rp.shutdown();
        } catch (e) {
          logSevereError("framescript shutdown() failed!", e);
        }
      }
    },
  };

  Services.obs.addObserver(observer, "sdk:loader:destroy", false);

  // =========================================================================
  // start up
  // =========================================================================

  rp.startup().catch(log.onError("framescript startup failed"));
}).catch((e) => {
  if (e === "content window has no associated tab") return;
  console.error("framescript startup failed");
  console.dir(e);
});
