/**
 * @reflection
 * [IDENTITY]: artifact_manifest
 * [PURPOSE]: Shared provenance helpers for PRIMERA artifacts and stale-input enforcement.
 * [STATE]: Active
 * [ANCHOR]: stampArtifact
 * [DEPENDS_ON]: fs, path, child_process
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const PROVENANCE_PREFIX = '<!-- PRIMERA_PROVENANCE ';
const PROVENANCE_REGEX = /^<!-- PRIMERA_PROVENANCE (.+?) -->\r?\n?/;

function runGit(args, rootDir = ROOT) {
    const result = spawnSync('git', args, {
        cwd: rootDir,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
    });

    return {
        code: result.status ?? 1,
        stdout: (result.stdout || '').trim(),
        stderr: (result.stderr || '').trim()
    };
}

function normalizeInputs(inputs = []) {
    return inputs.map((input) => {
        if (typeof input === 'string') {
            return path.basename(input);
        }

        if (input && typeof input === 'object') {
            return {
                ...input,
                artifact: input.artifact ? path.basename(input.artifact) : input.artifact
            };
        }

        return input;
    });
}

export function getGitMetadata(rootDir = ROOT) {
    const shaResult = runGit(['rev-parse', '--short', 'HEAD'], rootDir);
    const dirtyWorktree = runGit(['diff', '--quiet'], rootDir).code !== 0;
    const dirtyIndex = runGit(['diff', '--cached', '--quiet'], rootDir).code !== 0;

    return {
        gitSha: shaResult.code === 0 ? shaResult.stdout : 'unknown',
        dirty: dirtyWorktree || dirtyIndex
    };
}

export function stampArtifact(data, command, inputs = [], options = {}) {
    const { rootDir = ROOT, generatedAt = new Date().toISOString() } = options;
    const { gitSha, dirty } = getGitMetadata(rootDir);

    return {
        generatedAt,
        gitSha,
        dirty,
        sourceCommand: command,
        inputArtifacts: normalizeInputs(inputs),
        ...data
    };
}

export function writeStampedJson(filePath, data, command, inputs = [], options = {}) {
    const stamped = stampArtifact(data, command, inputs, options);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(stamped, null, 2));
    return stamped;
}

export function readStampedJson(filePath, fallback = null) {
    if (!fs.existsSync(filePath)) return fallback;

    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return fallback;
    }
}

export function parseMarkdownProvenance(content) {
    const match = content.match(PROVENANCE_REGEX);
    if (!match) return null;

    try {
        return JSON.parse(match[1]);
    } catch {
        return null;
    }
}

export function stampMarkdown(markdown, command, inputs = [], options = {}) {
    const provenance = stampArtifact({}, command, inputs, options);
    const comment = `${PROVENANCE_PREFIX}${JSON.stringify(provenance)} -->`;
    const stripped = markdown.replace(PROVENANCE_REGEX, '');
    return `${comment}\n${stripped}`;
}

export function readArtifactProvenance(filePath) {
    if (!fs.existsSync(filePath)) return null;

    if (filePath.endsWith('.json')) {
        return readStampedJson(filePath);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    return parseMarkdownProvenance(content);
}

export function formatAge(ms) {
    if (!Number.isFinite(ms) || ms < 0) return 'unknown age';

    if (ms < 60_000) {
        return `${Math.round(ms / 1000)}s`;
    }

    if (ms < 3_600_000) {
        return `${Math.round(ms / 60_000)}m`;
    }

    return `${Math.round(ms / 3_600_000)}h`;
}

export function validateArtifactFreshness(filePath, options = {}) {
    const {
        maxAgeMs = 3_600_000,
        currentGitSha = getGitMetadata(options.rootDir || ROOT).gitSha
    } = options;

    if (!fs.existsSync(filePath)) {
        return {
            ok: false,
            artifact: path.basename(filePath),
            reason: 'missing'
        };
    }

    const meta = readArtifactProvenance(filePath);
    if (!meta?.generatedAt) {
        return {
            ok: false,
            artifact: path.basename(filePath),
            reason: 'unstamped'
        };
    }

    const ageMs = Date.now() - Date.parse(meta.generatedAt);
    if (!Number.isFinite(ageMs)) {
        return {
            ok: false,
            artifact: path.basename(filePath),
            reason: 'invalid_timestamp',
            meta
        };
    }

    if (ageMs > maxAgeMs) {
        return {
            ok: false,
            artifact: path.basename(filePath),
            reason: 'stale',
            ageMs,
            meta
        };
    }

    if (meta.gitSha && currentGitSha !== 'unknown' && meta.gitSha !== currentGitSha) {
        return {
            ok: false,
            artifact: path.basename(filePath),
            reason: 'git_sha_mismatch',
            ageMs,
            meta
        };
    }

    return {
        ok: true,
        artifact: path.basename(filePath),
        ageMs,
        meta
    };
}

export function getPrimeraRoot() {
    return ROOT;
}
