// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const office_addin_cli_1 = require("office-addin-cli");
const defaults = require("./defaults");
const install_1 = require("./install");
const uninstall_1 = require("./uninstall");
const verify_1 = require("./verify");
function parseDays(optionValue) {
    const days = office_addin_cli_1.parseNumber(optionValue, "--days should specify a number.");
    if (days !== undefined) {
        if (!Number.isInteger(days)) {
            throw new Error("--days should be integer.");
        }
        if (days <= 0) {
            throw new Error("--days should be greater than zero.");
        }
    }
    return days;
}
function install(command) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const days = parseDays(command.days);
            yield install_1.ensureCertificatesAreInstalled(days, command.machine);
        }
        catch (err) {
            office_addin_cli_1.logErrorMessage(err);
        }
    });
}
exports.install = install;
function verify(command) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (yield verify_1.verifyCertificates()) {
                console.log(`You have trusted access to https://localhost.\nCertificate: ${defaults.localhostCertificatePath}\nKey: ${defaults.localhostKeyPath}`);
            }
            else {
                console.log(`You need to install certificates for trusted access to https://localhost.`);
            }
        }
        catch (err) {
            office_addin_cli_1.logErrorMessage(err);
        }
    });
}
exports.verify = verify;
function uninstall(command) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield uninstall_1.uninstallCaCertificate(command.machine);
            yield uninstall_1.deleteCertificateFiles(defaults.certificateDirectory);
        }
        catch (err) {
            office_addin_cli_1.logErrorMessage(err);
        }
    });
}
exports.uninstall = uninstall;
//# sourceMappingURL=commands.js.map