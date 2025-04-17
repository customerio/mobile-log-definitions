<p align=center>
  <a href="https://customer.io">
    <img src="https://avatars.githubusercontent.com/u/1152079?s=200&v=4" height="60">
  </a>
</p>

# 📘 Log Definition Source of Truth

A centralized system for defining, managing, and documenting log events across features and platforms.

---

## 🔍 Overview

This repository provides a **single source of truth** for all Mobile SDKs console log events used in our codebase. Each feature has its own log definition, and all definitions are written in **Jsonnet**, allowing for modular, DRY (Don't Repeat Yourself) design.

The workflow automates generation of:
- **JSON** artifacts for machine-readable log definitions
- **Notion documentation** with clear descriptions and **Mermaid diagrams**
