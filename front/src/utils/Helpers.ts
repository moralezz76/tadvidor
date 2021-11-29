import { IGenericObject } from '../config/interfaces';
import routes from '../config/routesAndViews';
import _ from 'lodash';

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const removeKey = (obj: IGenericObject, id: string) => {
  return Object.keys(obj).reduce((ret, i) => {
    return { ...ret, ...(i !== id && { [i]: obj[i] }) };
  }, {});
};

export const buildPathWithParams = (path: string, params: any) => {
  let finalPath = path;
  Object.keys(params).forEach(key => {
    finalPath = finalPath.replace(`:${key}`, params[key]);
  });

  return finalPath.replace(/\([^)(]*\)/, '');
  //return finalPath.replace(/\([^\)\(]*\)/, '');
};

export const decodeURItoJson = (data: string) => {
  try {
    return JSON.parse(atob(data.split(',')[1]));
  } catch (e) {
    return null;
  }
};

export const decodeTextToScatter = (_data: string) => {
  let data = atob(_data.split(',')[1]);
  try {
    if (data.length === 0) throw new Error('');
    const pt = data.split('\n');
    const line1pt = pt[0].split(' ');
    if (line1pt.length !== 4) throw new Error('');
    return line1pt;
  } catch (e) {
    return null;
  }
};

export const isPrefix = (prefix: string): boolean => {
  if (prefix) {
    const pt = prefix.split('/');
    const [ip, sec] = pt;
    const ptip = ip.split('.');
    const areDiff = [...ptip, sec].reduce((ret, item) => {
      return ret || item !== parseInt(item).toString();
    }, false);

    if (!sec || areDiff || ptip.length !== 4) return false;
  }
  return true;
};

export const firstKeyOf = (data: IGenericObject, level = 1, current = 1): any => {
  const [first] = Object.keys(data);
  if (level === current) return data[first];
  return firstKeyOf(data[first], level, current + 1);
};

const findPath = (path: any, ret: any = []): [] => {
  const routeIndex: any = Object.keys(routes).find((i: any) => routes[i].path === path);
  const inRoutes = routes[routeIndex];
  const { breadcrumbsTitle = `breadcrumb${_.capitalize(routeIndex)}`, parent } = inRoutes;
  ret = [
    {
      breadcrumbsTitle,
      path,
    },
    ...ret,
  ];
  return parent ? findPath(routes[parent].path, ret) : ret;
};

export const getPath = (p: any) => {
  //console.log(p);
  return findPath(p);
};

export const isEqual = (s1: any, s2: any) => {
  return s1 && s2 && s1.toString().toLowerCase() === s2.toString().toLowerCase();
};

export const C = {
  _FORCE_VALUE: 'FORCE_VALUE',
  _DATA: 'data',
  _FIXED: 'fixed',
};

export const IsDev: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const getCodePath = (source: any, find_str: string) => {
  const ret = findCountryCode(source, find_str, []);

  //remove '' & last (code)
  return ret.filter((i: any, n: number) => i !== '' && n !== ret.length - 1);
};

const findCountryCode = (obj: any, code: string, ret: string[]) => {
  let find: any = '';
  let _ret: any = [];
  Object.keys(obj).forEach((key: any) => {
    const v = obj[key];
    if (typeof v === 'string') {
      console.log(v, code);
      if (code.toLowerCase() === v.toLowerCase()) {
        find = [key, v];
        return false;
      }
    } else {
      const nx = findCountryCode(v, code, [...ret, key]);
      if (nx.length > 0) {
        _ret = nx;
        return false;
      }
    }
  });

  if (_ret.length) return _ret;
  if (find) return [...ret, ...find];
  return [];
};

export const CountryZones = {
  Global: {
    Europe: {
      'Western Europe': {
        Andorra: 'AD',
        Austria: 'AT',
        'Aland Islands': 'AX',
        Belgium: 'BE',
        Switzerland: 'CH',
        Cyprus: 'CY',
        Czechia: 'CZ',
        Germany: 'DE',
        Denmark: 'DK',
        Spain: 'ES',
        Finland: 'FI',
        'Faroe Islands': 'FO',
        France: 'FR',
        'Great Britain': 'GB',
        Guernsey: 'GG',
        Gibraltar: 'GI',
        Greenland: 'GL',
        Greece: 'GR',
        Croatia: 'HR',
        Ireland: 'IE',
        'Isle of Man': 'IM',
        Iceland: 'IS',
        Italy: 'IT',
        Jersey: 'JE',
        Liechtenstein: 'LI',
        Luxembourg: 'LU',
        Monaco: 'MC',
        Netherlands: 'NL',
        Norway: 'NO',
        Portugal: 'PT',
        Sweden: 'SE',
        'San Marino': 'SM',
        'Holy See': 'VA',
      },
      'Eastern Europe': {
        Albania: 'AL',
        'Bosnia and Herzegovina': 'BA',
        Bulgaria: 'BG',
        Belarus: 'BY',
        Estonia: 'EE',
        Hungary: 'HU',
        Lithuania: 'LT',
        Latvia: 'LV',
        Moldova: 'MD',
        Montenegro: 'ME',
        'North Macedonia': 'MK',
        Poland: 'PL',
        Romania: 'RO',
        Serbia: 'RS',
        Russia: 'RU',
        Slovenia: 'SI',
        Slovakia: 'SK',
        Ukraine: 'UA',
      },
    },
    Asia: {
      'Middle East': {
        UAE: 'AE',
        Bahrain: 'BH',
        Israel: 'IL',
        Iraq: 'IQ',
        Iran: 'IR',
        Jordan: 'JO',
        Kuwait: 'KW',
        Lebanon: 'LB',
        Oman: 'OM',
        Palestine: 'PS',
        Qatar: 'QA',
        'Saudi Arabia': 'SA',
        Syria: 'SY',
        Turkey: 'TR',
        Yemen: 'YE',
      },
      'Central Asia': {
        Afghanistan: 'AF',
        Armenia: 'AM',
        Azerbaijan: 'AZ',
        Georgia: 'GE',
        Kyrgyzstan: 'KG',
        Kazakhstan: 'KZ',
        Mongolia: 'MN',
        Tajikistan: 'TJ',
        Turkmenistan: 'TM',
        Uzbekistan: 'UZ',
      },
      'South Asia': {
        Bangladesh: 'BD',
        Bhutan: 'BT',
        India: 'IN',
        'British Indian Ocean Territory': 'IO',
        'Sri Lanka': 'LK',
        Maldives: 'MV',
        Nepal: 'NP',
        Pakistan: 'PK',
      },
      'Southeast Asia': {
        'Brunei Darussalam': 'BN',
        Indonesia: 'ID',
        Cambodia: 'KH',
        Laos: 'LA',
        Myanmar: 'MM',
        Malaysia: 'MY',
        Singapore: 'SG',
        Thailand: 'TH',
        'Timor-Leste': 'TL',
        Vietnam: 'VN',
      },
      'East Asia': {
        China: 'CN',
        'Hong Kong': 'HK',
        Japan: 'JP',
        'North Korea': 'KP',
        'South Korea': 'KR',
        Macao: 'MO',
        Philippines: 'PH',
        Taiwan: 'TW',
      },
    },
    'North America': {
      Caribbean: {
        'Antigua and Barbuda': 'AG',
        Anguilla: 'AI',
        Aruba: 'AW',
        Barbados: 'BB',
        'Saint Barthelemy': 'BL',
        Bermuda: 'BM',
        Bonaire: 'BQ',
        Bahamas: 'BS',
        Cuba: 'CU',
        Curacao: 'CW',
        Dominica: 'DM',
        'Dominican Republic': 'DO',
        Grenada: 'GD',
        Guadeloupe: 'GP',
        Haiti: 'HT',
        Jamaica: 'JM',
        'Saint Kitts and Nevis': 'KN',
        'Cayman Islands': 'KY',
        'Saint Lucia': 'LC',
        'Saint Martin': 'MF',
        Martinique: 'MQ',
        Montserrat: 'MS',
        Malta: 'MT',
        'Puerto Rico': 'PR',
        'Sint Maarten': 'SX',
        'Turks and Caicos Islands': 'TC',
        'Trinidad and Tobago': 'TT',
        'Saint Vincent and the Grenadines': 'VC',
        'Virgin Islands (British)': 'VG',
        'Virgin Islands (U.S.)': 'VI',
      },
      'Central America': {
        Belize: 'BZ',
        'Costa Rica': 'CR',
        Guatemala: 'GT',
        Honduras: 'HN',
        Nicaragua: 'NI',
        Panama: 'PA',
        'El Salvador': 'SV',
      },
      '': {
        Canada: 'CA',
        Mexico: 'MX',
        'Saint Pierre and Miquelon': 'PM',
        'United States': 'US',
      },
    },
    Africa: {
      'Sub-Saharan Africa': {
        Angola: 'AO',
        Botswana: 'BW',
        'Democratic Republic of the Congo': 'CD',
        'Central African Republic': 'CF',
        'Congo-Brazzaville': 'CG',
        Cameroon: 'CM',
        Gabon: 'GA',
        'Equatorial Guinea': 'GQ',
        Lesotho: 'LS',
        Madagascar: 'MG',
        Mauritius: 'MU',
        Malawi: 'MW',
        Mozambique: 'MZ',
        Namibia: 'NA',
        Réunion: 'RE',
        Rwanda: 'RW',
        Eswatini: 'SZ',
        'French Southern Territories': 'TF',
        Mayotte: 'YT',
        'South Africa': 'ZA',
        Zambia: 'ZM',
        Zimbabwe: 'ZW',
      },
      'West Africa': {
        'Burkina Faso': 'BF',
        Benin: 'BJ',
        'Ivory Coast': 'CI',
        'Cabo Verde': 'CV',
        Djibouti: 'DJ',
        Ghana: 'GH',
        Gambia: 'GM',
        Guinea: 'GN',
        'Guinea-Bissau': 'GW',
        Liberia: 'LR',
        Mali: 'ML',
        Mauritania: 'MR',
        Niger: 'NE',
        Nigeria: 'NG',
        'Sierra Leone': 'SL',
        Senegal: 'SN',
        'Sao Tome and Principe': 'ST',
        Togo: 'TG',
      },
      'North Africa': {
        Algeria: 'DZ',
        Egypt: 'EG',
        Libya: 'LY',
        Morocco: 'MA',
        Sudan: 'SD',
        Chad: 'TD',
        Tunisia: 'TN',
      },
      'East Africa': {
        Eritrea: 'ER',
        Ethiopia: 'ET',
        Kenya: 'KE',
        Comoros: 'KM',
        Seychelles: 'SC',
        Somalia: 'SO',
        'South Sudan': 'SS',
        Tanzania: 'TZ',
        Uganda: 'UG',
      },
    },
    Antarctica: {
      '': {
        Antarctica: 'AQ',
      },
    },
    'South America': {
      '': {
        Argentina: 'AR',
        Bolivia: 'BO',
        Brazil: 'BR',
        Chile: 'CL',
        Colombia: 'CO',
        Ecuador: 'EC',
        'Falkland Islands': 'FK',
        'French Guiana': 'GF',
        Guyana: 'GY',
        Peru: 'PE',
        Paraguay: 'PY',
        Suriname: 'SR',
        Uruguay: 'UY',
        Venezuela: 'VE',
      },
    },
    Oceania: {
      '': {
        'American Samoa': 'AS',
        Australia: 'AU',
        'Cook Islands': 'CK',
        'Christmas Island': 'CX',
        Fiji: 'FJ',
        Micronesia: 'FM',
        Guam: 'GU',
        Kiribati: 'KI',
        'Marshall Islands': 'MH',
        'Northern Mariana Islands': 'MP',
        'New Caledonia': 'NC',
        'Norfolk Island': 'NF',
        Nauru: 'NR',
        Niue: 'NU',
        'New Zealand': 'NZ',
        'French Polynesia': 'PF',
        'Papua New Guinea': 'PG',
        Palau: 'PW',
        'Solomon Islands': 'SB',
        Tokelau: 'TK',
        Tonga: 'TO',
        Tuvalu: 'TV',
        'United States Minor Outlying Islands': 'UM',
        Vanuatu: 'VU',
        'Wallis and Futuna': 'WF',
        Samoa: 'WS',
      },
    },
  },
};

export const MenuRankings = {
  AllRankings: {
    CustomerBase: {
      Retail: 'retail',
      Wholesale: 'wholesale',
      Backbone: 'backbone',
    },
    CustomerGrowth: 'customer_growth',
    PeeringBase: 'peering_base',
  },
};
