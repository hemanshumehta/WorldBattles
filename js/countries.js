// countries.js — Country data (no ES modules, works with file://)

var REGIONS = {
  AMERICAS:    'Americas',
  EUROPE:      'Europe',
  ASIA:        'Asia',
  AFRICA:      'Africa',
  OCEANIA:     'Oceania',
  MIDDLE_EAST: 'Middle East',
};

// ── Territory mapping ─────────────────────────────────────────────────────────
// Maps sovereign country ISO numeric id → array of territory ISO numeric ids
// that should light up on the map when the parent country is claimed.
// Only territories visible at 110m scale are included.
var TERRITORIES = {
  208: [304],           // Denmark → Greenland
  250: [254, 540, 258], // France → French Guiana, New Caledonia, French Polynesia
  826: [238],           // United Kingdom → Falkland Islands
  840: [630],           // United States → Puerto Rico
  578: [744],           // Norway → Svalbard
};

function getTerritoryIds(countryId) {
  return TERRITORIES[+countryId] || [];
}

var COUNTRIES_RAW = [
  // ── AMERICAS ──────────────────────────────────────────────────────────────
  { id: 32,  name: 'Argentina',              capital: 'Buenos Aires', capitalAliases: ['buenos aires'], aliases: ['argentine republic', 'argentia', 'argenteena'],       region: 'Americas' },
  { id: 84,  name: 'Belize',                 capital: 'Belmopan', capitalAliases: ['belmopan'], aliases: ['belieze', 'beleze'],                                   region: 'Americas' },
  { id: 68,  name: 'Bolivia',                capital: 'Sucre', capitalAliases: ['sucre', 'la paz'], aliases: ['plurinational state of bolivia', 'bolivea'],           region: 'Americas' },
  { id: 76,  name: 'Brazil',                 capital: 'Brasilia', capitalAliases: ['brasilia'], aliases: ['brasil', 'federative republic of brazil', 'brazeel'], region: 'Americas' },
  { id: 124, name: 'Canada',                 capital: 'Ottawa', capitalAliases: ['ottawa'], aliases: [],                                                       region: 'Americas' },
  { id: 152, name: 'Chile',                  capital: 'Santiago', capitalAliases: ['santiago'], aliases: ['republic of chile', 'chilee'],                         region: 'Americas' },
  { id: 170, name: 'Colombia',               capital: 'Bogota', capitalAliases: ['bogota'], aliases: ['republic of colombia', 'columbia', 'kolumbia'],        region: 'Americas' },
  { id: 188, name: 'Costa Rica',             capital: 'San Jose', capitalAliases: ['san jose'], aliases: ['costa rika', 'costarica'],                             region: 'Americas' },
  { id: 192, name: 'Cuba',                   capital: 'Havana', capitalAliases: ['havana'], aliases: ['republic of cuba'],                                     region: 'Americas' },
  { id: 214, name: 'Dominican Republic',     capital: 'Santo Domingo', capitalAliases: ['santo domingo'], aliases: ['dominican rep', 'dr', 'dominica republic', 'the dominican republic'], region: 'Americas' },
  { id: 218, name: 'Ecuador',                capital: 'Quito', capitalAliases: ['quito'], aliases: ['republic of ecuador', 'equador', 'ekwador'],           region: 'Americas' },
  { id: 222, name: 'El Salvador',            capital: 'San Salvador', capitalAliases: ['san salvador'], aliases: ['salvador', 'el salvador'],                             region: 'Americas' },
  { id: 320, name: 'Guatemala',              capital: 'Guatemala City', capitalAliases: ['guatemala city'], aliases: ['republic of guatemala', 'gwatemala', 'guatamala'],     region: 'Americas' },
  { id: 328, name: 'Guyana',                 capital: 'Georgetown', capitalAliases: ['georgetown'], aliases: ['co-operative republic of guyana', 'guy ana', 'giana', 'gee ana', 'guiana'], region: 'Americas' },
  { id: 332, name: 'Haiti',                  capital: 'Port-au-Prince', capitalAliases: ['port au prince'], aliases: ['republic of haiti', 'hayti', 'hate e'],                region: 'Americas' },
  { id: 340, name: 'Honduras',               capital: 'Tegucigalpa', capitalAliases: ['tegucigalpa'], aliases: ['republic of honduras', 'hondooras'],                   region: 'Americas' },
  { id: 388, name: 'Jamaica',                capital: 'Kingston', capitalAliases: ['kingston'], aliases: ['jamaika', 'ja may ca'],                                 region: 'Americas' },
  { id: 484, name: 'Mexico',                 capital: 'Mexico City', capitalAliases: ['mexico city'], aliases: ['mexican united states', 'mejico', 'mehico'],           region: 'Americas' },
  { id: 558, name: 'Nicaragua',              capital: 'Managua', capitalAliases: ['managua'], aliases: ['republic of nicaragua', 'nick a rag wa', 'nicarawa', 'nicaragua wa', 'nickaragua'], region: 'Americas' },
  { id: 591, name: 'Panama',                 capital: 'Panama City', capitalAliases: ['panama city'], aliases: ['republic of panama', 'pan ama'],                       region: 'Americas' },
  { id: 600, name: 'Paraguay',               capital: 'Asuncion', capitalAliases: ['asuncion'], aliases: ['republic of paraguay', 'para gway', 'para guy', 'parragway'], region: 'Americas' },
  { id: 604, name: 'Peru',                   capital: 'Lima', capitalAliases: ['lima'], aliases: ['republic of peru', 'perou'],                           region: 'Americas' },
  { id: 740, name: 'Suriname',               capital: 'Paramaribo', capitalAliases: ['paramaribo'], aliases: ['republic of suriname', 'surinam', 'surry nam', 'suri name', 'surinam', 'suri nam'], region: 'Americas' },
  { id: 780, name: 'Trinidad and Tobago',    capital: 'Port of Spain', capitalAliases: ['port of spain'], aliases: ['trinidad', 'tobago', 'trinidad & tobago', 'trinidad tobago', 'trinidad to bay go', 'to bay go'], region: 'Americas' },
  { id: 840, name: 'United States',          capital: 'Washington, D.C.', capitalAliases: ['washington', 'washington dc', 'dc'], aliases: ['usa', 'us', 'america', 'united states of america'],   region: 'Americas' },
  { id: 858, name: 'Uruguay',                capital: 'Montevideo', capitalAliases: ['montevideo'], aliases: ['oriental republic of uruguay', 'you roo gway', 'urugway', 'uragway', 'uru gway'], region: 'Americas' },
  { id: 862, name: 'Venezuela',              capital: 'Caracas', capitalAliases: ['caracas'], aliases: ['bolivarian republic of venezuela', 'venezuala', 'venezuala', 'vena zuela', 'venny zwela'], region: 'Americas' },

  // ── EUROPE ────────────────────────────────────────────────────────────────
  { id: 8,   name: 'Albania',                capital: 'Tirana', capitalAliases: ['tirana'], aliases: ['republic of albania', 'al bania'],                    region: 'Europe' },
  { id: 40,  name: 'Austria',                capital: 'Vienna', capitalAliases: ['vienna'], aliases: ['republic of austria', 'ostria'],                      region: 'Europe' },
  { id: 112, name: 'Belarus',                capital: 'Minsk', capitalAliases: ['minsk'], aliases: ['republic of belarus', 'byelorussia', 'bella roose', 'bell a ruse'], region: 'Europe' },
  { id: 56,  name: 'Belgium',                capital: 'Brussels', capitalAliases: ['brussels'], aliases: ['kingdom of belgium', 'belgique', 'belgium'],          region: 'Europe' },
  { id: 70,  name: 'Bosnia and Herzegovina', capital: 'Sarajevo', capitalAliases: ['sarajevo'], aliases: ['bosnia', 'herzegovina', 'bih', 'bosna', 'bosnia herzagovina', 'bosnia herzeegovina'], region: 'Europe' },
  { id: 100, name: 'Bulgaria',               capital: 'Sofia', capitalAliases: ['sofia'], aliases: ['republic of bulgaria', 'bulgaria'],                    region: 'Europe' },
  { id: 191, name: 'Croatia',                capital: 'Zagreb', capitalAliases: ['zagreb'], aliases: ['republic of croatia', 'hrvatska', 'cro asia'],        region: 'Europe' },
  { id: 196, name: 'Cyprus',                 capital: 'Nicosia', capitalAliases: ['nicosia'], aliases: ['republic of cyprus', 'syprus'],                       region: 'Europe' },
  { id: 203, name: 'Czech Republic',         capital: 'Prague', capitalAliases: ['prague'], aliases: ['czechia', 'czech', 'ceska republika', 'check republic', 'chek republic'], region: 'Europe' },
  { id: 208, name: 'Denmark',                capital: 'Copenhagen', capitalAliases: ['copenhagen'], aliases: ['kingdom of denmark', 'den mark'],                     region: 'Europe' },
  { id: 233, name: 'Estonia',                capital: 'Tallinn', capitalAliases: ['tallinn'], aliases: ['republic of estonia', 'estone ia'],                   region: 'Europe' },
  { id: 246, name: 'Finland',                capital: 'Helsinki', capitalAliases: ['helsinki'], aliases: ['republic of finland', 'suomi', 'fin land'],           region: 'Europe' },
  { id: 250, name: 'France',                 capital: 'Paris', capitalAliases: ['paris'], aliases: ['french republic'],                                     region: 'Europe' },
  { id: 276, name: 'Germany',                capital: 'Berlin', capitalAliases: ['berlin'], aliases: ['federal republic of germany', 'deutschland', 'germeny'], region: 'Europe' },
  { id: 300, name: 'Greece',                 capital: 'Athens', capitalAliases: ['athens'], aliases: ['hellenic republic', 'hellas', 'grece'],               region: 'Europe' },
  { id: 348, name: 'Hungary',                capital: 'Budapest', capitalAliases: ['budapest'], aliases: ['magyarorszag', 'hungery'],                             region: 'Europe' },
  { id: 352, name: 'Iceland',                capital: 'Reykjavik', capitalAliases: ['reykjavik'], aliases: ['republic of iceland', 'ice land'],                    region: 'Europe' },
  { id: 372, name: 'Ireland',                capital: 'Dublin', capitalAliases: ['dublin'], aliases: ['republic of ireland', 'eire', 'eye reland'],          region: 'Europe' },
  { id: 380, name: 'Italy',                  capital: 'Rome', capitalAliases: ['rome'], aliases: ['italian republic', 'italia', 'ittaly'],               region: 'Europe' },
  { id: 428, name: 'Latvia',                 capital: 'Riga', capitalAliases: ['riga'], aliases: ['republic of latvia', 'lat via'],                      region: 'Europe' },
  { id: 440, name: 'Lithuania',              capital: 'Vilnius', capitalAliases: ['vilnius'], aliases: ['republic of lithuania', 'lith uania'],                region: 'Europe' },
  { id: 442, name: 'Luxembourg',             capital: 'Luxembourg', capitalAliases: ['luxembourg city'], aliases: ['grand duchy of luxembourg', 'lux em berg', 'luxemberg', 'luxemburg'], region: 'Europe' },
  { id: 807, name: 'North Macedonia',        capital: 'Skopje', capitalAliases: ['skopje'], aliases: ['macedonia', 'republic of north macedonia', 'fyrom', 'macedonian', 'north macedonian', 'north macidonia'], region: 'Europe' },
  { id: 470, name: 'Malta',                  capital: 'Valletta', capitalAliases: ['valletta'], aliases: ['republic of malta'],                                  region: 'Europe' },
  { id: 498, name: 'Moldova',                capital: 'Chisinau', capitalAliases: ['chisinau'], aliases: ['republic of moldova', 'mol dova'],                    region: 'Europe' },
  { id: 499, name: 'Montenegro',             capital: 'Podgorica', capitalAliases: ['podgorica'], aliases: ['republic of montenegro', 'crna gora', 'montenne grow', 'monte negro'], region: 'Europe' },
  { id: 528, name: 'Netherlands',            capital: 'Amsterdam', capitalAliases: ['amsterdam'], aliases: ['holland', 'the netherlands', 'kingdom of the netherlands', 'nether lands'], region: 'Europe' },
  { id: 578, name: 'Norway',                 capital: 'Oslo', capitalAliases: ['oslo'], aliases: ['kingdom of norway', 'norge', 'norwy'],                region: 'Europe' },
  { id: 616, name: 'Poland',                 capital: 'Warsaw', capitalAliases: ['warsaw'], aliases: ['republic of poland', 'polska', 'poalnd'],             region: 'Europe' },
  { id: 620, name: 'Portugal',               capital: 'Lisbon', capitalAliases: ['lisbon'], aliases: ['portuguese republic', 'portgual'],                    region: 'Europe' },
  { id: 642, name: 'Romania',                capital: 'Bucharest', capitalAliases: ['bucharest'], aliases: ['roumania', 'rumania'],                                region: 'Europe' },
  { id: 643, name: 'Russia',                 capital: 'Moscow', capitalAliases: ['moscow'], aliases: ['russian federation', 'rushia', 'rusha'],              region: 'Europe' },
  { id: 688, name: 'Serbia',                 capital: 'Belgrade', capitalAliases: ['belgrade'], aliases: ['republic of serbia', 'serbea'],                       region: 'Europe' },
  { id: 703, name: 'Slovakia',               capital: 'Bratislava', capitalAliases: ['bratislava'], aliases: ['slovak republic', 'slovak', 'slo vakia'],             region: 'Europe' },
  { id: 705, name: 'Slovenia',               capital: 'Ljubljana', capitalAliases: ['ljubljana'], aliases: ['republic of slovenia', 'slo venia'],                  region: 'Europe' },
  { id: 724, name: 'Spain',                  capital: 'Madrid', capitalAliases: ['madrid'], aliases: ['kingdom of spain', 'espana', 'spane'],                region: 'Europe' },
  { id: 752, name: 'Sweden',                 capital: 'Stockholm', capitalAliases: ['stockholm'], aliases: ['kingdom of sweden', 'sverige', 'sweedn'],             region: 'Europe' },
  { id: 756, name: 'Switzerland',            capital: 'Bern', capitalAliases: ['bern'], aliases: ['swiss confederation', 'suisse', 'schweiz', 'switzer land', 'switserland'], region: 'Europe' },
  { id: 804, name: 'Ukraine',                capital: 'Kyiv', capitalAliases: ['kyiv', 'kiev'], aliases: ['ukrane', 'ukrayne'],                                  region: 'Europe' },
  { id: 826, name: 'United Kingdom',         capital: 'London', capitalAliases: ['london'], aliases: ['uk', 'great britain', 'britain', 'england', 'gb'],   region: 'Europe' },
  { id: 674, name: 'San Marino',             capital: 'San Marino', capitalAliases: ['san marino'], aliases: ['republic of san marino', 'san murino', 'san merino', 'sammarino'], region: 'Europe' },
  { id: 336, name: 'Vatican City',           capital: 'Vatican City', capitalAliases: ['vatican city'], aliases: ['holy see', 'vatican', 'the vatican', 'vattican'],    region: 'Europe' },

  // ── AFRICA ────────────────────────────────────────────────────────────────
  { id: 12,  name: 'Algeria',                capital: 'Algiers', capitalAliases: ['algiers'], aliases: ['peoples democratic republic of algeria', 'algerea'],  region: 'Africa' },
  { id: 24,  name: 'Angola',                 capital: 'Luanda', capitalAliases: ['luanda'], aliases: ['republic of angola', 'angolla'],                      region: 'Africa' },
  { id: 204, name: 'Benin',                  capital: 'Porto-Novo', capitalAliases: ['porto novo'], aliases: ['republic of benin', 'benen', 'beneen'],               region: 'Africa' },
  { id: 72,  name: 'Botswana',               capital: 'Gaborone', capitalAliases: ['gaborone'], aliases: ['republic of botswana', 'bots wana'],                  region: 'Africa' },
  { id: 854, name: 'Burkina Faso',           capital: 'Ouagadougou', capitalAliases: ['ouagadougou'], aliases: ['burkina', 'burkina fazzo', 'burkina fazso'],          region: 'Africa' },
  { id: 108, name: 'Burundi',                capital: 'Gitega', capitalAliases: ['gitega', 'bujumbura'], aliases: ['republic of burundi', 'burundy'],                     region: 'Africa' },
  { id: 120, name: 'Cameroon',               capital: 'Yaounde', capitalAliases: ['yaounde'], aliases: ['republic of cameroon', 'cameroun', 'cam e roon'],     region: 'Africa' },
  { id: 140, name: 'Central African Republic', capital: 'Bangui', capitalAliases: ['bangui'], aliases: ['car', 'central africa', 'central african rep'],    region: 'Africa' },
  { id: 148, name: 'Chad',                   capital: "N'Djamena", capitalAliases: ['ndjamena'], aliases: ['republic of chad'],                                   region: 'Africa' },
  { id: 174, name: 'Comoros',                capital: 'Moroni', capitalAliases: ['moroni'], aliases: ['union of the comoros', 'comoro', 'cameros', 'comoros islands', 'comores'], region: 'Africa' },
  { id: 178, name: 'Congo',                  capital: 'Brazzaville', capitalAliases: ['brazzaville'], aliases: ['republic of the congo', 'congo republic', 'congo brazzaville', 'republic congo'], region: 'Africa' },
  { id: 180, name: 'DR Congo',               capital: 'Kinshasa', capitalAliases: ['kinshasa'], aliases: ['democratic republic of the congo', 'drc', 'congo kinshasa', 'zaire', 'democratic congo', 'dem rep congo'], region: 'Africa' },
  { id: 262, name: 'Djibouti',               capital: 'Djibouti', capitalAliases: ['djibouti'], aliases: ['republic of djibouti', 'ji booty', 'jee booty', 'jeebuti', 'jubuti', 'djibooti', 'jeh booty', 'ji boo ti', 'jibuti'], region: 'Africa' },
  { id: 818, name: 'Egypt',                  capital: 'Cairo', capitalAliases: ['cairo'], aliases: ['arab republic of egypt', 'eejypt', 'egiypt'],         region: 'Africa' },
  { id: 226, name: 'Equatorial Guinea',      capital: 'Malabo', capitalAliases: ['malabo'], aliases: ['republic of equatorial guinea', 'equatorial ginny', 'equatoral guinea', 'equatorial gini'], region: 'Africa' },
  { id: 232, name: 'Eritrea',                capital: 'Asmara', capitalAliases: ['asmara'], aliases: ['state of eritrea', 'eritria', 'era tree ah', 'aretrea', 'erittrea', 'eritray'], region: 'Africa' },
  { id: 231, name: 'Ethiopia',               capital: 'Addis Ababa', capitalAliases: ['addis ababa'], aliases: ['federal democratic republic of ethiopia', 'etheopia', 'ethopia', 'ethipoia'], region: 'Africa' },
  { id: 266, name: 'Gabon',                  capital: 'Libreville', capitalAliases: ['libreville'], aliases: ['gabonese republic', 'gab on'],                        region: 'Africa' },
  { id: 270, name: 'Gambia',                 capital: 'Banjul', capitalAliases: ['banjul'], aliases: ['republic of the gambia', 'the gambia', 'gam bia'],    region: 'Africa' },
  { id: 288, name: 'Ghana',                  capital: 'Accra', capitalAliases: ['accra'], aliases: ['republic of ghana'],                                  region: 'Africa' },
  { id: 324, name: 'Guinea',                 capital: 'Conakry', capitalAliases: ['conakry'], aliases: ['republic of guinea', 'guinea conakry', 'ginny', 'giney'], region: 'Africa' },
  { id: 624, name: 'Guinea-Bissau',          capital: 'Bissau', capitalAliases: ['bissau'], aliases: ['republic of guinea bissau', 'guinea biso', 'guinea bis sow', 'guinea bissow', 'guinea b so'], region: 'Africa' },
  { id: 384, name: 'Ivory Coast',            capital: 'Yamoussoukro', capitalAliases: ['yamoussoukro'], aliases: ['cote divoire', 'cote d ivoire', 'ivory coast', 'cote divo ar'],  region: 'Africa' },
  { id: 404, name: 'Kenya',                  capital: 'Nairobi', capitalAliases: ['nairobi'], aliases: ['republic of kenya', 'ken ya'],                        region: 'Africa' },
  { id: 426, name: 'Lesotho',                capital: 'Maseru', capitalAliases: ['maseru'], aliases: ['kingdom of lesotho', 'le soo too', 'la sooto', 'lesoto', 'le so to'], region: 'Africa' },
  { id: 430, name: 'Liberia',                capital: 'Monrovia', capitalAliases: ['monrovia'], aliases: ['republic of liberia', 'li beria'],                    region: 'Africa' },
  { id: 434, name: 'Libya',                  capital: 'Tripoli', capitalAliases: ['tripoli'], aliases: ['state of libya', 'libiya', 'libia'],                  region: 'Africa' },
  { id: 450, name: 'Madagascar',             capital: 'Antananarivo', capitalAliases: ['antananarivo'], aliases: ['republic of madagascar', 'mada gasca', 'madaga scar'], region: 'Africa' },
  { id: 454, name: 'Malawi',                 capital: 'Lilongwe', capitalAliases: ['lilongwe'], aliases: ['republic of malawi', 'mala wi'],                      region: 'Africa' },
  { id: 466, name: 'Mali',                   capital: 'Bamako', capitalAliases: ['bamako'], aliases: ['republic of mali', 'molly', 'mally', 'moli', 'mali africa'], region: 'Africa' },
  { id: 478, name: 'Mauritania',             capital: 'Nouakchott', capitalAliases: ['nouakchott'], aliases: ['islamic republic of mauritania', 'more tania', 'mauri tania', 'mauretania', 'moretania'], region: 'Africa' },
  { id: 480, name: 'Mauritius',              capital: 'Port Louis', capitalAliases: ['port louis'], aliases: ['republic of mauritius', 'morish us', 'mauritious'],   region: 'Africa' },
  { id: 504, name: 'Morocco',                capital: 'Rabat', capitalAliases: ['rabat'], aliases: ['kingdom of morocco', 'maroc', 'moroco'],               region: 'Africa' },
  { id: 508, name: 'Mozambique',             capital: 'Maputo', capitalAliases: ['maputo'], aliases: ['republic of mozambique', 'moe zam beek', 'mozam beek', 'mozambik'], region: 'Africa' },
  { id: 516, name: 'Namibia',                capital: 'Windhoek', capitalAliases: ['windhoek'], aliases: ['republic of namibia', 'nami bia'],                    region: 'Africa' },
  { id: 562, name: 'Niger',                  capital: 'Niamey', capitalAliases: ['niamey'], aliases: ['republic of the niger', 'nee zhair', 'nee ger'],      region: 'Africa' },
  { id: 566, name: 'Nigeria',                capital: 'Abuja', capitalAliases: ['abuja'], aliases: ['federal republic of nigeria', 'ny jeria', 'nigera'],  region: 'Africa' },
  { id: 646, name: 'Rwanda',                 capital: 'Kigali', capitalAliases: ['kigali'], aliases: ['republic of rwanda', 'rawanda', 'ru wanda'],           region: 'Africa' },
  { id: 686, name: 'Senegal',                capital: 'Dakar', capitalAliases: ['dakar'], aliases: ['republic of senegal', 'sen a gal'],                   region: 'Africa' },
  { id: 694, name: 'Sierra Leone',           capital: 'Freetown', capitalAliases: ['freetown'], aliases: ['republic of sierra leone', 'sierra leon', 'ceara leon', 'sierra leoni'], region: 'Africa' },
  { id: 706, name: 'Somalia',                capital: 'Mogadishu', capitalAliases: ['mogadishu'], aliases: ['federal republic of somalia', 'so malia'],            region: 'Africa' },
  { id: 710, name: 'South Africa',           capital: 'Pretoria', capitalAliases: ['pretoria', 'cape town', 'bloemfontein'], aliases: ['republic of south africa', 'rsa', 'south africa'],   region: 'Africa' },
  { id: 728, name: 'South Sudan',            capital: 'Juba', capitalAliases: ['juba'], aliases: ['republic of south sudan', 'south sudaan'],            region: 'Africa' },
  { id: 729, name: 'Sudan',                  capital: 'Khartoum', capitalAliases: ['khartoum'], aliases: ['republic of the sudan', 'republic of sudan', 'sue dan'], region: 'Africa' },
  { id: 748, name: 'Eswatini',               capital: 'Mbabane', capitalAliases: ['mbabane'], aliases: ['swaziland', 'kingdom of eswatini', 's watini', 'swatini', 'swazi', 'eswatini kingdom'], region: 'Africa' },
  { id: 834, name: 'Tanzania',               capital: 'Dodoma', capitalAliases: ['dodoma', 'dar es salaam'], aliases: ['united republic of tanzania', 'tan zania'],           region: 'Africa' },
  { id: 768, name: 'Togo',                   capital: 'Lome', capitalAliases: ['lome'], aliases: ['togolese republic'],                                  region: 'Africa' },
  { id: 788, name: 'Tunisia',                capital: 'Tunis', capitalAliases: ['tunis'], aliases: ['tunisian republic', 'tunesia', 'toonezia'],           region: 'Africa' },
  { id: 800, name: 'Uganda',                 capital: 'Kampala', capitalAliases: ['kampala'], aliases: ['republic of uganda', 'oo ganda'],                     region: 'Africa' },
  { id: 732, name: 'Western Sahara',         capital: 'Laayoune', capitalAliases: ['laayoune'], aliases: ['sahrawi arab democratic republic', 'western sahara', 'western sa hara'], region: 'Africa' },
  { id: 894, name: 'Zambia',                 capital: 'Lusaka', capitalAliases: ['lusaka'], aliases: ['republic of zambia', 'zam bia'],                      region: 'Africa' },
  { id: 716, name: 'Zimbabwe',               capital: 'Harare', capitalAliases: ['harare'], aliases: ['republic of zimbabwe', 'zimba bwe', 'zimbab we'],     region: 'Africa' },

  // ── ASIA ──────────────────────────────────────────────────────────────────
  { id: 4,   name: 'Afghanistan',            capital: 'Kabul', capitalAliases: ['kabul'], aliases: ['islamic republic of afghanistan', 'affganistan', 'afghan istan'], region: 'Asia' },
  { id: 50,  name: 'Bangladesh',             capital: 'Dhaka', capitalAliases: ['dhaka'], aliases: ['peoples republic of bangladesh', 'bangla desh'],      region: 'Asia' },
  { id: 64,  name: 'Bhutan',                 capital: 'Thimphu', capitalAliases: ['thimphu'], aliases: ['kingdom of bhutan', 'boo tan', 'bhu tan'],            region: 'Asia' },
  { id: 96,  name: 'Brunei',                 capital: 'Bandar Seri Begawan', capitalAliases: ['bandar seri begawan'], aliases: ['brunei darussalam', 'broo nay', 'brew nay', 'brunay', 'brewnay'], region: 'Asia' },
  { id: 116, name: 'Cambodia',               capital: 'Phnom Penh', capitalAliases: ['phnom penh'], aliases: ['kingdom of cambodia', 'kampuchea', 'cam bodia'],      region: 'Asia' },
  { id: 156, name: 'China',                  capital: 'Beijing', capitalAliases: ['beijing'], aliases: ['peoples republic of china', 'prc', 'chyna'],          region: 'Asia' },
  { id: 356, name: 'India',                  capital: 'New Delhi', capitalAliases: ['new delhi', 'delhi'], aliases: ['republic of india', 'bharat', 'indea'],               region: 'Asia' },
  { id: 360, name: 'Indonesia',              capital: 'Jakarta', capitalAliases: ['jakarta'], aliases: ['republic of indonesia', 'indo nesia'],                region: 'Asia' },
  { id: 392, name: 'Japan',                  capital: 'Tokyo', capitalAliases: ['tokyo'], aliases: ['nippon', 'nihon', 'ja pan'],                          region: 'Asia' },
  { id: 398, name: 'Kazakhstan',             capital: 'Astana', capitalAliases: ['astana', 'nur sultan'], aliases: ['republic of kazakhstan', 'kaza stan', 'kazak stan', 'casac stan', 'kazakstan', 'kazakhastan'], region: 'Asia' },
  { id: 408, name: 'North Korea',            capital: 'Pyongyang', capitalAliases: ['pyongyang'], aliases: ['dprk', 'democratic peoples republic of korea', 'north corea'], region: 'Asia' },
  { id: 410, name: 'South Korea',            capital: 'Seoul', capitalAliases: ['seoul'], aliases: ['republic of korea', 'korea', 'south corea', 'kor ea'], region: 'Asia' },
  { id: 417, name: 'Kyrgyzstan',             capital: 'Bishkek', capitalAliases: ['bishkek'], aliases: ['kyrgyz republic', 'kirghizia', 'cry gaston', 'kir gas tan', 'kur giz stan', 'kirgizstan', 'kurgistan', 'keer gees tan', 'keer giz stan', 'kyrgz stan', 'kirgistan', 'cur gus tan'], region: 'Asia' },
  { id: 418, name: 'Laos',                   capital: 'Vientiane', capitalAliases: ['vientiane'], aliases: ['lao pdr', 'lao peoples democratic republic', 'louse', 'lao', 'lay os'], region: 'Asia' },
  { id: 458, name: 'Malaysia',               capital: 'Kuala Lumpur', capitalAliases: ['kuala lumpur'], aliases: ['malay sia', 'malasia'],                               region: 'Asia' },
  { id: 496, name: 'Mongolia',               capital: 'Ulaanbaatar', capitalAliases: ['ulaanbaatar'], aliases: ['mong olia', 'mongol'],                                region: 'Asia' },
  { id: 104, name: 'Myanmar',                capital: 'Naypyidaw', capitalAliases: ['naypyidaw'], aliases: ['burma', 'republic of myanmar', 'me an mar', 'myun mar', 'myan mar', 'me yun mar'], region: 'Asia' },
  { id: 524, name: 'Nepal',                  capital: 'Kathmandu', capitalAliases: ['kathmandu'], aliases: ['federal democratic republic of nepal', 'ne pal'],     region: 'Asia' },
  { id: 586, name: 'Pakistan',               capital: 'Islamabad', capitalAliases: ['islamabad'], aliases: ['islamic republic of pakistan', 'paki stan'],          region: 'Asia' },
  { id: 608, name: 'Philippines',            capital: 'Manila', capitalAliases: ['manila'], aliases: ['republic of the philippines', 'phillipines', 'philippians', 'philipines', 'filip eens'], region: 'Asia' },
  { id: 702, name: 'Singapore',              capital: 'Singapore', capitalAliases: ['singapore'], aliases: ['republic of singapore', 'singa pore'],                region: 'Asia' },
  { id: 144, name: 'Sri Lanka',              capital: 'Colombo', capitalAliases: ['colombo', 'sri jayawardenepura kotte'], aliases: ['ceylon', 'sree lanka', 'sri lanca', 'shri lanka'],    region: 'Asia' },
  { id: 158, name: 'Taiwan',                 capital: 'Taipei', capitalAliases: ['taipei'], aliases: ['republic of china', 'formosa', 'tie wan'],            region: 'Asia' },
  { id: 762, name: 'Tajikistan',             capital: 'Dushanbe', capitalAliases: ['dushanbe'], aliases: ['republic of tajikistan', 'tajiki stan', 'ta jikistan', 'ta jeeka stan', 'tajikestan', 'taji kistan', 'tah jiki stan'], region: 'Asia' },
  { id: 764, name: 'Thailand',               capital: 'Bangkok', capitalAliases: ['bangkok'], aliases: ['kingdom of thailand', 'siam', 'tie land', 'thai land'], region: 'Asia' },
  { id: 626, name: 'Timor-Leste',            capital: 'Dili', capitalAliases: ['dili'], aliases: ['east timor', 'timor less tay', 'timor leste', 'timor lesty', 'timor lest', 'east timore'], region: 'Asia' },
  { id: 795, name: 'Turkmenistan',           capital: 'Ashgabat', capitalAliases: ['ashgabat'], aliases: ['turk mena stan', 'turk me nistan', 'turk me ne stan', 'turkme nistan'], region: 'Asia' },
  { id: 860, name: 'Uzbekistan',             capital: 'Tashkent', capitalAliases: ['tashkent'], aliases: ['republic of uzbekistan', 'uzbee kistan', 'uzbek istan', 'uzbeck istan', 'uzbeki stan'], region: 'Asia' },
  { id: 704, name: 'Vietnam',                capital: 'Hanoi', capitalAliases: ['hanoi'], aliases: ['viet nam', 'socialist republic of vietnam', 'viet', 'viet nam republic'], region: 'Asia' },

  // ── MIDDLE EAST ───────────────────────────────────────────────────────────
  { id: 51,  name: 'Armenia',                capital: 'Yerevan', capitalAliases: ['yerevan'], aliases: ['republic of armenia', 'ar menia'],                    region: 'Middle East' },
  { id: 31,  name: 'Azerbaijan',             capital: 'Baku', capitalAliases: ['baku'], aliases: ['republic of azerbaijan', 'azer by john', 'azer by jan', 'azerbajan', 'azeri', 'azer baijan', 'azerbaijan'], region: 'Middle East' },
  { id: 48,  name: 'Bahrain',                capital: 'Manama', capitalAliases: ['manama'], aliases: ['kingdom of bahrain', 'bah rain', 'bahrane', 'ba rain'], region: 'Middle East' },
  { id: 268, name: 'Georgia',                capital: 'Tbilisi', capitalAliases: ['tbilisi'], aliases: ['sakartvelo', 'georgia country', 'georgea'],           region: 'Middle East' },
  { id: 364, name: 'Iran',                   capital: 'Tehran', capitalAliases: ['tehran'], aliases: ['islamic republic of iran', 'persia', 'eye ran', 'ee ron'], region: 'Middle East' },
  { id: 368, name: 'Iraq',                   capital: 'Baghdad', capitalAliases: ['baghdad'], aliases: ['republic of iraq', 'eye rack', 'ee raq'],             region: 'Middle East' },
  { id: 376, name: 'Israel',                 capital: 'Jerusalem', capitalAliases: ['jerusalem'], aliases: ['state of israel', 'iz reel', 'is rael'],              region: 'Middle East' },
  { id: 400, name: 'Jordan',                 capital: 'Amman', capitalAliases: ['amman'], aliases: ['hashemite kingdom of jordan', 'jor dan'],             region: 'Middle East' },
  { id: 275, name: 'Palestine',              capital: 'Jerusalem', capitalAliases: ['jerusalem', 'ramallah'], aliases: ['state of palestine', 'palestinian territories', 'west bank', 'gaza', 'gaza strip', 'pales tine'], region: 'Middle East' },
  { id: 414, name: 'Kuwait',                 capital: 'Kuwait City', capitalAliases: ['kuwait city'], aliases: ['state of kuwait', 'ku wait', 'kwait'],                region: 'Middle East' },
  { id: 422, name: 'Lebanon',                capital: 'Beirut', capitalAliases: ['beirut'], aliases: ['lebanese republic', 'leba non'],                      region: 'Middle East' },
  { id: 512, name: 'Oman',                   capital: 'Muscat', capitalAliases: ['muscat'], aliases: ['sultanate of oman', 'oh man'],                        region: 'Middle East' },
  { id: 634, name: 'Qatar',                  capital: 'Doha', capitalAliases: ['doha'], aliases: ['state of qatar', 'cutter', 'catar', 'ka tar', 'gutter', 'ka tar', 'qutar'], region: 'Middle East' },
  { id: 682, name: 'Saudi Arabia',           capital: 'Riyadh', capitalAliases: ['riyadh'], aliases: ['kingdom of saudi arabia', 'ksa', 'saudi', 'saudia'],  region: 'Middle East' },
  { id: 760, name: 'Syria',                  capital: 'Damascus', capitalAliases: ['damascus'], aliases: ['syrian arab republic', 'siria', 'seeria'],            region: 'Middle East' },
  { id: 792, name: 'Turkey',                 capital: 'Ankara', capitalAliases: ['ankara'], aliases: ['republic of turkey', 'turkiye', 'tur key'],           region: 'Middle East' },
  { id: 784, name: 'UAE',                    capital: 'Abu Dhabi', capitalAliases: ['abu dhabi'], aliases: ['united arab emirates', 'emirates', 'dubai', 'abu dhabi', 'you ae', 'u a e', 'you ay ee'], region: 'Middle East' },
  { id: 887, name: 'Yemen',                  capital: 'Sanaa', capitalAliases: ['sanaa'], aliases: ['republic of yemen', 'yem en'],                        region: 'Middle East' },

  // ── OCEANIA ───────────────────────────────────────────────────────────────
  { id: 36,  name: 'Australia',              capital: 'Canberra', capitalAliases: ['canberra'], aliases: ['commonwealth of australia', 'oz', 'aussie'],          region: 'Oceania' },
  { id: 242, name: 'Fiji',                   capital: 'Suva', capitalAliases: ['suva'], aliases: ['republic of fiji', 'fee jee'],                        region: 'Oceania' },
  { id: 296, name: 'Kiribati',               capital: 'Tarawa', capitalAliases: ['tarawa'], aliases: ['republic of kiribati', 'kirry bas', 'kiri bas', 'kerry boss', 'kiribas', 'kiri basi', 'carry bus', 'kirribas', 'kirabas'], region: 'Oceania' },
  { id: 584, name: 'Marshall Islands',       capital: 'Majuro', capitalAliases: ['majuro'], aliases: ['republic of the marshall islands', 'marshall', 'marshal islands'], region: 'Oceania' },
  { id: 583, name: 'Micronesia',             capital: 'Palikir', capitalAliases: ['palikir'], aliases: ['federated states of micronesia', 'fsm', 'micro nesia', 'my crow nesia', 'micronecia'], region: 'Oceania' },
  { id: 520, name: 'Nauru',                  capital: 'Yaren', capitalAliases: ['yaren'], aliases: ['republic of nauru', 'naoero', 'na roo', 'nah roo', 'nour roo', 'naw roo'], region: 'Oceania' },
  { id: 554, name: 'New Zealand',            capital: 'Wellington', capitalAliases: ['wellington'], aliases: ['nz', 'aotearoa', 'new zeeland', 'new zelan'],         region: 'Oceania' },
  { id: 585, name: 'Palau',                  capital: 'Ngerulmud', capitalAliases: ['ngerulmud'], aliases: ['republic of palau', 'pa lau', 'palao'],               region: 'Oceania' },
  { id: 598, name: 'Papua New Guinea',       capital: 'Port Moresby', capitalAliases: ['port moresby'], aliases: ['png', 'new guinea', 'papua', 'poppa new guinea', 'papa new guinea', 'papua new ginny', 'papwa new guinea'], region: 'Oceania' },
  { id: 882, name: 'Samoa',                  capital: 'Apia', capitalAliases: ['apia'], aliases: ['western samoa', 'sa moa', 'sa mo ah'],                region: 'Oceania' },
  { id: 90,  name: 'Solomon Islands',        capital: 'Honiara', capitalAliases: ['honiara'], aliases: ['solomon', 'soloman islands', 'solemon islands'],      region: 'Oceania' },
  { id: 776, name: 'Tonga',                  capital: 'Nukuʻalofa', capitalAliases: ['nukualofa', 'nuku alofa'], aliases: ['kingdom of tonga', 'ton ga'],                         region: 'Oceania' },
  { id: 798, name: 'Tuvalu',                 capital: 'Funafuti', capitalAliases: ['funafuti'], aliases: ['ellice islands', 'to value', 'too va loo', 'tuva loo', 'tuvalo', 'tu va loo', 'two value', 'toova loo', 'tuv a loo', 'tu valu'], region: 'Oceania' },
  { id: 548, name: 'Vanuatu',                capital: 'Port Vila', capitalAliases: ['port vila'], aliases: ['republic of vanuatu', 'van a too', 'vana too', 'van wha too', 'van oh ah too', 'vanuatoo', 'van wah too'], region: 'Oceania' },
];

// Deduplicate
var _seenIds = new Set();
var COUNTRIES = COUNTRIES_RAW.filter(function(c) {
  if (_seenIds.has(c.id)) return false;
  _seenIds.add(c.id);
  return true;
});

// Lookup map: numeric id → country
var COUNTRY_BY_ID = new Map(COUNTRIES.map(function(c) { return [c.id, c]; }));

// Flat search terms list
var SEARCH_TERMS = [];
var CAPITAL_TERMS = [];
COUNTRIES.forEach(function(c) {
  SEARCH_TERMS.push({ term: c.name.toLowerCase(), id: c.id });
  c.aliases.forEach(function(a) { SEARCH_TERMS.push({ term: a.toLowerCase(), id: c.id }); });
  
  CAPITAL_TERMS.push({ term: c.capital.toLowerCase(), id: c.id });
  c.capitalAliases.forEach(function(a) { CAPITAL_TERMS.push({ term: a.toLowerCase(), id: c.id }); });
});

function _normalize(str) {
  return str.toLowerCase()
    .replace(/[''`]/g, "'")
    .replace(/[-\u2013\u2014]/g, ' ')
    .replace(/[^a-z0-9 ']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function _levenshtein(a, b) {
  var m = a.length, n = b.length;
  var dp = [];
  for (var i = 0; i <= m; i++) {
    dp[i] = [];
    for (var j = 0; j <= n; j++) {
      dp[i][j] = i === 0 ? j : j === 0 ? i : 0;
    }
  }
  for (var i = 1; i <= m; i++) {
    for (var j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

function findCountry(input, mode) {
  if (!input || input.trim().length < 2) return null;
  var q = _normalize(input);
  var termsList = mode === 'capitals' ? CAPITAL_TERMS : SEARCH_TERMS;

  // 1. Exact match
  for (var i = 0; i < termsList.length; i++) {
    var st = termsList[i];
    if (_normalize(st.term) === q) return COUNTRY_BY_ID.get(st.id);
  }

  // 2. Input contains a full country term
  for (var i = 0; i < termsList.length; i++) {
    var st = termsList[i];
    var normTerm = _normalize(st.term);
    if (q.includes(normTerm) && normTerm.length >= 4) return COUNTRY_BY_ID.get(st.id);
  }

  // 3. Term starts with input (partial speech)
  for (var i = 0; i < termsList.length; i++) {
    var st = termsList[i];
    var normTerm = _normalize(st.term);
    if (normTerm.startsWith(q) && q.length >= 4) return COUNTRY_BY_ID.get(st.id);
  }

  // 4. Fuzzy match (1 typo per 5 chars)
  var maxDist = Math.floor(q.length / 5);
  if (maxDist === 0) return null;
  var best = null, bestDist = Infinity;
  for (var i = 0; i < termsList.length; i++) {
    var st = termsList[i];
    var normTerm = _normalize(st.term);
    if (Math.abs(normTerm.length - q.length) > maxDist + 1) continue;
    var d = _levenshtein(q, normTerm);
    if (d <= maxDist && d < bestDist) {
      bestDist = d;
      best = COUNTRY_BY_ID.get(st.id);
    }
  }
  return best;
}

function getByRegion() {
  var groups = { Americas: [], Europe: [], Asia: [], Africa: [], Oceania: [], 'Middle East': [] };
  COUNTRIES.forEach(function(c) { if (groups[c.region]) groups[c.region].push(c); });
  return groups;
}
