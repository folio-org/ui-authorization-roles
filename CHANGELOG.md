# Change history for ui-authorization-roles

## 1.6.0 IN PROGRESS

* Show modifying users' names instead of IDs. Refs UIROLES-71.
* Use `Capabilities` components from `stripes-authorization-components` repository instead of local files. Refs UIROLES-86.
* Include `stripes-authorization-components` in `stripesDeps` to pull its assets into the bundle. Refs UIROLES-102.
* Duplicate authorization roles. Refs UIROLES-64.
* Add missed permission to see list of capabilities set on Edit role page. Refs UIROLES-115.
* Create separate capability sets for CRUD actions with authorization roles in UI. Refs UIROLES-112.

## [1.5.0](https://github.com/folio-org/ui-authorization-roles/tree/v1.5.0) (2024-05-27)
[Full Changelog](https://github.com/folio-org/ui-authorization-roles/compare/v1.4.0...v1.5.0)

* Fix Patron group not always shown for assigned users in detailed view of authorization role. Refs UIROLES-52.
* Use `<NoValue>` to represent unselected checkboxes in read-only mode. Refs UIROLES-41.
* Show user name instead of UUID in Role Detail page. Refs UIROLES-71.
* Show spinner while loading capabilities/capabilitySets tables after selecting applications. Refs UIROLES-60.
* Show callout instead of JS alert on save/delete error. Refs UIROLES-53.
* Role details should show capabilities inherited from capability-sets. Refs UIROLES-67.
* Handle empty `metadata` values without invalid `/users/` API queries. Refs UIROLES-78.
* Use Save & close button label stripes-component translation key. Refs UIROLES-61.

## [1.4.0](https://github.com/folio-org/ui-authorization-roles/tree/v1.4.0) (2024-04-26)
[Full Changelog](https://github.com/folio-org/ui-authorization-roles/compare/v1.3.0...v1.4.0)

* Server-side query sort (temporary, lacking i18n).
* Clean up `package.json` cruft etc. Refs UIROLES-57.
* Correctly assign/unassign users to roles. Refs UIROLES-63, UIROLES-43.
* Fix capabilities/sets not sorted by "Resource" value when creating/editing an authorization role. Refs UIROLES-70.

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

