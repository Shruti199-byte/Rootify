from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base

from routers import auth, ngos, posts, messages, opportunities, applications

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Rootify API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(ngos.router)
app.include_router(posts.router)
app.include_router(messages.router)
app.include_router(opportunities.router)
app.include_router(applications.router)

@app.get("/")
def read_root():
    return {"message": "Rootify Backend is 100% Online!"}