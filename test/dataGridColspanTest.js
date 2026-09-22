import DataGrid from '../lib/komps/data-grid.js';
import DataGridColumn from '../lib/komps/data-grid/column.js';
import * as assert from 'assert';

function wait(ms = 20) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function buildGrid(columns) {
    const grid = new DataGrid({ style: 'height: 400px', columns, data: [{}, {}] });
    document.body.append(grid);
    // initialize runs on connect; wait for the scaffold (header cells) to exist.
    for (let i = 0; i < 50 && !grid.columns?.[0]?.headerCell; i++) await wait(10);
    return grid;
}

describe('DataGridColumn colspan', function () {
    describe('unit — track sizing + placement', function () {
        it('defaults to a single track spanning one line', function () {
            const col = new DataGridColumn({ width: 120, index: 0 });
            assert.equal(col.colspan, 1);
            assert.deepEqual(col.trackSizes(80), [120]);
            assert.equal(col.totalWidth(80), 120);
            assert.equal(col.gridColumn(), '1');
        });

        it('splits width evenly across colspan tracks by default', function () {
            const col = new DataGridColumn({ width: 360, colspan: 3, index: 1 });
            assert.deepEqual(col.trackSizes(80), [120, 120, 120]);
            assert.equal(col.totalWidth(80), 360);
        });

        it('honors explicit tracks (array or px string); width is their sum', function () {
            const arr = new DataGridColumn({ colspan: 2, tracks: [100, 200] });
            assert.deepEqual(arr.trackSizes(80), [100, 200]);
            assert.equal(arr.totalWidth(80), 300);

            const str = new DataGridColumn({ colspan: 3, tracks: '90px 90px 120px' });
            assert.deepEqual(str.trackSizes(80), [90, 90, 120]);
            assert.equal(str.totalWidth(80), 300);
        });

        it('falls back to defaultWidth when width is unset/invalid', function () {
            assert.deepEqual(new DataGridColumn({}).trackSizes(80), [80]);
            assert.deepEqual(new DataGridColumn({ width: 'auto' }).trackSizes(80), [80]);
        });

        it('gridColumn() spans from the assigned start line', function () {
            const col = new DataGridColumn({ colspan: 3, index: 1 });
            col.startLine = 2;
            assert.equal(col.gridColumn(), '2 / span 3');
        });

        it('setWidth rescales explicit tracks proportionally', function () {
            const col = new DataGridColumn({ colspan: 2, tracks: [100, 300] }); // total 400
            col.setWidth(200); // halve
            assert.deepEqual(col.trackSizes(80), [50, 150]);
            assert.equal(col.width, 200);
        });

        it('setWidth on a default-split column just updates width', function () {
            const col = new DataGridColumn({ colspan: 3, width: 300 });
            col.setWidth(600);
            assert.deepEqual(col.trackSizes(80), [200, 200, 200]);
        });

        it('resizeTrack redistributes between neighbors, keeping the total', function () {
            const col = new DataGridColumn({ colspan: 3, tracks: [150, 130, 120] });
            col.resizeTrack(0, 180);
            assert.deepEqual(col.trackSizes(80), [180, 100, 120]);
            assert.equal(col.totalWidth(80), 400);
        });

        it('resizeTrack clamps both sides to min', function () {
            const col = new DataGridColumn({ colspan: 3, tracks: [150, 130, 120] });
            col.resizeTrack(0, 500, 24); // pair is 280 → capped at 256
            assert.deepEqual(col.trackSizes(80), [256, 24, 120]);
        });

        it('resizeTrack materializes a default-split column', function () {
            const col = new DataGridColumn({ colspan: 3, width: 300 });
            col.resizeTrack(0, 150, 0, 100); // even split [100,100,100] → [150,50,100]
            assert.deepEqual(col.trackSizes(100), [150, 50, 100]);
        });

        it('resizeTrack is a no-op on the last track (no right neighbor)', function () {
            const col = new DataGridColumn({ colspan: 3, tracks: [150, 130, 120] });
            col.resizeTrack(2, 200);
            assert.deepEqual(col.trackSizes(80), [150, 130, 120]);
        });
    });

    describe('grid integration — template + start lines', function () {
        it('expands a colspan column into sub-tracks and offsets later columns', async function () {
            const grid = await buildGrid([
                { header: 'A', width: 100 },
                { header: 'Markets', width: 360, colspan: 3 },
                { header: 'B', width: 80 }
            ]);

            assert.equal(grid.columnTemplate(), '100px 120px 120px 120px 80px');
            assert.equal(grid.style.getPropertyValue('--dg-template-columns'), '100px 120px 120px 120px 80px');
            assert.deepEqual(grid.columns.map(c => c.startLine), [1, 2, 5]);

            // Total width is unchanged — geometry stays one entry per column.
            assert.equal(grid.columnGeometry.extent, 540);
            assert.equal(grid.style.getPropertyValue('--dg-width'), '540px');

            assert.equal(grid.columns[0].headerCell.style.gridColumn, '1');
            assert.equal(grid.columns[1].headerCell.style.gridColumn, '2 / span 3');
            assert.equal(grid.columns[2].headerCell.style.gridColumn, '5');

            // The colspan header cell is a subgrid so its content aligns to the sub-tracks.
            assert.equal(grid.columns[1].headerCell.style.display, 'grid');
            assert.equal(grid.columns[1].headerCell.style.gridTemplateColumns, 'subgrid');
            assert.equal(grid.columns[0].headerCell.style.display, '');

            grid.remove();
        });

        it('a plain grid still gets one track per column (regression)', async function () {
            const grid = await buildGrid([{ header: 'A', width: 100 }, { header: 'B', width: 80 }]);
            assert.equal(grid.columnTemplate(), '100px 80px');
            assert.deepEqual(grid.columns.map(c => c.startLine), [1, 2]);
            assert.equal(grid.columns[0].headerCell.style.gridColumn, '1');
            assert.equal(grid.columns[1].headerCell.style.gridColumn, '2');
            grid.remove();
        });

        it('recomputes start lines + template after a reorder', async function () {
            const grid = await buildGrid([
                { header: 'A', width: 100 },
                { header: 'Markets', width: 360, colspan: 3 },
                { header: 'B', width: 80 }
            ]);

            // Move Markets to the front (what the reorder plugin does to the array).
            const [markets] = grid.columns.splice(1, 1);
            grid.columns.unshift(markets);
            grid.reindexColumns(0);
            grid.columnGeometry.rebuildFrom(0);
            grid.applyColumnGeometry();

            assert.equal(grid.columnTemplate(), '120px 120px 120px 100px 80px');
            assert.deepEqual(grid.columns.map(c => c.startLine), [1, 4, 5]);
            assert.equal(grid.columns[0].gridColumn(), '1 / span 3');

            grid.remove();
        });
    });
});
