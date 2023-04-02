const fs = require('fs')
const path = require('path')

const JSBOX_CODE = `
// JSBOX_CODE_START
const safari = require("safari")
safari.open(LOCAL_URL)
// JSBOX_CODE_END
`;
const indexPath = path.resolve(__dirname, '../dist/index.js');

fs.appendFileSync(indexPath, JSBOX_CODE, { encoding: 'utf-8' })