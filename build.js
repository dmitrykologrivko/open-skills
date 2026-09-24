const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const rootDir = __dirname;
const skillsDir = path.join(rootDir, '.agents', 'skills');
const configFile = process.argv[2] || 'config.json';
const configPath = path.resolve(process.cwd(), configFile);

function readConfig() {
  let configText;

  try {
    configText = fs.readFileSync(configPath, 'utf8');
  } catch (error) {
    throw new Error(`cannot read config file ${configPath}: ${error.message}`);
  }

  try {
    return JSON.parse(configText);
  } catch (error) {
    throw new Error(`invalid JSON in ${configPath}: ${error.message}`);
  }
}

function validateName(name, label) {
  if (typeof name !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(name)) {
    throw new Error(`${label} must contain only letters, numbers, hyphens, and underscores`);
  }
}

function validateRelativePath(value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} must be a non-empty relative path`);
  }

  const normalized = path.posix.normalize(value.replaceAll('\\', '/'));
  if (path.posix.isAbsolute(normalized) || path.win32.isAbsolute(normalized) ||
      normalized === '..' || normalized.startsWith('../')) {
    throw new Error(`${label} must stay inside the repository`);
  }

  return normalized;
}

function renderSkill(skillText, variables, skillName) {
  return skillText.replace(/\{\{\s*([^{}\s]+)\s*\}\}/g, (placeholder, variableName) => {
    if (!Object.prototype.hasOwnProperty.call(variables, variableName)) {
      throw new Error(`missing value for {{${variableName}}} in skill ${skillName}`);
    }

    const value = variables[variableName];
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      throw new Error(`value for ${variableName} in skill ${skillName} must be a string, number, or boolean`);
    }

    return String(value);
  });
}

function buildSkill(sourceDir, outputDir, variables, skillName) {
  fs.cpSync(sourceDir, outputDir, { recursive: true });

  const skillPath = path.join(outputDir, 'SKILL.md');
  if (!fs.existsSync(skillPath)) {
    throw new Error(`skill has no SKILL.md: ${skillName}`);
  }

  const source = fs.readFileSync(skillPath, 'utf8');
  const rendered = renderSkill(source, variables, skillName);
  fs.writeFileSync(skillPath, rendered);
}

function namespaceSkillName(skillText, repositoryNamespace, skillName) {
  const frontmatterMatch = skillText.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!frontmatterMatch) {
    throw new Error(`skill has no frontmatter: ${skillName}`);
  }

  const nameLinePattern = /^name:[^\r\n]*(\r?\n|$)/m;
  if (!nameLinePattern.test(frontmatterMatch[2])) {
    throw new Error(`skill frontmatter has no name: ${skillName}`);
  }

  const namespacedName = `${repositoryNamespace}:${skillName}`;
  const frontmatter = frontmatterMatch[2].replace(
    nameLinePattern,
    `name: ${namespacedName}$1`,
  );
  return `${frontmatterMatch[1]}${frontmatter}${frontmatterMatch[3]}${skillText.slice(frontmatterMatch[0].length)}`;
}

function buildExternalSkill(sourceDir, outputDir, repositoryNamespace, skillName) {
  fs.cpSync(sourceDir, outputDir, { recursive: true });

  const skillPath = path.join(outputDir, 'SKILL.md');
  if (!fs.existsSync(skillPath)) {
    throw new Error(`skill has no SKILL.md: ${skillName}`);
  }

  const source = fs.readFileSync(skillPath, 'utf8');
  const namespaced = namespaceSkillName(source, repositoryNamespace, skillName);
  fs.writeFileSync(skillPath, namespaced);
}

function normalizeRepository(repository, ref) {
  const githubMatch = repository.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\/tree\/([^/]+))?\/?$/,
  );
  if (!githubMatch) {
    return { repository, ref };
  }

  const repositoryName = githubMatch[2].replace(/\.git$/, '');
  return {
    repository: `https://github.com/${githubMatch[1]}/${repositoryName}.git`,
    ref: ref ?? (githubMatch[3] ? decodeURIComponent(githubMatch[3]) : undefined),
  };
}

function getRepositoryNamespace(repository) {
  const githubMatch = repository.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!githubMatch) {
    throw new Error(`external skill repository must be a GitHub repository URL: ${repository}`);
  }

  return `${githubMatch[1]}-${githubMatch[2]}`;
}

function readExternalSkills(config) {
  if (config.external_skills === undefined) {
    return [];
  }
  if (!Array.isArray(config.external_skills)) {
    throw new Error('external_skills must be an array');
  }

  return config.external_skills.map((repositoryConfig, repositoryIndex) => {
    if (!repositoryConfig || typeof repositoryConfig !== 'object' || Array.isArray(repositoryConfig)) {
      throw new Error(`external_skills[${repositoryIndex}] must be an object`);
    }
    if (typeof repositoryConfig.repository !== 'string' || repositoryConfig.repository.length === 0) {
      throw new Error(`external_skills[${repositoryIndex}].repository must be a non-empty string`);
    }
    if (repositoryConfig.ref !== undefined &&
        (typeof repositoryConfig.ref !== 'string' || repositoryConfig.ref.length === 0)) {
      throw new Error(`external_skills[${repositoryIndex}].ref must be a non-empty string`);
    }
    if (!repositoryConfig.skills || typeof repositoryConfig.skills !== 'object' ||
        Array.isArray(repositoryConfig.skills)) {
      throw new Error(`external_skills[${repositoryIndex}].skills must be an object`);
    }

    const skills = Object.entries(repositoryConfig.skills).map(([name, skillPath]) => {
      validateName(name, `external skill name ${name}`);
      return {
        name,
        path: validateRelativePath(skillPath, `path for external skill ${name}`),
      };
    });

    if (skills.length === 0) {
      throw new Error(`external_skills[${repositoryIndex}].skills must not be empty`);
    }

    const normalizedRepository = normalizeRepository(
      repositoryConfig.repository,
      repositoryConfig.ref,
    );
    return {
      repository: normalizedRepository.repository,
      ref: normalizedRepository.ref,
      namespace: getRepositoryNamespace(normalizedRepository.repository),
      skills,
    };
  });
}

function cloneRepository(repository, ref) {
  const checkoutDir = fs.mkdtempSync(path.join(os.tmpdir(), 'open-skills-'));
  const args = ['clone', '--depth', '1', '--quiet'];
  if (ref) {
    args.push('--branch', ref);
  }
  args.push(repository, checkoutDir);

  try {
    execFileSync('git', args, { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
  } catch (error) {
    const details = error.stderr?.trim() || error.message;
    fs.rmSync(checkoutDir, { recursive: true, force: true });
    throw new Error(`cannot clone external skill repository ${repository}: ${details}`);
  }

  return checkoutDir;
}

function build() {
  const config = readConfig();

  validateName(config.project, 'project name');
  if (typeof config.response_language !== 'string' || config.response_language.length === 0) {
    throw new Error('response_language must be a non-empty string');
  }
  if (!config.skills || typeof config.skills !== 'object' || Array.isArray(config.skills)) {
    throw new Error('skills must be an object');
  }

  const externalRepositories = readExternalSkills(config);
  const selectedSkillNames = new Set();

  // Local skills
  for (const skillName of Object.keys(config.skills)) {
    validateName(skillName, `skill name ${skillName}`);
    selectedSkillNames.add(skillName);
  }

  // External skills
  for (const repositoryConfig of externalRepositories) {
    for (const { name } of repositoryConfig.skills) {
      if (selectedSkillNames.has(name)) {
        throw new Error(`skill selected more than once: ${name}`);
      }
      selectedSkillNames.add(name);
    }
  }

  const outputDir = path.join(rootDir, `${config.project}-skills`);
  fs.rmSync(outputDir, { recursive: true, force: true });

  const globalVariables = {
    response_language: config.response_language ?? '',
    task_prefix_regexp: config.task_prefix_regexp ?? '',
    base_feature_branch: config.base_feature_branch ?? '',
    base_hotfix_branch: config.base_hotfix_branch ?? '',
  };

  for (const [skillName, skillVariables] of Object.entries(config.skills)) {
    if (!skillVariables || typeof skillVariables !== 'object' || Array.isArray(skillVariables)) {
      throw new Error(`values for skill ${skillName} must be an object`);
    }

    const sourcePath = path.join(skillsDir, skillName, 'SKILL.md');
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`skill not found: ${skillName}`);
    }

    const outputSkillDir = path.join(outputDir, skillName);
    fs.mkdirSync(outputSkillDir, { recursive: true });
    const variables = {
      ...globalVariables,
      ...skillVariables,
    };
    buildSkill(path.dirname(sourcePath), outputSkillDir, variables, skillName);
  }

  for (const repositoryConfig of externalRepositories) {
    const checkoutDir = cloneRepository(repositoryConfig.repository, repositoryConfig.ref);
    try {
      for (const { name, path: skillPath } of repositoryConfig.skills) {
        const sourceDir = path.join(checkoutDir, skillPath);
        if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
          throw new Error(`external skill path is not a directory: ${repositoryConfig.repository}/${skillPath}`);
        }

        const outputSkillDir = path.join(outputDir, name);
        fs.mkdirSync(outputSkillDir, { recursive: true });
        buildExternalSkill(sourceDir, outputSkillDir, repositoryConfig.namespace, name);
      }
    } finally {
      fs.rmSync(checkoutDir, { recursive: true, force: true });
    }
  }

  console.log(`Built ${selectedSkillNames.size} skill(s) in ${outputDir}`);
}

try {
  build();
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exitCode = 1;
}
