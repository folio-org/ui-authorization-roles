# Change history for ui-authorization-roles

## [1.3.3](https://github.com/folio-org/ui-authorization-roles/tree/v1.3.3) (2024-04-16)
[Full Changelog](https://github.com/folio-org/ui-authorization-roles/compare/v1.3.2...v1.3.3)

* Bugfix: handle large users-per-role queries via `useChunkedCQLFetch` and `Use ChunkedCQL for request`. Refs UIROLES-43.

## [1.3.2](https://github.com/folio-org/ui-authorization-roles/tree/v1.3.2) (2024-04-15)
[Full Changelog](https://github.com/folio-org/ui-authorization-roles/compare/v1.3.1...v1.3.2)

* Fix error when updating only name/description for authorization role. Refs UIROLES-62.
* Replace `roleCapabilitiesListIds` with `roleCapabilitySetsListIds` as intersecting list in the `updatedSelectedCapabilitySetsMap` variable within the `useApplicationCapabilities` hook. Refs UIROLES-59.

## [1.3.1](https://github.com/folio-org/ui-authorization-roles/tree/v1.3.1) (2024-03-26)
[Full Changelog](https://github.com/folio-org/ui-authorization-roles/compare/v1.3.0...v1.3.1)

* Also support `capability-sets` `2.0`. Refs UIROLES-65.

* Server-side query sort (temporary, lacking i18n).

## [1.3.0](https://github.com/folio-org/ui-authorization-roles/tree/v1.3.0) (2024-03-05)
[Full Changelog](https://github.com/folio-org/ui-authorization-roles/compare/v1.2.0...v1.3.0)

* View role capability sets. Refs UIROLES-30.
* List users assigned to a given role. Refs UIROLES-31.
* Retrieve up to 5000 capabilities at once. Refs UIROLES-47.
* Add ability to Assign/unassign roles to users in role details pane. Refs UIROLES-43.
* Show spinner while loading capabilities/capabilitySets tables. Refs UIROLES-42
* Show capabilities/capability sets depending on selected applications. Refs UIROLES-40.
* Include `settings.authorization-roles.enabled` permission set. Refs UIROLES-54.

## 1.2.0

* First release.

