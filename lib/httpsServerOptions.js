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
const defaults = require("./defaults");
const install_1 = require("./install");
function getHttpsServerOptions() {
    return __awaiter(this, void 0, void 0, function* () {
        yield install_1.ensureCertificatesAreInstalled();
        const httpsServerOptions = {};
        try {
            httpsServerOptions.cert = fs.readFileSync(defaults.localhostCertificatePath);
        }
        catch (err) {
            throw new Error(`Unable to read the certificate file.\n${err}`);
        }
        try {
            httpsServerOptions.key = fs.readFileSync(defaults.localhostKeyPath);
        }
        catch (err) {
            throw new Error(`Unable to read the certificate key.\n${err}`);
        }
        return httpsServerOptions;
    });
}
exports.getHttpsServerOptions = getHttpsServerOptions;
//# sourceMappingURL=httpsServerOptions.js.map