# Local Static Server

SVGotchi full local model mode uses localhost only as a static file server.

This server exists because normal browsers block direct-open `file://` SVG access to sibling model assets. Serving files over `http://127.0.0.1:<port>` gives the browser normal fetch semantics while preserving local browser inference.

## Static Serving Contract

Allowed:

- serve SVG files;
- serve JavaScript and module files;
- serve ONNX Runtime WASM files;
- serve tokenizer/config JSON;
- serve local ONNX model files;
- serve small committed preview assets;
- open the user's browser to the served SVG app document.

Forbidden:

- no model inference endpoint;
- no prompt submission endpoint;
- no hosted inference proxy;
- no external API calls;
- no runtime model downloads;
- no backend model execution.

The browser owns inference. Localhost only delivers static bytes.

## Commands

```bash
npm run serve:preview
npm run serve
```

For automated checks:

```bash
npm run serve:smoke
```

## Served Paths

The current static server exposes:

- `/` and `/index.html` for the SVGotchi SVG app document;
- `/assets/*` from committed small assets;
- `/models/*` from local model assets;
- `/runtime/*` from local runtime assets;
- `/vendor/transformers/*` for the browser Transformers.js bundle.

The server normalizes paths and rejects traversal outside the allowed roots.

## Security Notes

The server binds to `127.0.0.1`. It is intended for local use.

It should not be deployed as a production inference service. It has no inference route by design.

To audit the boundary, search the server code for request handling. It should only map paths to static files or generate the SVG app document. It should not inspect prompt text or call model APIs.
