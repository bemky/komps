import Dropzone from '../lib/komps/dropzone.js';
import * as assert from 'assert';

function wait(ms = 10) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function dropEvent(files) {
    const event = new window.Event('drop', { bubbles: true, cancelable: true });
    event.dataTransfer = { files };
    return event;
}

describe('Dropzone', function () {

    describe('fileDrop', function () {
        it('includes the file and the originating drop event in detail', async function () {
            const dropzone = new Dropzone();
            document.body.append(dropzone);
            // connectedCallback is async — listeners attach a microtask later
            await wait();

            const details = [];
            dropzone.addEventListener('fileDrop', e => details.push(e.detail));

            const files = ['a.txt', 'b.txt'];
            const event = dropEvent(files);
            dropzone.dispatchEvent(event);

            assert.deepEqual(details.map(d => d.file), files);
            // One drop, one source event, shared across every file it carried
            assert.ok(details.every(d => d.sourceEvent === event));

            dropzone.remove();
        });
    });
});
