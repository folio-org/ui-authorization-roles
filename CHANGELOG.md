# Change history for ui-authorization-roles

## 1.4.0 IN PROGRESS

* Server-side query sort (temporary, lacking i18n).

## [1.3.0](https://github.com/folio-org/ui-authorization-roles/tree/v1.3.0) (2024-03-05)
[Full Changelog](https://github.com/folio-org/ui-authorization-roles/compare/v1.2.0...v1.3.0)

* View role capability sets. Refs UIROLES-30.
* List users assigned to a given role. Refs UIROLES-31.
* Retrieve up to 5000 capabilities at once. Refs UIROLES-47.
* Include `settings.authorization-roles.enabled` permission set. Refs UIROLES-54. 
* Add ability to Assign/unassign roles to users in role details pane. Refs UIROLES-43.
* Show spinner while loading capabilities/capabilitySets tables. Refs UIROLES-42
* Show capabilities/capability sets depending on selected applications. Refs UIROLES-40.
* Include `settings.authorization-roles.enabled` permission set. Refs UIROLES-54.
* Fix error when updating only name/description for authorization role. Refs UIROLES-62.
* Replace `roleCapabilitiesListIds` with `roleCapabilitySetsListIds` as intersecting list in the `updatedSelectedCapabilitySetsMap` variable within the `useApplicationCapabilities` hook. Refs UIROLES-59.


## 1.2.0

* First release.

