import _ from 'lodash';
import BxbIcon from '../../assets/images/icon-bxb.svg';
import BethIcon from '../../assets/images/icon-beth.svg';
import BusdIcon from '../../assets/images/icon-busd.svg';
import BdotIcon from '../../assets/images/icon-dot.svg';

export function getAddress (addr: string) {
    if (_.size(addr) < 17) {
      return addr
    }

    const prefix = addr.substring(0, 11)
    const suffix = addr.substring(_.size(addr) - 4, _.size(addr))

    return `${prefix}..${suffix}`
  }

export const tokenTypes = [
    {
      name: 'BXB',
      icon: BxbIcon
    }, {
      name: 'BUSD',
      icon: BusdIcon
    }, {
      name: 'DOT',
      icon: BdotIcon
    }, {
      name: 'BETH',
      icon: BethIcon
    }
  ];