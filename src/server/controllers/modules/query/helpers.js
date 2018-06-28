const { _U_ } = require('../../../utilities/');


// helpers
/**
 * compose a hashed object containing Mongo query expressions for pagination
 * @param {object} query                    - express.js query object
 * @param {number} [num]                    - preset numbers of document per page
 * @return {object}                         - a collection of Mongo expressions contains paginating variables
 */
const paginatedMetaExpression = (query, num = 10) => {
  const $$page = Math.trunc(query.page > 1 ? query.page : 1);
  const $$num = Math.trunc(query.num > 0 ? query.num : num);
  const $$end = { $ceil: { $divide: ['$count', $$num] } };
  const $$now = { $cond: { if: { $lt: [$$page, $$end] }, then: { $literal: $$page }, else: $$end } };
  return { page: $$page, num: $$num, end: $$end, now: $$now };
};


/**
 * compose Mongo query expression based on a time range from an array
 * @param {array} start                     - an array formatted as [YYYY, MM, DD]
 * @param {array} end                       - an array formatted as [YYYY, MM, DD]
 * @return {object}                         - part-of expression in $match stage
 */
const queryDateExpression = (start, end) => {
  if (!start || !end || start.length !== 3 || end.length !== 3) return null;
  const [A, Z] = [(start < end) ? start : end, (start < end) ? end : start];
  const [G, L] = [{ Y: A[0], M: A[1], D: A[2] }, { Y: Z[0], M: Z[1], D: Z[2] }];
  G.D = G.Y ? G.M ? G.D ? G.D : (G.D += 1) : (G.D += 1) : L.M && L.D ? L.D : (G.D += 1);
  G.M = G.Y ? G.M ? (G.M -= 1) : G.M : L.M ? L.M - 1 : G.M;
  G.Y = G.Y ? G.Y : L.Y;
  L.Y = L.M ? L.Y : (L.Y += 1);
  L.M = L.M && L.D ? (L.M -= 1) : L.M;
  L.D += 1;
  return { $gte: new Date(Date.UTC(G.Y, G.M, G.D)), $lt: new Date(Date.UTC(L.Y, L.M, L.D)) };
};


/**
 * parse date query into an date array
 * @param {string} str                      - query string
 * @return {array}                          - an array shaped as [[YYYY, MM, DD], [YYYY, MM, DD]]
 */
const parseQueryDate = (str) => {
  if (!str || !_U_.string.checkToStringTag(str, 'String')) return [];
  //
  const group = '((?:\\d{4}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|[1-2][0-9]|3[0-1])?)?)?)';
  const query = new RegExp(`^(?!-?\\/?$)${group}(?:-|\\/?$)${group}\\/?$`);
  const range = new RegExp('(\\d{4})(\\d{2})(\\d{2})');
  return (query.exec(str) || []).slice(1, 3)
    .map(date => range.exec(date.padEnd(8, '0')).slice(1, 4)
      .map(value => Number(value)));
};


/**
 * parse sorting query into fieldName-direction entries
 * @param {string} str                      - query string
 * @param {string} [order]                  - contains information about sorting direction
 * @param {number} [preset]                 - default sorting direction (as descending direction)
 * @return {array}                          - an array shaped as [[fieldName, direction], ...]
 */
const parseQuerySort = (str, order = '', preset = -1) => {
  if (!str || !_U_.string.checkToStringTag(str, 'String')) return [];
  //
  const entries = [];
  const flag = order.split(':')[1];
  const weight = flag === 'a' ? 1 : flag === 'd' ? -1 : 0;
  const item = str && str.split(',');
  for (let i = item.length - 1; i > -1; i -= 1) {
    const [field, directionFlag] = item[i].split(':');
    const fieldWeight = (Math.trunc(directionFlag) && (directionFlag > 0 ? 1 : -1))
        || (directionFlag === 'a' && 1)
        || (directionFlag === 'd' && -1)
        || (preset > 0 ? 1 : -1);
    entries.push([field.trim(), weight || fieldWeight]);
  }
  return entries.reverse();
};


// exports
module.exports = {
  paginatedMetaExpression,
  queryDateExpression,
  parseQueryDate,
  parseQuerySort,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
