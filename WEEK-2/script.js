// To‑Do App – Week 2 JS Fundamentals
// Data model
const STORAGE_KEY = 'todo.items.v1';
let todos = [];
let activeFilter = 'all'; // 'all' | 'active' | 'completed'

// Elements
const form = document.getElementById('new-todo-form');
const input = document.getElementById('new-todo-input');
const list = document.getElementById('todo-list');
const itemsLeftEl = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));

// Utils
const uid = () => Math.random().toString(36).slice(2, 9);
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
const load = () => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch { return []; }
};

function render() {
	// Filter
	let filtered = todos;
	if (activeFilter === 'active') filtered = todos.filter(t => !t.completed);
	if (activeFilter === 'completed') filtered = todos.filter(t => t.completed);

	// List
	list.innerHTML = filtered.map(item => templateItem(item)).join('');

	// Counter
	const left = todos.filter(t => !t.completed).length;
	itemsLeftEl.textContent = `${left} item${left === 1 ? '' : 's'} left`;

	// Filter button aria-selected
	filterButtons.forEach(btn => btn.setAttribute('aria-selected', String(btn.dataset.filter === activeFilter)));
}

function templateItem(item) {
	return `
		<li class="todo-item${item.completed ? ' completed' : ''}" data-id="${item.id}">
			<input class="checkbox" type="checkbox" ${item.completed ? 'checked' : ''} aria-label="Toggle completed" />
			<div class="title" role="textbox" aria-label="Edit title" tabindex="0">${escapeHtml(item.title)}</div>
			<div class="actions">
				<button class="icon-btn edit" title="Edit">Edit</button>
				<button class="icon-btn delete" title="Delete">Delete</button>
			</div>
		</li>`;
}

function escapeHtml(str) {
	return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
	todos = load();
	render();
});

// Add new todo
form?.addEventListener('submit', (e) => {
	e.preventDefault();
	const title = input.value.trim();
	if (!title) return;
	todos.push({ id: uid(), title, completed: false, createdAt: Date.now() });
	input.value = '';
	save();
	render();
});

// Clear completed
clearCompletedBtn?.addEventListener('click', () => {
	const before = todos.length;
	todos = todos.filter(t => !t.completed);
	if (todos.length !== before) { save(); render(); }
});

// Filters
filterButtons.forEach(btn => btn.addEventListener('click', () => {
	activeFilter = btn.dataset.filter;
	render();
}));

// Delegated events for list actions
list?.addEventListener('click', (e) => {
	const li = e.target.closest('.todo-item');
	if (!li) return;
	const id = li.dataset.id;
	const todo = todos.find(t => t.id === id);
	if (!todo) return;

	if (e.target.matches('.delete')) {
		todos = todos.filter(t => t.id !== id);
		save();
		render();
	}
	if (e.target.matches('.edit')) {
		startEdit(li, todo);
	}
});

list?.addEventListener('change', (e) => {
	if (e.target.matches('.checkbox')) {
		const li = e.target.closest('.todo-item');
		const todo = todos.find(t => t.id === li.dataset.id);
		if (!todo) return;
		todo.completed = e.target.checked;
		save();
		render();
	}
});

// Editing
function startEdit(li, todo) {
	const titleEl = li.querySelector('.title');
	titleEl.setAttribute('contenteditable', 'true');
	titleEl.focus();
	// Place caret at end
	placeCaretAtEnd(titleEl);

	const cancel = () => {
		titleEl.removeAttribute('contenteditable');
		titleEl.textContent = todo.title;
	};
	const commit = () => {
		const newTitle = titleEl.textContent.trim();
		if (!newTitle) { cancel(); return; }
		todo.title = newTitle;
		save();
		titleEl.removeAttribute('contenteditable');
		render();
	};

	const onKey = (ev) => {
		if (ev.key === 'Enter') { ev.preventDefault(); commit(); }
		if (ev.key === 'Escape') { ev.preventDefault(); cancel(); }
	};
	const onBlur = () => commit();

	titleEl.addEventListener('keydown', onKey, { once: false });
	titleEl.addEventListener('blur', onBlur, { once: true });
}

function placeCaretAtEnd(el) {
	const range = document.createRange();
	range.selectNodeContents(el);
	range.collapse(false);
	const sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
}

// Developer aid: expose for console
window.__todos = { get: () => todos, set: (arr) => { todos = arr; save(); render(); } };