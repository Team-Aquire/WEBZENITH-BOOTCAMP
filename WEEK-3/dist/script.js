// Constants
const STORAGE_KEY = 'todo.items.v1';
// Application State
class TodoApp {
    constructor() {
        this.todos = [];
        this.activeFilter = 'all';
        // Get DOM elements with proper typing
        this.form = document.getElementById('new-todo-form');
        this.input = document.getElementById('new-todo-input');
        this.list = document.getElementById('todo-list');
        this.itemsLeftEl = document.getElementById('items-left');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
        this.init();
    }
    init() {
        this.todos = this.loadFromStorage();
        this.bindEvents();
        this.render();
    }
    // Utility functions
    generateId() {
        return Math.random().toString(36).slice(2, 9);
    }
    saveToStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
    }
    loadFromStorage() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw)
                return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        }
        catch {
            return [];
        }
    }
    escapeHtml(str) {
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return str.replace(/[&<>"']/g, (c) => escapeMap[c]);
    }
    // Rendering
    render() {
        this.renderList();
        this.renderCounter();
        this.renderFilters();
    }
    renderList() {
        if (!this.list)
            return;
        let filtered = this.todos;
        if (this.activeFilter === 'active') {
            filtered = this.todos.filter(t => !t.completed);
        }
        else if (this.activeFilter === 'completed') {
            filtered = this.todos.filter(t => t.completed);
        }
        this.list.innerHTML = filtered.map(item => this.templateItem(item)).join('');
    }
    templateItem(item) {
        return `
      <li class="todo-item${item.completed ? ' completed' : ''}" data-id="${item.id}">
        <input class="checkbox" type="checkbox" ${item.completed ? 'checked' : ''} aria-label="Toggle completed" />
        <div class="title" role="textbox" aria-label="Edit title" tabindex="0">${this.escapeHtml(item.title)}</div>
        <div class="actions">
          <button class="icon-btn edit" title="Edit">Edit</button>
          <button class="icon-btn delete" title="Delete">Delete</button>
        </div>
      </li>`;
    }
    renderCounter() {
        if (!this.itemsLeftEl)
            return;
        const left = this.todos.filter(t => !t.completed).length;
        this.itemsLeftEl.textContent = `${left} item${left === 1 ? '' : 's'} left`;
    }
    renderFilters() {
        this.filterButtons.forEach(btn => {
            btn.setAttribute('aria-selected', String(btn.dataset.filter === this.activeFilter));
        });
    }
    // Event handlers
    bindEvents() {
        this.bindFormEvents();
        this.bindFilterEvents();
        this.bindListEvents();
        this.bindClearCompletedEvent();
    }
    bindFormEvents() {
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTodo();
        });
    }
    bindFilterEvents() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeFilter = btn.dataset.filter;
                this.render();
            });
        });
    }
    bindListEvents() {
        this.list?.addEventListener('click', (e) => {
            this.handleListClick(e);
        });
        this.list?.addEventListener('change', (e) => {
            this.handleListChange(e);
        });
    }
    bindClearCompletedEvent() {
        this.clearCompletedBtn?.addEventListener('click', () => {
            this.handleClearCompleted();
        });
    }
    // Action handlers
    handleAddTodo() {
        if (!this.input)
            return;
        const title = this.input.value.trim();
        if (!title)
            return;
        const newTodo = {
            id: this.generateId(),
            title,
            completed: false,
            createdAt: Date.now()
        };
        this.todos.push(newTodo);
        this.input.value = '';
        this.saveToStorage();
        this.render();
    }
    handleListClick(e) {
        const target = e.target;
        const li = target.closest('.todo-item');
        if (!li)
            return;
        const id = li.dataset.id;
        if (!id)
            return;
        const todo = this.todos.find(t => t.id === id);
        if (!todo)
            return;
        if (target.matches('.delete')) {
            this.deleteTodo(id);
        }
        else if (target.matches('.edit')) {
            this.startEdit(li, todo);
        }
    }
    handleListChange(e) {
        const target = e.target;
        if (!target.matches('.checkbox'))
            return;
        const li = target.closest('.todo-item');
        const id = li?.dataset.id;
        if (!id)
            return;
        const todo = this.todos.find(t => t.id === id);
        if (!todo)
            return;
        todo.completed = target.checked;
        this.saveToStorage();
        this.render();
    }
    handleClearCompleted() {
        const before = this.todos.length;
        this.todos = this.todos.filter(t => !t.completed);
        if (this.todos.length !== before) {
            this.saveToStorage();
            this.render();
        }
    }
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveToStorage();
        this.render();
    }
    // Editing functionality
    startEdit(li, todo) {
        const titleEl = li.querySelector('.title');
        if (!titleEl)
            return;
        titleEl.setAttribute('contenteditable', 'true');
        titleEl.focus();
        this.placeCaretAtEnd(titleEl);
        const cancel = () => {
            titleEl.removeAttribute('contenteditable');
            titleEl.textContent = todo.title;
        };
        const commit = () => {
            const newTitle = titleEl.textContent?.trim() || '';
            if (!newTitle) {
                cancel();
                return;
            }
            todo.title = newTitle;
            this.saveToStorage();
            titleEl.removeAttribute('contenteditable');
            this.render();
        };
        const onKey = (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                commit();
            }
            else if (ev.key === 'Escape') {
                ev.preventDefault();
                cancel();
            }
        };
        const onBlur = () => commit();
        titleEl.addEventListener('keydown', onKey);
        titleEl.addEventListener('blur', onBlur, { once: true });
    }
    placeCaretAtEnd(el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    // Public methods for debugging
    getTodos() {
        return [...this.todos];
    }
    setTodos(todos) {
        this.todos = todos;
        this.saveToStorage();
        this.render();
    }
}
// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
    // Developer aid: expose for console
    window.__todoApp = app;
});
export {};
