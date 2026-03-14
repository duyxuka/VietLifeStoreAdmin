import { Environment } from '@abp/ng.core';

const baseUrl = 'http://42.96.61.186:8090';

const oAuthConfig = {
  issuer: 'http://42.96.61.186:8090/',
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
      url: 'http://42.96.61.186:8090',
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
