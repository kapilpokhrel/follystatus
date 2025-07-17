import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import url from 'url';
import { fileURLToPath, pathToFileURL } from 'url';
import { compile, preprocess } from 'svelte/compiler';
import { render } from 'svelte/server';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html as toJSX } from 'satori-html';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT) || 8005;
const OGImageBaseURL = process.env.OGImageBaseURL;
const DIST_DIR = path.join(__dirname, "../dist");
const INDEX_FILE = path.join(DIST_DIR, "index.html");

const getMimeType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
    };
    return mimeTypes[ext] || "application/octet-stream";
};

const cardComponentPath = path.resolve(__dirname, './components/Card.svelte');

const fontCache = new Map();

async function getFont(fontName) {
    if (fontCache.has(fontName)) {
        return fontCache.get(fontName);
    }

    const fontPath = path.join(__dirname, `./assets/fonts/${fontName}`);
    const buffer = await fs.readFile(fontPath);
    fontCache.set(fontName, buffer);
    return buffer;
}

async function getImage(jsx, options) {
    const svg = await satori(jsx, {
        width: options.width || 560,
        height: (options.width || 560)/(16/10),
        fonts: await Promise.all(options.fonts.map(async (currFont) => {
            return {
                name: currFont.name,
                data: await getFont(currFont.file),
                style: currFont.style || "normal",
                weight: currFont.weight || 400,
            }
        })),
    });

    const resvg = new Resvg(svg, {
            fitTo: {
                mode: 'width',
                value: options.imageWidth || 1200,
            }
        });

    const image = resvg.render();
    return image.asPng()
}

const componentCache = new Map();

async function getComponent(componentPath) {
    if (componentCache.has(componentPath)) {
        return componentCache.get(componentPath);
    }

    const svelteCode = await fs.readFile(componentPath, "utf-8");

    const aliasPreprocessor = {
        script: async ({ content }) => {
            const replaced = content.replace(/\$lib\//g, "./lib/");
            return { code: replaced };
        },
    };

    const preprocessed = await preprocess(svelteCode, aliasPreprocessor, {
        filename: "Card.svelte",
    });

    const compiled = compile(preprocessed.code, {
        generate: "server",
        css: "external",
    });

    const tempFile = path.join(__dirname, `.svelte-compiled-${path.basename(componentPath)}.mjs`);
    await fs.writeFile(tempFile, compiled.js.code, "utf-8");

    const module = await import(pathToFileURL(tempFile).href);
    const component = module.default;
    
    const out = { component: component, css: compiled.css.code };
    componentCache.set(componentPath, out);
    return out;
}

async function renderComponent(componentPath, props) {
    const { component, css } = await getComponent(componentPath);
    const componentRendered = render(component, {props: props});
    const renderedHTML = `${componentRendered.html}<style>${css}</style>`
    
    return renderedHTML;
}

async function handleImageRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/og-image') {
        const code = parsedUrl.query.code;
        const msg = parsedUrl.query.msg;
        await renderComponent(
            cardComponentPath, {selectedCode: code, currentMessage: msg}
        );
        const image = await getImage(
            toJSX(await renderComponent(
                cardComponentPath, {selectedCode: code, currentMessage: msg}
            )),
            {
                width: 560,
                imageWidth: 1200,
                fonts: [
                    {
                        name: 'EduVICWANTBeginner',
                        file: 'EduVICWANTBeginner-Medium.ttf',
                        weight: 500,
                    },
                    {
                        name: 'JetBrainsMono',
                        file: 'JetBrainsMono-Bold.ttf',
                        weight: 700,
                    }
                ]
            }
        );
        res.writeHead(200, {
            'Content-Type': 'image/png', // or image/jpeg etc. depending on your buffer
            'Content-Length': image.length
        });
        res.end(image);
        return;
    }
    res.writeHead(404);
    res.end('Not Found');
}

async function serveIndexHTML(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const code = parsedUrl.query.code;


    const msg = Array.isArray(parsedUrl.query.msg)
        ? parsedUrl.query.msg[0]
        : parsedUrl.query.msg;

    let meta = "";
    if (msg && code) {
        meta = `
<meta property="og:url" content="${req.url}">
<meta property="og:type" content="website">
<meta property="og:title" content="follyStatus">
<meta property="og:description" content="">
<meta property="og:image" content="${OGImageBaseURL}/og-image?code=${code}&msg=${encodeURIComponent(msg)}">

<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="follystatus.onrender.com">
<meta property="twitter:url" content="${req.url}">
<meta name="twitter:title" content="follyStatus">
<meta name="twitter:description" content="">
<meta name="twitter:image" content="${OGImageBaseURL}/og-image?code=${code}&msg=${encodeURIComponent(msg)}">
`;
    }
    try {
        const data = await fs.readFile(INDEX_FILE, "utf8");
        const modifiedHtml = data.replace("{__OG_IMAGE_META__}", meta);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(modifiedHtml);
    } catch (err) {
        console.error("Failed to serve index:", err);
        res.writeHead(500);
        res.end("Internal Server Error");
    }
}

async function serveFile(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    const requestedFile = pathname === "/" ? "/index.html" : pathname;
    const filePath = path.join(DIST_DIR, requestedFile);

    const isIndex = requestedFile === "/index.html";
    let stats;
    try {
        stats = await fs.stat(filePath);
    } catch {
        stats = null;
    }
    if (!stats || !stats.isFile() || isIndex) {
        serveIndexHTML(req, res).catch((err) => {
            console.error("Failed to serve index:", err);
            res.writeHead(500);
            res.end("Server Error");
        });
    } else {
        const mimeType = getMimeType(filePath);
        try {
            const content = await fs.readFile(filePath);
            res.writeHead(200, { "Content-Type": mimeType });
            res.end(content);
        } catch (err) {
            console.error("Failed to serve file:", err);
            res.writeHead(500);
            res.end("Server Error");
        }
    }
}

async function createServer() {
    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url, true);
        if (parsedUrl.pathname === '/og-image') {
            handleImageRequest(req, res);
        } else {
            serveFile(req, res)
        }
    });
    return server;
}

const server = await createServer();
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
