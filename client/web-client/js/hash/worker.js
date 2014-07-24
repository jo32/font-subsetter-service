importScripts('libs/cryptojs-3.1.2/sha1.js', 'libs/cryptojs-3.1.2/lib-typedarrays-min.js');

self.onmessage = function (event) {

    var file = event.data;
    if (!file) {
        return;
    }

    var sha1 = CryptoJS.algo.SHA1.create();

    var reader = new FileReaderSync();
    var data = reader.readAsArrayBuffer(file);
    var unit8Array = new Uint8Array(data);
    var message = new CryptoJS.lib.WordArray.init(unit8Array);

    sha1.update(message);
    var hash = sha1.finalize().toString();
    self.postMessage({
        "file": file,
        "hash": hash
    });
}