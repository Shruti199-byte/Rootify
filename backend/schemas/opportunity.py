"""Opportunity schemas."""
from pydantic import BaseModel
from typing import Optional


class OpportunityBase(BaseModel):
    title: str
    description: str
    time_commitment: str


class OpportunityCreate(OpportunityBase):
    pass


class OpportunityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    time_commitment: Optional[str] = None


class OpportunityResponse(OpportunityBase):
    id: int
    ngo_id: int

    class Config:
        from_attributes = True