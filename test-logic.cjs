const policiesData = require('./src/data/policies.json');
let concern = '취업';
let state = '대학생';

let matched = policiesData.filter(p => p.tags.includes(concern));
if (matched.length === 0) {
  matched = policiesData;
}
matched.sort((a, b) => {
  const aMatch = a.tags.includes(state) ? 1 : 0;
  const bMatch = b.tags.includes(state) ? 1 : 0;
  return bMatch - aMatch;
});
console.log(matched.slice(0, 2).length);
