import * as $ from 'svelte/internal/server';
import { statusCodeMap } from "./lib/status_codes.js";

export default function _unknown_($$payload, $$props) {
	$.push();

	let { selectedCode, currentMessage } = $$props;

	$$payload.out += `<div class="card svelte-2wty8a"><div class="card-code svelte-2wty8a">${$.escape(selectedCode)}: ${$.escape(statusCodeMap[parseInt(selectedCode)])}</div> <div class="card-message svelte-2wty8a">${$.escape(currentMessage)}</div></div>`;
	$.pop();
}