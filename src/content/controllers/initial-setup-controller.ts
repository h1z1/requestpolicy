/*
 * ***** BEGIN LICENSE BLOCK *****
 *
 * RequestPolicy - A Firefox extension for control over cross-site requests.
 * Copyright (c) 2008-2009 Justin Samuel
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

declare const LegacyApi: any;

import {IController} from "lib/classes/controllers";
import {NotificationID, Notifications} from "models/notifications";
import {Storage} from "models/storage";
import {VersionInfos} from "models/version-infos";

function onNotificationsTabOpened(aId: NotificationID) {
  if (aId !== NotificationID.InitialSetup) return;
  Notifications.onTabOpened.removeListener(onNotificationsTabOpened);
  Storage.set({welcomeWindowShown: true});
}

function maybeShowSetupTab() {
  if (Storage.get("welcomeWindowShown")) return;

  if (VersionInfos.isRPUpgrade) {
    // If the use has just upgraded from an 0.x version, set the
    // default-policy preferences based on the old preferences.
    Storage.set({"defaultPolicy.allow": false});
    if (LegacyApi.prefs.isSet("uriIdentificationLevel")) {
      const identLevel = Storage.get("uriIdentificationLevel");
      Storage.set({
        "defaultPolicy.allowSameDomain": identLevel === 1,
      });
    }
  }

  Notifications.onTabOpened.addListener(onNotificationsTabOpened);
  Notifications.add(NotificationID.InitialSetup);
}

export const InitialSetupController: IController = {
  startupPreconditions: [
    Storage.pReady,
    VersionInfos.pReady,
  ],
  startup() {
    maybeShowSetupTab();
  },
};