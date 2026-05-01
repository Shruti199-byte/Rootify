from database import SessionLocal, Base, engine
from models import NGO, Opportunity

Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Clear old data
    db.query(Opportunity).delete()
    db.query(NGO).delete()
    db.commit()

    # --- NGO LIST ---
    ngos = [
        {
            "name": "Code for Good",
            "description": "Teaching kids to code.",
            "location": "Delhi",
            "category": "education",
        },
        {
            "name": "Green Earth Foundation",
            "description": "Working for environment protection.",
            "location": "Chandigarh",
            "category": "environment",
        },
        {
            "name": "Health First NGO",
            "description": "Organizing health camps.",
            "location": "Shimla",
            "category": "health",
        },
    ]

    created_ngos = []

    # Create NGOs
    for ngo_data in ngos:
        ngo = NGO(
            name=ngo_data["name"],
            description=ngo_data["description"],
            location=ngo_data["location"],
            category=ngo_data["category"],
            contact_info="info@example.com",
            contact_email="info@example.com",
            contact_phone="9876543210",
            website="",
            is_verified=True,
        )
        db.add(ngo)
        db.commit()
        db.refresh(ngo)
        created_ngos.append(ngo)

    # --- OPPORTUNITIES ---
    opportunities = [
        {
            "ngo": created_ngos[0],
            "title": "Teaching Volunteer",
            "description": "Help kids learn coding.",
            "time": "3 hours/week",
        },
        {
            "ngo": created_ngos[1],
            "title": "Tree Plantation Drive",
            "description": "Join environmental activities.",
            "time": "2 hours/week",
        },
        {
            "ngo": created_ngos[2],
            "title": "Health Camp Volunteer",
            "description": "Assist doctors in camps.",
            "time": "4 hours/week",
        },
    ]

    for opp_data in opportunities:
        opp = Opportunity(
            ngo_id=opp_data["ngo"].id,
            title=opp_data["title"],
            description=opp_data["description"],
            time_commitment=opp_data["time"],
        )
        db.add(opp)

    db.commit()

    print("✅ Multiple NGOs & opportunities created successfully!")

finally:
    db.close()