import { createAppInstance } from '@hayadev/configurator';
import colors from 'colors';
import { Command, InvalidArgumentError } from 'commander';
import dotenv from 'dotenv';
import fs from 'fs';
import ora from 'ora';
import { inspect } from 'util';
import { fromError } from 'zod-validation-error';
import { version } from '../../package.json';
import { config as FormApp } from '../config';

const REQUIREMENT_SPLITTER = '----------------\n';

dotenv.config();

if (!process.env.AI_API_KEY) {
    console.error('AI_API_KEY environment variable is not set');
    process.exit(1);
}

const AI_API_ENDPOINT = process.env.AI_API_ENDPOINT ?? 'https://ptminder.ptengine.com/v1/workflows/run';
const AI_API_KEY = process.env.AI_API_KEY;

const app = createAppInstance(FormApp, version);

async function main() {
    const program = new Command();
    program
        .name('ai-gen-test')
        .description('AI form config generation test')
        .option(
            '-r, --requirements <path>',
            'Requirements file path',
            (value) => {
                if (!fs.existsSync(value)) {
                    throw new InvalidArgumentError('Requirements file does not exist');
                }
                return value;
            },
            'requirements.txt'
        )
        .option('-c, --count <count>', 'Repeat count for each requirement', (value) => parseInt(value), 1)
        .option('-d, --debug', 'Enable debug mode', false)
        .action(runTests);

    await program.parseAsync();
}

async function runTests({ requirements, count, debug }: { requirements: string; count: number; debug: boolean }) {
    console.log('🤖 Running AI form config generation tests');
    console.log('Requirements file:', requirements);

    const reqLines = fs.readFileSync(requirements, 'utf-8').split(REQUIREMENT_SPLITTER);
    const reqs = reqLines.filter((req) => req.trim());

    console.log('Requirements:', reqs.length);
    console.log('Repeat count:', count);
    console.log();

    let failedRuns = 0;
    let failedReqs = 0;
    let totalTook = 0;
    let totalReqs = 0;

    for (let i = 0; i < reqs.length; i++) {
        const req = reqs[i].trim();

        totalReqs++;
        const spinner = ora(`${i + 1}. ${req.substring(0, 50).replace('\n', ' ')}`).start();

        let reqFailed = false;
        let reqTook = 0;

        for (let j = 0; j < count; j++) {
            if (count > 1) {
                spinner.suffixText = `(run #${j + 1})`;
            }

            try {
                const took = await runOne(req, debug);
                reqTook += took;
                totalTook += took;
            } catch (e) {
                console.error(e);
                failedRuns++;
                reqFailed = true;
            }
        }

        if (reqFailed) {
            failedReqs++;
            spinner.fail();
        } else {
            spinner.suffixText = colors.cyan(`(avg. ${(reqTook / count / 1000).toFixed(2)}s)`);
            spinner.succeed();
        }
    }

    console.log();
    if (failedRuns > 0) {
        console.log(
            colors.red(
                `🤖 Completed: ${failedRuns}/${
                    totalReqs * count
                } runs failed, ${failedReqs}/${totalReqs} requirements failed, avg. ${(
                    totalTook /
                    (totalReqs * count) /
                    1000
                ).toFixed(2)}s`
            )
        );
        process.exit(1);
    } else {
        console.log(
            colors.green(
                `🤖 Completed: ${totalReqs * count - failedRuns}/${totalReqs * count} runs passed, ${
                    totalReqs - failedReqs
                }/${totalReqs} requirements passed, avg. ${(totalTook / (totalReqs * count) / 1000).toFixed(2)}s`
            )
        );
    }
}

async function runOne(req: string, debug: boolean) {
    const requestBody = {
        inputs: {
            requirements: req,
        },
        response_mode: 'blocking',
        user: 'ai-gen-test@ptmind.com',
    };

    let start = Date.now();

    const response = await fetch(AI_API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + AI_API_KEY,
        },
        body: JSON.stringify(requestBody),
    });

    const responseBody = await response.json();

    if (debug) {
        console.log('AI response:', inspect(responseBody));
    }

    if (!responseBody.data?.outputs?.text) {
        throw new Error('AI response does not contain expected data');
    }

    const model = JSON.parse(responseBody.data.outputs.text);
    if (debug) {
        console.log('Model:', inspect(model));
    }

    const result = app.importModel(model);
    if (!result.success) {
        console.error('Failed to import model:', inspect(result.issues));
        console.log('Model:', inspect(model));
        throw new Error(`Failed to import model. Issues: ${fromError(result.issues)}`);
    }

    if (debug) {
        console.log('Took:', Date.now() - start, 'ms');
    }

    return Date.now() - start;
}

main();
