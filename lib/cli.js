#!/usr/bin/env node
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const office_addin_cli_1 = require("office-addin-cli");
const commands = require("./commands");
const defaults = require("./defaults");
commander.name("office-addin-dev-certs");
commander.version(process.env.npm_package_version || "(version not available)");
commander
    .command("install")
    .option("--machine", "Install the CA certificate for all users. You must be an Administrator.")
    .option("--days <days>", `Specifies the validity of CA certificate in days. Default: ${defaults.daysUntilCertificateExpires}`)
    .description(`Generate an SSL certificate for "localhost" issued by a CA certificate which is installed.`)
    .action(commands.install);
commander
    .command("verify")
    .description(`Verify the CA certificate.`)
    .action(commands.verify);
commander
    .command("uninstall")
    .option("--machine", "Uninstall the CA certificate for all users. You must be an Administrator.")
    .description(`Uninstall the certificate.`)
    .action(commands.uninstall);
// if the command is not known, display an error
commander.on("command:*", function () {
    office_addin_cli_1.logErrorMessage(`The command syntax is not valid.\n`);
    process.exitCode = 1;
    commander.help();
});
if (process.argv.length > 2) {
    commander.parse(process.argv);
}
else {
    commander.help();
}
//# sourceMappingURL=cli.js.map