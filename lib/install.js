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
const defaults = require("./defaults");
const generate_1 = require("./generate");
const uninstall_1 = require("./uninstall");
const verify_1 = require("./verify");
function getInstallCommand(caCertificatePath, machine = false) {
    switch (process.platform) {
        case "win32":
            return `powershell -ExecutionPolicy Bypass scripts\\install.ps1 ${machine ? "LocalMachine" : "CurrentUser"} '${caCertificatePath}'`;
        case "darwin": // macOS
            return `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain '${caCertificatePath}'`;
        case "linux":
            return `sudo mv ${caCertificatePath} /usr/local/share/ca-certificates && sudo /usr/sbin/update-ca-certificates`;
        default:
            throw new Error(`Platform not supported: ${process.platform}`);
    }
}
function ensureCertificatesAreInstalled(daysUntilCertificateExpires = defaults.daysUntilCertificateExpires, machine = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const areCertificatesValid = verify_1.verifyCertificates();
        if (areCertificatesValid) {
            console.log(`You already have trusted access to https://localhost.\nCertificate: ${defaults.localhostCertificatePath}\nKey: ${defaults.localhostKeyPath}`);
        }
        else {
            yield uninstall_1.uninstallCaCertificate(false, false);
            yield uninstall_1.deleteCertificateFiles(defaults.certificateDirectory);
            yield generate_1.generateCertificates(defaults.caCertificatePath, defaults.localhostCertificatePath, defaults.localhostKeyPath, daysUntilCertificateExpires);
            yield installCaCertificate(defaults.caCertificatePath, machine);
        }
    });
}
exports.ensureCertificatesAreInstalled = ensureCertificatesAreInstalled;
function installCaCertificate(caCertificatePath = defaults.caCertificatePath, machine = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = getInstallCommand(caCertificatePath, machine);
        try {
            console.log(`Installing CA certificate "Developer CA for Microsoft Office Add-ins"...`);
            // If the certificate is already installed by another instance skip it.
            if (!verify_1.isCaCertificateInstalled()) {
                child_process_1.execSync(command, { stdio: "pipe" });
            }
            console.log(`You now have trusted access to https://localhost.\nCertificate: ${defaults.localhostCertificatePath}\nKey: ${defaults.localhostKeyPath}`);
        }
        catch (error) {
            throw new Error(`Unable to install the CA certificate. ${error.stderr.toString()}`);
        }
    });
}
exports.installCaCertificate = installCaCertificate;
//# sourceMappingURL=install.js.map