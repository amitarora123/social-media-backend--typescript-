import { startGraphqlServer } from './graphql';
import config from './config/config';

startGraphqlServer(config.port);
