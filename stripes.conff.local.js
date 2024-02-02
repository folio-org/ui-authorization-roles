module.exports = {
  okapi: {
    // application gateway
    'url': 'https://kong-pbfe2.int.aws.folio.org',
    uiUrl: 'http://localhost:3000',

    // authentication details: url, secret, clientId
    'authnUrl': 'https://keycloak-pbfe2.int.aws.folio.org',
    clientId: 'fs09000000-application',

    // tenant manager: retrieve tenants given a name
    'tenantManagerUrl': 'https://kong-pbfe2.int.aws.folio.org',
    'tenant': 'fs09000000',

    // tenant entitlement: retrieve apps affiliated with a tenant
    'tenantEntitlementUrl': 'https://kong-pbfe2.int.aws.folio.org',

    // application details: retrieve application details (including modules and their full descriptors)
    'applicationManagerUrl': 'https://kong-pbfe2.int.aws.folio.org',
  },
  config: {
    hasAllPerms: true,
    logCategories: 'core,path,action,xhr',
    logPrefix: '--',
    maxUnpagedResourceCount: 2000,
    isSingleTenant: true,
    showPerms: false,
  },
  modules: {
    '@folio/authorization-roles': {},
    '@folio/plugin-select-application' : {},
  },

  branding: {
    logo: {
      src: './tenant-assets/opentown-libraries-logo.png',
      alt: 'Opentown Libraries',
    },
    favicon: {
      src: './tenant-assets/folio-favicon.png',
    },
    style:{
      mainNav:{}
    }
  },

};
