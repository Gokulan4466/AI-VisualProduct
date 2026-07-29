import time
from typing import List, Dict, Any, Optional
try:
    from app.catalog_data import INITIAL_CATALOG, generate_category_clustered_vector
except ModuleNotFoundError:
    from catalog_data import INITIAL_CATALOG, generate_category_clustered_vector

class DatabaseStore:
    def __init__(self):
        # In-memory storage collections initialized from expanded INITIAL_CATALOG
        self.products: List[Dict[str, Any]] = list(INITIAL_CATALOG)
        self.users: List[Dict[str, Any]] = [
            {
                "id": "usr-1",
                "name": "Demo User",
                "email": "demo@antigravity.ai",
                "search_history": [],
                "wishlist": [],
                "orders": []
            }
        ]
        self.search_history: List[Dict[str, Any]] = [
            {
                "id": "hist-1",
                "timestamp": "2026-07-29T10:15:00Z",
                "queryImageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80",
                "topMatchName": "Chronos Elegance Automatic Leather Watch",
                "similarity": 98.4
            },
            {
                "id": "hist-2",
                "timestamp": "2026-07-29T11:00:00Z",
                "queryImageUrl": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&auto=format&fit=crop&q=80",
                "topMatchName": "Royal Amber Oud Eau de Parfum",
                "similarity": 96.2
            }
        ]
        self.cart: List[Dict[str, Any]] = []
        self.wishlist: List[str] = ["prod-watch-1", "prod-perfume-1"]
        self.orders: List[Dict[str, Any]] = []

    def get_all_products(self) -> List[Dict[str, Any]]:
        return self.products

    def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        for prod in self.products:
            if prod["id"] == product_id:
                return prod
        return None

    def add_product(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        prod_id = f"prod-{len(self.products) + 1}"
        product_data["id"] = prod_id
        if "feature_vector" not in product_data or not product_data["feature_vector"]:
            cat = product_data.get("category", "Watches")
            product_data["feature_vector"] = generate_category_clustered_vector(cat, len(self.products) + 500)
        self.products.append(product_data)
        return product_data

    def log_search(self, query_img_url: str, top_match_name: str, similarity: float):
        hist_item = {
            "id": f"hist-{len(self.search_history) + 1}",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "queryImageUrl": query_img_url,
            "topMatchName": top_match_name,
            "similarity": similarity
        }
        self.search_history.insert(0, hist_item)
        if len(self.search_history) > 20:
            self.search_history.pop()

    def get_analytics(self) -> Dict[str, Any]:
        return {
            "totalVisualSearches": 1840,
            "avgMatchConfidence": 96.2,
            "catalogItemsCount": len(self.products),
            "activeCategories": len(set(p.get("category", "") for p in self.products)),
            "popularCategories": [
                {"category": "Perfumes", "count": 740, "percentage": 40.0},
                {"category": "Footwear", "count": 550, "percentage": 30.0},
                {"category": "Watches", "count": 370, "percentage": 20.0},
                {"category": "Slippers", "count": 180, "percentage": 10.0}
            ]
        }

db_instance = DatabaseStore()
