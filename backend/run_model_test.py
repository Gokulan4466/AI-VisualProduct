import io
import time
import numpy as np
from PIL import Image

print("=" * 70)
print("  INTELLIGENT VISUAL PRODUCT SEARCH - FULL AI MODEL EXECUTION TEST")
print("=" * 70)

# Step 1: Import AI Engine & Database
print("\n[Step 1/5] Loading AI Engine Modules...")
from app.ai_engine import VisualAIEngine, HAS_OPENCV, HAS_TORCH, HAS_FAISS
from app.database import db_instance

print(f" -> OpenCV Available:      {HAS_OPENCV}")
print(f" -> PyTorch ResNet50:      {HAS_TORCH}")
print(f" -> FAISS Similarity Search:{HAS_FAISS}")

# Initialize Model Engine
ai_engine = VisualAIEngine()
print(f" -> Model Device:          {ai_engine.device}")
print(f" -> Feature Dimension:     {ai_engine.feature_dim}")

# Step 2: Catalog Indexing
print("\n[Step 2/5] Loading & Indexing Catalog Products...")
products = db_instance.get_all_products()
print(f" -> Total Catalog Items:   {len(products)}")

# Step 3: Create Sample Test Query Image
print("\n[Step 3/5] Generating Sample Test Image (Footwear / Sneaker Pattern)...")
img = Image.new("RGB", (300, 300), color=(30, 41, 59))
# Add some color patterns to simulate a shoe product image
from PIL import ImageDraw
draw = ImageDraw.Draw(img)
draw.ellipse([50, 100, 250, 200], fill=(239, 68, 68), outline=(255, 255, 255)) # Red sneaker body
draw.rectangle([60, 180, 240, 210], fill=(255, 255, 255))                      # White sole

img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='JPEG')
sample_image_bytes = img_byte_arr.getvalue()
print(" -> Sample query image generated successfully (300x300 RGB JPEG)")

# Step 4: Run OpenCV Preprocessing & ResNet50 Feature Extraction
print("\n[Step 4/5] Executing OpenCV Normalization & PyTorch ResNet50 Feature Extraction...")
t_start = time.time()

# 4a. Preprocessing
norm_img = ai_engine.preprocess_image_opencv(sample_image_bytes)
print(f" -> OpenCV Resized & Normalized Shape: {norm_img.shape}, dtype: {norm_img.dtype}")

# 4b. ResNet50 Deep Vector Extraction
query_vector = ai_engine.extract_features(sample_image_bytes)
print(f" -> ResNet50 Feature Vector Extracted: Length = {len(query_vector)}")
print(f" -> Feature Vector L2 Norm: {np.linalg.norm(query_vector):.4f}")
print(f" -> Sample Coefficients (First 10): {np.round(query_vector[:10], 4)}")

# Step 5: FAISS Vector Similarity Search & Matching
print("\n[Step 5/5] Executing FAISS Similarity Search against Catalog...")
matches, category_hint = ai_engine.search_similar_products(
    query_vector, products, top_k=10, image_bytes=sample_image_bytes
)

t_end = time.time()
processing_time_ms = (t_end - t_start) * 1000

print(f"\n[RESULTS] Detected Visual Category Hint: '{category_hint}'")
print(f"[RESULTS] AI Pipeline Execution Time:    {processing_time_ms:.2f} ms")
print(f"[RESULTS] Top Matches Found:             {len(matches)}\n")

print("-" * 75)
print(f"{'Rank':<5} | {'Product Name':<32} | {'Category':<10} | {'Match %':<8} | {'Price':<7}")
print("-" * 75)

for idx, m in enumerate(matches, 1):
    prod = m["product"]
    sim = m["similarityPercentage"]
    name = prod["name"][:30]
    cat = prod["category"]
    price = f"${prod['price']:.2f}"
    print(f"#{idx:<4} | {name:<32} | {cat:<10} | {sim:>6.1f}% | {price:<7}")

print("-" * 75)
print("\nTop Match Confidence Breakdown:")
if matches:
    top_bd = matches[0]["breakdown"]
    print(f" -> Overall Match: {top_bd['overall']}%")
    print(f" -> Color Match:   {top_bd['colorMatch']}%")
    print(f" -> Shape Match:   {top_bd['shapeMatch']}%")
    print(f" -> Texture Match: {top_bd['textureMatch']}%")

print("\n" + "=" * 70)
print("  MODEL EXECUTION COMPLETED SUCCESSFULLY!")
print("=" * 70)
