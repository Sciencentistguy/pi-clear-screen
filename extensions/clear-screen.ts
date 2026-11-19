import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import { Container, type TUI } from "@earendil-works/pi-tui";

interface Transcript {
	loadedResources: Container;
	chat: Container;
}

// Pi mounts a document container as the first TUI child, laid out as
// [header, loaded resources, chat]. Only the latter two are display-only
// views of the session, so clearing them leaves the banner in place.
function findTranscript(tui: TUI): Transcript | undefined {
	const document = tui.children[0];
	if (!(document instanceof Container) || document.children.length !== 3) return undefined;
	const [, loadedResources, chat] = document.children;
	if (!(loadedResources instanceof Container) || !(chat instanceof Container)) return undefined;
	return { loadedResources, chat };
}

// ctx.ui.custom() is the only way for a command to reach the TUI instance;
// closing immediately means nothing is ever shown.
const captureTui = (ctx: ExtensionCommandContext) =>
	ctx.ui.custom<TUI>((tui, _theme, _keybindings, done) => {
		done(tui);
		return { render: () => [], invalidate() {} };
	});

export default function clearScreen(pi: ExtensionAPI) {
	pi.registerCommand("clear", {
		description: "Clear the screen (keeps context and session)",
		handler: async (_args, ctx) => {
			if (ctx.mode !== "tui") return;
			if (!ctx.isIdle()) {
				ctx.ui.notify("Cannot clear the screen while the agent is running", "warning");
				return;
			}

			const tui = await captureTui(ctx);
			const transcript = findTranscript(tui);
			if (!transcript) {
				ctx.ui.notify("clear-screen: unrecognised pi TUI layout", "error");
				return;
			}

			transcript.loadedResources.clear();
			transcript.chat.clear();
			// A forced render wipes the screen and scrollback, then redraws from the header down.
			tui.requestRender(true);
		},
	});
}
