"""Applications router: users apply and admin/NGO can manage applications."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Application, Opportunity, NGO, User
from schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationResponse
from services.auth import get_current_user

router = APIRouter(prefix="/api/applications", tags=["Applications"])


def enrich_application(app, db: Session):
    opp = db.query(Opportunity).filter(Opportunity.id == app.opportunity_id).first()
    user = db.query(User).filter(User.id == app.user_id).first()
    ngo = db.query(NGO).filter(NGO.id == opp.ngo_id).first() if opp else None

    return {
        "id": app.id,
        "user_id": app.user_id,
        "opportunity_id": app.opportunity_id,
        "status": app.status or "pending",
        "hours_contributed": getattr(app, "hours_contributed", 0) or 0,
        "user_name": user.full_name if user else "Unknown User",
        "user_email": user.email if user else "",
        "opportunity_title": opp.title if opp else "Unknown Opportunity",
        "ngo_name": ngo.name if ngo else "Unknown NGO",
    }


@router.post("/", response_model=ApplicationResponse, status_code=201)
def apply_to_opportunity(
    app_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    opp = db.query(Opportunity).filter(Opportunity.id == app_data.opportunity_id).first()

    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    existing = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.opportunity_id == app_data.opportunity_id,
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="You have already applied")

    application = Application(
        user_id=current_user.id,
        opportunity_id=app_data.opportunity_id,
        status="pending",
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return enrich_application(application, db)


@router.get("/my", response_model=list[ApplicationResponse])
def my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    apps = db.query(Application).filter(
        Application.user_id == current_user.id
    ).order_by(Application.id.desc()).all()

    return [enrich_application(app, db) for app in apps]


@router.get("/ngo", response_model=list[ApplicationResponse])
def ngo_applications(db: Session = Depends(get_db)):
    """
    Demo/admin-managed route.
    Shows all applications so NGO/admin can review them.
    """
    apps = db.query(Application).order_by(Application.id.desc()).all()
    return [enrich_application(app, db) for app in apps]


@router.put("/{app_id}", response_model=ApplicationResponse)
def update_application(
    app_id: int,
    updates: ApplicationUpdate,
    db: Session = Depends(get_db),
):
    application = db.query(Application).filter(Application.id == app_id).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    allowed_statuses = ["pending", "accepted", "rejected", "completed"]

    if updates.status:
        if updates.status not in allowed_statuses:
            raise HTTPException(status_code=400, detail="Invalid status")
        application.status = updates.status

    if hasattr(application, "hours_contributed") and updates.hours_contributed is not None:
        application.hours_contributed = updates.hours_contributed

    db.commit()
    db.refresh(application)

    return enrich_application(application, db)