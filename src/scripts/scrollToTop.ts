const SHOW_THRESHOLD = 400;
const FOOTER_GAP = 16;

export function setupScrollToTop(root: ParentNode) {
	const button = root.querySelector<HTMLButtonElement>('.scroll-to-top');
	const footer = root.querySelector<HTMLElement>('footer');
	if (!button) return;

	const updateState = () => {
		button.classList.toggle('is-visible', window.scrollY > SHOW_THRESHOLD);

		if (footer) {
			const overlap = window.innerHeight - footer.getBoundingClientRect().top;
			button.style.setProperty('--footer-overlap', `${Math.max(overlap + FOOTER_GAP, 0)}px`);
		}
	};

	updateState();
	window.addEventListener('scroll', updateState, { passive: true });
	window.addEventListener('resize', updateState);

	button.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});
}
