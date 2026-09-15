import Spreadsheet from '../lib/komps/spreadsheet.js';
import SpreadsheetColumn from '../lib/komps/spreadsheet/column.js';
import * as assert from 'assert';

/** A column whose stored value is an opaque id, carrying a richer `text/html`
 *  representation for copy and pulling the id back out of it on paste — the
 *  belongs-to scenario from issue #82. */
class IdColumn extends SpreadsheetColumn {
    static pasteAccepts = ['text/html', 'text/plain']

    valueFor(record) {
        return {
            'text/plain': String(record[this.attribute]),
            'text/html': `<span data-id="${record[this.attribute]}">${record.name}</span>`
        }
    }

    parsePaste(value, type) {
        if (type === 'text/html') {
            const match = value.match(/data-id="([^"]*)"/)
            if (match) return match[1]
        }
        return value
    }
}

async function buildGrid(columns, data) {
    const grid = new Spreadsheet({ style: 'height: 300px', columns, data })
    document.body.append(grid)
    while (!grid.rows) await new Promise(r => setTimeout(r, 0))
    return grid
}

describe('Spreadsheet', function () {

    describe('copy', function () {
        it('builds text/plain and text/html payloads, falling back to the escaped plain value when a column has no text/html representation', async function () {
            const grid = await buildGrid(
                [{ attribute: 'name' }, new IdColumn({ attribute: 'id' })],
                [{ id: 1, name: 'Ben & Jerry' }]
            )
            grid.selection = { anchor: { row: 0, col: 0 }, focus: { row: 0, col: 1 } }

            const tsv = await grid.copyText()
            assert.strictEqual(tsv, 'Ben & Jerry\t1')

            const html = await grid.copyHtml()
            assert.strictEqual(html, '<table><tr><td>Ben &amp; Jerry</td><td><span data-id="1">Ben & Jerry</span></td></tr></table>')
        })
    })

    describe('paste', function () {
        it('splits TSV text into a matrix, dropping a trailing empty row', function () {
            const grid = new Spreadsheet()
            assert.deepStrictEqual(grid.matrixFromText('a\tb\nc\td\n'), [['a', 'b'], ['c', 'd']])
            assert.deepStrictEqual(grid.matrixFromText('a\tb\nc\td'), [['a', 'b'], ['c', 'd']])
        })

        it('parses a pasted <table> into a matrix of cell innerHTML', function () {
            const grid = new Spreadsheet()
            const matrix = grid.matrixFromHtml('<table><tr><td>a</td><td><b>b</b></td></tr></table>')
            assert.deepStrictEqual(matrix, [['a', '<b>b</b>']])
        })

        it('returns null for html with no table', function () {
            const grid = new Spreadsheet()
            assert.strictEqual(grid.matrixFromHtml('<div>no table here</div>'), null)
        })

        it('pastes text/html into a column that declares support for it, and text/plain into one that does not', async function () {
            const grid = await buildGrid(
                [{ attribute: 'name' }, new IdColumn({ attribute: 'id' })],
                [{ id: 1, name: 'Alice' }]
            )
            grid.active = { row: 0, col: 0 }
            grid.selection = { anchor: { row: 0, col: 0 }, focus: { row: 0, col: 1 } }

            grid.pasteData({
                'text/plain': 'Bob\t2',
                'text/html': '<table><tr><td>Bob</td><td><span data-id="2">Bob</span></td></tr></table>'
            })
            await new Promise(r => setTimeout(r, 0))

            assert.strictEqual(grid.rows[0].record.name, 'Bob')
            assert.strictEqual(grid.rows[0].record.id, '2')
        })

        it('falls back to the plain-text matrix when the pasted HTML table shape does not match the TSV', async function () {
            const grid = await buildGrid(
                [{ attribute: 'name' }, new IdColumn({ attribute: 'id' })],
                [{ id: 1, name: 'Alice' }]
            )
            grid.active = { row: 0, col: 0 }
            grid.selection = { anchor: { row: 0, col: 0 }, focus: { row: 0, col: 1 } }

            grid.pasteData({
                'text/plain': 'Bob\t2',
                // A single-cell table — shape doesn't match the 1x2 TSV, so it's ignored.
                'text/html': '<table><tr><td>Bob 2</td></tr></table>'
            })
            await new Promise(r => setTimeout(r, 0))

            assert.strictEqual(grid.rows[0].record.name, 'Bob')
            // The id column's html-shaped round-trip only kicks in when the table lines up;
            // with html ignored here it receives plain text like any text/plain column.
            assert.strictEqual(grid.rows[0].record.id, '2')
        })
    })
})
