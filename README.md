# Intelligent Visual Product Search

An enterprise-grade, production-ready AI Visual Product Search application for E-Commerce. Users can search for products by uploading an image, dragging & dropping photos, or capturing live snapshots via webcam instead of typing keywords. 

The application utilizes **OpenCV** for image preprocessing & normalization, **PyTorch ResNet50** deep neural network for feature extraction, and **FAISS** vector similarity indexing to return top-10 visually matching products sorted by exact similarity percentage.

---

## Technology Stack

### Frontend
- **React.js 18** with **TypeScript**
- **Vite** build engine & dev server
- **Tailwind CSS** with custom Glassmorphism design system
- **Framer Motion** micro-interactions & smooth transitions
- **Lucide Icons**
- **React Router 6**

### Backend
- **Python FastAPI** framework
- **Pydantic v2** schemas & data validation

### AI & Machine Learning Pipeline
- **OpenCV**: Image resizing (224x224) and RGB normalization (`mean=[0.485, 0.456, 0.406]`, `std=[0.229, 0.224, 0.225]`)
- **PyTorch & torchvision**: ResNet50 pretrained neural network for 2048-dimensional feature embedding extraction
- **FAISS (Facebook AI Similarity Search)**: Sub-millisecond vector L2/Cosine similarity matching
- **AI Confidence Score Breakdown**: Color match, shape match, and texture match metrics

### Database & Storage
- **MongoDB** / In-memory PyMongo store pre-seeded with 25+ e-commerce items (Footwear, Audio, Watches, Fashion, Furniture, Eyewear)

---

## AI Visual Search Workflow

```
User Uploads Image / Webcam Capture / Voice Search
                    ↓
Image Preprocessing & Normalization (OpenCV 224x224)
                    ↓
ResNet50 Feature Extraction (2048-dim Normalized Vector)
                    ↓
FAISS Vector Indexing & Cosine Distance Search
                    ↓
Top 10 Visually Similar Products Displayed (+ Match %)
                    ↓
View Details → Add to Cart → Instant Checkout
```

---

## Application Pages & Features

1. **Landing Page** (`/`): Modern startup hero section, live interactive AI demo, features grid, step-by-step workflow timeline, testimonials.
2. **Visual Search Lab** (`/search`): Drag & drop upload zone, webcam live capture modal, voice search assistant, AI pipeline progress loader (OpenCV $\to$ ResNet50 $\to$ FAISS).
3. **Search Results Page** (`/results`): Query image reference side-by-side with Top 10 matches, similarity percentage badges, confidence breakdown, category/brand/price/color filters, sort options.
4. **Product Details Page** (`/product/:id`): High-res image gallery, specifications table, stock indicator, ratings, visually similar product recommendations.
5. **Dashboard** (`/dashboard`): User welcome card, search history log, popular categories, AI recommendations.
6. **Cart & Checkout** (`/cart`): Item list, quantity adjusters, subtotal, free shipping, tax calculation, checkout modal.
7. **Admin Dashboard** (`/admin`): Visual search analytics charts, active catalog count, product vector indexer form.
8. **Auth Pages** (`/login`, `/register`): Email login, Google OAuth simulator, password reset.

---

## Getting Started

### 1. Run Backend Server (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
API Documentation: `http://127.0.0.1:8000/docs`

### 2. Run Frontend Application (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Access UI: `http://localhost:3000`
