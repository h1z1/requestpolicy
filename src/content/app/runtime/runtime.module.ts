/*
 * ***** BEGIN LICENSE BLOCK *****
 *
 * RequestPolicy - A Firefox extension for control over cross-site requests.
 * Copyright (c) 2018 Martin Kimmerle
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

import { App } from "app/interfaces";
import { Common } from "common/interfaces";
import { Connection } from "lib/classes/connection";
import { IModule, Module } from "lib/classes/module";

export class Runtime extends Module {
  // protected get debugEnabled() { return true; }

  protected get startupPreconditions() {
    return [
      this.pGotEWEConnection,
    ] as Array<Promise<any>>;
  }

  private eweConnection: Connection<any, any> | null;
  private pGotEWEConnection: Promise<void>;
  private gotEWEConnection = false;

  constructor(
      log: Common.ILog,
      pEWEConnection: Promise<Connection<any, any> | null>,
      private readonly aboutUri: App.runtime.IAboutUri,
  ) {
    super("app.runtime", log);
    this.pGotEWEConnection = pEWEConnection.then((m) => {
      this.eweConnection = m;
      this.gotEWEConnection = true;
    });
    this.pGotEWEConnection.catch(this.log.onError("pGotEWEConnection"));
  }

  protected get subModules() {
    const rv: {[k: string]: IModule} = {
      aboutUri: this.aboutUri,
    };
    if (!this.gotEWEConnection) {
      throw new Error(`startup preconditions not finished yet!`);
    }
    if (this.eweConnection) { rv.eweConnection = this.eweConnection; }
    return rv;
  }
}
