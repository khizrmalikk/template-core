# 🚀 Galaxy CLI Development Guide

> Build a powerful CLI tool to instantly scaffold new Core and Feature apps for your Galaxy System

## 📋 Table of Contents

1. [Overview](#overview)
2. [Why You Need a CLI](#why-you-need-a-cli)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Implementation Steps](#implementation-steps)
6. [Core Features](#core-features)
7. [Publishing & Distribution](#publishing--distribution)
8. [Usage Examples](#usage-examples)
9. [Best Practices](#best-practices)

## 🎯 Overview

The Galaxy CLI enables developers to:
- Create new Core or Feature apps with a single command
- Auto-configure galaxy.config.ts based on prompts
- Set up authentication and environment variables
- Generate color palettes with visual preview
- Connect features to existing cores
- Deploy to various platforms

## 🤔 Why You Need a CLI

A CLI tool will make it incredibly efficient to:
- **Instantly scaffold** new Core or Feature apps
- **Auto-configure** all settings based on user prompts  
- **Generate themes** with visual previews
- **Connect features** to existing cores automatically
- **Ensure consistency** across all projects
- **Save hours** of setup time for each new project

## 🛠 Tech Stack

Essential packages for your CLI:

| Package | Purpose |
|---------|---------|
| `commander` | Command parsing and structure |
| `inquirer` | Interactive prompts with great UX |
| `chalk` | Colored terminal output |
| `ora` | Elegant loading spinners |
| `degit` | Fast project cloning (better than git clone) |
| `gradient-string` | Beautiful gradient text |
| `figlet` | ASCII art text banners |
| `execa` | Better child process execution |
| `validate-npm-package-name` | Project name validation |
| `fs-extra` | Enhanced file system operations |

## 📁 Project Structure

```
galaxy-cli/
├── bin/
│   └── galaxy.js              # Entry point (executable)
├── src/
│   ├── commands/
│   │   ├── create.js          # Create new projects
│   │   ├── init.js            # Initialize existing
│   │   ├── add-feature.js     # Add features to core
│   │   ├── theme.js           # Theme generator
│   │   └── deploy.js          # Deployment helper
│   ├── templates/
│   │   ├── core/              # Core app template
│   │   ├── feature/           # Feature app template
│   │   └── configs/           # Config presets
│   ├── themes/
│   │   └── presets.js         # Color theme presets
│   ├── utils/
│   │   ├── git.js             # Git operations
│   │   ├── package-manager.js # npm/yarn/pnpm detection
│   │   ├── config-updater.js  # Update galaxy.config.ts
│   │   ├── colors.js          # Color utilities
│   │   └── validation.js      # Input validation
│   └── index.js               # Main CLI logic
├── test/
│   └── cli.test.js            # Test suite
├── package.json
├── README.md
└── LICENSE
```

## 📦 Implementation Steps

### Step 1: Initialize CLI Project

```bash
# Create CLI directory
mkdir galaxy-cli
cd galaxy-cli

# Initialize package
npm init -y

# Install dependencies
npm install commander inquirer chalk ora degit gradient-string figlet fs-extra execa validate-npm-package-name
```

### Step 2: Configure package.json

```json
{
  "name": "create-galaxy-app",
  "version": "1.0.0",
  "description": "Create Galaxy System apps with one command",
  "type": "module",
  "bin": {
    "create-galaxy-app": "./bin/galaxy.js",
    "galaxy": "./bin/galaxy.js"
  },
  "engines": {
    "node": ">=18.18.0"
  },
  "files": [
    "bin",
    "src",
    "templates"
  ],
  "keywords": ["galaxy", "saas", "nextjs", "create-app", "cli"],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/galaxy-cli"
  },
  "dependencies": {
    "commander": "^11.0.0",
    "inquirer": "^9.2.0",
    "chalk": "^5.3.0",
    "ora": "^7.0.1",
    "degit": "^2.8.4",
    "gradient-string": "^2.0.2",
    "figlet": "^1.7.0",
    "fs-extra": "^11.1.1",
    "execa": "^8.0.1",
    "validate-npm-package-name": "^5.0.0"
  }
}
```

### Step 3: Create Entry Point

**bin/galaxy.js**
```javascript
#!/usr/bin/env node

import { program } from 'commander';
import gradient from 'gradient-string';
import figlet from 'figlet';
import { createCommand } from '../src/commands/create.js';
import { initCommand } from '../src/commands/init.js';
import { themeCommand } from '../src/commands/theme.js';
import { addFeatureCommand } from '../src/commands/add-feature.js';

// Display beautiful banner
console.log(
  gradient.pastel.multiline(
    figlet.textSync('Galaxy CLI', { horizontalLayout: 'full' })
  )
);

program
  .name('galaxy')
  .description('CLI for creating Galaxy System apps')
  .version('1.0.0');

// Register commands
program.addCommand(createCommand);
program.addCommand(initCommand);
program.addCommand(themeCommand);
program.addCommand(addFeatureCommand);

program.parse();
```

### Step 4: Implement Create Command

**src/commands/create.js**
```javascript
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { fileURLToPath } from 'url';
import degit from 'degit';
import { execa } from 'execa';
import fs from 'fs-extra';
import validateProjectName from 'validate-npm-package-name';
import { themePresets } from '../themes/presets.js';
import { updateGalaxyConfig } from '../utils/config-updater.js';
import { detectPackageManager } from '../utils/package-manager.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createCommand = new Command('create')
  .argument('<project-name>', 'Name of your project')
  .option('-t, --type <type>', 'Project type: core or feature')
  .option('--core <url>', 'Core app URL (for feature apps)')
  .option('--no-install', 'Skip dependency installation')
  .option('--no-git', 'Skip git initialization')
  .option('-p, --package-manager <pm>', 'Package manager: npm, yarn, or pnpm')
  .description('Create a new Galaxy app')
  .action(async (projectName, options) => {
    // Validate project name
    const validation = validateProjectName(projectName);
    if (!validation.validForNewPackages) {
      console.error(chalk.red(`Invalid project name: ${projectName}`));
      validation.errors?.forEach(err => console.error(chalk.red(`  - ${err}`)));
      process.exit(1);
    }

    // Interactive prompts
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'What type of app are you creating?',
        choices: [
          { name: '🌌 Core App (Galaxy Center)', value: 'core' },
          { name: '🪐 Feature App (Planet)', value: 'feature' }
        ],
        when: !options.type
      },
      {
        type: 'input',
        name: 'appName',
        message: 'What is your app\'s display name?',
        default: projectName
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())
      },
      {
        type: 'input',
        name: 'tagline',
        message: 'Enter a tagline for your app:',
        default: answers => answers.type === 'core' 
          ? 'Central hub for all your tools'
          : 'Specialized tool for your workflow'
      },
      {
        type: 'input',
        name: 'coreUrl',
        message: 'Enter the Core app URL:',
        when: answers => answers.type === 'feature' && !options.core,
        validate: input => {
          try {
            new URL(input);
            return true;
          } catch {
            return 'Please enter a valid URL';
          }
        }
      },
      {
        type: 'list',
        name: 'theme',
        message: 'Choose a color theme:',
        choices: [
          { name: '🌊 Ocean (Blue/Teal)', value: 'ocean' },
          { name: '🌲 Forest (Green/Brown)', value: 'forest' },
          { name: '🌅 Sunset (Orange/Purple)', value: 'sunset' },
          { name: '🌙 Midnight (Dark/Purple)', value: 'midnight' },
          { name: '🎨 Custom', value: 'custom' }
        ]
      }
    ]);

    // Handle custom theme
    let colorPalette = themePresets[answers.theme] || themePresets.ocean;
    
    if (answers.theme === 'custom') {
      const customColors = await inquirer.prompt([
        {
          type: 'input',
          name: 'primary',
          message: 'Primary color (hex):',
          default: '#3B82F6',
          validate: validateHexColor
        },
        {
          type: 'input',
          name: 'secondary',
          message: 'Secondary color (hex):',
          default: '#8B5CF6',
          validate: validateHexColor
        },
        {
          type: 'input',
          name: 'accent',
          message: 'Accent color (hex):',
          default: '#F59E0B',
          validate: validateHexColor
        },
        {
          type: 'list',
          name: 'mode',
          message: 'Light or dark mode?',
          choices: ['light', 'dark']
        }
      ]);
      
      colorPalette = {
        primary: customColors.primary,
        secondary: customColors.secondary,
        accent: customColors.accent,
        background: customColors.mode === 'dark' ? '#0F172A' : '#FFFFFF',
        foreground: customColors.mode === 'dark' ? '#F1F5F9' : '#1F2937',
        muted: '#9CA3AF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444'
      };
    }

    // Create project
    const spinner = ora('Creating your Galaxy app...').start();

    try {
      const projectPath = path.join(process.cwd(), projectName);

      // Clone template
      spinner.text = 'Cloning template...';
      const repoUrl = 'github:your-org/template-core';
      await degit(repoUrl).clone(projectPath);

      // Update galaxy.config.ts
      spinner.text = 'Configuring galaxy settings...';
      await updateGalaxyConfig(projectPath, {
        id: projectName,
        type: answers.type || options.type,
        name: answers.appName,
        tagline: answers.tagline,
        coreAppUrl: answers.coreUrl || options.core,
        colorPalette
      });

      // Update package.json
      spinner.text = 'Updating package.json...';
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = projectName;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

      // Create .env.local
      spinner.text = 'Creating environment file...';
      const envTemplate = await fs.readFile(
        path.join(projectPath, 'env.template'),
        'utf-8'
      );
      await fs.writeFile(
        path.join(projectPath, '.env.local'),
        envTemplate
      );

      // Initialize git
      if (options.git !== false) {
        spinner.text = 'Initializing git repository...';
        await execa('git', ['init'], { cwd: projectPath });
        await execa('git', ['add', '.'], { cwd: projectPath });
        await execa('git', ['commit', '-m', 'Initial commit from Galaxy CLI'], {
          cwd: projectPath
        });
      }

      // Install dependencies
      if (options.install !== false) {
        spinner.text = 'Installing dependencies...';
        const pm = await detectPackageManager(options.packageManager);
        await execa(pm, ['install'], { cwd: projectPath });
      }

      spinner.succeed(chalk.green('Galaxy app created successfully!'));

      // Display theme preview
      console.log('\n' + chalk.bold('🎨 Your Theme:'));
      console.log('━'.repeat(40));
      Object.entries(colorPalette).slice(0, 5).forEach(([name, hex]) => {
        const preview = '██████';
        console.log(
          `${name.padEnd(12)} ${chalk.hex(hex)(preview)} ${hex}`
        );
      });

      // Display next steps
      console.log('\n' + chalk.bold('🚀 Next steps:'));
      console.log(chalk.cyan(`  cd ${projectName}`));
      
      if (options.install === false) {
        console.log(chalk.cyan('  npm install'));
      }
      
      console.log(chalk.cyan('  Configure your .env.local file'));
      console.log(chalk.cyan('  npm run dev'));
      
      console.log('\n' + chalk.bold('📚 Resources:'));
      console.log(chalk.dim('  - Galaxy Architecture Guide: GALAXY_ARCHITECTURE_GUIDE.md'));
      console.log(chalk.dim('  - Configuration Guide: GALAXY_CONFIGURATION.md'));
      console.log(chalk.dim('  - Theme Guide: COLOR_PALETTE_GUIDE.md'));
      
      console.log('\n' + chalk.green('Happy building! 🌌'));

    } catch (error) {
      spinner.fail(chalk.red('Failed to create project'));
      console.error(error);
      process.exit(1);
    }
  });

function validateHexColor(input) {
  const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexRegex.test(input)) {
    return 'Please enter a valid hex color';
  }
  return true;
}
```

### Step 5: Theme Presets

**src/themes/presets.js**
```javascript
export const themePresets = {
  ocean: {
    primary: '#0EA5E9',
    secondary: '#6366F1',
    accent: '#06B6D4',
    background: '#F0F9FF',
    foreground: '#0C4A6E',
    muted: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  forest: {
    primary: '#10B981',
    secondary: '#84CC16',
    accent: '#F59E0B',
    background: '#F0FDF4',
    foreground: '#14532D',
    muted: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  sunset: {
    primary: '#F97316',
    secondary: '#EC4899',
    accent: '#8B5CF6',
    background: '#FFF7ED',
    foreground: '#7C2D12',
    muted: '#9CA3AF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  midnight: {
    primary: '#8B5CF6',
    secondary: '#6366F1',
    accent: '#EC4899',
    background: '#0F172A',
    foreground: '#F1F5F9',
    muted: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  }
};
```

### Step 6: Configuration Updater

**src/utils/config-updater.js**
```javascript
import fs from 'fs-extra';
import path from 'path';

export async function updateGalaxyConfig(projectPath, settings) {
  const configPath = path.join(projectPath, 'src/config/galaxy.config.ts');
  let content = await fs.readFile(configPath, 'utf-8');
  
  // Update basic fields
  const replacements = {
    id: settings.id,
    type: settings.type,
    name: settings.name,
    tagline: settings.tagline,
    coreAppUrl: settings.coreAppUrl,
  };
  
  for (const [key, value] of Object.entries(replacements)) {
    if (value !== undefined) {
      const regex = new RegExp(`${key}:\\s*['"].*['"]`, 'g');
      content = content.replace(regex, `${key}: '${value}'`);
    }
  }
  
  // Update color palette
  if (settings.colorPalette) {
    const paletteStr = `colorPalette: {
    primary: '${settings.colorPalette.primary}',
    secondary: '${settings.colorPalette.secondary}',
    accent: '${settings.colorPalette.accent}',
    background: '${settings.colorPalette.background}',
    foreground: '${settings.colorPalette.foreground}',
    muted: '${settings.colorPalette.muted}',
    success: '${settings.colorPalette.success}',
    warning: '${settings.colorPalette.warning}',
    error: '${settings.colorPalette.error}',
  }`;
    
    content = content.replace(
      /colorPalette:\s*{[\s\S]*?}/,
      paletteStr
    );
  }
  
  await fs.writeFile(configPath, content);
}
```

### Step 7: Package Manager Detection

**src/utils/package-manager.js**
```javascript
import { execa } from 'execa';

export async function detectPackageManager(preferred) {
  if (preferred) return preferred;
  
  // Check for lockfiles
  const cwd = process.cwd();
  
  if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) {
    return 'yarn';
  }
  if (await fs.pathExists(path.join(cwd, 'package-lock.json'))) {
    return 'npm';
  }
  
  // Check what's installed
  try {
    await execa('pnpm', ['--version']);
    return 'pnpm';
  } catch {}
  
  try {
    await execa('yarn', ['--version']);
    return 'yarn';
  } catch {}
  
  return 'npm';
}
```

## 🎨 Core Features

### 1. Theme Command

**src/commands/theme.js**
```javascript
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { themePresets } from '../themes/presets.js';

export const themeCommand = new Command('theme')
  .description('Generate and preview color themes')
  .option('-p, --preview', 'Preview current theme')
  .option('-g, --generate', 'Generate a new theme')
  .action(async (options) => {
    if (options.preview) {
      await previewCurrentTheme();
    } else {
      await generateNewTheme();
    }
  });

async function previewCurrentTheme() {
  const configPath = path.join(process.cwd(), 'src/config/galaxy.config.ts');
  
  if (!await fs.pathExists(configPath)) {
    console.error(chalk.red('Not in a Galaxy project directory'));
    process.exit(1);
  }
  
  const configContent = await fs.readFile(configPath, 'utf-8');
  
  console.log('\n' + chalk.bold('Current Theme Preview:'));
  console.log('━'.repeat(40));
  
  // Extract and display colors
  const colorRegex = /(\w+):\s*['"]#([A-Fa-f0-9]{6})['"]/g;
  let match;
  
  while ((match = colorRegex.exec(configContent)) !== null) {
    const [, name, hex] = match;
    const preview = '██████';
    console.log(
      `${name.padEnd(12)} ${chalk.hex(`#${hex}`)(preview)} #${hex}`
    );
  }
}

async function generateNewTheme() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'method',
      message: 'How would you like to generate your theme?',
      choices: [
        { name: 'From preset', value: 'preset' },
        { name: 'From base color', value: 'base' },
        { name: 'Manual selection', value: 'manual' }
      ]
    }
  ]);
  
  let palette;
  
  switch (answers.method) {
    case 'preset':
      const { preset } = await inquirer.prompt([
        {
          type: 'list',
          name: 'preset',
          message: 'Choose a preset:',
          choices: Object.keys(themePresets).map(key => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: key
          }))
        }
      ]);
      palette = themePresets[preset];
      break;
      
    case 'base':
      // Generate from base color logic
      break;
      
    case 'manual':
      // Manual color selection
      break;
  }
  
  // Display and apply theme
  console.log('\n' + chalk.bold('Generated Theme:'));
  console.log('━'.repeat(40));
  
  Object.entries(palette).forEach(([name, hex]) => {
    const preview = '██████';
    console.log(
      `${name.padEnd(12)} ${chalk.hex(hex)(preview)} ${hex}`
    );
  });
}
```

### 2. Add Feature Command

**src/commands/add-feature.js**
```javascript
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

export const addFeatureCommand = new Command('add-feature')
  .argument('<feature-id>', 'Feature identifier')
  .option('--url <url>', 'Feature URL')
  .option('--api <endpoint>', 'API endpoint')
  .description('Add a feature to your Core app')
  .action(async (featureId, options) => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Feature display name:',
        default: featureId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      },
      {
        type: 'input',
        name: 'url',
        message: 'Feature URL:',
        when: !options.url,
        validate: validateUrl
      },
      {
        type: 'input',
        name: 'apiEndpoint',
        message: 'API endpoint:',
        when: !options.api
      },
      {
        type: 'input',
        name: 'description',
        message: 'Feature description:'
      }
    ]);
    
    // Add to galaxy.config.ts
    const configPath = path.join(process.cwd(), 'src/config/galaxy.config.ts');
    let content = await fs.readFile(configPath, 'utf-8');
    
    const newFeature = `{
      id: '${featureId}',
      name: '${answers.name}',
      url: '${answers.url || options.url}',
      apiEndpoint: '${answers.apiEndpoint || options.api}',
      description: '${answers.description}'
    }`;
    
    // Add to related array
    content = content.replace(
      /related:\s*\[/,
      `related: [\n    ${newFeature},`
    );
    
    await fs.writeFile(configPath, content);
    
    console.log(chalk.green(`✓ Added ${answers.name} to your Galaxy!`));
  });

function validateUrl(input) {
  try {
    new URL(input);
    return true;
  } catch {
    return 'Please enter a valid URL';
  }
}
```

### 3. Initialize Command

**src/commands/init.js**
```javascript
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

export const initCommand = new Command('init')
  .description('Initialize existing project as Galaxy app')
  .action(async () => {
    // Check if already initialized
    const configPath = path.join(process.cwd(), 'src/config/galaxy.config.ts');
    
    if (await fs.pathExists(configPath)) {
      console.log(chalk.yellow('This project is already a Galaxy app!'));
      process.exit(0);
    }
    
    // Gather information
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'What type of app is this?',
        choices: [
          { name: '🌌 Core App', value: 'core' },
          { name: '🪐 Feature App', value: 'feature' }
        ]
      },
      {
        type: 'input',
        name: 'name',
        message: 'App name:',
        default: path.basename(process.cwd())
      },
      {
        type: 'input',
        name: 'tagline',
        message: 'Tagline:'
      }
    ]);
    
    // Create configuration
    await fs.ensureDir(path.join(process.cwd(), 'src/config'));
    
    const configTemplate = `import { GalaxyConfig } from '@/types/galaxy';

export const galaxyConfig: GalaxyConfig = {
  id: '${answers.name.toLowerCase().replace(/\s+/g, '-')}',
  type: '${answers.type}',
  name: '${answers.name}',
  tagline: '${answers.tagline}',
  colorPalette: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#F59E0B',
    background: '#FFFFFF',
    foreground: '#1F2937',
    muted: '#9CA3AF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  related: []
};`;
    
    await fs.writeFile(configPath, configTemplate);
    
    console.log(chalk.green('✓ Galaxy configuration created!'));
    console.log(chalk.cyan('\nNext steps:'));
    console.log(chalk.dim('  - Review src/config/galaxy.config.ts'));
    console.log(chalk.dim('  - Add theme provider to your app'));
    console.log(chalk.dim('  - Configure features if this is a Core app'));
  });
```

## 🚀 Publishing & Distribution

### Local Development

```bash
# Link for local testing
cd galaxy-cli
npm link

# Test commands
galaxy create test-app
galaxy theme --preview
galaxy add-feature test-feature
```

### Publish to npm

1. **Create npm account** (if you don't have one)
```bash
npm adduser
```

2. **Publish package**
```bash
npm publish --access public
```

3. **Users can install globally**
```bash
npm install -g create-galaxy-app
```

4. **Or use with npx (recommended)**
```bash
npx create-galaxy-app my-app
```

### GitHub Release Automation

**.github/workflows/release.yml**
```yaml
name: Release
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm test
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
      
      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
        with:
          tag_name: ${{github.ref}}
          release_name: Release ${{github.ref}}
          draft: false
          prerelease: false
```

## 📖 Usage Examples

### Basic Usage

```bash
# Interactive mode (recommended)
npx create-galaxy-app

# Create Core app
npx create-galaxy-app my-galaxy --type core

# Create Feature app
npx create-galaxy-app my-feature --type feature --core https://my-galaxy.com

# Skip installation
npx create-galaxy-app my-app --no-install

# Use specific package manager
npx create-galaxy-app my-app --package-manager pnpm
```

### Advanced Commands

```bash
# Initialize existing project
cd existing-project
galaxy init

# Add feature to Core
galaxy add-feature payment-processor --url https://payments.example.com

# Theme management
galaxy theme --preview
galaxy theme --generate

# Deploy (future feature)
galaxy deploy --platform vercel
```

### CLI Workflow Example

```bash
# 1. Create a Core app
npx create-galaxy-app job-tracker-core --type core

# 2. Create Feature apps
npx create-galaxy-app cv-generator --type feature --core http://localhost:3000
npx create-galaxy-app cover-letter-ai --type feature --core http://localhost:3000

# 3. Add features to Core
cd job-tracker-core
galaxy add-feature cv-generator --url http://localhost:3001
galaxy add-feature cover-letter-ai --url http://localhost:3002

# 4. Preview theme
galaxy theme --preview

# 5. Deploy
galaxy deploy --platform vercel
```

## 💡 Best Practices

### 1. User Experience

- **Clear prompts**: Use descriptive questions
- **Smart defaults**: Suggest sensible defaults
- **Progress indicators**: Show what's happening
- **Error messages**: Be helpful, not cryptic
- **Success feedback**: Celebrate completion

### 2. Performance

- **Use degit**: Faster than git clone
- **Parallel operations**: Run independent tasks simultaneously
- **Cache when possible**: Store frequently used data
- **Minimal dependencies**: Keep the CLI lightweight

### 3. Error Handling

```javascript
try {
  // Operation
} catch (error) {
  if (error.code === 'EACCES') {
    console.error(chalk.red('Permission denied. Try running with sudo.'));
  } else if (error.code === 'ENOENT') {
    console.error(chalk.red('File or directory not found.'));
  } else {
    console.error(chalk.red('An error occurred:'), error.message);
  }
  process.exit(1);
}
```

### 4. Testing

**test/cli.test.js**
```javascript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

describe('Galaxy CLI', () => {
  let testDir;
  
  beforeEach(async () => {
    testDir = path.join(os.tmpdir(), 'galaxy-cli-test-' + Date.now());
    await fs.ensureDir(testDir);
    process.chdir(testDir);
  });
  
  afterEach(async () => {
    await fs.remove(testDir);
  });
  
  it('creates a core app', async () => {
    const { stdout } = await execa('galaxy', [
      'create',
      'test-core',
      '--type', 'core',
      '--no-install'
    ]);
    
    expect(stdout).toContain('successfully');
    expect(await fs.pathExists('test-core')).toBe(true);
    
    const config = await fs.readFile(
      'test-core/src/config/galaxy.config.ts',
      'utf-8'
    );
    expect(config).toContain("type: 'core'");
  });
  
  it('creates a feature app', async () => {
    const { stdout } = await execa('galaxy', [
      'create',
      'test-feature',
      '--type', 'feature',
      '--core', 'https://example.com',
      '--no-install'
    ]);
    
    expect(stdout).toContain('successfully');
    
    const config = await fs.readFile(
      'test-feature/src/config/galaxy.config.ts',
      'utf-8'
    );
    expect(config).toContain("type: 'feature'");
    expect(config).toContain('https://example.com');
  });
  
  it('validates project names', async () => {
    await expect(
      execa('galaxy', ['create', '123-invalid'])
    ).rejects.toThrow();
  });
});
```

## 🔮 Future Enhancements

### 1. AI-Powered Features
```javascript
// Generate components with AI
galaxy generate component Button --ai

// Generate color palettes
galaxy theme --ai "corporate professional"
```

### 2. Plugin System
```javascript
// Install plugins
galaxy plugin add @galaxy/auth
galaxy plugin add @galaxy/payments
galaxy plugin add @galaxy/analytics
```

### 3. Template Marketplace
```javascript
// Browse templates
galaxy template browse

// Install community template
galaxy template install ecommerce-suite

// Publish your template
galaxy template publish
```

### 4. Cloud Integration
```javascript
// Deploy to Galaxy Cloud
galaxy deploy

// Manage deployments
galaxy deployments list
galaxy rollback v1.2.3
```

### 5. Team Collaboration
```javascript
// Share configurations
galaxy config share

// Sync with team
galaxy sync --team my-team
```

## 🛡️ Security Considerations

1. **Validate all inputs**: Prevent injection attacks
2. **Use HTTPS for templates**: Ensure secure downloads
3. **Sanitize file paths**: Prevent directory traversal
4. **Check dependencies**: Use npm audit
5. **Secure credentials**: Never log sensitive data

## 📊 Analytics (Optional)

Track anonymous usage to improve the CLI:

```javascript
import analytics from './analytics.js';

// Track command usage
analytics.track('command', {
  command: 'create',
  type: answers.type,
  theme: answers.theme,
  duration: Date.now() - startTime
});

// Track errors
analytics.track('error', {
  command: 'create',
  error: error.message,
  code: error.code
});
```

## 🤝 Contributing

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/galaxy-cli
cd galaxy-cli

# Install dependencies
npm install

# Link for local development
npm link

# Run tests
npm test

# Run in watch mode
npm run dev
```

### Contribution Guidelines

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📝 License

MIT - See LICENSE file for details

---

Build your Galaxy System with confidence and speed! 🌌

For more information:
- [Galaxy Architecture Guide](./GALAXY_ARCHITECTURE_GUIDE.md)
- [Galaxy Configuration Guide](./GALAXY_CONFIGURATION.md)
- [Color Palette Guide](./COLOR_PALETTE_GUIDE.md)
