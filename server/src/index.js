import { Server } from '@logux/server'
import Datastore from 'nedb'
import path from 'path'
// import bcrypt from 'bcrypt'
// import jwt from 'jwt-simple'

const JWT_SECRET='secret'

import Todos from './todos.js'

const server = new Server(
  Server.loadOptions(process, {
    subprotocol: '1.0.0',
    supports: '1.x',
    // root: __dirname
    root: path.resolve(),
  })
)


server.auth((userId, token) => {
  // Allow only local users until we will have a proper authentication
  return process.env.NODE_ENV !== 'production'
});

// server.auth(({ userId, token }) => {
//   if (userId === 'anonymous') {
//     return true
//   } else {
//     try {
//       const data = jwt.decode(token, process.env.JWT_SECRET)
//       return data.sub === userId
//     } catch (e) {
//       return false
//     }
//   }
// })

// server.type('login', {
//   async access (ctx) {
//     return ctx.userId === 'anonymous'
//   },
//   async process (ctx, action, meta) {
//     const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', action.email)
//     if (!user) {
//       server.undo(action, meta, 'Unknown email')
//     } else if (await bcrypt.compare(action.password, hash)) {
//       let token = jwt.encode({ sub: user.id }, process.env.JWT_SECRET)
//       ctx.sendBack({ type: 'login/done', userId: user.id, token })
//     } else {
//       server.undo(action, meta, 'Wrong password')
//     }
//   }
// })

// server.http((req, res) => {
//   if (req.url === '/auth') {
//     // const token = signIn(req)
//     //     meta( name="token" content=JWT.encode({ sub: current_user.id }, ENV['JWT_SECRET'], 'HS256') )
    
//     if (token) {
//       res.setHeader('Set-Cookie', `token=${token}; Secure; HttpOnly`)
//       res.end()
//     } else {
//       res.statusCode = 400
//       res.end('Wrong user or password')
//     }
//   }
// })


const db = new Datastore({ filename: 'db/test.db', autoload: true });
const todos = new Todos(db);

function sendBackTodo(ctx, todo) {
  const { id } = todo;
  if (todo.meta.deleted) {
    ctx.sendBack({ type: 'DELETE_TODO', id });
  } else {
    const { text, completed } = todo;
    ctx.sendBack({ type: 'ADD_TODO', id, text, completed });
  }
}

server.channel('todos/:id', {
  access (ctx, action, meta) {
    // return ctx.params.id === ctx.userId
    return true
  },
  // filter (ctx, action, meta) {
  //   return (otherCtx, otherAction, otherMeta) => {
  //     return !action.hidden
  //   }
  // },
  // async init (ctx, action, meta) {
  //   const todo = await todos.find(ctx.params.id)
  //   // ctx.sendBack(ctx, todo)
  //   sendBackTodo(ctx, todo);
  // },
  async load (ctx, action, meta) {
    const todo = await todos.find(ctx.params.id)
    // ctx.sendBack(ctx, todo)
    sendBackTodo(ctx, todo);
  }
})

server.channel('todos', {
  access(ctx, action, meta) {
    return true;
  },
  // filter (ctx, action, meta) {
  //   return (otherCtx, otherAction, otherMeta) => {
  //     return !action.hidden
  //   }
  // },
  async init (ctx, action, meta) {
    for (let todo of await todos.all()) {
      sendBackTodo(ctx, todo);
    }
  },
  async load (ctx, action, meta) {
    for (let todo of await todos.all()) {
      sendBackTodo(ctx, todo);
    }
  }
});

server.type('ADD_TODO', {
  access(ctx, action, meta) {
    return true;
  },
  resend(ctx, action, meta) {
    return { channel: 'todos' };
  },
  async process(ctx, action, meta) {
    await todos.addTodo(action.id, action.text, meta);
  }
});

server.type('EDIT_TODO', {
  access(ctx, action, meta) {
    return true;
  },
  resend(ctx, action, meta) {
    return { channel: 'todos' };
  },
  async process(ctx, action, meta) {
    await todos.editTodo(action.id, action.text, meta);
  }
});

server.type('DELETE_TODO', {
  access(ctx, action, meta) {
    return true;
  },
  resend(ctx, action, meta) {
    return { channel: 'todos' };
  },
  async process(ctx, action, meta) {
    await todos.removeTodo(action.id, meta);
  }
});

server.type('COMPLETE_TODO', {
  access(ctx, action, meta) {
    return true;
  },
  resend(ctx, action, meta) {
    return { channel: 'todos' };
  },
  async process(ctx, action, meta) {
    await todos.toggleTodo(action.id, meta);
  }
});

server.type('CLEAR_COMPLETED', {
  access(ctx, action, meta) {
    return true;
  },
  resend(ctx, action, meta) {
    return { channel: 'todos' };
  },
  async process(ctx, action, meta) {
    await todos.clearCompleted(meta);
  }
});

server.listen();
