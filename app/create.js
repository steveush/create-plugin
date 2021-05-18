const _ = require("lodash");
const fs = require("fs/promises");
const fsx = require("fs-extra");
const path = require("path");
const glob = require("glob-promise");
const Handlebars = require("handlebars");

async function create(template, target, pkg){
    const source = path.resolve(__dirname, "../templates", template);
    if (await fsx.pathExists(source)){
        const files = await glob("**/*", {"cwd": source});

        return Promise.all(files.filter((fileName) => {
            return !fileName.endsWith(".gitkeep");
        }).map( async (fileName) => {
            const destName = Handlebars.compile(fileName),
                src = path.join(source, fileName),
                dest = path.join(target, destName(pkg).replace(/\.hbs$/ig, "")),
                exists = await fsx.pathExists(dest);

            let action = "skip";
            if ( !exists ) {
                const lstat = await fs.lstat(src);
                if (lstat.isDirectory()){
                    action = "mkdir";
                    await fsx.ensureDir(dest);
                } else {
                    action = "copy";
                    const raw = await fs.readFile(src, "utf8");
                    const contents = Handlebars.compile(raw);
                    await fsx.outputFile(dest, contents(pkg));
                }
            }
            return { src, dest, action };
        }));
    }
    return [];
}

module.exports = create;