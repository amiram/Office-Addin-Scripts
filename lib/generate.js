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
const fs = require("fs");
const fsExtra = require("fs-extra");
const mkcert = require("mkcert");
const path = require("path");
const defaults = require("./defaults");
/* Generate operation will check if there is already valid certificate installed.
   if yes, then this operation will be no op.
   else, new certificates are generated and installed if --install was provided.
*/
function generateCertificates(caCertificatePath = defaults.caCertificatePath, localhostCertificatePath = defaults.localhostCertificatePath, localhostKeyPath = defaults.localhostKeyPath, daysUntilCertificateExpires = defaults.daysUntilCertificateExpires) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            fsExtra.ensureDirSync(path.dirname(caCertificatePath));
            fsExtra.ensureDirSync(path.dirname(localhostCertificatePath));
            fsExtra.ensureDirSync(path.dirname(localhostKeyPath));
        }
        catch (err) {
            throw new Error(`Unable to create the directory.\n${err}`);
        }
        const cACertificateInfo = {
            countryCode: defaults.countryCode,
            locality: defaults.locality,
            organization: defaults.certificateName,
            state: defaults.state,
            validityDays: daysUntilCertificateExpires,
        };
        let caCertificate;
        try {
            caCertificate = yield mkcert.createCA(cACertificateInfo);
        }
        catch (err) {
            throw new Error(`Unable to generate the CA certificate.\n${err}`);
        }
        const localhostCertificateInfo = {
            caCert: caCertificate.cert,
            caKey: caCertificate.key,
            domains: defaults.domain,
            validityDays: daysUntilCertificateExpires,
        };
        let localhostCertificate;
        try {
            localhostCertificate = yield mkcert.createCert(localhostCertificateInfo);
        }
        catch (err) {
            throw new Error(`Unable to generate the localhost certificate.\n${err}`);
        }
        try {
            if (!fs.existsSync(caCertificatePath)) {
                fs.writeFileSync(`${caCertificatePath}`, caCertificate.cert);
                fs.writeFileSync(`${localhostCertificatePath}`, localhostCertificate.cert);
                fs.writeFileSync(`${localhostKeyPath}`, localhostCertificate.key);
            }
        }
        catch (err) {
            throw new Error(`Unable to write generated certificates.\n${err}`);
        }
        if (caCertificatePath === defaults.caCertificatePath) {
            console.log("The developer certificates have been generated in " + defaults.certificateDirectory);
        }
        else {
            console.log("The developer certificates have been generated.");
        }
    });
}
exports.generateCertificates = generateCertificates;
//# sourceMappingURL=generate.js.map