import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import url from 'url';
import { fileURLToPath, pathToFileURL } from 'url';
import { compile, compileModule } from 'svelte/compiler';
import { render } from 'svelte/server';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html as toJSX } from 'satori-html';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cardComponentPath = path.resolve(__dirname, '../components/Card.svelte');

async function getFont(fontName) {
    const fontPath = path.join(__dirname, `../assets/fonts/${fontName}`);
    const buffer = await fs.readFile(fontPath);
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
   
async function renderComponent(componentPath, props) {
    const svelteCode = await fs.readFile(componentPath, 'utf-8');

    const compiled = compile(svelteCode, {generate: 'server', css: 'external'});

    const tempFile = path.join(__dirname, `.svelte-compiled-card.mjs`);
    await fs.writeFile(tempFile, compiled.js.code, 'utf-8');

    const module = await import(pathToFileURL(tempFile).href);
    const component = module.default;
    const componentRendered = render(component, {props: props});
    const renderedHTML = `${componentRendered.html}<style>${compiled.css.code}</style>`
    console.log(renderedHTML)
    
    await fs.unlink(tempFile);
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

async function createServer() {
    const server = http.createServer((req, res) => {handleImageRequest(req, res)});
    return server;
}

const server = await createServer();
server.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});

