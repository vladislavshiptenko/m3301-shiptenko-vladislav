import SuperTokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Dashboard from 'supertokens-node/recipe/dashboard';

export const superTokensConfig = {
  framework: 'express' as const,
  supertokens: {
    connectionURI:
      process.env.SUPERTOKENS_CONNECTION_URI || 'https://try.supertokens.com',
    apiKey: process.env.SUPERTOKENS_API_KEY,
  },
  appInfo: {
    appName: process.env.APP_NAME || 'Development App',
    apiDomain: process.env.API_DOMAIN || 'http://localhost:5000',
    websiteDomain: process.env.WEBSITE_DOMAIN || 'http://localhost:5000',
    apiBasePath: '/api/supertokens',
    websiteBasePath: '/auth',
  },
  recipeList: [
    EmailPassword.init(),
    Session.init({
      cookieSecure: process.env.NODE_ENV === 'production',
      getTokenTransferMethod: () => 'cookie',
    }),
    Dashboard.init(),
  ],
};

SuperTokens.init(superTokensConfig);
