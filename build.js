const fs = require('node:fs');
const path = require('node:path');

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

function build() {
  const config = readConfig();

  validateName(config.project, 'project name');
  if (typeof config.response_language !== 'string' || config.response_language.length === 0) {
    throw new Error('response_language must be a non-empty string');
  }
  if (!config.skills || typeof config.skills !== 'object' || Array.isArray(config.skills)) {
    throw new Error('skills must be an object');
  }

  const outputDir = path.join(rootDir, `${config.project}-skills`);
  fs.rmSync(outputDir, { recursive: true, force: true });

  for (const [skillName, skillVariables] of Object.entries(config.skills)) {
    validateName(skillName, `skill name ${skillName}`);
    if (!skillVariables || typeof skillVariables !== 'object' || Array.isArray(skillVariables)) {
      throw new Error(`values for skill ${skillName} must be an object`);
    }

    const sourcePath = path.join(skillsDir, skillName, 'SKILL.md');
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`skill not found: ${skillName}`);
    }

    const outputSkillDir = path.join(outputDir, skillName);
    fs.mkdirSync(outputSkillDir, { recursive: true });
    const source = fs.readFileSync(sourcePath, 'utf8');
    const variables = {
      response_language: config.response_language,
      task_prefix_regexp: config.task_prefix_regexp ?? '',
      ...skillVariables,
    };
    const rendered = renderSkill(source, variables, skillName);
    fs.writeFileSync(path.join(outputSkillDir, 'SKILL.md'), rendered);
  }

  console.log(`Built ${Object.keys(config.skills).length} skill(s) in ${outputDir}`);
}

try {
  build();
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exitCode = 1;
}
