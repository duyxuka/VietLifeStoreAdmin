import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44385/',
  redirectUri: baseUrl,
  clientId: 'VietlifeStore_App',
  dummyClientSecret:'1q2w3e*',
  responseType: 'code',
  scope: 'offline_access VietlifeStore',
  requireHttps: false,
  useRefreshToken: true,
};

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'VietLife',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://localhost:44385',
      rootNamespace: 'VietlifeStore',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
  localization: {
    defaultResourceName: 'VietLife',
    supportedLocales: ['en', 'vi'],
  },
} as Environment;
