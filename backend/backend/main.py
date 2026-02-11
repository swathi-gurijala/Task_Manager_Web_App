from fastapi import FastAPI

app = FastAPI(title="Anything.ai Backend")

@app.get("/")
def root():
    return {"status": "Backend running successfully"}
