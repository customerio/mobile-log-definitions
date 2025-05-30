<p align=center>
  <a href="https://customer.io">
    <img src="https://avatars.githubusercontent.com/u/1152079?s=200&v=4" height="60">
  </a>
</p>

# 📦 Mobile Log Definitions

A structured, testable system for defining, validating, and documenting logging events using [Jsonnet](https://jsonnet.org/).

---

## 🧭 Overview

This repository provides a **central source of truth** for CIO mobile SDKs log definitions across features and platforms.

- Each feature has its own `.jsonnet` definition under `features/<feature-name>/`
- These files are compiled into machine-readable `.json` files
- Each feature has a corresponding docs generated under `/docs` directory
- Unit tests verify the structure and content of each feature’s output `.json` files

---

## 📁 Project structure

```
.
├── features/                   # Jsonnet definitions per feature
│   ├── push/
│   │   └── push.jsonnet
│   ├── init/
│   │   └── core.jsonnet
│   └── ...
├── generated/                 # Compiled JSON output
│   └── json/
│       └── push/
│           └── push.json
│   └── mermaid/
│       └── push/
│           └── push.mmd
├── docs/                      # Docs for each feature
│   ├── ...
├── scripts/                   # Helper scripts
│   ├── ...
├── __tests__/                 # Jest unit tests per feature
│   ├── ...
```

---

## 🚀 Getting started

### 1. Install requirements

Install dependencies for building and testing:

```bash
brew install jsonnet
npm install
```

### 2. Build JSON files

Run the build script to generate `.json` files from all `.jsonnet` files in the `features/` directory:

```bash
npm run generateJson
```

### 3. Build Mermaid diagrams

Run the build script to generate `.mmd` diagrams from all `.json` files in the `generated/json` directory:

```bash
npm run generateDiagrams
```

### 4. Build feature docs

Run the build script to generate `.md` docs from all `.json` files in the `generated/json` directory:

```bash
npm run generateMarkdownDocs
```

### 5. Validate output completeness

Check that all `.jsonnet` files have corresponding `.json` outputs:

```bash
npm run validateGeneration
```

You can also run `npm run generate` to generate all JSON, Mermaid diagrams and docs using a single convenience command.

---

## 🧪 Adding or updating a feature

To define a new logging feature:

1. Create a `.jsonnet` file under `features/<your-feature>/`
2. Run `npm run generateJson` to generate the `.json` file
3. Run `npm run generateDiagrams` to generate the `.mmd` file
4. Run `npm run generateMarkdownDocs` to generate `.md` docs files
5. Add a test under `__tests__/<your-feature>.test.js`
6. Run `npm test` to validate

---

## ✅ Testing

Each `.jsonnet` feature must have a corresponding Jest test file under `__tests__/` that:

- Verifies required keys
- Checks for uniqueness of IDs
- Ensures optional fields like `success`, `error`, `next` are valid if present

Run all tests:

```bash
npm test
```

---

## 📄 License

MIT
