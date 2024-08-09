import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { BuildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: BuildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body
      if (!title || !description) { return res.writeHead(401).end('Body error') }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        updated_at: new Date(),
        created_at: new Date(),
      }
      database.save('tasks', task)
      return res.writeHead(201).end('Task created')
    }
  },
  {
    method: 'GET',
    path: BuildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks')
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: BuildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description} = req.body
      if (!title || !description) { return res.writeHead(401).end('Body error') }

      const task = {
        title,
        description,
        updated_at: new Date(),
      }
      const result = database.update('tasks', id, task)
      if (result === null) { return res.writeHead(404).end('msg: Task not found') }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: BuildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const result = database.delete('tasks', id)
      if (result === null) { return res.writeHead(404).end('msg: Task not found') }
      
      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: BuildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const result = database.check('tasks', id)
      if (result === null) { return res.writeHead(404).end('msg: Task not found') }
      
      return res.writeHead(200).end('Task completed')
    }
  },
]