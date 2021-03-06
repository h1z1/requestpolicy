/*
 * ***** BEGIN LICENSE BLOCK *****
 *
 * RequestPolicy - A Firefox extension for control over cross-site requests.
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

declare const RUN_ID: number;  // see bootstrap.jsm

const env = (str: TemplateStringsArray) => (
    str[0] !== "undefined" &&
    !str[0].startsWith("/* @echo ")
);

const LOG_ALL = env`/* @echo LOG_ALL */`;

export const C = {
  LOG_ALL,
  // tslint:disable:max-line-length
  LOG_BG_CONTENT_BOUNDARIES: env`/* @echo LOG_BG_CONTENT_BOUNDARIES */` || LOG_ALL,
  LOG_ENVIRONMENT: env`/* @echo LOG_ENVIRONMENT */` || LOG_ALL,
  LOG_EVENT_LISTENERS: env`/* @echo LOG_EVENT_LISTENERS */` || LOG_ALL,
  LOG_FLAG_STATE: env`/* @echo LOG_FLAG_STATE */` || LOG_ALL,
  LOG_GETTING_SAVED_REQUESTS: env`/* @echo LOG_GETTING_SAVED_REQUESTS */` || LOG_ALL,
  LOG_MESSAGE_LISTENERS: env`/* @echo LOG_MESSAGE_LISTENERS */` || LOG_ALL,
  LOG_REQUESTS: env`/* @echo LOG_REQUESTS */` || LOG_ALL,
  LOG_STORAGE_MIGRATION: env`/* @echo LOG_STORAGE_MIGRATION */` || LOG_ALL,
  // tslint:enable:max-line-length

  // tslint:disable-next-line:object-literal-sort-keys
  AMO: env`/* @echo AMO */`,
  BUILD_ALIAS: `/* @echo BUILD_ALIAS */`,
  EXTENSION_TYPE: `/* @echo EXTENSION_TYPE */`,

  get UI_TESTING() {
    return this.BUILD_ALIAS === "ui-testing";
  },

  LOG_PREFIX: "[RequestPolicy] ",

  EWE_CONNECTION_EWE_ID: "ewe.legacyConnection",
  EWE_CONNECTION_LEGACY_ID: "app.legacy.eweConnection",
  EXTENSION_ID: "/* @echo EXTENSION_ID */",

  // NOTE: do not generate the run ID here,
  //   because "constants.js" gets loaded multiple times, i.e.,
  //   in multiple environments.
  CONTEXT_ID: Math.random(),
  get RUN_ID() {
    return RUN_ID;
  },

  FIREFOX_ID: "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}",
  SEAMONKEY_ID: "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}",
  // We need a random RUN_ID because of
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1202125
  get MMID() { // message manager ID
    return `${this.EXTENSION_ID}_${this.RUN_ID}`;
  },
  get MM_PREFIX() {
    return `${this.MMID}:`;
  },

  RULE_ACTION_ALLOW: 1,
  RULE_ACTION_DENY: 2,

  UNDEFINED: Symbol("UNDEFINED"),
};
