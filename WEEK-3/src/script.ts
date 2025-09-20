import { TodoItem, FilterType } from './types.js';

// Constants
const STORAGE_KEY = 'todo.items.v1';

// Application State
class TodoApp {
  private todos: TodoItem[] = [];
  private activeFilter: FilterType = 'all';

  // DOM Elements
  private form: HTMLFormElement | null;
  private input: HTMLInputElement | null;
  private list: HTMLUListElement | null;
  private itemsLeftEl: HTMLSpanElement | null;
  private clearCompletedBtn: HTMLButtonElement | null;
  private filterButtons: HTMLButtonElement[];

  constructor() {
    // Get DOM elements with proper typing
    this.form = document.getElementById('new-todo-form') as HTMLFormElement;
    this.input = document.getElementById('new-todo-input') as HTMLInputElement;
    this.list = document.getElementById('todo-list') as HTMLUListElement;
    this.itemsLeftEl = document.getElementById('items-left') as HTMLSpanElement;
    this.clearCompletedBtn = document.getElementById('clear-completed') as HTMLButtonElement;
    this.filterButtons = Array.from(document.querySelectorAll('[data-filter]')) as HTMLButtonElement[];

    this.init();
  }

  private init(): void {
    this.todos = this.loadFromStorage();
    this.bindEvents();
    this.render();
  }

  // Utility functions
  private generateId(): string {
    return Math.random().toString(36).slice(2, 9);
  }

  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
  }

  private loadFromStorage(): TodoItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private escapeHtml(str: string): string {
    const escapeMap: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, (c) => escapeMap[c]);
  }

  // Rendering
  private render(): void {
    this.renderList();
    this.renderCounter();
    this.renderFilters();
  }

  private renderList(): void {
    if (!this.list) return;

    let filtered = this.todos;
    if (this.activeFilter === 'active') {
      filtered = this.todos.filter(t => !t.completed);
    } else if (this.activeFilter === 'completed') {
      filtered = this.todos.filter(t => t.completed);
    }

    this.list.innerHTML = filtered.map(item => this.templateItem(item)).join('');
  }

  private templateItem(item: TodoItem): string {
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

  private renderCounter(): void {
    if (!this.itemsLeftEl) return;

    const left = this.todos.filter(t => !t.completed).length;
    this.itemsLeftEl.textContent = `${left} item${left === 1 ? '' : 's'} left`;
  }

  private renderFilters(): void {
    this.filterButtons.forEach(btn => {
      btn.setAttribute('aria-selected', String(btn.dataset.filter === this.activeFilter));
    });
  }

  // Event handlers
  private bindEvents(): void {
    this.bindFormEvents();
    this.bindFilterEvents();
    this.bindListEvents();
    this.bindClearCompletedEvent();
  }

  private bindFormEvents(): void {
    this.form?.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.handleAddTodo();
    });
  }

  private bindFilterEvents(): void {
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeFilter = btn.dataset.filter as FilterType;
        this.render();
      });
    });
  }

  private bindListEvents(): void {
    this.list?.addEventListener('click', (e: Event) => {
      this.handleListClick(e);
    });

    this.list?.addEventListener('change', (e: Event) => {
      this.handleListChange(e);
    });
  }

  private bindClearCompletedEvent(): void {
    this.clearCompletedBtn?.addEventListener('click', () => {
      this.handleClearCompleted();
    });
  }

  // Action handlers
  private handleAddTodo(): void {
    if (!this.input) return;

    const title = this.input.value.trim();
    if (!title) return;

    const newTodo: TodoItem = {
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

  private handleListClick(e: Event): void {
    const target = e.target as HTMLElement;
    const li = target.closest('.todo-item') as HTMLLIElement;
    if (!li) return;

    const id = li.dataset.id;
    if (!id) return;

    const todo = this.todos.find(t => t.id === id);
    if (!todo) return;

    if (target.matches('.delete')) {
      this.deleteTodo(id);
    } else if (target.matches('.edit')) {
      this.startEdit(li, todo);
    }
  }

  private handleListChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (!target.matches('.checkbox')) return;

    const li = target.closest('.todo-item') as HTMLLIElement;
    const id = li?.dataset.id;
    if (!id) return;

    const todo = this.todos.find(t => t.id === id);
    if (!todo) return;

    todo.completed = target.checked;
    this.saveToStorage();
    this.render();
  }

  private handleClearCompleted(): void {
    const before = this.todos.length;
    this.todos = this.todos.filter(t => !t.completed);
    
    if (this.todos.length !== before) {
      this.saveToStorage();
      this.render();
    }
  }

  private deleteTodo(id: string): void {
    this.todos = this.todos.filter(t => t.id !== id);
    this.saveToStorage();
    this.render();
  }

  // Editing functionality
  private startEdit(li: HTMLLIElement, todo: TodoItem): void {
    const titleEl = li.querySelector('.title') as HTMLElement;
    if (!titleEl) return;

    titleEl.setAttribute('contenteditable', 'true');
    titleEl.focus();
    this.placeCaretAtEnd(titleEl);

    const cancel = (): void => {
      titleEl.removeAttribute('contenteditable');
      titleEl.textContent = todo.title;
    };

    const commit = (): void => {
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

    const onKey = (ev: KeyboardEvent): void => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        commit();
      } else if (ev.key === 'Escape') {
        ev.preventDefault();
        cancel();
      }
    };

    const onBlur = (): void => commit();

    titleEl.addEventListener('keydown', onKey);
    titleEl.addEventListener('blur', onBlur, { once: true });
  }

  private placeCaretAtEnd(el: HTMLElement): void {
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
  public getTodos(): TodoItem[] {
    return [...this.todos];
  }

  public setTodos(todos: TodoItem[]): void {
    this.todos = todos;
    this.saveToStorage();
    this.render();
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new TodoApp();
  
  // Developer aid: expose for console
  (window as any).__todoApp = app;
});