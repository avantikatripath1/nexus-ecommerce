import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const JWT_SECRET = process.env.JWT_SECRET || 'nexus_super_secret_key';
const DATA_FILE = path.join(process.cwd(), 'db.json');

// Initialize DB
if (!fs.existsSync(DATA_FILE) || JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')).products.length < 100 || fs.readFileSync(DATA_FILE, 'utf-8').includes('loremflickr.com')) {
  const categories = [
    { id: '1', name: 'Laptops', slug: 'laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800' },
    { id: '2', name: 'Audio', slug: 'audio', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800' },
    { id: '3', name: 'Furniture', slug: 'furniture', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800' },
    { id: '4', name: 'Watches', slug: 'watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800' },
    { id: '5', name: 'Cameras', slug: 'cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800' },
    { id: '6', name: 'Smartphones', slug: 'smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800' }
  ];

  const categoryImages: { [key: string]: string[] } = {
    'Laptops': [
      'photo-1496181133206-80ce9b88a853', 'photo-1517336714731-489689fd1ca8', 'photo-1498050108023-c5249f4df085', 
      'photo-1525547719571-a2d4ac8945e2', 'photo-1588872657578-7efd1f1555ed', 'photo-1531297484001-80022131f5a1'
    ],
    'Audio': [
      'photo-1505740420928-5e560c06d30e', 'photo-1546435770-a3e426bf472b', 'photo-1484704849700-f032a568e944',
      'photo-1524678606370-a47ad25cb82a', 'photo-1558002038-103792e07924', 'photo-1583333223166-9316d80a4ba3'
    ],
    'Furniture': [
      'photo-1586023492125-27b2c045efd7', 'photo-1524758631624-e2822e304c36', 'photo-1555041469-a586c61ea9bc',
      'photo-1581539252191-7a5058cd4c68', 'photo-1503602642458-232111445657', 'photo-1538688525198-9b88f6f53126'
    ],
    'Watches': [
      'photo-1523275335684-37898b6baf30', 'photo-1524592094714-0f0654e20314', 'photo-1508685096489-77a4aa2ba2fe',
      'photo-1523170335258-f5ed11844a49', 'photo-1542491595-3ca56efd28c6', 'photo-1547996160-81dfa63595aa'
    ],
    'Cameras': [
      'photo-1516035069371-29a1b244cc32', 'photo-1510127034890-ba27508e9f1c', 'photo-1526170315870-ef0397169486',
      'photo-1495707902641-75cac588d2e9', 'photo-1502920917128-1aa500764cbd', 'photo-1564466809058-bf4114d55352'
    ],
    'Smartphones': [
      'photo-1511707171634-5f897ff02aa9', 'photo-1523206489230-c012c64b2b48', 'photo-1556656793-062ff9f18744',
      'photo-1567581935884-3349723552ca', 'photo-1598327105666-5b89351aff97', 'photo-1510557880182-3d4d3cba35a5'
    ]
  };

  const productNames: { [key: string]: string[] } = {
    'Laptops': ['UltraBook Pro', 'Gaming Beast X', 'Slim Air 13', 'DevStation 15', 'TouchTab Pro', 'ZenBook Duo', 'ThinkPad Master', 'EliteBook G9', 'Surface Max', 'Chromebook Plus'],
    'Audio': ['Echo Buds', 'Pure Beats', 'Wave Headphones', 'Studio Mic V2', 'Nano Speaker', 'ProPods Max', 'SoundBar Ultra', 'Vinyl Player Pro', 'Amp Master', 'NoiseStop X'],
    'Furniture': ['Ego Desk', 'Cloud Sofa', 'Minimal Lamp', 'Task Chair Pro', 'Zen Bookshelf', 'Oak Table', 'Mod Wardrobe', 'Velvet Armchair', 'Marble SideTable', 'Nesta Bed'],
    'Watches': ['Chrono Alpha', 'Digital Sport', 'Classic Gold', 'SmartBand G5', 'Diver Pro', 'GMT Master', 'Quartz Minimal', 'Solar Volt', 'Pilot Gear', 'Heritage Pro'],
    'Cameras': ['Capture 4K', 'Focus Mirrorless', 'Action Cam 360', 'Cinema Rig', 'PointShoot G', 'InstaPrint', 'Wildlife Cam', 'Sky Drone Pro', 'Macro Lens Kit', 'Flash Master'],
    'Smartphones': ['Pixel Nova', 'Galaxy Ultra', 'iPhone Pro Max', 'OnePlus Elite', 'Nokia Pure', 'Sony Xperia Pro', 'Xiaomi Ultra', 'Oppo Find X', 'Realme Master', 'Zenfone Pro']
  };

  const vendors = [
    { id: 'v1', name: 'Nexus Official' },
    { id: 'v2', name: 'Apple Store' },
    { id: 'v3', name: 'Modern Living Co' },
    { id: 'v4', name: 'TechHub' },
    { id: 'v5', name: 'Premium Imports' }
  ];

  const products = [];
  let idCounter = 1;

  for (const cat of categories) {
    const names = productNames[cat.name] || [];
    const imageIds = categoryImages[cat.name] || [];
    for (let i = 0; i < 18; i++) {
      const name = names[i % names.length] + ' ' + (Math.floor(i / names.length) + 1);
      const vendor = vendors[Math.floor(Math.random() * vendors.length)];
      const imageId = imageIds[i % imageIds.length];
      products.push({
        id: (idCounter++).toString(),
        name: name,
        description: `Experience the best-in-class performance with the original ${name}. This high-quality product is designed for those who value excellence and durability. Perfect for modern lifestyles and professional needs.`,
        price: Math.floor(Math.random() * 2000) + 99,
        category: cat.name,
        // Using curated Unsplash photo IDs - definitely NO humans, pure isolation/product tech vibe
        image: `https://images.unsplash.com/${imageId}?auto=format&fit=crop&q=80&w=800`,
        vendorId: vendor.id,
        vendorName: vendor.name,
        stock: Math.floor(Math.random() * 100) + 10,
        rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
        reviewsCount: Math.floor(Math.random() * 1000) + 20
      });
    }
  }

  const initialData = {
    users: [],
    products: products,
    categories: categories,
    orders: []
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

function readDB() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeDB(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    const db = readDB();
    
    if (db.users.find((u: any) => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: hashedPassword,
      role: role || 'CUSTOMER'
    };

    db.users.push(newUser);
    writeDB(db);

    const { password: _, ...userWithoutPassword } = newUser;
    const token = jwt.sign(userWithoutPassword, JWT_SECRET);
    res.json({ token, user: userWithoutPassword });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const db = readDB();
    const user = db.users.find((u: any) => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = jwt.sign(userWithoutPassword, JWT_SECRET);
    res.json({ token, user: userWithoutPassword });
  });

  // Product Routes
  app.get('/api/products', (req, res) => {
    const db = readDB();
    res.json(db.products);
  });

  app.get('/api/categories', (req, res) => {
    const db = readDB();
    res.json(db.categories);
  });

  app.get('/api/products/:id', (req, res) => {
    const db = readDB();
    const product = db.products.find((p: any) => p.id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  });

  app.post('/api/products', authenticateToken, (req, res) => {
    if ((req as any).user.role !== 'VENDOR' && (req as any).user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const db = readDB();
    const newProduct = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      vendorId: (req as any).user.id,
      vendorName: (req as any).user.name,
      rating: 0,
      reviewsCount: 0
    };
    db.products.push(newProduct);
    writeDB(db);
    res.status(201).json(newProduct);
  });

  // Order Routes
  app.post('/api/orders', authenticateToken, (req, res) => {
    const db = readDB();
    const newOrder = {
      ...req.body,
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: (req as any).user.id,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    db.orders.push(newOrder);
    writeDB(db);
    res.status(201).json(newOrder);
  });

  app.get('/api/orders', authenticateToken, (req, res) => {
    const db = readDB();
    const userOrders = db.orders.filter((o: any) => o.userId === (req as any).user.id || (req as any).user.role === 'ADMIN');
    res.json(userOrders);
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production build serving (assumed dist exists)
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
