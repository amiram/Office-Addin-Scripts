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
const child_process_1 = require("child_process");
const fsExtra = require("fs-extra");
const path = require("path");
const defaults = require("./defaults");
const verify_1 = require("./verify");
function getUninstallCommand(machine = false) {
    switch (process.platform) {
        case "win32":
            return `powershell -ExecutionPolicy Bypass scripts\\uninstall.ps1 ${machine ? "LocalMachine" : "CurrentUser"} '${defaults.certificateName}'`;
        case "darwin": // macOS
            return `sudo security delete-certificate -c '${defaults.certificateName}'`;
        case "linux":
            return `sudo rm /usr/local/share/ca-certificates/${defaults.caCertificateFileName} && sudo /usr/sbin/update-ca-certificates --fresh`;
        default:
            throw new Error(`Platform not supported: ${process.platform}`);
    }
}
// Deletes the generated certificate files and delete the certificate directory if its empty
function deleteCertificateFiles(certificateDirectory = defaults.certificateDirectory) {
    if (fsExtra.existsSync(certificateDirectory)) {
        fsExtra.removeSync(path.join(certificateDirectory, defaults.localhostCertificateFileName));
        fsExtra.removeSync(path.join(certificateDirectory, defaults.localhostKeyFileName));
        fsExtra.removeSync(path.join(certificateDirectory, defaults.caCertificateFileName));
        if (fsExtra.readdirSync(certificateDirectory).length === 0) {
            fsExtra.removeSync(certificateDirectory);
        }
    }
}
exports.deleteCertificateFiles = deleteCertificateFiles;
function uninstallCaCertificate(machine = false, verbose = true) {
    return __awaiter(this, void 0, void 0, function* () {
        if (verify_1.isCaCertificateInstalled()) {
            const command = getUninstallCommand(machine);
            try {
                console.log(`Uninstalling CA certificate "Developer CA for Microsoft Office Add-ins"...`);
                child_process_1.execSync(command, { stdio: "pipe" });
                console.log(`You no longer have trusted access to https://localhost.`);
            }
            catch (error) {
                throw new Error(`Unable to uninstall the CA certificate.\n${error.stderr.toString()}`);
            }
        }
        else {
            if (verbose) {
                console.log(`The CA certificate is not installed.`);
            }
        }
    });
}
exports.uninstallCaCertificate = uninstallCaCertificate;
//# sourceMappingURL=uninstall.js.map