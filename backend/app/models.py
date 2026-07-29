from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Product(BaseModel):
    id: str
    name: str
    brand: str
    category: str
    description: str
    price: float
    discount: float = 0.0 # percentage discount e.g. 15.0
    original_price: Optional[float] = None
    imageUrl: str
    gallery: List[str] = []
    stock: int = 10
    rating: float = 4.5
    reviewsCount: int = 42
    color: str = "Multi"
    specifications: Dict[str, str] = {}
    feature_vector: Optional[List[float]] = None

class SimilarityBreakdown(BaseModel):
    overall: float
    colorMatch: float
    shapeMatch: float
    textureMatch: float

class MatchResult(BaseModel):
    product: Product
    similarityPercentage: float
    confidenceScore: float
    breakdown: SimilarityBreakdown

class VisualSearchResponse(BaseModel):
    queryImage: str
    topMatches: List[MatchResult]
    detectedCategory: str
    processingTimeMs: float
    totalCatalogSize: int

class CartItem(BaseModel):
    productId: str
    quantity: int = 1

class CartRequest(BaseModel):
    items: List[CartItem]

class WishlistRequest(BaseModel):
    productId: str

class OrderRequest(BaseModel):
    userId: Optional[str] = "guest_user"
    items: List[CartItem]
    totalAmount: float
    shippingAddress: str
    paymentMethod: str = "Credit Card"

class SearchHistoryItem(BaseModel):
    id: str
    timestamp: str
    queryImageUrl: str
    topMatchName: str
    similarity: float

class ProductCreate(BaseModel):
    name: str
    brand: str
    category: str
    description: str
    price: float
    discount: float = 0.0
    imageUrl: str
    stock: int = 20
    color: str = "Black"
    specifications: Dict[str, str] = {}
