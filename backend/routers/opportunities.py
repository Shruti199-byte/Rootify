"""Opportunities router: CRUD for volunteer opportunities."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models import Opportunity, NGO
from schemas.opportunity import OpportunityCreate, OpportunityUpdate, OpportunityResponse

router = APIRouter(prefix="/api/opportunities", tags=["Opportunities"])


@router.post("/", response_model=OpportunityResponse, status_code=201)
def create_opportunity(
    ngo_id: int,
    opp_data: OpportunityCreate,
    db: Session = Depends(get_db),
):
    ngo = db.query(NGO).filter(NGO.id == ngo_id).first()

    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")

    opp = Opportunity(
        ngo_id=ngo.id,
        title=opp_data.title,
        description=opp_data.description,
        time_commitment=opp_data.time_commitment,
    )

    db.add(opp)
    db.commit()
    db.refresh(opp)

    return opp


@router.get("/", response_model=list[OpportunityResponse])
def list_opportunities(
    ngo_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Opportunity)

    if ngo_id:
        query = query.filter(Opportunity.ngo_id == ngo_id)

    return query.order_by(Opportunity.id.desc()).all()


@router.get("/{opp_id}", response_model=OpportunityResponse)
def get_opportunity(opp_id: int, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()

    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    return opp


@router.put("/{opp_id}", response_model=OpportunityResponse)
def update_opportunity(
    opp_id: int,
    updates: OpportunityUpdate,
    db: Session = Depends(get_db),
):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()

    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    update_data = updates.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        if field in ["title", "description", "time_commitment"]:
            setattr(opp, field, value)

    db.commit()
    db.refresh(opp)

    return opp


@router.delete("/{opp_id}", status_code=204)
def delete_opportunity(
    opp_id: int,
    db: Session = Depends(get_db),
):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()

    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    db.delete(opp)
    db.commit()