var WORDS = [
  ['el', ['the', -0.14310], ['a', -2.01490]],
  ['perro', ['dog', -0.24116], ['puppy', -2.63906], ['hound', -2.63906], ['canine', -2.63906]],
  ['blanco', ['white', -0.33647], ['target', -1.54045], ['alabaster', -2.63906]],
  ['no', ['not', -0.24116], ['no', -1.94591], ['ain\'t', -2.63906]],
  ['es', ['is', -0.07411], ['be', -2.63906]],
  ['mío', ['mine', -0.33647], ['my', -1.25276]],
];

var BIGRAM = {
  'a': { 'a': -3.40230, 'be': -4.50972, 'hound': -5.36787, 'target': -3.37254, '&lt;/s&gt;': -101.17200, 'no': -3.33659, 'alabaster': -7.07693, 'dog': -3.61042, 'canine': -4.80600, 'mine': -3.74321, '&lt;s&gt;': -101.17200, 'ain\'t': -101.17200, 'not': -3.86574, 'the': -3.59544, 'puppy': -4.54850, 'my': -4.75533, 'white': -3.25377, 'is': -3.60688 },
  'be': { 'a': -2.30144, 'be': -3.70432, 'hound': -6.23009, 'target': -4.31437, '&lt;/s&gt;': -100.64600, 'no': -3.23625, 'alabaster': -6.55132, 'dog': -4.96590, 'canine': -5.85283, 'mine': -4.00887, '&lt;s&gt;': -100.64600, 'ain\'t': -100.64600, 'not': -3.26721, 'the': -2.33092, 'puppy': -5.89394, 'my': -3.24724, 'white': -3.88080, 'is': -3.03594 },
  'hound': { 'a': -2.98435, 'be': -3.76075, 'hound': -5.85993, 'target': -4.22180, '&lt;/s&gt;': -100.27600, 'no': -3.79386, 'alabaster': -6.18117, 'dog': -1.21531, 'canine': -5.48268, 'mine': -4.38555, '&lt;s&gt;': -100.27600, 'ain\'t': -100.27600, 'not': -3.51831, 'the': -1.77691, 'puppy': -5.52378, 'my': -3.89708, 'white': -4.06428, 'is': -2.17797 },
  'target': { 'a': -2.16907, 'be': -3.31014, 'hound': -6.22071, 'target': -4.58257, '&lt;/s&gt;': -100.63700, 'no': -3.93341, 'alabaster': -6.54194, 'dog': -4.95652, 'canine': -5.84345, 'mine': -4.74632, '&lt;s&gt;': -100.63700, 'ain\'t': -100.63700, 'not': -2.77880, 'the': -1.72547, 'puppy': -5.88456, 'my': -4.25786, 'white': -4.42506, 'is': -1.71663 },
  '&lt;/s&gt;': { 'a': -2.70857, 'be': -3.48497, 'hound': -5.58415, 'target': -3.94602, '&lt;/s&gt;': -100.00000, 'no': -3.51808, 'alabaster': -5.90539, 'dog': -4.31997, 'canine': -5.20690, 'mine': -4.10977, '&lt;s&gt;': -100.00000, 'ain\'t': -100.00000, 'not': -3.24253, 'the': -2.65291, 'puppy': -5.24800, 'my': -3.62130, 'white': -3.78850, 'is': -2.49367 },
  'no': { 'a': -3.25232, 'be': -3.84065, 'hound': -6.28067, 'target': -3.49519, '&lt;/s&gt;': -100.69700, 'no': -3.50268, 'alabaster': -6.60191, 'dog': -4.05496, 'canine': -5.90342, 'mine': -4.65785, '&lt;s&gt;': -100.69700, 'ain\'t': -100.69700, 'not': -3.58653, 'the': -3.27922, 'puppy': -5.94452, 'my': -4.26386, 'white': -3.51165, 'is': -3.16739 },
  'alabaster': { 'a': -2.92078, 'be': -3.69718, 'hound': -5.79637, 'target': -4.15823, '&lt;/s&gt;': -100.21200, 'no': -3.73030, 'alabaster': -6.11760, 'dog': -4.53218, 'canine': -5.41911, 'mine': -4.32198, '&lt;s&gt;': -100.21200, 'ain\'t': -100.21200, 'not': -3.45475, 'the': -2.86512, 'puppy': -5.46022, 'my': -3.83352, 'white': -4.00071, 'is': -2.70588 },
  'dog': { 'a': -2.74225, 'be': -3.28175, 'hound': -6.07598, 'target': -4.43785, '&lt;/s&gt;': -100.49200, 'no': -3.63763, 'alabaster': -6.39722, 'dog': -4.81180, 'canine': -5.69873, 'mine': -3.80238, '&lt;s&gt;': -100.49200, 'ain\'t': -100.49200, 'not': -3.49902, 'the': -2.62863, 'puppy': -5.73983, 'my': -3.67848, 'white': -4.28033, 'is': -2.00210 },
  'canine': { 'a': -2.99856, 'be': -3.77496, 'hound': -5.87414, 'target': -4.23601, '&lt;/s&gt;': -100.29000, 'no': -3.80807, 'alabaster': -6.19538, 'dog': -4.60996, 'canine': -5.49689, 'mine': -4.39976, '&lt;s&gt;': -100.29000, 'ain\'t': -100.29000, 'not': -3.53252, 'the': -2.94290, 'puppy': -5.53799, 'my': -3.91129, 'white': -4.07849, 'is': -2.78366 },
  'mine': { 'a': -2.94943, 'be': -3.50288, 'hound': -6.22595, 'target': -3.99168, '&lt;/s&gt;': -100.64200, 'no': -4.15988, 'alabaster': -6.54719, 'dog': -4.96177, 'canine': -5.84870, 'mine': -4.75157, '&lt;s&gt;': -100.64200, 'ain\'t': -100.64200, 'not': -3.43184, 'the': -2.39168, 'puppy': -5.88980, 'my': -3.88385, 'white': -4.43030, 'is': -1.84742 },
  '&lt;s&gt;': { 'a': -2.70857, 'be': -3.48497, 'hound': -5.58415, 'target': -3.94602, '&lt;/s&gt;': -100.00000, 'no': -3.51808, 'alabaster': -5.90539, 'dog': -4.31997, 'canine': -5.20690, 'mine': -4.10977, '&lt;s&gt;': -100.00000, 'ain\'t': -100.00000, 'not': -3.24253, 'the': -2.65291, 'puppy': -5.24800, 'my': -3.62130, 'white': -3.78850, 'is': -2.49367 },
  'ain\'t': { 'a': -2.70857, 'be': -3.48497, 'hound': -5.58415, 'target': -3.94602, '&lt;/s&gt;': -100.00000, 'no': -3.51808, 'alabaster': -5.90539, 'dog': -4.31997, 'canine': -5.20690, 'mine': -4.10977, '&lt;s&gt;': -100.00000, 'ain\'t': -100.00000, 'not': -3.24253, 'the': -2.65291, 'puppy': -5.24800, 'my': -3.62130, 'white': -3.78850, 'is': -2.49367 },
  'not': { 'a': -2.17326, 'be': -2.28959, 'hound': -6.28531, 'target': -3.61831, '&lt;/s&gt;': -100.70100, 'no': -4.06584, 'alabaster': -6.60655, 'dog': -4.45474, 'canine': -5.90806, 'mine': -3.77082, '&lt;s&gt;': -100.70100, 'ain\'t': -100.70100, 'not': -3.57204, 'the': -2.29438, 'puppy': -5.23638, 'my': -3.29519, 'white': -3.81160, 'is': -3.10986 },
  'the': { 'a': -3.55875, 'be': -4.53371, 'hound': -5.46782, 'target': -3.59620, '&lt;/s&gt;': -101.16200, 'no': -3.84519, 'alabaster': -6.13697, 'dog': -3.85824, 'canine': -5.10409, 'mine': -3.76028, '&lt;s&gt;': -101.16200, 'ain\'t': -101.16200, 'not': -4.15066, 'the': -3.45059, 'puppy': -5.24241, 'my': -4.56212, 'white': -3.20612, 'is': -3.63113 },
  'puppy': { 'a': -3.06119, 'be': -3.83759, 'hound': -5.93678, 'target': -4.29865, '&lt;/s&gt;': -100.35300, 'no': -3.87071, 'alabaster': -6.25801, 'dog': -1.54811, 'canine': -5.55953, 'mine': -4.46239, '&lt;s&gt;': -100.35300, 'ain\'t': -100.35300, 'not': -3.59516, 'the': -3.00554, 'puppy': -5.60063, 'my': -3.97393, 'white': -4.14113, 'is': -2.84630 },
  'my': { 'a': -3.22567, 'be': -3.70721, 'hound': -6.28326, 'target': -3.31776, '&lt;/s&gt;': -100.69900, 'no': -4.21719, 'alabaster': -6.60449, 'dog': -2.96378, 'canine': -5.90600, 'mine': -4.58278, '&lt;s&gt;': -100.69900, 'ain\'t': -100.69900, 'not': -3.61053, 'the': -3.32058, 'puppy': -5.94711, 'my': -4.09049, 'white': -3.56455, 'is': -3.19278 },
  'white': { 'a': -3.04782, 'be': -3.87849, 'hound': -4.43455, 'target': -4.47749, '&lt;/s&gt;': -100.53100, 'no': -4.04955, 'alabaster': -6.43686, 'dog': -2.92101, 'canine': -5.73837, 'mine': -4.64123, '&lt;s&gt;': -100.53100, 'ain\'t': -100.53100, 'not': -3.77400, 'the': -2.87123, 'puppy': -4.42410, 'my': -4.15277, 'white': -4.31997, 'is': -2.37366 },
  'is': { 'a': -1.47749, 'be': -4.07395, 'hound': -6.79183, 'target': -4.45009, '&lt;/s&gt;': -101.20800, 'no': -2.42126, 'alabaster': -7.11306, 'dog': -5.24517, 'canine': -6.41458, 'mine': -4.07729, '&lt;s&gt;': -101.20800, 'ain\'t': -101.20800, 'not': -1.74562, 'the': -1.53161, 'puppy': -6.45568, 'my': -3.06900, 'white': -3.91506, 'is': -3.49983 },
};
