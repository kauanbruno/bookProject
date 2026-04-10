const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const SECRET_KEY = 'bookapp-secret-key-12345';
const expiresIn = '24h';

function createToken(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function verifyToken(token) {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    return decoded;
  } catch {
    return null;
  }
}

server.post('/login', (req, res) => {
  const { email, password } = req.body;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'UTF-8'));
  const user = db.users?.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  const accessToken = createToken({ 
    id: user.id, 
    email: user.email, 
    name: user.name, 
    role: user.role 
  });

  res.json({
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

server.use((req, res, next) => {
  if (req.path === '/login') {
    return next();
  }

  if (req.path.startsWith('/books/with-progress') || req.path.startsWith('/my-library')) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  req.user = decoded;
  next();
});

server.get('/userBooks', (req, res) => {
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'UTF-8'));
  const userId = req.user.id;
  const userBooks = db.userBooks?.filter(ub => ub.userId === userId) || [];
  res.json(userBooks);
});

server.get('/books/with-progress', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;
  const decoded = token ? verifyToken(token) : null;
  const userId = decoded ? decoded.id : null;
  
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'UTF-8'));
  
  const booksWithProgress = db.books.map(book => {
    if (userId) {
      const userBook = db.userBooks?.find(ub => ub.userId === userId && ub.bookId === book.id);
      if (userBook) {
        return {
          ...book,
          inLibrary: true,
          userStatus: userBook.status || null,
          userPagesRead: userBook.pagesRead || 0
        };
      }
    }
    return {
      ...book,
      inLibrary: false,
      userStatus: null,
      userPagesRead: 0
    };
  });
  
  res.json(booksWithProgress);
});

server.get('/my-library', (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'UTF-8'));
  const userId = req.user.id;
  const userBooks = db.userBooks?.filter(ub => ub.userId === userId) || [];
  
  const libraryBooks = userBooks.map(userBook => {
    const book = db.books.find(b => b.id === userBook.bookId);
    if (book) {
      return {
        ...book,
        inLibrary: true,
        userStatus: userBook.status,
        userPagesRead: userBook.pagesRead
      };
    }
    return null;
  }).filter(b => b !== null);
  
  res.json(libraryBooks);
});

server.get('/userBooks/:bookId', (req, res) => {
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'UTF-8'));
  const userId = req.user.id;
  const bookId = parseInt(req.params.bookId);
  const userBook = db.userBooks?.find(ub => ub.userId === userId && ub.bookId === bookId);
  res.json(userBook || null);
});

server.post('/userBooks', (req, res) => {
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'UTF-8'));
  const { bookId, status, pagesRead } = req.body;
  const userId = req.user.id;
  
  const existingIndex = db.userBooks?.findIndex(ub => ub.userId === userId && ub.bookId === bookId);
  
  if (existingIndex >= 0) {
    db.userBooks[existingIndex] = { ...db.userBooks[existingIndex], status, pagesRead };
  } else {
    const newUserBook = {
      id: db.userBooks ? db.userBooks.length + 1 : 1,
      userId,
      bookId,
      status,
      pagesRead
    };
    db.userBooks = db.userBooks || [];
    db.userBooks.push(newUserBook);
  }
  
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2));
  res.json(db.userBooks.find(ub => ub.userId === userId && ub.bookId === bookId));
});

server.use(router);
server.listen(3001, () => {
  console.log('JSON Server is running on http://localhost:3001');
});