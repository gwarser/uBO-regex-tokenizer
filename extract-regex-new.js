// after uBO 1.31.1b6 https://github.com/gorhill/uBlock/commit/6ac09a28560ebe7de6c20841b5ffb024fe97442d#diff-5dbe5f13c0ecb375ea4a9cabf76c9bf598b364eeb21666040482f8eeaa7cb1f1R3163-R3208

let badTokens = new Map([
    ['https', 123617],
    ['com', 76987],
    ['js', 43620],
    ['www', 33129],
    ['jpg', 32221],
    ['images', 31812],
    ['css', 19715],
    ['png', 19140],
    ['static', 15724],
    ['net', 15239],
    ['de', 13155],
    ['img', 11109],
    ['assets', 10746],
    ['min', 7807],
    ['cdn', 7568],
    ['content', 6900],
    ['wp', 6444],
    ['fonts', 6095],
    ['svg', 5976],
    ['http', 5813],
    ['ssl', 5735],
    ['amazon', 5440],
    ['ru', 5427],
    ['fr', 5199],
    ['facebook', 5178],
    ['en', 5146],
    ['image', 5028],
    ['html', 4837],
    ['media', 4833],
    ['co', 4783],
    ['php', 3972],
    ['2019', 3943],
    ['org', 3924],
    ['jquery', 3531],
    ['02', 3438],
    ['api', 3382],
    ['gif', 3350],
    ['eu', 3322],
    ['prod', 3289],
    ['woff2', 3200],
    ['logo', 3194],
    ['themes', 3107],
    ['icon', 3048],
    ['google', 3026],
    ['v1', 3019],
    ['uploads', 2963],
    ['googleapis', 2860],
    ['v3', 2816],
    ['tv', 2762],
    ['icons', 2748],
    ['core', 2601],
    ['gstatic', 2581],
    ['ac', 2509],
    ['utag', 2466],
    ['id', 2459],
    ['ver', 2448],
    ['rsrc', 2387],
    ['files', 2361],
    ['uk', 2357],
    ['us', 2271],
    ['pl', 2262],
    ['common', 2205],
    ['public', 2076],
    ['01', 2016],
    ['na', 1957],
    ['v2', 1954],
    ['12', 1914],
    ['thumb', 1895],
    ['web', 1853],
    ['ui', 1841],
    ['default', 1825],
    ['main', 1737],
    ['false', 1715],
    ['2018', 1697],
    ['embed', 1639],
    ['player', 1634],
    ['dist', 1599],
    ['woff', 1593],
    ['global', 1593],
    ['json', 1572],
    ['11', 1566],
    ['600', 1559],
    ['app', 1556],
    ['styles', 1533],
    ['plugins', 1526],
    ['274', 1512],
    ['random', 1505],
    ['sites', 1505],
    ['imasdk', 1501],
    ['bridge3', 1501],
    ['news', 1496],
    ['width', 1494],
    ['thumbs', 1485],
    ['ttf', 1470],
    ['ajax', 1463],
    ['user', 1454],
    ['scripts', 1446],
    ['twitter', 1440],
    ['crop', 1431],
    ['new', 1412],
]);

function extractTokenFromRegex(s) {
    let reToken = /[%0-9A-Za-z]+/g;
    let reRegexTokenAbort = /[\(\)\[\]]/;
    let reRegexBadPrefix = /(^|[^\\]\.|\\[%SDWsdw]|[^\\][()*+?[\\\]{}])$/;
    let reRegexBadSuffix = /^([^\\]\.|\\[%SDWsdw]|[()*+?[\]{}]|$)/;
    let maxTokenLen = 7;

    reToken.lastIndex = 0;
    const pattern = s;
    let bestToken;
    let bestBadness = 0x7FFFFFFF;
    for (;;) {
        const matches = reToken.exec(pattern);
        if (matches === null) { break; }
        let token = matches[0];
        let prefix = pattern.slice(0, matches.index);
        let suffix = pattern.slice(reToken.lastIndex);
        if (
            reRegexTokenAbort.test(prefix) &&
            reRegexTokenAbort.test(suffix)
        ) {
            continue;
        }
        if ( token.charCodeAt(0) === 0x62 /* 'b' */ ) {
            const match = /\\+$/.exec(prefix);
            if (match !== null && (match[0].length & 1) !== 0) {
                prefix += 'b';
                token = token.slice(1);
            }
        }
        if (
            reRegexBadPrefix.test(prefix) || (
                token.length < maxTokenLen &&
                reRegexBadSuffix.test(suffix)
            )
        ) {
            continue;
        }
        const badness = token.length > 1
            ? badTokens.get(token) || 0
            : 1;
        if (badness < bestBadness) {
            bestToken = token;
            if (badness === 0) { break; }
            bestBadness = badness;
        }
    }
    if ( bestToken !== undefined ) {
        token = bestToken.toLowerCase();
        // tokenHash = urlTokenizer.tokenHashFromString(token);
        return token;
    }
}

let r = document.getElementById('regex');
let t = document.getElementById('target');
r.addEventListener('keyup', () => {
    t.textContent = extractTokenFromRegex(regex.value) || '';
})
