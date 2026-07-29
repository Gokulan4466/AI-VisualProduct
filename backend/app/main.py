import base64
import time
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.models import (
    Product, VisualSearchResponse, MatchResult, SimilarityBreakdown,
    CartRequest, WishlistRequest, OrderRequest, ProductCreate
)
from app.database import db_instance
from app.ai_engine import ai_engine_instance, HAS_OPENCV, HAS_TORCH, HAS_FAISS

app = FastAPI(
    title="Intelligent Visual Product Search API",
    description="Computer Vision & FAISS AI Visual Product Search API",
    version="1.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Intelligent Visual Product Search AI Engine",
        "version": "1.0.0",
        "modules": {
            "OpenCV": HAS_OPENCV,
            "PyTorch_ResNet50": HAS_TORCH,
            "FAISS_Similarity_Search": HAS_FAISS
        }
    }

@app.get("/api/products")
def get_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None
):
    products = db_instance.get_all_products()
    filtered = []

    for p in products:
        if category and p.get("category", "").lower() != category.lower():
            continue
        if brand and p.get("brand", "").lower() != brand.lower():
            continue
        if min_price is not None and p.get("price", 0) < min_price:
            continue
        if max_price is not None and p.get("price", 0) > max_price:
            continue
        if search:
            q = search.lower()
            if q not in p.get("name", "").lower() and q not in p.get("description", "").lower():
                continue
        filtered.append(p)

    return {"total": len(filtered), "products": filtered}

@app.get("/api/product/{product_id}")
def get_product_by_id(product_id: str):
    prod = db_instance.get_product_by_id(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Calculate visually similar recommendations for detail page
    vec = prod.get("feature_vector")
    similar_recs = []
    if vec:
        import numpy as np
        query_vec = np.array(vec, dtype=np.float32)
        matches, _ = ai_engine_instance.search_similar_products(
            query_vec, [p for p in db_instance.products if p["id"] != product_id], top_k=4
        )
        similar_recs = [m["product"] for m in matches]

    return {
        "product": prod,
        "similarProducts": similar_recs
    }

@app.post("/api/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """API Endpoint Step 1: Upload image file and return temporary Data URL."""
    contents = await file.read()
    b64_str = base64.b64encode(contents).decode("utf-8")
    data_url = f"data:{file.content_type};base64,{b64_str}"
    return {"status": "success", "filename": file.filename, "imageUrl": data_url}

@app.post("/api/extract-features")
async def extract_features(file: UploadFile = File(...)):
    """API Endpoint Step 2-5: Resize image using OpenCV, normalize, and extract ResNet50 vector."""
    contents = await file.read()
    # OpenCV Preprocessing
    norm_img = ai_engine_instance.preprocess_image_opencv(contents)
    # ResNet50 Feature Vector Generation
    vec = ai_engine_instance.extract_features(contents)
    return {
        "status": "success",
        "vectorDimension": len(vec),
        "featureVector": vec[:20].tolist(), # Preview first 20 coefficients
        "l2Norm": float(sum(x**2 for x in vec)**0.5)
    }

@app.post("/api/search")
async def visual_search(
    file: Optional[UploadFile] = File(None),
    imageBase64: Optional[str] = Form(None)
):
    """Full AI Visual Search Workflow: Upload -> OpenCV Preprocess -> ResNet50 -> FAISS Search -> Top 10 Recommendations."""
    t_start = time.time()

    image_bytes = None
    query_image_url = ""

    if file:
        image_bytes = await file.read()
        b64_str = base64.b64encode(image_bytes).decode("utf-8")
        query_image_url = f"data:{file.content_type};base64,{b64_str}"
    elif imageBase64:
        # Strip header if data URL
        if "," in imageBase64:
            b64_clean = imageBase64.split(",")[1]
            query_image_url = imageBase64
        else:
            b64_clean = imageBase64
            query_image_url = f"data:image/jpeg;base64,{imageBase64}"
        image_bytes = base64.b64decode(b64_clean)
    else:
        raise HTTPException(status_code=400, detail="Must provide an image file or imageBase64 parameter.")

    # 1. OpenCV Preprocessing & Normalization
    _ = ai_engine_instance.preprocess_image_opencv(image_bytes)

    # 2. ResNet50 Feature Extraction
    query_vector = ai_engine_instance.extract_features(image_bytes)

    # 3. FAISS Vector Similarity Search
    matches, detected_category = ai_engine_instance.search_similar_products(
        query_vector, db_instance.get_all_products(), top_k=10, image_bytes=image_bytes
    )

    t_elapsed_ms = round((time.time() - t_start) * 1000, 2)

    # Log search query
    top_name = matches[0]["product"]["name"] if matches else "No Match"
    top_sim = matches[0]["similarityPercentage"] if matches else 0.0
    db_instance.log_search(query_image_url[:200], top_name, top_sim)

    return VisualSearchResponse(
        queryImage=query_image_url,
        topMatches=matches,
        detectedCategory=detected_category,
        processingTimeMs=t_elapsed_ms,
        totalCatalogSize=len(db_instance.products)
    )

@app.get("/api/history")
def get_search_history():
    return {"history": db_instance.search_history}

@app.get("/api/analytics")
def get_analytics():
    return db_instance.get_analytics()

@app.post("/api/cart")
def update_cart(req: CartRequest):
    db_instance.cart = [item.dict() for item in req.items]
    return {"status": "success", "cart": db_instance.cart}

@app.get("/api/cart")
def get_cart():
    return {"cart": db_instance.cart}

@app.post("/api/wishlist")
def toggle_wishlist(req: WishlistRequest):
    pid = req.productId
    if pid in db_instance.wishlist:
        db_instance.wishlist.remove(pid)
        action = "removed"
    else:
        db_instance.wishlist.append(pid)
        action = "added"
    return {"status": "success", "action": action, "wishlist": db_instance.wishlist}

@app.get("/api/wishlist")
def get_wishlist():
    items = [p for p in db_instance.products if p["id"] in db_instance.wishlist]
    return {"wishlist": db_instance.wishlist, "products": items}

@app.post("/api/orders")
def place_order(req: OrderRequest):
    order_id = f"ORD-{int(time.time())}"
    order_data = {
        "orderId": order_id,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        **req.dict()
    }
    db_instance.orders.append(order_data)
    # Clear cart after purchase
    db_instance.cart = []
    return {"status": "success", "orderId": order_id, "order": order_data}

@app.post("/api/admin/products")
def admin_add_product(prod: ProductCreate):
    new_p = db_instance.add_product(prod.dict())
    return {"status": "success", "product": new_p}
