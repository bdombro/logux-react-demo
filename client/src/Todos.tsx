import { useClient, useFilter, useSync } from '@logux/client/preact'
import {h} from 'preact'

import { defineSyncMap } from '@logux/client'

export const TodoType = defineSyncMap<{
  id: string,
  text: string,
  completed: boolean
}>('todos')

export default function Todos() {
	return <div>
		<TodoList />
		<TodoSingle />
	</div>
}

export function TodoList() {
	// const todos = useFilter('todos', { projectId })
	const todos = useFilter(TodoType, {})
	if (todos.isLoading) return<div>Loading...</div>

	return (
		<div>
			<h2>Todos List</h2>
			<ul>
				{todos.isEmpty && <li>No todos</li>}
				{todos.list.map(todo => <Todo todo={todo} key={todo.id} />)}
			</ul>
		</div>
	)

	function addTodo() {
		// client.
	}
}

export function TodoSingle() {
	const todo = useSync(TodoType, '5ojFLbhTE14USFbQ3EyBb')
	if (todo.isLoading) return<div>Loading1...</div>
	const todos = {list: [todo]}

	return (
		<div>
			<h2>Todo Single</h2>
			<ul>
				{todos.list.map(todo => <Todo todo={todo} key={todo.id} />)}
			</ul>
		</div>
	)

	function addTodo() {
		// client.
	}
}

function Todo({todo}: {todo: any}) {
	return (
		<li onClick={() => todo.completed = !todo.completed}>
			{todo.id} {todo.text}{' '}
			{todo.completed ? '✓' : 'x'}
		</li>
	)
}

