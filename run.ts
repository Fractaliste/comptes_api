import { createReadStream, createWriteStream, mkdtempSync } from 'fs';
import { copyFile, mkdir, readdir, rmdir, access, stat, rm } from 'fs/promises';
import { EOL } from 'os';
import { join } from 'path';
import { createInterface } from "readline";

const srcDir = 'C:\\Users/RaphDine/Documents/WS/comptes_b/src/entity'
const tempDir = mkdtempSync("comptes")
const destDir = 'C:\\Users/RaphDine/Documents/WS/comptes_api/src/dto'

rmDirContentRecursive(destDir)
    .then(() => mkdir(destDir))
    .then(() => {
        return readdir(srcDir)
    })
    .then(files => {
        return Promise.all(files.map(file => handleFile(file)))
    })
    .then(filenames => Promise.all(filenames.map(file => createInterfaceFile(file))))
    .then(filenames => filenames.flatMap(f => f))
    .then(filenames => createIndexTs(filenames))
    .then(() => rmDirContentRecursive(tempDir))
    .catch(error => {
        console.log("Got an error", error)
        console.trace()
    })

function handleFile(fileName: string): Promise<string> {
    const srcPath = join(srcDir, fileName);
    const tempPath = join(tempDir, fileName);
    const tempEditedPath = join(tempDir, `${fileName}_edited`);
    const destPath = join(destDir, fileName);

    return copyFile(srcPath, tempPath)
        .then(() => {
            console.log(`Start reading file ${fileName}`);
            const readingStream = createReadStream(tempPath);
            const writingStream = createWriteStream(tempEditedPath, { emitClose: true });

            const className = fileName.replace('.ts', '')
            writingStream.write(`import { I${className} } from "./I${className}";`)
            writingStream.write(EOL)


            const rl = createInterface({
                input: readingStream,
                output: writingStream,
                crlfDelay: Infinity
            });
            rl.on("line", (line) => {
                if (/^\s*@.*\)\s*$/.test(line)) {
                    // Remove all decorator @
                } else if (line.indexOf("typeorm") !== -1) {
                    // Remove all typeorm reference
                } else {
                    // console.log("line is ", line);
                    writingStream.write(line.replace(` ${className} `, ` ${className} implements I${className} `))
                    writingStream.write(EOL)
                }

            })

            return new Promise(resolve => {
                rl.on("close", () => {
                    console.log(`File ${fileName} is closed`);
                    readingStream.close()
                    writingStream.on("close", () => resolve(fileName))
                    writingStream.close()

                })
            })
        })
        .then(() => copyFile(tempEditedPath, destPath))
        .then(() => fileName)
}

function createInterfaceFile(fileName: string): Promise<string[]> {
    const srcPath =  join(tempDir, fileName);
    const destPath = join(destDir, `I${fileName}`);

    console.log(`Start createInterfaceFile for ${fileName}`);
    const readingStream = createReadStream(srcPath);
    const writingStream = createWriteStream(destPath, { emitClose: true });

    const className = fileName.replace('.ts', '')

    const rl = createInterface({
        input: readingStream,
        output: writingStream,
        crlfDelay: Infinity
    });
    rl.on("line", (line) => {
        if (/^\s*@.*\)\s*$/.test(line)) {
            // Remove all decorator @
        } else if (line.indexOf("typeorm") !== -1) {
            // Remove all typeorm reference
        } else {
            // console.log("line is ", line);

            writingStream.write(line.replace(className, `I${className}`).replace(" class ", " interface "))
            writingStream.write(EOL)
        }

    })

    return new Promise(resolve => {
        rl.on("close", () => {
            console.log(`File ${fileName} is closed`);
            readingStream.close()
            writingStream.on("close", () => resolve(fileName))
            writingStream.close()

        })
    })
        .then(() => [fileName, `I${fileName}`])
}



function rmDirContentRecursive(dirPath: string): Promise<any> {
    console.log(`Rmdir on ${dirPath}`);

    return access(dirPath)
        .catch((error) => console.log("Error while rmDirContentRecursive", error))
        .then(() => readdir(dirPath))
        .then(children => {
            return Promise.all(children
                .map(child => join(dirPath, child))
                .map(child => {
                    return stat(join(child))
                        .then(stats => {
                            if (stats.isDirectory()) {
                                return rmDirContentRecursive(child)
                            } else {
                                return rm(child)
                            }
                        })
                }))
        })
        .then(() => rmdir(dirPath))
}
function createIndexTs(filenames: string[]): Promise<any> {
    const indexPath = join(destDir, '..', "index.ts")
    console.log(filenames);


    return access(indexPath)
        .then(() => rm(indexPath))
        .catch(() => console.log(`${indexPath} does not exists`))
        .then(() => {
            return Promise.all(

                filenames.map(fileName => {
                    const filePath = join(destDir, fileName)

                    const readingStream = createReadStream(filePath, { emitClose: true });
                    const rl = createInterface({
                        input: readingStream,
                        crlfDelay: Infinity
                    });

                    let className: string;
                    rl.on("line", (line) => {
                        if (/class\s+(\S+)/.test(line)) {
                            const matches = /class\s+(\S+)/.exec(line)

                            if (matches && matches[1]) {
                                className = matches[1]
                            }
                        } else if (/interface\s+(\S+)/.test(line)) {
                            const matches = /interface\s+(\S+)/.exec(line)

                            if (matches && matches[1]) {
                                className = matches[1]
                            }
                        }

                    })

                    return new Promise(resolve => {
                        rl.on("close", () => {
                            console.log(`File ${fileName} is closed`);
                            readingStream.on("close", () => resolve(className))
                            readingStream.close()

                        })
                    })
                })
            )

        })
        .then((classes) => {
            const writingStream = createWriteStream(indexPath, { emitClose: true });

            classes.map(className => `import { ${className} } from "./dto/${className}.js";${EOL}`)
                .forEach(importStatement => writingStream.write(importStatement))
            writingStream.write(`export { ${classes.join(", ")} }`)


            return new Promise(resolve => {
                writingStream.on("close", () => resolve(undefined))
                writingStream.close()
            })
        })
}

