/*
 * Copyright (c) 2019 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Broadcom, Inc. - initial API and implementation
 */

import { URL } from "url";
import * as vscode from "vscode";
import * as nls from "vscode-nls";
const localize = nls.config({ messageFormat: nls.MessageFormat.file })();

export async function createNewConnection() {
    let url: URL;
    let profileName: string;
    let userName: string;
    let zosmfURL: string;
    let rejectUnauthorize: string = "false";
    let options: vscode.InputBoxOptions;

    const validateUrl = (newUrl: string) => {
        try {
            url = new URL(newUrl);
        } catch (error) {
            return false;
        }
        return url.port ? true : false;
    };

    zosmfURL = await vscode.window.showInputBox({
        ignoreFocusOut: true,
        placeHolder: "URL",
        prompt: localize("createNewConnection.option.prompt.url",
        "Enter a z/OSMF URL in the format 'http(s)://url:port'."),
        validateInput: (text: string) => (validateUrl(text) ? "" : "Please enter a valid URL."),
        value: zosmfURL
    });

    if (!zosmfURL) {
        vscode.window.showInformationMessage(localize("createNewConnection.enterzosmfURL",
                "No valid value for z/OSMF URL. Operation Cancelled"));
        return;
    }

    options = {
        prompt: localize("createNewConnection.option.prompt.profileName", "Enter a Profile Name"),
        value: profileName
    };
    profileName = await vscode.window.showInputBox(options);
    if (!profileName) {
        vscode.window.showInformationMessage(localize("createNewConnection.enterprofileName",
                "Operation Cancelled"));
        return;
    }

    options = {
        prompt: localize("createNewConnection.option.prompt.userName", "Enter a valid username"),
        value: userName
    };
    userName = await vscode.window.showInputBox(options);
    if (!userName) {
        vscode.window.showInformationMessage(localize("createNewConnection.enteruserName",
                "Operation Cancelled"));
        return;
    } else if (userName.length > 0) {
        const regexUsername = new RegExp("^([@#$a-zA-Z0-9]{1,7})$");

        if (!regexUsername.test(userName)) {
            vscode.window.showInformationMessage(localize("createNewConnection.enteruserName.validateUserName",
                "Please enter a valid User Name")); // fix this!
        }
    }

    options = {
        prompt: localize("createNewConnection.option.prompt.rejectUnauthorize", "Set to \"true\" to enable reject unauthorize"),
        value: rejectUnauthorize
    };
    rejectUnauthorize = await vscode.window.showInputBox(options);
    if (!rejectUnauthorize) {
        vscode.window.showInformationMessage(localize("createNewConnection.rejectUnauthorize",
                "Operation Cancelled"));
        return;
    }
}
