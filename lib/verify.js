// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const defaults = require("./defaults");
function getVerifyCommand() {
    switch (process.platform) {
        case "win32":
            return `powershell -ExecutionPolicy Bypass scripts\\verify.ps1 '${defaults.certificateName}'`;
        case "darwin": // macOS
            return `security find-certificate -c '${defaults.certificateName}' -p | openssl x509 -checkend 86400 -noout`;
        case "linux":
            return `[ -f /usr/local/share/ca-certificates/${defaults.caCertificateFileName} ] && openssl x509 -in /usr/local/share/ca-certificates/${defaults.caCertificateFileName} -checkend 86400 -noout`;
        default:
            throw new Error(`Platform not supported: ${process.platform}`);
    }
}
function isCaCertificateInstalled() {
    const command = getVerifyCommand();
    try {
        const output = child_process_1.execSync(command, { stdio: "pipe" }).toString();
        if (process.platform === "darwin") {
            return true;
        }
        else if (output.length !== 0) {
            return true; // powershell command return empty string if the certificate not-found/expired
        }
    }
    catch (error) {
        // Mac security command throws error if the certifcate is not-found/expired
    }
    return false;
}
exports.isCaCertificateInstalled = isCaCertificateInstalled;
function validateCertificateAndKey(certificatePath, keyPath) {
    let certificate = "";
    let key = "";
    try {
        certificate = fs.readFileSync(certificatePath).toString();
    }
    catch (err) {
        throw new Error(`Unable to read the certificate.\n${err}`);
    }
    try {
        key = fs.readFileSync(keyPath).toString();
    }
    catch (err) {
        throw new Error(`Unable to read the certificate key.\n${err}`);
    }
    let encrypted;
    try {
        encrypted = crypto.publicEncrypt(certificate, Buffer.from("test"));
    }
    catch (err) {
        throw new Error(`The certificate is not valid.\n${err}`);
    }
    try {
        crypto.privateDecrypt(key, encrypted);
    }
    catch (err) {
        throw new Error(`The certificate key is not valid.\n${err}`);
    }
}
function verifyCertificates(certificatePath = defaults.localhostCertificatePath, keyPath = defaults.localhostKeyPath) {
    let isCertificateValid = true;
    try {
        validateCertificateAndKey(certificatePath, keyPath);
    }
    catch (err) {
        isCertificateValid = false;
    }
    return isCertificateValid && isCaCertificateInstalled();
}
exports.verifyCertificates = verifyCertificates;
//# sourceMappingURL=verify.js.map