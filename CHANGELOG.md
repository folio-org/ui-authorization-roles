# Change history for ui-authorization-roles

## 1.4.0 IN PROGRESS

* Server-side query sort (temporary, lacking i18n).
* Clean up `package.json` cruft etc. Refs UIROLES-57.
* Correctly assign/unassign users to roles. Refs UIROLES-63, UIROLES-43.
* Fix capabilities/sets not sorted by "Resource" value when creating/editing an authorization role. Refs UIROLES-70.
* Fix Patron group not always shown for assigned users in detailed view of authorization role. Refs UIROLES-52.
* Use `<NoValue>` to represent unselected checkboxes in read-only mode. Refs UIROLES-41.
* Show user name instead of UUID in Role Detail page. Refs UIROLES-71.
* Show ID of role in URL path when viewing role details. Refs UIROLES-46.

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

