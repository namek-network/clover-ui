import { TokenType } from './types';

const CLV: TokenType = { id: 0, name: 'CLV', logo: require('../../assets/images/icon-bxb.svg') };
const CUSDT: TokenType = { id: 1, name: 'CUSDT', logo: require('../../assets/images/icon-busd.svg') };
const DOT: TokenType = { id: 2, name: 'DOT', logo: require('../../assets/images/icon-dot.svg') };
const CETH: TokenType = { id: 3, name: 'CETH', logo: require('../../assets/images/icon-beth.svg') };

/**
 * TODO: Delete.
 * Do not use this hard-coded ones. This should only be used for testing
 */
export default [CLV, CUSDT, DOT, CETH];
