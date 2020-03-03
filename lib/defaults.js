// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const path = require("path");
// Default certificate names
exports.certificateDirectoryName = ".office-addin-dev-certs";
exports.certificateDirectory = path.join(os.homedir(), exports.certificateDirectoryName);
exports.caCertificateFileName = "ca.crt";
exports.caCertificatePath = path.join(exports.certificateDirectory, exports.caCertificateFileName);
exports.localhostCertificateFileName = "localhost.crt";
exports.localhostCertificatePath = path.join(exports.certificateDirectory, exports.localhostCertificateFileName);
exports.localhostKeyFileName = "localhost.key";
exports.localhostKeyPath = path.join(exports.certificateDirectory, exports.localhostKeyFileName);
// Default certificate details
exports.certificateName = "Developer CA for Microsoft Office Add-ins";
exports.countryCode = "US";
exports.daysUntilCertificateExpires = 30;
exports.domain = ["127.0.0.1", "localhost"];
exports.locality = "Redmond";
exports.state = "WA";
//# sourceMappingURL=defaults.js.map