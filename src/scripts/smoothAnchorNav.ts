export function setupSmoothAnchorNav(root: ParentNode) {
	root.querySelectorAll<HTMLAnchorElement>('nav a[href^="/#"]').forEach((link) => {
		link.addEventListener('click', (event) => {
			const id = link.hash.slice(1);
			const target = document.getElementById(id);
			if (!target) return;

			event.preventDefault();
			target.scrollIntoView({ behavior: 'smooth' });
		});
	});
}
