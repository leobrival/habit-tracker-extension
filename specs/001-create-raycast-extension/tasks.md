# Tasks: Create Raycast Extension

**Input**: Design documents from `/specs/001-create-raycast-extension/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Raycast extension structure with TypeScript and React components

## Phase 3.1: Setup

- [x] T001 Create Raycast extension project structure with package.json manifest
- [x] T002 Initialize TypeScript configuration with strict mode and Raycast API types
- [x] T003 [P] Configure ESLint with @raycast/eslint-config and Prettier formatting
- [x] T004 [P] Set up assets directory structure with extension and command icons
- [x] T005 [P] Create README.md with extension documentation and usage guide

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] T006 [P] Contract test for extension manifest validation in tests/contract/test_extension_manifest.ts
- [x] T007 [P] Contract test for TypeScript configuration validation in tests/contract/test_typescript_config.ts
- [x] T008 [P] Integration test for extension loading in Raycast in tests/integration/test_extension_loading.ts
- [x] T009 [P] Integration test for command execution workflow in tests/integration/test_command_workflow.ts
- [x] T010 [P] Integration test for preferences configuration in tests/integration/test_preferences.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [x] T011 [P] ExtensionManifest type definitions in src/types.ts
- [x] T012 [P] Command type definitions and interfaces in src/types.ts
- [x] T013 [P] Preference configuration types in src/types.ts
- [x] T014 [P] Main authentication command component in src/auth.tsx
- [x] T015 [P] Dashboard command component in src/dashboard.tsx
- [x] T016 [P] Authentication service with session management in src/auth-service.ts
- [x] T017 [P] Shared logout action utility in src/logout-action.ts

## Phase 3.4: Configuration & Assets

- [x] T018 Implement package.json manifest with commands and preferences configuration
- [x] T019 Configure tsconfig.json with Raycast extension TypeScript settings
- [x] T020 Set up .eslintrc.json with Raycast-specific linting rules
- [x] T021 [P] Add extension icon PNG file in assets/extension-icon.png
- [x] T022 [P] Add command-specific icons in assets/command-icons/

## Phase 3.5: Development Tooling

- [x] T023 [P] Create development scripts for ray develop in package.json
- [x] T024 [P] Create build scripts for ray build in package.json
- [x] T025 [P] Create linting scripts for ray lint in package.json
- [x] T026 [P] Create publishing scripts for ray publish in package.json

## Phase 3.6: Integration & Error Handling

- [x] T027 Implement error handling with Toast notifications using @raycast/api
- [x] T028 Add state persistence using Raycast LocalStorage utilities
- [x] T029 Implement keyboard navigation and shortcuts for optimal UX
- [x] T030 Add loading states and performance optimizations (<200ms response)

## Phase 3.7: Polish & Validation

- [x] T031 [P] Unit tests for authentication service in tests/unit/test_auth_service.ts
- [x] T032 [P] Unit tests for command components in tests/unit/test_commands.ts
- [x] T033 [P] Unit tests for type definitions in tests/unit/test_types.ts
- [x] T034 Performance validation tests ensuring <300ms extension startup
- [x] T035 Store submission validation using ray publish --validate
- [x] T036 [P] Update CLAUDE.md with extension development patterns
- [x] T037 Manual testing following quickstart.md validation steps

## Dependencies

- Setup (T001-T005) before everything
- Tests (T006-T010) before implementation (T011-T017)
- Core types (T011-T013) before components (T014-T017)
- Configuration (T018-T020) after core implementation
- Assets (T021-T022) can be parallel with other phases
- Development tooling (T023-T026) after configuration
- Integration (T027-T030) after core features complete
- Polish and validation (T031-T037) at the end

## Parallel Example

```
# Launch contract tests together:
Task: "Contract test for extension manifest validation in tests/contract/test_extension_manifest.js"
Task: "Contract test for TypeScript configuration validation in tests/contract/test_typescript_config.js"
Task: "Integration test for extension loading in Raycast in tests/integration/test_extension_loading.js"
Task: "Integration test for command execution workflow in tests/integration/test_command_workflow.js"
Task: "Integration test for preferences configuration in tests/integration/test_preferences.js"
```

## Notes

- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Follow Raycast extension development best practices
- Ensure constitutional compliance: Type Safety, UX Priority, Performance standards

## Validation Checklist

_GATE: Checked by main() before returning_

- [x] All contracts have corresponding tests
- [x] All entities have model tasks
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
